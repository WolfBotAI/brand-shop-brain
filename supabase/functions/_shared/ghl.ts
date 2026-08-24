// Shared helpers for talking to the CRM (GoHighLevel / Wolf Bot AI) API v2.

export const GHL_BASE = "https://services.leadconnectorhq.com";

export function ghlEnv() {
  const apiKey = Deno.env.get("GHL_API_KEY");
  const locationId = Deno.env.get("GHL_LOCATION_ID");
  if (!apiKey) throw new Error("GHL_API_KEY is not configured");
  if (!locationId) throw new Error("GHL_LOCATION_ID is not configured");
  return {
    apiKey,
    locationId,
    calendarId: Deno.env.get("GHL_CALENDAR_ID") ?? "",
    ownerUserId: Deno.env.get("GHL_OWNER_USER_ID") ?? "",
    pipelineId: Deno.env.get("GHL_PIPELINE_ID") ?? "",
    pipelineStageId: Deno.env.get("GHL_PIPELINE_STAGE_ID") ?? "",
    tag: Deno.env.get("GHL_DEMO_TAG") ?? "demo-booked",
    smsWebhookUrl: Deno.env.get("GHL_SMS_WEBHOOK_URL") ?? "",
    timezone: Deno.env.get("GHL_TIMEZONE") ?? "America/New_York",
    meetingLink: Deno.env.get("DEMO_MEETING_LINK") ?? "",
  };
}

export async function ghlFetch(
  path: string,
  init: RequestInit & { version?: string } = {},
): Promise<any> {
  const { apiKey } = ghlEnv();
  const { version = "2021-07-28", headers, ...rest } = init;
  const res = await fetch(`${GHL_BASE}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: version,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`GHL ${path} failed [${res.status}]: ${text}`);
    throw new Error(`[${res.status}] ${text}`);
  }
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

/**
 * Sends the SMS from the CRM so it lands in the contact's conversation thread.
 * Uses the conversations API; falls back to an inbound webhook when one is configured.
 */
export async function triggerGhlSms(payload: {
  contactId?: string | null;
  message: string;
  [key: string]: unknown;
}) {
  const { smsWebhookUrl } = ghlEnv();

  if (payload.contactId) {
    try {
      await ghlFetch("/conversations/messages", {
        method: "POST",
        body: JSON.stringify({
          type: "SMS",
          contactId: payload.contactId,
          message: payload.message,
        }),
      });
      return true;
    } catch (err) {
      console.error("CRM SMS send failed:", err);
    }
  }

  if (!smsWebhookUrl) {
    console.warn("No SMS webhook configured — SMS not sent");
    return false;
  }
  try {
    const res = await fetch(smsWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`SMS webhook failed [${res.status}]: ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("SMS webhook error:", err);
    return false;
  }
}

export function formatSlot(iso: string, timezone: string) {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: timezone,
  }).format(d);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: timezone,
  }).format(d);
  return { date, time, full: `${date} at ${time}` };
}
