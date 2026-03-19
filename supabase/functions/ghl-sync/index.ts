import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GHL_BASE = "https://rest.gohighlevel.com/v1";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ghlApiKey = Deno.env.get("GHL_API_KEY");
  if (!ghlApiKey) {
    return new Response(
      JSON.stringify({ error: "GHL_API_KEY not configured. Please add your GoHighLevel API key." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const headers = {
    Authorization: `Bearer ${ghlApiKey}`,
    "Content-Type": "application/json",
  };

  try {
    const body = await req.json();
    const { action, payload } = body;

    switch (action) {
      case "sync_order": {
        const { customer_name, customer_email, order_id, items, total, store_name } = payload;

        // 1. Upsert contact
        const contactResp = await fetch(`${GHL_BASE}/contacts/`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: customer_name,
            email: customer_email,
            tags: ["brand-shop-customer", store_name?.toLowerCase().replace(/\s+/g, "-")],
          }),
        });

        const contactData = await contactResp.json();
        const contactId = contactData?.contact?.id || contactData?.id;

        // 2. Add order note to contact
        if (contactId) {
          const orderSummary = (items || [])
            .map((i: any) => `${i.title} (${i.color}/${i.size}) x${i.qty} - $${i.price}`)
            .join("\n");

          await fetch(`${GHL_BASE}/contacts/${contactId}/notes/`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              body: `📦 New Order #${order_id}\nStore: ${store_name}\nTotal: $${total}\n\n${orderSummary}`,
            }),
          });
        }

        return new Response(
          JSON.stringify({ success: true, contactId }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "log_communication": {
        const { contact_email, message, channel, store_name } = payload;

        // Find contact by email
        const searchResp = await fetch(
          `${GHL_BASE}/contacts/lookup?email=${encodeURIComponent(contact_email)}`,
          { headers }
        );
        const searchData = await searchResp.json();
        const contactId = searchData?.contacts?.[0]?.id;

        if (contactId) {
          await fetch(`${GHL_BASE}/contacts/${contactId}/notes/`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              body: `💬 [${channel || "Chat"}] ${store_name || ""}\n${message}`,
            }),
          });
        }

        return new Response(
          JSON.stringify({ success: true, contactId }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "update_order_status": {
        const { contact_email, order_id, new_status, store_name } = payload;

        const searchResp = await fetch(
          `${GHL_BASE}/contacts/lookup?email=${encodeURIComponent(contact_email)}`,
          { headers }
        );
        const searchData = await searchResp.json();
        const contactId = searchData?.contacts?.[0]?.id;

        if (contactId) {
          await fetch(`${GHL_BASE}/contacts/${contactId}/notes/`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              body: `📋 Order Status Update\nOrder: #${order_id}\nStore: ${store_name}\nNew Status: ${new_status}`,
            }),
          });
        }

        return new Response(
          JSON.stringify({ success: true, contactId }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "create_sub_account": {
        const { store_name, store_id, owner_email } = payload;

        const locationResp = await fetch(`${GHL_BASE}/locations/`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: store_name,
            email: owner_email,
            settings: {
              allowDuplicateContact: false,
            },
          }),
        });

        const locationData = await locationResp.json();

        return new Response(
          JSON.stringify({ success: true, locationId: locationData?.id }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (err) {
    console.error("ghl-sync error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
