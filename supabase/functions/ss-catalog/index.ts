import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SS_BASE = "https://api.ssactivewear.com/v2";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ssKey = Deno.env.get("SS_API_KEY");
  const ssAccount = Deno.env.get("SS_ACCOUNT_NUMBER");
  if (!ssKey || !ssAccount) {
    return new Response(
      JSON.stringify({ error: "SS_API_KEY or SS_ACCOUNT_NUMBER not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const authHeader = "Basic " + btoa(`${ssAccount}:${ssKey}`);

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "styles";

    let ssUrl: string;

    switch (action) {
      case "styles": {
        // List/search styles — supports ?keyword=xxx&category=xxx
        const keyword = url.searchParams.get("keyword") || "";
        const category = url.searchParams.get("category") || "";
        const page = url.searchParams.get("page") || "1";
        const perPage = url.searchParams.get("perPage") || "50";
        let endpoint = `${SS_BASE}/styles/?page=${page}&perPage=${perPage}`;
        if (keyword) endpoint += `&keyword=${encodeURIComponent(keyword)}`;
        if (category) endpoint += `&category=${encodeURIComponent(category)}`;
        ssUrl = endpoint;
        break;
      }
      case "style": {
        const styleID = url.searchParams.get("styleID");
        if (!styleID) {
          return new Response(
            JSON.stringify({ error: "styleID required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        ssUrl = `${SS_BASE}/styles/${styleID}`;
        break;
      }
      case "products": {
        const styleIDs = url.searchParams.get("styleIDs") || "";
        if (!styleIDs) {
          return new Response(
            JSON.stringify({ error: "styleIDs required (comma-separated)" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        ssUrl = `${SS_BASE}/products/?styleID=${encodeURIComponent(styleIDs)}`;
        break;
      }
      case "categories": {
        ssUrl = `${SS_BASE}/categories/`;
        break;
      }
      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const ssResp = await fetch(ssUrl, {
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    });

    if (!ssResp.ok) {
      const errBody = await ssResp.text();
      console.error(`SS API error [${ssResp.status}]: ${errBody}`);
      return new Response(
        JSON.stringify({ error: `SS API returned ${ssResp.status}`, detail: errBody }),
        { status: ssResp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await ssResp.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ss-catalog error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
