import path from "path";
import PDFDocument from "pdfkit";
import type { FullEligibilityResult } from "@/lib/eligibility-gates";
import type { EligibilityRentalPayload } from "@/lib/eligibility-pipeline";
import type { JourneyDocument } from "@/lib/journey-types";

const LOGO_PATH = path.join(process.cwd(), "public", "logo", "westay.png");

const PAGE_W = 612;
const PAGE_H = 792;
const M = 48;

const C = {
  ink: "#0C1B2A",
  muted: "#5C6570",
  line: "#E2E8E4",
  teal: "#2A9D8F",
  tealDark: "#1E7A70",
  tealBg: "#EBF7F6",
  warnBg: "#FDF8EC",
  warn: "#B8860B",
  badBg: "#FEF0EC",
  bad: "#E76F51",
  panel: "#F5F7FA",
  white: "#FFFFFF",
};

const DISCOVERY_URL = "https://links.womcom.com/widget/bookings/westay-discovery-call";
const CONTACT_EMAIL = "info.atnhawaii@gmail.com";

// ─── Label lookup maps ───────────────────────────────────────────────────────

const GOAL_LABELS: Record<string, string> = {
  "long-term": "Long-Term Rental",
  "short-term": "Short-Term Rental",
  "family": "Family Living",
  "live-rent": "Live In It, Rent the Main House",
  "not-sure": "Not Sure Yet",
};
const ADU_TYPE_LABELS: Record<string, string> = {
  "backyard": "Backyard Home",
  "attached": "Attached Addition",
  "second-story": "Second Story Addition",
};
const BUILD_PREF_LABELS: Record<string, string> = {
  "fast-track": "Fast Track",
  "custom": "Custom Build",
};
const PLAN_LABELS: Record<string, string> = {
  "studio": "Studio",
  "one-bedroom": "One Bedroom",
  "two-bedroom": "Two Bedroom",
  "two-office": "Two Bedroom + Office",
};
const SIDING_LABELS: Record<string, string> = {
  "default-stucco": "Default Stucco",
  "board-batten": "Board & Batten",
  "vertical-tg": "Vertical T&G",
  "horizontal-lap": "Horizontal Lap",
};
const CLADDING_LABELS: Record<string, string> = {
  "original": "Imported (Original)",
  "coastal": "Coastal Milky White",
  "soft-sage": "Soft Sage",
  "stormwood": "Stormwood Drift",
  "brushed-sandstorm": "Brushed Sandstorm",
  "deep-umber": "Deep Umber",
};
const INTERIOR_LABELS: Record<string, string> = {
  "kai": "Kai — Warm & Simple",
  "aina": "Aina — Grounded & Rich",
  "lani": "Lani — Light & Airy",
  "anu": "Anu — Earthy & Balanced",
};
const FUNDING_LABELS: Record<string, string> = {
  "cash": "Cash",
  "financing": "Need Financing",
  "exploring": "Exploring Options",
};
const ROOF_LABELS: Record<string, string> = {
  "asphalt": "Asphalt Shingle",
  "metal": "Metal Roof",
};

function lbl(map: Record<string, string>, id: string | null | undefined): string {
  if (!id) return "—";
  return map[id] ?? id;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type EligibilitySnap = {
  address?: string;
  eligibilityResult?: FullEligibilityResult;
  rentalData?: EligibilityRentalPayload | null;
};

function parseSnapshot(journey: JourneyDocument): EligibilitySnap | null {
  const raw = journey.eligibilitySnapshot;
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  return {
    address: typeof o.address === "string" ? o.address : undefined,
    eligibilityResult:
      o.eligibilityResult && typeof o.eligibilityResult === "object"
        ? (o.eligibilityResult as FullEligibilityResult)
        : undefined,
    rentalData: (o.rentalData as EligibilityRentalPayload | null | undefined) ?? null,
  };
}

function scoreFromResult(result: FullEligibilityResult): number {
  const n = result.gates.length;
  return n === 0 ? 0 : Math.round((result.passCount / n) * 100);
}

function eligibilityRating(score: number, status: FullEligibilityResult["status"]): string {
  if (status === "INELIGIBLE") return "Needs attention — several checks did not pass.";
  if (status === "NEEDS_REVIEW" || score < 70)
    return "Eligible with verification — some items need a closer look.";
  if (score >= 85) return "Highly Eligible — strong alignment with typical DPP requirements.";
  return "Good eligibility — a few items may need confirmation.";
}

// ─── Drawing primitives ───────────────────────────────────────────────────────

type Doc = InstanceType<typeof PDFDocument>;

function pageFooter(doc: Doc, page: number, total: number): void {
  doc.font("Helvetica").fontSize(7).fillColor("#9CA3AF");
  doc.text(
    `WeStay Technologies Inc. · Kapolei, Hawaiʻi`,
    M, PAGE_H - 34,
    { width: PAGE_W - 2 * M, align: "left", continued: true }
  );
  doc.text(`Page ${page} of ${total}`, { align: "right" });
}

function sectionBanner(doc: Doc, title: string, subtitle?: string): void {
  const y = doc.y;
  const h = subtitle ? 38 : 28;
  doc.rect(0, y, PAGE_W, h).fill(C.ink);
  doc.font("Helvetica-Bold").fontSize(11).fillColor(C.white);
  doc.text(title.toUpperCase(), M, y + 8, { width: PAGE_W - 2 * M });
  if (subtitle) {
    doc.font("Helvetica").fontSize(8).fillColor(C.teal);
    doc.text(subtitle, M, y + 22, { width: PAGE_W - 2 * M });
  }
  doc.y = y + h + 12;
}

function drawProgressBar(doc: Doc, x: number, y: number, w: number, pct: number): void {
  doc.roundedRect(x, y, w, 10, 3).fill(C.line);
  if (pct > 0) doc.roundedRect(x, y, (w * Math.min(100, pct)) / 100, 10, 3).fill(C.teal);
}

/** Draws an initials avatar circle at (cx, cy). */
function drawAvatar(doc: Doc, cx: number, cy: number, r: number, initials: string): void {
  doc.circle(cx, cy, r).fill(C.teal);
  doc.font("Helvetica-Bold")
    .fontSize(r * 0.9)
    .fillColor(C.white)
    .text(initials, cx - r, cy - r * 0.6, { width: r * 2, align: "center" });
}

/** Stat card — small metric tile. */
function statCard(doc: Doc, x: number, y: number, w: number, fieldLabel: string, value: string, sub?: string): void {
  const h = 62;
  doc.roundedRect(x, y, w, h, 5).fill(C.panel);
  doc.font("Helvetica").fontSize(7).fillColor(C.muted).text(fieldLabel.toUpperCase(), x + 10, y + 8, { width: w - 20 });
  doc.font("Helvetica-Bold").fontSize(16).fillColor(C.ink).text(value, x + 10, y + 20, { width: w - 20 });
  if (sub) doc.font("Helvetica").fontSize(7).fillColor(C.muted).text(sub, x + 10, y + 44, { width: w - 20 });
}

/**
 * Draws a two-column table.
 * Left col = field name (muted), right col = answer (teal bg + bold teal text when filled).
 * Returns the Y position after the last row.
 */
function drawTable(
  doc: Doc,
  x: number,
  startY: number,
  w: number,
  rows: Array<{ field: string; value: string }>,
  labelColW = 190
): number {
  const valColW = w - labelColW;
  const ROW_H = 26;
  let y = startY;

  // Header
  doc.rect(x, y, labelColW, ROW_H).fill(C.ink);
  doc.rect(x + labelColW, y, valColW, ROW_H).fill(C.teal);
  doc.font("Helvetica-Bold").fontSize(7.5).fillColor(C.white);
  doc.text("FIELD", x + 10, y + 9, { width: labelColW - 20 });
  doc.text("ANSWER", x + labelColW + 10, y + 9, { width: valColW - 20 });
  y += ROW_H;

  for (let i = 0; i < rows.length; i++) {
    const { field, value } = rows[i];
    const filled = value !== "—" && value.trim() !== "";
    const rowBg = i % 2 === 0 ? C.white : C.panel;
    doc.rect(x, y, labelColW, ROW_H).fill(rowBg);
    doc.rect(x + labelColW, y, valColW, ROW_H).fill(filled ? C.tealBg : C.panel);
    // row border
    doc.rect(x, y, w, ROW_H).lineWidth(0.4).strokeColor(C.line).stroke();

    doc.font("Helvetica").fontSize(8.5).fillColor(C.muted);
    doc.text(field, x + 10, y + 8, { width: labelColW - 20 });
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(filled ? C.tealDark : C.muted);
    doc.text(value || "—", x + labelColW + 10, y + 8, { width: valColW - 20 });
    y += ROW_H;
  }

  return y;
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function buildJourneyReportPdf(journey: JourneyDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "LETTER", margin: 0 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const snap = parseSnapshot(journey);
    const er = snap?.eligibilityResult;
    const score = er ? scoreFromResult(er) : 0;
    const rating = er ? eligibilityRating(score, er.status) : "";
    const TOTAL = 5;
    let pg = 1;

    const contact = journey.contact;
    const firstName = contact?.firstName ?? "";
    const lastName = contact?.lastName ?? "";
    const fullName = `${firstName} ${lastName}`.trim() || "Homeowner";
    const initials = ((firstName[0] ?? "") + (lastName[0] ?? "")).toUpperCase() || "?";

    // ══════════════════════════════════════════
    //  PAGE 1 — COVER
    // ══════════════════════════════════════════

    // Top dark header band
    doc.rect(0, 0, PAGE_W, 100).fill(C.ink);
    // Teal accent stripe
    doc.rect(0, 100, PAGE_W, 5).fill(C.teal);

    // WeStay logo — right side of header
    const logoW = 130;
    const logoH = Math.round(logoW * (52 / 176)); // preserve 176:52 aspect ratio
    try {
      doc.image(LOGO_PATH, PAGE_W - M - logoW, Math.round((100 - logoH) / 2), { width: logoW });
    } catch {
      // logo file missing — skip silently
    }

    // Title
    doc.font("Helvetica-Bold").fontSize(30).fillColor(C.white);
    doc.text("ADU Snapshot", M, 22, { width: PAGE_W - 2 * M - logoW - 16 });
    doc.font("Helvetica").fontSize(11).fillColor(C.teal);
    doc.text("Eligibility  ·  Cost  ·  Income  ·  Next Steps", M, 58, { width: PAGE_W - 2 * M - logoW - 16 });

    // ── User profile card ──
    const profileY = 120;
    drawAvatar(doc, M + 26, profileY + 26, 26, initials);

    doc.font("Helvetica-Bold").fontSize(15).fillColor(C.ink);
    doc.text(fullName, M + 64, profileY + 4, { width: PAGE_W - M - 64 - M });
    doc.font("Helvetica").fontSize(9).fillColor(C.muted);
    if (contact?.email) doc.text(contact.email, M + 64, profileY + 22, { width: PAGE_W - M - 64 - M });
    if (contact?.phone) doc.text(contact.phone, M + 64, profileY + 34, { width: PAGE_W - M - 64 - M });

    doc.moveTo(M, profileY + 60).lineTo(PAGE_W - M, profileY + 60).lineWidth(0.5).strokeColor(C.line).stroke();

    // ── Property info ──
    const propY = profileY + 72;
    doc.font("Helvetica-Bold").fontSize(10).fillColor(C.muted);
    doc.text("PROPERTY ADDRESS", M, propY);
    doc.font("Helvetica-Bold").fontSize(12).fillColor(C.ink);
    doc.text(snap?.address ?? "Address on file", M, propY + 14, { width: PAGE_W - 2 * M });

    // ── Metric tiles ──
    const metricY = propY + 48;
    const adu = er?.aduSize;
    const mW = (PAGE_W - 2 * M - 18) / 4;
    const metrics = [
      { l: "Max ADU Size", v: adu ? `${adu.maxAduSizeSqFt.toLocaleString()} SF` : "—" },
      { l: "Eligibility Score", v: er ? `${score}%` : "—" },
      { l: "Checks Pass", v: er ? `${er.passCount} of ${er.gates.length}` : "—" },
      { l: "Status", v: er ? er.status.replace(/_/g, " ") : "—" },
    ];
    metrics.forEach((m, i) => statCard(doc, M + i * (mW + 6), metricY, mW, m.l, m.v));

    // ── Prepared for block ──
    const prepY = metricY + 78;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(C.muted);
    doc.text(`Prepared for: ${fullName}`, M, prepY);
    doc.font("Helvetica").fontSize(9).fillColor(C.muted);
    doc.text(
      `Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      M, prepY + 14
    );

    // ── Disclaimer ──
    const discY = prepY + 48;
    doc.roundedRect(M, discY, PAGE_W - 2 * M, 60, 5).fill(C.tealBg);
    doc.font("Helvetica").fontSize(8).fillColor(C.tealDark);
    doc.text(
      "This Snapshot is a preliminary estimate based on your address and the answers you provided. It is not a commitment to build, a loan offer, or financial advice. Your full personalized Pathway Report will be prepared after your discovery call.",
      M + 12, discY + 10, { width: PAGE_W - 2 * M - 24 }
    );

    // ── At a Glance — contact + build info below disclaimer ──
    doc.y = discY + 75;
    doc.font("Helvetica-Bold").fontSize(8).fillColor(C.muted);
    doc.text("AT A GLANCE", M, doc.y);
    doc.moveDown(0.3);
    drawTable(doc, M, doc.y, PAGE_W - 2 * M, [
      { field: "Name",        value: fullName },
      { field: "Email",       value: contact?.email ?? "—" },
      { field: "Phone",       value: contact?.phone ?? "—" },
      { field: "Goal",        value: lbl(GOAL_LABELS,       journey.buildSelections?.goalId) },
      { field: "ADU Type",    value: lbl(ADU_TYPE_LABELS,   journey.buildSelections?.aduTypeId) },
      { field: "Build Path",  value: lbl(BUILD_PREF_LABELS, journey.buildSelections?.buildPreferenceId) },
      { field: "Address",     value: snap?.address ?? "—" },
      { field: "Max ADU SF",  value: adu ? `${adu.maxAduSizeSqFt.toLocaleString()} SF` : "—" },
    ]);

    pageFooter(doc, pg++, TOTAL);
    doc.addPage();

    // ══════════════════════════════════════════
    //  PAGE 2 — ELIGIBILITY
    // ══════════════════════════════════════════

    sectionBanner(doc, "Eligibility", "Automated checks run against City & County of Honolulu DPP criteria");

    if (er) {
      // Score + bar
      const scoreY = doc.y;
      doc.font("Helvetica-Bold").fontSize(52).fillColor(C.teal);
      doc.text(`${score}%`, M, scoreY, { width: 130, lineBreak: false });

      doc.font("Helvetica-Bold").fontSize(13).fillColor(C.ink);
      doc.text(rating, M + 145, scoreY + 6, { width: PAGE_W - 2 * M - 145 });
      doc.font("Helvetica").fontSize(9).fillColor(C.muted);
      doc.text(
        `${er.passCount} pass  ·  ${er.flagCount} need verification  ·  ${er.failCount} blocked`,
        M + 145, scoreY + 26, { width: PAGE_W - 2 * M - 145 }
      );
      drawProgressBar(doc, M, scoreY + 58, PAGE_W - 2 * M, score);
      doc.y = scoreY + 76;
      doc.moveDown(0.5);

      // Gate columns
      const passG = er.gates.filter((g) => g.status === "pass");
      const flagG = er.gates.filter((g) => g.status === "flag");
      const badG  = er.gates.filter((g) => g.status === "fail" || g.status === "pending");
      const colW  = (PAGE_W - 2 * M - 16) / 3;
      const boxY  = doc.y;
      const BOX_H = 195;

      const cols = [
        { title: "✓  Checks Pass",        gates: passG, hdr: C.teal,    bg: C.tealBg },
        { title: "⚠  Needs Verification", gates: flagG, hdr: C.warn,    bg: C.warnBg },
        { title: "✗  Blocked / Pending",  gates: badG,  hdr: C.bad,     bg: C.badBg  },
      ];

      cols.forEach(({ title, gates, hdr, bg }, idx) => {
        const cx = M + idx * (colW + 8);
        doc.roundedRect(cx, boxY, colW, BOX_H, 5).fill(bg);
        doc.rect(cx, boxY, colW, 24).fill(hdr);
        doc.font("Helvetica-Bold").fontSize(8).fillColor(C.white);
        doc.text(title, cx + 8, boxY + 8, { width: colW - 16 });
        doc.font("Helvetica").fontSize(8).fillColor(C.ink);
        const lines = gates.slice(0, 6).map((g) => `• ${g.name}`);
        doc.text(lines.join("\n") || "None", cx + 8, boxY + 32, { width: colW - 16 });
        if (gates.length > 6) {
          doc.font("Helvetica").fontSize(7).fillColor(C.muted);
          doc.text(`+${gates.length - 6} more`, cx + 8, boxY + BOX_H - 16, { width: colW - 16 });
        }
      });

      doc.y = boxY + BOX_H + 14;

      // Notable gate details
      const notable = er.gates.filter((g) => g.status !== "pass").slice(0, 6);
      if (notable.length) {
        doc.font("Helvetica-Bold").fontSize(9).fillColor(C.ink).text("Gate Details", M, doc.y);
        doc.moveDown(0.25);
        for (const g of notable) {
          const col = g.status === "fail" ? C.bad : C.warn;
          doc.font("Helvetica-Bold").fontSize(8).fillColor(col).text(`${g.name}: `, M, doc.y, { continued: true });
          doc.font("Helvetica").fillColor(C.ink).text(g.message, { width: PAGE_W - 2 * M });
          doc.moveDown(0.2);
        }
      }
    } else {
      doc.font("Helvetica").fontSize(10).fillColor(C.muted).text("No eligibility data stored for this journey.");
    }

    pageFooter(doc, pg++, TOTAL);
    doc.addPage();

    // ══════════════════════════════════════════
    //  PAGE 3 — CONFIGURATION
    // ══════════════════════════════════════════

    sectionBanner(doc, "ADU Configuration", "Selections made in the 3D ADU configurator during the client session");

    const cfg = journey.configuratorSummary;
    if (cfg) {
      doc.font("Helvetica-Bold").fontSize(9).fillColor(C.ink).text("Design Selections", M, doc.y);
      doc.moveDown(0.25);
      let y4 = drawTable(doc, M, doc.y, PAGE_W - 2 * M, [
        { field: "Floor Plan",        value: lbl(PLAN_LABELS,     cfg.planId) },
        { field: "Siding Style",      value: lbl(SIDING_LABELS,   cfg.sidingId) },
        { field: "Exterior Cladding", value: lbl(CLADDING_LABELS, cfg.claddingId) },
        { field: "Roof Style",        value: lbl(ROOF_LABELS,     cfg.roofStyle) },
        { field: "Interior Theme",    value: lbl(INTERIOR_LABELS, cfg.interiorId) },
        { field: "Funding Method",    value: lbl(FUNDING_LABELS,  cfg.fundingId) },
      ]);
      doc.y = y4 + 16;

      doc.font("Helvetica-Bold").fontSize(9).fillColor(C.ink).text("Optional Features", M, doc.y);
      doc.moveDown(0.25);
      const featureRows: Array<{ field: string; value: string }> = [
        { field: "Deck",              value: cfg.features.deck   ? "Yes — Included" : "No" },
        { field: "Lanai / Porch",      value: cfg.features.lanai  ? "Yes — Included" : "No" },
        { field: "Outdoor Shower",    value: cfg.features.shower ? "Yes — Included" : "No" },
        ...Object.entries(cfg.upgrades ?? {}).map(([k, v]) => ({
          field: k,
          value: v ? "Yes — Included" : "No",
        })),
      ];
      y4 = drawTable(doc, M, doc.y, PAGE_W - 2 * M, featureRows);
      doc.y = y4 + 16;

      if (cfg.chipLabels?.length) {
        doc.font("Helvetica-Bold").fontSize(9).fillColor(C.ink).text("All Selected Options", M, doc.y);
        doc.moveDown(0.2);
        doc.roundedRect(M, doc.y, PAGE_W - 2 * M, 36, 5).fill(C.tealBg);
        doc.font("Helvetica").fontSize(8).fillColor(C.tealDark);
        doc.text(
          cfg.chipLabels.join("  ·  "),
          M + 10, doc.y + 8,
          { width: PAGE_W - 2 * M - 20 }
        );
        doc.y += 48;
      }
    } else {
      doc.font("Helvetica").fontSize(10).fillColor(C.muted).text("No configurator session stored for this journey.");
    }

    pageFooter(doc, pg++, TOTAL);
    doc.addPage();

    // ══════════════════════════════════════════
    //  PAGE 4 — ESTIMATED NUMBERS
    // ══════════════════════════════════════════

    sectionBanner(doc, "Estimated Numbers", "ZIP-level rent comps · Construction costs finalized on discovery call");

    const rent = snap?.rentalData?.rentals?.[0];
    const cardW = (PAGE_W - 2 * M - 12) / 2;
    const cardY = doc.y;
    statCard(
      doc, M, cardY, cardW,
      "Est. Monthly Rent (primary comp)",
      rent ? `$${rent.estimate.toLocaleString()}` : "—",
      rent ? `$${rent.min.toLocaleString()}–$${rent.max.toLocaleString()} · ${rent.comparableCount} comps` : "No data available"
    );
    statCard(
      doc, M + cardW + 12, cardY, cardW,
      "Eligibility Score",
      er ? `${score}%` : "—",
      er ? `${er.passCount} of ${er.gates.length} checks passing` : ""
    );
    doc.y = cardY + 74;

    // Rent comps table
    if (snap?.rentalData?.rentals?.length) {
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").fontSize(9).fillColor(C.ink).text("Rent Comps by Bedroom Count", M, doc.y);
      doc.moveDown(0.25);
      const rentRows = snap.rentalData.rentals.slice(0, 8).map((r) => ({
        field: `${r.bedrooms}-Bedroom Unit`,
        value: `$${r.estimate.toLocaleString()} / mo  (range $${r.min.toLocaleString()}–$${r.max.toLocaleString()}, ${r.comparableCount} comps)`,
      }));
      const rentEnd = drawTable(doc, M, doc.y, PAGE_W - 2 * M, rentRows);
      doc.y = rentEnd + 16;
    }

    doc.moveDown(0.3);
    doc.roundedRect(M, doc.y, PAGE_W - 2 * M, 44, 5).fill(C.panel);
    doc.font("Helvetica").fontSize(8).fillColor(C.muted);
    doc.text(
      "Annual income and property-value impact statements are directional only. The advisor will align numbers to the lender, appraisal, and tax context on the discovery call.",
      M + 12, doc.y + 8, { width: PAGE_W - 2 * M - 24 }
    );

    pageFooter(doc, pg++, TOTAL);
    doc.addPage();

    // ══════════════════════════════════════════
    //  PAGE 5 — NEXT STEP
    // ══════════════════════════════════════════

    sectionBanner(doc, "Thank You");

    doc.moveDown(2);
    doc.font("Helvetica-Bold").fontSize(24).fillColor(C.ink);
    doc.text("Thank you.", M, doc.y, { width: PAGE_W - 2 * M, align: "center" });
    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(11).fillColor(C.muted);
    doc.text(
      "The client's ADU journey has been received and is under review.",
      M, doc.y, { width: PAGE_W - 2 * M, align: "center" }
    );

    doc.moveDown(3);
    const coY = doc.y;
    doc.roundedRect(M, coY, PAGE_W - 2 * M, 96, 6).fill(C.panel);
    doc.font("Helvetica-Bold").fontSize(12).fillColor(C.ink);
    doc.text("WeStay Technologies Inc.", M + 28, coY + 18, { width: PAGE_W - 2 * M - 56 });
    doc.font("Helvetica").fontSize(9).fillColor(C.muted);
    doc.text("Kapolei, Hawaiʻi", M + 28, coY + 38, { width: PAGE_W - 2 * M - 56 });
    doc.text(CONTACT_EMAIL,           M + 28, coY + 52, { width: PAGE_W - 2 * M - 56 });
    doc.text(DISCOVERY_URL,           M + 28, coY + 66, { width: PAGE_W - 2 * M - 56 });

    doc.y = coY + 112;
    doc.moveDown(2);
    doc.font("Helvetica").fontSize(7.5).fillColor("#9CA3AF");
    doc.text(
      `Journey ${journey.journeyId ?? "—"}  ·  Generated ${new Date().toISOString()}`,
      M, doc.y, { width: PAGE_W - 2 * M, align: "center" }
    );

    pageFooter(doc, pg, TOTAL);
    doc.end();
  });
}
