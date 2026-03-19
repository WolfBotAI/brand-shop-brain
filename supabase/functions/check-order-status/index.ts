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

    // Build status timeline for each order
    const enrichedOrders = orders.map((order: any) => {
      const statusMap: Record<string, number> = {
        pending: 0,
        confirmed: 1,
        in_production: 2,
        decorated: 3,
        shipped: 4,
        delivered: 5,
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
        ...order,
        timeline,
        status_label: allSteps[currentStep]?.label || order.status,
      };
    });

    // Try to get tracking info from order metadata
    // In the future, this would query Printful API, Decorator API, or GHL
    // For now, we return the database status with the timeline

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
