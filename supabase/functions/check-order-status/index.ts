import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface StatusStep {
  label: string;
  status: "completed" | "current" | "upcoming";
  timestamp?: string;
  detail?: string;
}

interface FulfillmentGroup {
  source: "printful" | "ss" | "manual";
  externalId?: string;
  decorator?: string;
  items: any[];
  status: string;
  statusLabel: string;
  timeline: StatusStep[];
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  estimatedDelivery?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order_id, email, store_id } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find orders
    let query = supabase.from("orders").select("*");
    if (order_id) {
      query = query.eq("id", order_id);
    } else if (email && store_id) {
      query = query.eq("customer_email", email.toLowerCase()).eq("store_id", store_id);
    } else {
      return new Response(
        JSON.stringify({ error: "Provide order_id or email + store_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: orders, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    if (!orders || orders.length === 0) {
      return new Response(
        JSON.stringify({ orders: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Enrich each order with multi-source status
    const enrichedOrders = await Promise.all(orders.map(async (order: any) => {
      const fulfillmentDetails = order.fulfillment_details || {};
      const groups: FulfillmentGroup[] = [];

      // Check if order has split fulfillment
      const fulfillmentGroups = fulfillmentDetails.groups || [];

      if (fulfillmentGroups.length > 0) {
        // Multi-source order: query each source
        for (const group of fulfillmentGroups) {
          const enrichedGroup = await enrichFulfillmentGroup(group);
          groups.push(enrichedGroup);
        }
      } else {
        // Single-source order: use local DB status
        groups.push(buildLocalTimeline(order));
      }

      // Build overall status from worst group status
      const overallStatus = deriveOverallStatus(groups);

      return {
        ...order,
        fulfillment_groups: groups,
        status_label: overallStatus.label,
        timeline: overallStatus.timeline,
      };
    }));

    return new Response(
      JSON.stringify({ orders: enrichedOrders }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("check-order-status error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildLocalTimeline(order: any): FulfillmentGroup {
  const statusMap: Record<string, number> = {
    pending: 0, confirmed: 1, in_production: 2, decorated: 3, shipped: 4, delivered: 5,
  };
  const currentStep = statusMap[order.status] ?? 0;
  const allSteps = [
    { label: "Order Received", key: "pending" },
    { label: "Confirmed", key: "confirmed" },
    { label: "In Production", key: "in_production" },
    { label: "Decorated", key: "decorated" },
    { label: "Shipped", key: "shipped" },
    { label: "Delivered", key: "delivered" },
  ];

  const timeline: StatusStep[] = allSteps.map((step, i) => ({
    label: step.label,
    status: i < currentStep ? "completed" : i === currentStep ? "current" : "upcoming",
    timestamp: i === 0 ? order.created_at : i <= currentStep ? order.updated_at : undefined,
  }));

  return {
    source: "manual",
    items: order.items || [],
    status: order.status,
    statusLabel: allSteps[currentStep]?.label || order.status,
    timeline,
  };
}

async function enrichFulfillmentGroup(group: any): Promise<FulfillmentGroup> {
  const { source, externalId, items, decorator } = group;

  if (source === "printful" && externalId) {
    return await fetchPrintfulStatus(externalId, items);
  }

  if (source === "ss" && externalId) {
    return await fetchShipStationStatus(externalId, items, decorator);
  }

  // GHL / manual fallback
  if (group.contactEmail) {
    return await fetchGHLStatus(group, items);
  }

  // Pure local fallback
  return {
    source: source || "manual",
    externalId,
    decorator,
    items,
    status: group.status || "pending",
    statusLabel: group.status || "Pending",
    timeline: [{
      label: group.status || "Processing",
      status: "current",
    }],
  };
}

async function fetchPrintfulStatus(orderId: string, items: any[]): Promise<FulfillmentGroup> {
  const apiKey = Deno.env.get("PRINTFUL_API_KEY");
  if (!apiKey) return manualFallback("printful", orderId, items);

  try {
    const resp = await fetch(`https://api.printful.com/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!resp.ok) return manualFallback("printful", orderId, items);

    const data = await resp.json();
    const order = data.result;

    const printfulStatusMap: Record<string, string> = {
      draft: "pending", pending: "confirmed", inprocess: "in_production",
      fulfilled: "shipped", canceled: "canceled",
    };

    const shipments = order.shipments || [];
    const tracking = shipments[0];

    const mappedStatus = printfulStatusMap[order.status] || order.status;
    const timeline = buildTimelineFromStatus(mappedStatus);

    return {
      source: "printful",
      externalId: orderId,
      items,
      status: mappedStatus,
      statusLabel: order.status,
      timeline,
      trackingNumber: tracking?.tracking_number,
      trackingUrl: tracking?.tracking_url,
      carrier: tracking?.carrier,
      estimatedDelivery: tracking?.estimated_delivery,
    };
  } catch (e) {
    console.error("Printful status fetch error:", e);
    return manualFallback("printful", orderId, items);
  }
}

async function fetchShipStationStatus(trackingRef: string, items: any[], decorator?: string): Promise<FulfillmentGroup> {
  const apiKey = Deno.env.get("SHIPSTATION_API_KEY");
  const apiSecret = Deno.env.get("SHIPSTATION_API_SECRET");
  if (!apiKey || !apiSecret) return manualFallback("ss", trackingRef, items, decorator);

  try {
    const auth = btoa(`${apiKey}:${apiSecret}`);
    const resp = await fetch(
      `https://ssapi.shipstation.com/shipments?orderNumber=${encodeURIComponent(trackingRef)}`,
      { headers: { Authorization: `Basic ${auth}` } }
    );
    if (!resp.ok) return manualFallback("ss", trackingRef, items, decorator);

    const data = await resp.json();
    const shipment = data.shipments?.[0];

    if (shipment) {
      return {
        source: "ss",
        externalId: trackingRef,
        decorator,
        items,
        status: "shipped",
        statusLabel: "Shipped",
        timeline: buildTimelineFromStatus("shipped"),
        trackingNumber: shipment.trackingNumber,
        carrier: shipment.carrierCode,
      };
    }

    return manualFallback("ss", trackingRef, items, decorator);
  } catch (e) {
    console.error("ShipStation status fetch error:", e);
    return manualFallback("ss", trackingRef, items, decorator);
  }
}

async function fetchGHLStatus(group: any, items: any[]): Promise<FulfillmentGroup> {
  const ghlApiKey = Deno.env.get("GHL_API_KEY");
  if (!ghlApiKey || !group.contactEmail) return manualFallback("manual", undefined, items, group.decorator);

  try {
    const resp = await fetch(
      `https://rest.gohighlevel.com/v1/contacts/lookup?email=${encodeURIComponent(group.contactEmail)}`,
      { headers: { Authorization: `Bearer ${ghlApiKey}` } }
    );
    if (!resp.ok) return manualFallback("manual", undefined, items, group.decorator);

    const data = await resp.json();
    const contact = data.contacts?.[0];
    if (!contact) return manualFallback("manual", undefined, items, group.decorator);

    // Read custom fields
    const customFields = contact.customField || [];
    const getField = (key: string) => customFields.find((f: any) => f.key === key)?.value;

    const orderStatus = getField("order_status") || "pending";
    const trackingNumber = getField("tracking_number");

    return {
      source: "manual",
      decorator: group.decorator,
      items,
      status: orderStatus,
      statusLabel: orderStatus.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
      timeline: buildTimelineFromStatus(orderStatus),
      trackingNumber,
    };
  } catch (e) {
    console.error("GHL status fetch error:", e);
    return manualFallback("manual", undefined, items, group.decorator);
  }
}

function manualFallback(source: string, externalId?: string, items?: any[], decorator?: string): FulfillmentGroup {
  return {
    source: source as any,
    externalId,
    decorator,
    items: items || [],
    status: "pending",
    statusLabel: "Processing",
    timeline: [{ label: "Order Received", status: "current" }],
  };
}

function buildTimelineFromStatus(status: string): StatusStep[] {
  const statusMap: Record<string, number> = {
    pending: 0, confirmed: 1, in_production: 2, decorated: 3, shipped: 4, delivered: 5,
  };
  const currentStep = statusMap[status] ?? 0;
  const allSteps = [
    "Order Received", "Confirmed", "In Production", "Decorated", "Shipped", "Delivered",
  ];

  return allSteps.map((label, i) => ({
    label,
    status: i < currentStep ? "completed" as const : i === currentStep ? "current" as const : "upcoming" as const,
  }));
}

function deriveOverallStatus(groups: FulfillmentGroup[]) {
  // Overall timeline: use the "slowest" group's status
  const statusOrder = ["pending", "confirmed", "in_production", "decorated", "shipped", "delivered"];
  let slowestIdx = Infinity;
  for (const g of groups) {
    const idx = statusOrder.indexOf(g.status);
    if (idx >= 0 && idx < slowestIdx) slowestIdx = idx;
  }
  if (slowestIdx === Infinity) slowestIdx = 0;

  const overallStatus = statusOrder[slowestIdx];
  const timeline = buildTimelineFromStatus(overallStatus);

  const labelMap: Record<string, string> = {
    pending: "Order Received", confirmed: "Confirmed", in_production: "In Production",
    decorated: "Decorated", shipped: "Shipped", delivered: "Delivered",
  };

  return { label: labelMap[overallStatus] || overallStatus, timeline };
}
