import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { ghlEnv, ghlFetch } from "../_shared/ghl.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const env = ghlEnv();
    if (!env.calendarId) return json({ error: "GHL_CALENDAR_ID is not configured" }, 500);

    const url = new URL(req.url);
    const days = Math.min(Math.max(Number(url.searchParams.get("days") ?? 14), 1), 30);
    const timezone = url.searchParams.get("timezone") || env.timezone;

    const startDate = Date.now() + 60 * 60 * 1000; // no bookings within the next hour
    const endDate = startDate + days * 24 * 60 * 60 * 1000;

    const data = await ghlFetch(
      `/calendars/${env.calendarId}/free-slots?startDate=${startDate}&endDate=${endDate}&timezone=${encodeURIComponent(timezone)}`,
      { method: "GET", version: "2021-04-15" },
    );

    // Response shape: { "2026-08-25": { slots: [...] }, traceId: "..." }
    const byDate: { date: string; slots: string[] }[] = [];
    for (const [key, value] of Object.entries(data ?? {})) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
      const slots = (value as { slots?: string[] })?.slots ?? [];
      if (slots.length) byDate.push({ date: key, slots });
    }
    byDate.sort((a, b) => a.date.localeCompare(b.date));

    return json({ timezone, days: byDate });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("ghl-calendar error:", msg);
    return json({ error: "Could not load available times", details: msg }, 502);
  }
});
