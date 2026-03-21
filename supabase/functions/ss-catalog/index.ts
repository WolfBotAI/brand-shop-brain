import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SS_BASE = "https://api.ssactivewear.com/v2";
const SS_CDN = "https://cdni.ssactivewear.com";

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

    // Image proxy — returns binary image data
    if (action === "image") {
      const imageUrl = url.searchParams.get("url");
      if (!imageUrl) {
        return new Response("Missing url param", { status: 400, headers: corsHeaders });
      }

      // Convert relative S&S paths to CDN URLs
      let fullUrl = imageUrl;
      if (!imageUrl.startsWith("http")) {
        fullUrl = `${SS_CDN}/${imageUrl.replace(/^\//, "")}`;
      }
      // Also fix www.ssactivewear.com URLs to use CDN
      fullUrl = fullUrl.replace("www.ssactivewear.com", "cdni.ssactivewear.com");

      // Try CDN first (no auth needed for public CDN)
      const cdnResp = await fetch(fullUrl, { headers: { Accept: "image/*" } });
      if (cdnResp.ok) {
        const contentType = cdnResp.headers.get("content-type") || "image/jpeg";
        const body = await cdnResp.arrayBuffer();
        return new Response(body, {
          headers: {
            ...corsHeaders,
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      }

      // Fall back to authenticated fetch from API domain
      const authUrl = fullUrl.replace("cdni.ssactivewear.com", "www.ssactivewear.com");
      const imgResp = await fetch(authUrl, {
        headers: { Authorization: authHeader, Accept: "image/*" },
      });

      if (!imgResp.ok) {
        return new Response("Image not found", { status: 404, headers: corsHeaders });
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

    // styleDetail — fetches /products/?styleID=X and aggregates colors, sizes, pricing
    if (action === "styleDetail") {
      const styleID = url.searchParams.get("styleID");
      if (!styleID) {
        return new Response(
          JSON.stringify({ error: "styleID required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const ssResp = await fetch(`${SS_BASE}/products/?styleID=${styleID}`, {
        headers: { Authorization: authHeader, Accept: "application/json" },
      });

      if (!ssResp.ok) {
        const errBody = await ssResp.text();
        console.error(`SS products API error [${ssResp.status}]: ${errBody}`);
        return new Response(
          JSON.stringify({ error: `SS API returned ${ssResp.status}` }),
          { status: ssResp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const products = await ssResp.json();
      if (!Array.isArray(products) || products.length === 0) {
        return new Response(
          JSON.stringify({ colors: [], sizes: [], pricing: null, products: [] }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Aggregate unique colors
      const colorMap = new Map<string, { name: string; hex: string; image: string | null; backImage: string | null }>();
      const sizeSet = new Set<string>();
      let minCustomerPrice = Infinity;
      let maxCustomerPrice = 0;
      let minPiecePrice = Infinity;
      let maxPiecePrice = 0;

      for (const p of products) {
        const colorName = p.colorName || p.ColorName || "";
        const hex = p.color1 || p.Color1 || "#888888";
        const frontImg = p.colorFrontImage || p.ColorFrontImage || null;
        const backImg = p.colorBackImage || p.ColorBackImage || null;
        const sizeName = p.sizeName || p.SizeName || "";
        const custPrice = p.customerPrice || p.CustomerPrice || 0;
        const piecePrice = p.piecePrice || p.PiecePrice || 0;

        if (colorName && !colorMap.has(colorName)) {
          colorMap.set(colorName, { name: colorName, hex: `#${hex.replace(/^#/, "")}`, image: frontImg, backImage: backImg });
        }
        if (sizeName) sizeSet.add(sizeName);
        if (custPrice > 0) {
          minCustomerPrice = Math.min(minCustomerPrice, custPrice);
          maxCustomerPrice = Math.max(maxCustomerPrice, custPrice);
        }
        if (piecePrice > 0) {
          minPiecePrice = Math.min(minPiecePrice, piecePrice);
          maxPiecePrice = Math.max(maxPiecePrice, piecePrice);
        }
      }

      const result = {
        colors: Array.from(colorMap.values()),
        sizes: Array.from(sizeSet),
        pricing: {
          customerPrice: { min: minCustomerPrice === Infinity ? 0 : minCustomerPrice, max: maxCustomerPrice },
          piecePrice: { min: minPiecePrice === Infinity ? 0 : minPiecePrice, max: maxPiecePrice },
        },
        description: products[0]?.description || products[0]?.Description || "",
        brandName: products[0]?.brandName || products[0]?.BrandName || "",
        styleName: products[0]?.styleName || products[0]?.StyleName || "",
        totalSkus: products.length,
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
