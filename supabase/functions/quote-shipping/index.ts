import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CartItem {
  title: string;
  styleId?: number;
  source: "ss" | "printful"; // fulfillment source
  printfulVariantId?: number;
  weight_oz?: number;
  qty: number;
  price: number;
  color?: string;
  size?: string;
  decoratorId?: string; // which decorator handles this item
}

interface ShippingAddress {
  name: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

interface ShipmentLeg {
  source: string;
  decorator?: string;
  items: CartItem[];
  rate: number;
  carrier?: string;
  service?: string;
  estimatedDays?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, shipping_address, store_id } = await req.json() as {
      items: CartItem[];
      shipping_address: ShippingAddress;
      store_id?: string;
    };

    if (!items?.length || !shipping_address) {
      return new Response(
        JSON.stringify({ error: "items and shipping_address required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const legs: ShipmentLeg[] = [];

    // Group items by fulfillment source + decorator
    const printfulItems = items.filter(i => i.source === "printful");
    const ssItems = items.filter(i => i.source === "ss" || !i.source);

    // Group SS items by decorator
    const ssByDecorator = new Map<string, CartItem[]>();
    for (const item of ssItems) {
      const key = item.decoratorId || "default";
      if (!ssByDecorator.has(key)) ssByDecorator.set(key, []);
      ssByDecorator.get(key)!.push(item);
    }

    // --- Printful shipping quote ---
    if (printfulItems.length > 0) {
      const printfulRate = await getPrintfulShippingRate(printfulItems, shipping_address);
      legs.push({
        source: "printful",
        items: printfulItems,
        rate: printfulRate.rate,
        carrier: printfulRate.carrier,
        service: printfulRate.service,
        estimatedDays: printfulRate.estimatedDays,
      });
    }

    // --- ShipStation shipping quotes (one per decorator leg) ---
    for (const [decoratorId, decoratorItems] of ssByDecorator) {
      const ssRate = await getShipStationRate(decoratorItems, shipping_address);
      legs.push({
        source: "ss",
        decorator: decoratorId,
        items: decoratorItems,
        rate: ssRate.rate,
        carrier: ssRate.carrier,
        service: ssRate.service,
        estimatedDays: ssRate.estimatedDays,
      });
    }

    const totalShipping = legs.reduce((sum, leg) => sum + leg.rate, 0);

    return new Response(
      JSON.stringify({
        total_shipping: Math.round(totalShipping * 100) / 100,
        legs,
        currency: "USD",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("quote-shipping error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function getPrintfulShippingRate(
  items: CartItem[],
  address: ShippingAddress
): Promise<{ rate: number; carrier: string; service: string; estimatedDays?: number }> {
  const apiKey = Deno.env.get("PRINTFUL_API_KEY");
  if (!apiKey) {
    // Fallback: estimate based on item count
    return { rate: 4.99 + (items.length - 1) * 1.5, carrier: "USPS", service: "Standard" };
  }

  try {
    const resp = await fetch("https://api.printful.com/shipping/rates", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: {
          address1: address.address1,
          city: address.city,
          state_code: address.state,
          country_code: address.country || "US",
          zip: address.zip,
        },
        items: items.map(i => ({
          variant_id: i.printfulVariantId || 1,
          quantity: i.qty,
        })),
      }),
    });

    if (!resp.ok) {
      console.error("Printful shipping API error:", resp.status);
      return { rate: 4.99 + (items.length - 1) * 1.5, carrier: "USPS", service: "Standard" };
    }

    const data = await resp.json();
    const rates = data?.result || [];
    // Pick STANDARD or cheapest
    const standard = rates.find((r: any) => r.id === "STANDARD") || rates[0];
    if (standard) {
      return {
        rate: parseFloat(standard.rate),
        carrier: standard.name || "Standard",
        service: standard.id || "STANDARD",
        estimatedDays: standard.maxDeliveryDays,
      };
    }
    return { rate: 4.99, carrier: "USPS", service: "Standard" };
  } catch (e) {
    console.error("Printful rate fetch failed:", e);
    return { rate: 4.99 + (items.length - 1) * 1.5, carrier: "USPS", service: "Standard" };
  }
}

async function getShipStationRate(
  items: CartItem[],
  address: ShippingAddress
): Promise<{ rate: number; carrier: string; service: string; estimatedDays?: number }> {
  const apiKey = Deno.env.get("SHIPSTATION_API_KEY");
  const apiSecret = Deno.env.get("SHIPSTATION_API_SECRET");

  if (!apiKey || !apiSecret) {
    // Fallback: flat rate estimate
    const totalQty = items.reduce((s, i) => s + i.qty, 0);
    const estimatedWeight = totalQty * 8; // ~8 oz per apparel item
    const rate = estimatedWeight <= 16 ? 7.99 : 7.99 + Math.ceil((estimatedWeight - 16) / 16) * 3.5;
    return { rate, carrier: "USPS", service: "Priority Mail" };
  }

  try {
    const totalWeight = items.reduce((s, i) => s + (i.weight_oz || 8) * i.qty, 0);
    const auth = btoa(`${apiKey}:${apiSecret}`);

    const resp = await fetch("https://ssapi.shipstation.com/shipments/getrates", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carrierCode: "stamps_com", // USPS via ShipStation
        fromPostalCode: "90001", // Platform warehouse default
        toState: address.state,
        toCountry: address.country || "US",
        toPostalCode: address.zip,
        toCity: address.city,
        weight: { value: totalWeight, units: "ounces" },
        confirmation: "delivery",
        residential: true,
      }),
    });

    if (!resp.ok) {
      console.error("ShipStation rate error:", resp.status);
      const totalQty = items.reduce((s, i) => s + i.qty, 0);
      return { rate: 7.99 + totalQty * 1.5, carrier: "USPS", service: "Priority Mail" };
    }

    const rates = await resp.json();
    // Pick cheapest rate
    if (Array.isArray(rates) && rates.length > 0) {
      rates.sort((a: any, b: any) => a.shipmentCost - b.shipmentCost);
      const cheapest = rates[0];
      return {
        rate: cheapest.shipmentCost + (cheapest.otherCost || 0),
        carrier: cheapest.carrierCode,
        service: cheapest.serviceName,
        estimatedDays: cheapest.estimatedDays,
      };
    }

    return { rate: 7.99, carrier: "USPS", service: "Priority Mail" };
  } catch (e) {
    console.error("ShipStation rate fetch failed:", e);
    const totalQty = items.reduce((s, i) => s + i.qty, 0);
    return { rate: 7.99 + totalQty * 1.5, carrier: "USPS", service: "Priority Mail" };
  }
}
