import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SS_BASE = "https://api.ssactivewear.com/v2";
const SS_MEDIA_BASE = "https://www.ssactivewear.com";

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

    // Image proxy — returns binary image data, not JSON
    if (action === "image") {
      const imageUrl = url.searchParams.get("url");
      if (!imageUrl) {
        return new Response("Missing url param", { status: 400, headers: corsHeaders });
      }

      // Fix relative URLs from S&S API — prepend base domain
      let fullUrl = imageUrl;
      if (!imageUrl.startsWith("http")) {
        fullUrl = `${SS_MEDIA_BASE}/${imageUrl.replace(/^\//, "")}`;
      }

      const imgResp = await fetch(fullUrl, {
        headers: { Authorization: authHeader, Accept: "image/*" },
      });

      if (!imgResp.ok) {
        // Try without auth as some S&S images are publicly accessible
        const publicResp = await fetch(fullUrl, { headers: { Accept: "image/*" } });
        if (!publicResp.ok) {
          return new Response("Image not found", { status: 404, headers: corsHeaders });
        }
        const contentType = publicResp.headers.get("content-type") || "image/jpeg";
        const body = await publicResp.arrayBuffer();
        return new Response(body, {
          headers: {
            ...corsHeaders,
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      }

      const contentType = imgResp.headers.get("content-type") || "image/jpeg";
      const body = await imgResp.arrayBuffer();

      return new Response(body, {
        headers: {
          ...corsHeaders,
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    }

    let ssUrl: string;

    switch (action) {
      case "styles": {
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
