import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { ghlEnv, ghlFetch } from "../_shared/ghl.ts";

// Temporary setup helper: lists calendars, users, and pipelines so the demo
// booking flow can be wired to the right ids.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const env = ghlEnv();
  const out: Record<string, unknown> = { locationId: env.locationId };

  const safe = async (label: string, fn: () => Promise<unknown>) => {
    try {
      out[label] = await fn();
    } catch (err) {
      out[label] = { error: (err as Error).message };
    }
  };

  await safe("calendars", async () => {
    const r = await ghlFetch(`/calendars/?locationId=${env.locationId}`, {
      method: "GET",
      version: "2021-04-15",
    });
    return (r?.calendars ?? []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slotDuration: c.slotDuration,
      isActive: c.isActive,
    }));
  });

  await safe("users", async () => {
    const r = await ghlFetch(`/users/?locationId=${env.locationId}`, { method: "GET" });
    return (r?.users ?? []).map((u: any) => ({
      id: u.id,
      name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
      email: u.email,
    }));
  });

  await safe("pipelines", async () => {
    const r = await ghlFetch(`/opportunities/pipelines?locationId=${env.locationId}`, {
      method: "GET",
    });
    return (r?.pipelines ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      stages: (p.stages ?? []).map((s: any) => ({ id: s.id, name: s.name })),
    }));
  });

  return new Response(JSON.stringify(out, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
