// Enqueues an email through the project's email infrastructure.
// Returns false (without throwing) when email infra / sender domain is not ready yet,
// so booking never fails because of email.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

export async function enqueueEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  templateName: string;
  idempotencyKey: string;
}): Promise<boolean> {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const fromEmail = Deno.env.get("DEMO_FROM_EMAIL");
  if (!url || !serviceKey) return false;

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  try {
    const { error } = await supabase.rpc("enqueue_email", {
      p_queue: "transactional_emails",
      p_payload: {
        to: params.to,
        from: fromEmail ?? undefined,
        subject: params.subject,
        html: params.html,
        text: params.text,
        purpose: "transactional",
        template_name: params.templateName,
        idempotency_key: params.idempotencyKey,
      },
    });
    if (error) {
      console.warn("enqueue_email unavailable:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("enqueue_email failed:", err);
    return false;
  }
}
