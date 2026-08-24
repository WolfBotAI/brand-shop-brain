// Branded HTML emails for the 15-minute Zoom discovery call.

const ORANGE = "#FF9500";
const SITE = "https://brand-shop.ai";

export type DemoEmailKind = "confirmation" | "reminder_48h" | "reminder_24h" | "reminder_1h";

export interface DemoEmailData {
  firstName: string;
  whenFull: string;
  timezone: string;
  meetingLink: string;
  rescheduleLink?: string;
}

function shell(headline: string, intro: string, data: DemoEmailData, footnote: string) {
  const cta = data.meetingLink
    ? `<a href="${data.meetingLink}" style="display:inline-block;background:${ORANGE};color:#ffffff;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:9999px;font-size:16px;">Join the Zoom call</a>`
    : `<span style="color:#6b7280;font-size:14px;">Your Zoom link will arrive in the calendar invite.</span>`;

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f7f7f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f8;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:${ORANGE};padding:20px 28px;">
          <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.2px;">Brand-Shop.AI</span>
        </td></tr>
        <tr><td style="padding:32px 28px 8px 28px;">
          <h1 style="margin:0 0 12px 0;font-size:24px;line-height:1.25;">${headline}</h1>
          <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#374151;">Hi ${data.firstName}, ${intro}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;">
            <tr><td style="padding:18px 20px;">
              <p style="margin:0 0 6px 0;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;">15-minute Zoom discovery call</p>
              <p style="margin:0;font-size:17px;font-weight:600;">${data.whenFull}</p>
              <p style="margin:6px 0 0 0;font-size:13px;color:#6b7280;">Time zone: ${data.timezone}</p>
            </td></tr>
          </table>
          <p style="margin:24px 0 8px 0;">${cta}</p>
          ${
            data.rescheduleLink
              ? `<p style="margin:12px 0 0 0;font-size:14px;color:#6b7280;">Need a different time? <a href="${data.rescheduleLink}" style="color:${ORANGE};">Reschedule here</a>.</p>`
              : ""
          }
          <p style="margin:24px 0 0 0;font-size:15px;line-height:1.6;color:#374151;">${footnote}</p>
        </td></tr>
        <tr><td style="padding:28px;border-top:1px solid #f0f0f2;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">Brand-Shop.AI — AI-powered storefronts for apparel distributors and decorators.<br/>
          <a href="${SITE}" style="color:#9ca3af;">brand-shop.ai</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function buildDemoEmail(kind: DemoEmailKind, data: DemoEmailData): { subject: string; html: string; text: string } {
  let subject: string;
  let headline: string;
  let intro: string;
  let footnote: string;

  switch (kind) {
    case "confirmation":
      subject = `You're booked — Brand-Shop.AI demo on ${data.whenFull}`;
      headline = "Your demo is confirmed";
      intro = "thanks for booking a 15-minute Zoom discovery call with Brand-Shop.AI. Here are the details:";
      footnote =
        "We'll walk through how AI-built storefronts, automated order routing, and 24/7 AI support fit your operation — and answer whatever you bring.";
      break;
    case "reminder_48h":
      subject = `In 2 days: your Brand-Shop.AI demo`;
      headline = "Your demo is in 2 days";
      intro = "a quick heads-up about your upcoming 15-minute Zoom discovery call:";
      footnote = "Bring one store or client scenario you'd like to see automated — that makes the 15 minutes count.";
      break;
    case "reminder_24h":
      subject = `Tomorrow: your Brand-Shop.AI demo`;
      headline = "Your demo is tomorrow";
      intro = "just a reminder about your 15-minute Zoom discovery call tomorrow:";
      footnote = "See you then. Reply to this email if anything changes.";
      break;
    case "reminder_1h":
      subject = `Starting soon: your Brand-Shop.AI demo`;
      headline = "Your demo starts in an hour";
      intro = "your 15-minute Zoom discovery call is coming up shortly:";
      footnote = "Join a minute early so we can use the full 15 minutes.";
      break;
  }

  const html = shell(headline, intro, data, footnote);
  const text = `${headline}\n\nHi ${data.firstName}, ${intro}\n\n15-minute Zoom discovery call\n${data.whenFull} (${data.timezone})\n${
    data.meetingLink ? `Join: ${data.meetingLink}\n` : ""
  }\n${footnote}\n\nBrand-Shop.AI — ${SITE}`;

  return { subject, html, text };
}

export function smsBody(kind: DemoEmailKind, data: DemoEmailData) {
  switch (kind) {
    case "confirmation":
      return `Brand-Shop.AI: You're booked for a 15-min Zoom demo on ${data.whenFull} (${data.timezone}).${
        data.meetingLink ? ` Join: ${data.meetingLink}` : ""
      }`;
    case "reminder_48h":
      return `Brand-Shop.AI: Your 15-min Zoom demo is in 2 days — ${data.whenFull} (${data.timezone}).`;
    case "reminder_24h":
      return `Brand-Shop.AI: Reminder, your 15-min Zoom demo is tomorrow — ${data.whenFull} (${data.timezone}).`;
    case "reminder_1h":
      return `Brand-Shop.AI: Your 15-min Zoom demo starts in 1 hour.${data.meetingLink ? ` Join: ${data.meetingLink}` : ""}`;
  }
}
