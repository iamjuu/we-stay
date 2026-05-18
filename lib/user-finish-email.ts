/** Plain + HTML body for the homeowner after configurator finish — no PDF. */
import path from "path";

const BOOKING_URL = "https://links.womcom.com/widget/bookings/westay-discovery-call";
const SUPPORT_EMAIL = "info.atnhawaii@gmail.com";

const BRAND_TEAL = "#2A9D8F";
const BRAND_INK = "#0C1B2A";
const BRAND_MUTED = "#5C6570";
const BRAND_BG = "#F4F8F7";
const HEADER_BG = "#0c1b2a";

export const WESTAY_LOGO_ATTACHMENT = {
  filename: "westay-logo.png",
  path: path.join(process.cwd(), "public", "logo", "westay.png"),
  cid: "westay-logo",
  contentType: "image/png",
} as const;

export function buildUserFinishThankYouEmail(firstName: string): { subject: string; text: string; html: string } {
  const name = firstName.trim() || "there";
  const subject = "Thank you for connecting with WeStay";

  const text = `Aloha ${name},

Thank you for taking the time to explore your ADU journey with WeStay. We're glad you're here.

We've received your configuration details. Our team will review everything on our side. If you'd like to go deeper, you're welcome to book a short discovery call — no pressure, just answers.

Book a discovery call:
${BOOKING_URL}

Questions? Reply to this email or write us at ${SUPPORT_EMAIL}.

Warm regards,
The WeStay team`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#eef2f0;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#eef2f0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(12,27,42,0.08);">
          <tr>
            <td style="background:${HEADER_BG};padding:28px 32px;text-align:center;">
              <img src="cid:westay-logo" alt="WeStay" width="176" height="52" style="display:block;margin:0 auto;max-width:100%;height:auto;">
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.9);">ADU clarity for Oʻahu homeowners</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 28px;background:${BRAND_BG};">
              <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:${BRAND_INK};">Aloha ${escapeHtml(name)},</p>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:${BRAND_INK};">
                Thank you for connecting with us and for walking through your ADU snapshot with WeStay.
              </p>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:${BRAND_MUTED};">
                We've received your selections. Our team has everything on file. The next step, whenever you're ready, is a friendly discovery call — your questions, your timeline, zero obligation.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0;">
                <tr>
                  <td style="border-radius:8px;background:${BRAND_TEAL};">
                    <a href="${BOOKING_URL}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">Schedule your discovery call</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:14px;line-height:1.55;color:${BRAND_MUTED};">
                Prefer email? Reply to this message or reach us at
                <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND_TEAL};font-weight:600;">${escapeHtml(SUPPORT_EMAIL)}</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;background:#ffffff;border-top:1px solid #e2e8e4;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;text-align:center;">
                WeStay · Honolulu, Hawaiʻi<br>
                You're receiving this because you completed the WeStay ADU configurator.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
