import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { ghlEnv, triggerGhlSms, formatSlot } from "../_shared/ghl.ts";
import { buildDemoEmail, smsBody, type DemoEmailKind } from "../_shared/demo-emails.ts";
import { enqueueEmail } from "../_shared/send-email.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const WINDOWS: { kind: DemoEmailKind; column: string; hours: number }[] = [
  { kind: "reminder_48h", column: "reminder_48h_sent_at", hours: 48 },
  { kind: "reminder_24h", column: "reminder_24h_sent_at", hours: 24 },
  { kind: "reminder_1h", column: "reminder_1h_sent_at", hours: 1 },
];

// Runs on a schedule: sends any reminder whose window has opened and hasn't gone out yet.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  let env;
  try {
    env = ghlEnv();
  } catch {
    env = { meetingLink: Deno.env.get("DEMO_MEETING_LINK") ?? "" } as ReturnType<typeof ghlEnv>;
  }

  const now = Date.now();
  const results: Record<string, number> = {};

  try {
    const { data: bookings, error } = await supabase
      .from("demo_bookings")
      .select("*")
      .eq("status", "booked")
      .gte("slot_start", new Date(now).toISOString())
      .lte("slot_start", new Date(now + 49 * 60 * 60 * 1000).toISOString());
    if (error) throw new Error(error.message);

    for (const booking of bookings ?? []) {
      const startMs = new Date(booking.slot_start as string).getTime();
      const hoursOut = (startMs - now) / (60 * 60 * 1000);

      for (const w of WINDOWS) {
        if (booking[w.column]) continue;
        if (hoursOut > w.hours) continue; // window not open yet
        // Don't fire a wider reminder that is already superseded by a closer one
        const closer = WINDOWS.find((x) => x.hours < w.hours && hoursOut <= x.hours);
        if (closer) continue;

        const when = formatSlot(booking.slot_start as string, booking.timezone as string);
        const data = {
          firstName: booking.first_name as string,
          whenFull: when.full,
          timezone: booking.timezone as string,
          meetingLink: env.meetingLink,
        };
        const mail = buildDemoEmail(w.kind, data);

        await enqueueEmail({
          to: booking.email as string,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
          templateName: `demo_${w.kind}`,
          idempotencyKey: `${w.kind}-${booking.id}`,
        });

        await triggerGhlSms({
          type: w.kind,
          contactId: booking.ghl_contact_id,
          email: booking.email,
          phone: booking.phone,
          first_name: booking.first_name,
          message: smsBody(w.kind, data),
          appointment_time: when.full,
          timezone: booking.timezone,
          meeting_link: env.meetingLink,
        });

        await supabase
          .from("demo_bookings")
          .update({ [w.column]: new Date().toISOString() })
          .eq("id", booking.id);

        results[w.kind] = (results[w.kind] ?? 0) + 1;
      }
    }

    return json({ success: true, processed: bookings?.length ?? 0, sent: results });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("demo-reminders error:", msg);
    return json({ error: msg }, 500);
  }
});
