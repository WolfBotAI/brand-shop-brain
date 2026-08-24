// Captures savings-assessment leads into the CRM: upserts the contact,
// applies assessment tags, and logs the persona / pain points / DISC profile as a note.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";
import { ghlEnv, ghlFetch } from "../_shared/ghl.ts";

const BodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(40).optional().default(""),
  smsConsent: z.boolean().optional().default(false),
  persona: z.string().max(60).optional().default(""),
  painPoints: z.array(z.string().max(300)).max(10).optional().default([]),
  discType: z.string().max(60).optional().default(""),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return json({ error: parsed.error.flatten().fieldErrors }, 400);
  }
  const lead = parsed.data;
  const env = ghlEnv();

  const [firstName, ...rest] = lead.name.trim().split(/\s+/);
  const tags = [
    "assessment-lead",
    ...(lead.persona ? [`persona-${lead.persona}`] : []),
    ...(lead.discType ? [`disc-${lead.discType.toLowerCase()}`] : []),
    ...(lead.smsConsent ? ["sms-consent"] : []),
  ];

  try {
    const contactRes = await ghlFetch("/contacts/upsert", {
      method: "POST",
      body: JSON.stringify({
        locationId: env.locationId,
        firstName,
        lastName: rest.join(" ") || undefined,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || undefined,
        source: "Website — Savings Assessment",
        tags,
        ...(env.ownerUserId ? { assignedTo: env.ownerUserId } : {}),
      }),
    });
    const contactId = contactRes?.contact?.id ?? contactRes?.id;
    if (!contactId) throw new Error("CRM did not return a contact id");

    await ghlFetch(`/contacts/${contactId}/tags`, {
      method: "POST",
      body: JSON.stringify({ tags }),
    }).catch((e) => console.warn("tag add failed:", e));

    const noteLines = [
      "Savings assessment completed.",
      lead.persona ? `Persona: ${lead.persona}` : null,
      lead.discType ? `DISC profile: ${lead.discType}` : null,
      lead.painPoints.length ? `Pain points: ${lead.painPoints.join(" | ")}` : null,
      `SMS consent: ${lead.smsConsent ? "yes" : "no"}`,
    ].filter(Boolean);

    await ghlFetch(`/contacts/${contactId}/notes`, {
      method: "POST",
      body: JSON.stringify({ body: noteLines.join("\n") }),
    }).catch((e) => console.warn("note create failed:", e));

    return json({ ok: true, contactId });
  } catch (err) {
    console.error("capture-lead failed:", err);
    return json({ error: "Could not save your details. Please try again." }, 502);
  }
});
