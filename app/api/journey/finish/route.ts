import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { buildJourneyReportPdf } from "@/lib/build-report-pdf";
import { getJourneyByJourneyId, mergeJourney } from "@/lib/journey-db";
import type { JourneyConfiguratorSummary, JourneyContact, JourneyDocument } from "@/lib/journey-types";
import { getMongoUri, getSmtpConfig } from "@/lib/server-config";
import { buildUserFinishThankYouEmail, WESTAY_LOGO_ATTACHMENT } from "@/lib/user-finish-email";

function ownedBy(doc: JourneyDocument, browserUserId: string): boolean {
  const owner = doc.browserUserId ?? doc.userId;
  if (!owner) return true;
  return owner === browserUserId;
}

function parseReportContact(raw: unknown): JourneyContact | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const firstName = typeof o.firstName === "string" ? o.firstName.trim() : "";
  const lastName = typeof o.lastName === "string" ? o.lastName.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const phone = typeof o.phone === "string" ? o.phone.trim() : "";
  if (!firstName || !lastName || !phone) return null;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return { firstName, lastName, email, phone };
}

export async function POST(req: Request) {
  try {
    if (!getMongoUri()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const smtp = getSmtpConfig();
    if (!smtp) {
      return NextResponse.json({ error: "Email not configured" }, { status: 503 });
    }

    const body = (await req.json()) as {
      journeyId?: string;
      browserUserId?: string;
      /** @deprecated Use browserUserId */
      userId?: string;
      configuratorSummary?: JourneyConfiguratorSummary;
      /** Client session contact — use when Mongo row has no contact (e.g. journey id changed mid-flow). */
      reportContact?: unknown;
    };
    const journeyId = body.journeyId?.trim();
    const browserUserId = (body.browserUserId ?? body.userId)?.trim();
    if (!journeyId || !browserUserId) {
      return NextResponse.json({ error: "journeyId and browserUserId required" }, { status: 400 });
    }

    if (body.configuratorSummary) {
      const merged = await mergeJourney(journeyId, browserUserId, {
        maxNavIndex: 6,
        configuratorSummary: body.configuratorSummary,
      });
      if (!merged) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const reportContact = parseReportContact(body.reportContact);
    if (reportContact) {
      const merged = await mergeJourney(journeyId, browserUserId, { contact: reportContact });
      if (!merged) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const journey = await getJourneyByJourneyId(journeyId);
    if (!journey) {
      return NextResponse.json({ error: "Journey not found" }, { status: 404 });
    }
    if (!ownedBy(journey, browserUserId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const pdfBuffer = await buildJourneyReportPdf(journey);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: smtp.user, pass: smtp.pass },
    });

    const contactEmail = journey.contact?.email?.trim() ?? "";
    const hasUserInbox = contactEmail.includes("@");
    const adminSubject = `WeStay ADU report — ${hasUserInbox ? contactEmail : journeyId.slice(0, 8)}`;
    const filename = `westay-adu-report-${journeyId.slice(0, 8)}.pdf`;

    const internalNote = `New ADU journey submission.\nJourney ID: ${journeyId}\nBrowser user: ${browserUserId}\nContact: ${contactEmail || "n/a"}`;
    const attachment = { filename, content: pdfBuffer, contentType: "application/pdf" as const };

    if (hasUserInbox) {
      const firstName = journey.contact?.firstName ?? "there";
      const userMail = buildUserFinishThankYouEmail(firstName);
      /** Homeowner: styled thank-you only — no PDF (full snapshot PDF goes to admin). */
      await transporter.sendMail({
        from: smtp.from,
        to: contactEmail,
        replyTo: smtp.from,
        subject: userMail.subject,
        text: userMail.text,
        html: userMail.html,
        attachments: [WESTAY_LOGO_ATTACHMENT],
      });

      const adminHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f8f7;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f8f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(12,27,42,0.08);">
          <tr>
            <td style="background:#0c1b2a;padding:24px 32px;text-align:center;">
              <img src="cid:westay-logo-admin" alt="WeStay" width="176" height="52" style="display:block;margin:0 auto;max-width:100%;height:auto;">
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;font-size:14px;line-height:1.65;color:#0c1b2a;white-space:pre-wrap;">${internalNote}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      await transporter.sendMail({
        from: smtp.from,
        to: smtp.from,
        subject: adminSubject,
        text: internalNote,
        html: adminHtml,
        attachments: [
          attachment,
          { ...WESTAY_LOGO_ATTACHMENT, cid: "westay-logo-admin" },
        ],
      });
    } else {
      const fallbackNote = `${internalNote}\n\n(No contact email on file — user thank-you not sent.)`;
      const fallbackHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f8f7;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f8f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(12,27,42,0.08);">
          <tr>
            <td style="background:#0c1b2a;padding:24px 32px;text-align:center;">
              <img src="cid:westay-logo-admin" alt="WeStay" width="176" height="52" style="display:block;margin:0 auto;max-width:100%;height:auto;">
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;font-size:14px;line-height:1.65;color:#0c1b2a;white-space:pre-wrap;">${fallbackNote}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
      await transporter.sendMail({
        from: smtp.from,
        to: smtp.from,
        subject: adminSubject,
        text: fallbackNote,
        html: fallbackHtml,
        attachments: [
          attachment,
          { ...WESTAY_LOGO_ATTACHMENT, cid: "westay-logo-admin" },
        ],
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("journey/finish", e);
    return NextResponse.json({ error: "Failed to send report" }, { status: 500 });
  }
}
