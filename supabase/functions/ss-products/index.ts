const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SS_BASE = "https://api.ssactivewear.com/v2";

function getAuthHeader(): string {
  const account = Deno.env.get("SS_ACCOUNT_NUMBER");
  const key = Deno.env.get("SS_API_KEY");
  if (!account || !key) throw new Error("SS Activewear credentials not configured");
  return "Basic " + btoa(`${account}:${key}`);
}

async function ssGet(path: string) {
  const res = await fetch(`${SS_BASE}${path}`, {
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SS API ${res.status}: ${text}`);
  }
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { search, styleIds } = body as {
      search?: string;
      styleIds?: string[];
    };

    let result: unknown;

    if (styleIds && styleIds.length > 0) {
      // Get products for specific styles
      const ids = styleIds.join(",");
      const products = await ssGet(
        `/products/?style=${ids}&fields=Sku,piecePrice,customerPrice,dozenPrice,casePrice,colorFrontImage,colorName,sizeName,brandName,styleName,title`
      );

      // Normalize: deduplicate by styleName+colorName, pick first size, prefix images
      const seen = new Map<string, unknown>();
      for (const p of products as any[]) {
        const key = `${p.styleName}-${p.colorName}`;
        if (!seen.has(key)) {
          seen.set(key, {
            sku: p.sku,
            brandName: p.brandName,
            styleName: p.styleName,
            title: p.title,
            colorName: p.colorName,
            sizeName: p.sizeName,
            customerPrice: p.customerPrice,
            piecePrice: p.piecePrice,
            dozenPrice: p.dozenPrice,
            casePrice: p.casePrice,
            imageUrl: p.colorFrontImage
              ? `https://www.ssactivewear.com/${p.colorFrontImage}`
              : null,
          });
        }
      }
      result = Array.from(seen.values());
    } else if (search) {
      // Search styles by keyword
      const styles = await ssGet(`/styles/?q=${encodeURIComponent(search)}`);
      result = (styles as any[]).slice(0, 30).map((s: any) => ({
        styleID: s.styleID,
        title: s.title,
        description: s.description,
        brandName: s.brandName,
        baseCategory: s.baseCategory,
        styleImage: s.styleImage
          ? `https://www.ssactivewear.com/${s.styleImage}`
          : null,
        customerPrice: s.customerPrice,
        piecePrice: s.piecePrice,
      }));
    } else {
      return new Response(
        JSON.stringify({ error: "Provide 'search' or 'styleIds'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
