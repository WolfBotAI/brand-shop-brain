import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { ghlEnv, ghlFetch, triggerGhlSms, formatSlot } from "../_shared/ghl.ts";
import { buildDemoEmail, smsBody } from "../_shared/demo-emails.ts";
import { enqueueEmail } from "../_shared/send-email.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const BodySchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().max(80).optional().default(""),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(30),
  company: z.string().trim().max(160).optional().default(""),
  role: z.string().trim().max(120).optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
  slot: z.string().datetime({ offset: true }),
  timezone: z.string().trim().max(64).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let env;
  try {
    env = ghlEnv();
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return json({ error: "Invalid request", fields: parsed.error.flatten().fieldErrors }, 400);
  }
  const b = parsed.data;
  const timezone = b.timezone || env.timezone;
  const start = new Date(b.slot);
  if (Number.isNaN(start.getTime()) || start.getTime() < Date.now()) {
    return json({ error: "Please pick an upcoming time slot." }, 400);
  }
  const end = new Date(start.getTime() + 15 * 60 * 1000);
  const when = formatSlot(start.toISOString(), timezone);
  const fullName = `${b.firstName} ${b.lastName}`.trim();

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  try {
    // 1. Upsert the contact
    const contactRes = await ghlFetch("/contacts/upsert", {
      method: "POST",
      body: JSON.stringify({
        locationId: env.locationId,
        firstName: b.firstName,
        lastName: b.lastName || undefined,
        name: fullName,
        email: b.email,
        phone: b.phone,
        companyName: b.company || undefined,
        source: "Website — Book a Demo",
        tags: [env.tag],
        ...(env.ownerUserId ? { assignedTo: env.ownerUserId } : {}),
      }),
    });
    const contactId = contactRes?.contact?.id ?? contactRes?.id;
    if (!contactId) throw new Error("CRM did not return a contact id");

    // Make sure the tag sticks even on an existing contact
    await ghlFetch(`/contacts/${contactId}/tags`, {
      method: "POST",
      body: JSON.stringify({ tags: [env.tag] }),
    }).catch((e) => console.warn("tag add failed:", e));

    // 2. Book the appointment on the discovery calendar
    let appointmentId: string | null = null;
    if (env.calendarId) {
      const apptRes = await ghlFetch("/calendars/events/appointments", {
        method: "POST",
        version: "2021-04-15",
        body: JSON.stringify({
          calendarId: env.calendarId,
          locationId: env.locationId,
          contactId,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          title: `15-min Zoom discovery — ${b.company || fullName}`,
          appointmentStatus: "confirmed",
          ignoreFreeSlotValidation: false,
          toNotify: true,
          ...(env.ownerUserId ? { assignedUserId: env.ownerUserId } : {}),
        }),
      });
      appointmentId = apptRes?.id ?? apptRes?.event?.id ?? null;
    }

    // 3. Create the opportunity, owned by William
    let opportunityId: string | null = null;
    if (env.pipelineId && env.pipelineStageId) {
      const oppRes = await ghlFetch("/opportunities/", {
        method: "POST",
        body: JSON.stringify({
          locationId: env.locationId,
          pipelineId: env.pipelineId,
          pipelineStageId: env.pipelineStageId,
          contactId,
          name: `${b.company || fullName} — Demo booked`,
          status: "open",
          source: "Website — Book a Demo",
          ...(env.ownerUserId ? { assignedTo: env.ownerUserId } : {}),
        }),
      }).catch((e) => {
        console.warn("opportunity create failed:", e);
        return null;
      });
      opportunityId = oppRes?.opportunity?.id ?? oppRes?.id ?? null;
    }

    // 4. Persist the booking so reminders can be scheduled
    const { data: booking, error: insertError } = await supabase
      .from("demo_bookings")
      .insert({
        first_name: b.firstName,
        last_name: b.lastName || null,
        email: b.email,
        phone: b.phone,
        company: b.company || null,
        role: b.role || null,
        notes: b.notes || null,
        timezone,
        slot_start: start.toISOString(),
        slot_end: end.toISOString(),
        ghl_contact_id: contactId,
        ghl_appointment_id: appointmentId,
        ghl_opportunity_id: opportunityId,
      })
      .select("id")
      .single();
    if (insertError) console.error("booking insert failed:", insertError.message);

    // 5. Instant confirmation — branded email from us, SMS triggered in the CRM
    const emailData = {
      firstName: b.firstName,
      whenFull: when.full,
      timezone,
      meetingLink: env.meetingLink,
    };
    const mail = buildDemoEmail("confirmation", emailData);
    const emailQueued = await enqueueEmail({
      to: b.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      templateName: "demo_confirmation",
      idempotencyKey: `demo-confirmation-${booking?.id ?? contactId}`,
    });

    await triggerGhlSms({
      type: "demo_confirmation",
      contactId,
      email: b.email,
      phone: b.phone,
      first_name: b.firstName,
      message: smsBody("confirmation", emailData),
      appointment_time: when.full,
      timezone,
      meeting_link: env.meetingLink,
    });

    if (booking?.id && emailQueued) {
      await supabase
        .from("demo_bookings")
        .update({ confirmation_sent_at: new Date().toISOString() })
        .eq("id", booking.id);
    }

    return json({
      success: true,
      bookingId: booking?.id ?? null,
      when: when.full,
      timezone,
      meetingLink: env.meetingLink || null,
      emailQueued,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("book-demo error:", msg);
    return json({ error: "We couldn't complete the booking. Please try another time slot.", details: msg }, 502);
  }
});
