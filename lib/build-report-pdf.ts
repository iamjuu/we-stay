import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import type { FullEligibilityResult } from "@/lib/eligibility-gates";
import type { EligibilityRentalPayload } from "@/lib/eligibility-pipeline";
import type { JourneyDocument } from "@/lib/journey-types";

const PAGE_W = 612;
const PAGE_H = 792;
const M = 52;
const COLORS = {
  ink: "#0C1B2A",
  muted: "#5C6570",
  line: "#E2E8E4",
  teal: "#2A9D8F",
  tealDark: "#1E7A70",
  warn: "#E9C46A",
  bad: "#E76F51",
  ok: "#2A9D8F",
  panel: "#F4F8F7",
};

const DISCOVERY_BOOKING_URL = "https://links.womcom.com/widget/bookings/westay-discovery-call";
const CONTACT_EMAIL = "richie.westayhome@gmail.com";

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
  if (n === 0) return 0;
  return Math.round((result.passCount / n) * 100);
}

function eligibilityRating(score: number, status: FullEligibilityResult["status"]): string {
  if (status === "INELIGIBLE") return "Needs attention — several checks did not pass.";
  if (status === "NEEDS_REVIEW" || score < 70) return "Eligible with verification — some items need a closer look.";
  if (score >= 85) return "Highly eligible — strong alignment with typical DPP requirements.";
  return "Good eligibility — a few items may need confirmation.";
}

/** Score meter — avoids PDF arc APIs that are missing from some typings. */
function drawScoreMeter(doc: InstanceType<typeof PDFDocument>, x: number, y: number, w: number, pct: number): void {
  const p = Math.max(0, Math.min(100, pct));
  doc.roundedRect(x, y, w, 14, 4).fill(COLORS.line);
  if (p > 0) doc.roundedRect(x, y, (w * p) / 100, 14, 4).fill(COLORS.teal);
}

function drawStatCard(
  doc: InstanceType<typeof PDFDocument>,
  x: number,
  y: number,
  w: number,
  label: string,
  value: string,
  sub?: string
): void {
  doc.roundedRect(x, y, w, 58, 6).fill(COLORS.panel);
  doc.fillColor(COLORS.muted).font("Helvetica").fontSize(8);
  doc.text(label.toUpperCase(), x + 12, y + 8, { width: w - 24 });
  doc.fillColor(COLORS.ink).font("Helvetica-Bold").fontSize(16);
  doc.text(value, x + 12, y + 20, { width: w - 24 });
  if (sub) {
    doc.font("Helvetica").fontSize(8).fillColor(COLORS.muted);
    doc.text(sub, x + 12, y + 40, { width: w - 24 });
  }
}

function drawRentalBars(
  doc: InstanceType<typeof PDFDocument>,
  x: number,
  y: number,
  width: number,
  rentals: EligibilityRentalPayload["rentals"]
): void {
  if (!rentals.length) return;
  const slice = rentals.slice(0, 5);
  const maxEst = Math.max(...slice.map((r) => r.estimate), 1);
  const barW = Math.min(56, (width - (slice.length - 1) * 12) / slice.length);
  let bx = x;
  const baseY = y + 110;
  doc.font("Helvetica-Bold").fontSize(11).fillColor(COLORS.ink).text("Rent comps by unit type (zip-level)", x, y);
  doc.font("Helvetica").fontSize(8).fillColor(COLORS.muted);
  doc.text("Bar height reflects estimated monthly rent from comparable count in your ZIP.", x, y + 16, { width });

  for (const row of slice) {
    const h = Math.round((row.estimate / maxEst) * 88);
    doc.roundedRect(bx, baseY - h, barW, h, 3).fill(COLORS.teal);
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(COLORS.ink)
      .text(`$${Math.round(row.estimate / 1000)}k`, bx, baseY - h - 16, { width: barW, align: "center" });
    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor(COLORS.muted)
      .text(`${row.bedrooms} bd`, bx, baseY + 6, { width: barW, align: "center" });
    bx += barW + 12;
  }
}

function safeImage(rel: string): string | null {
  const p = path.join(process.cwd(), rel);
  return fs.existsSync(p) ? p : null;
}

function pageFooter(doc: InstanceType<typeof PDFDocument>, page: number, total: number): void {
  doc.font("Helvetica").fontSize(8).fillColor("#9CA3AF");
  doc.text(`— ${page} of ${total} —`, M, PAGE_H - 40, {
    align: "center",
    width: PAGE_W - 2 * M,
  });
}

export function buildJourneyReportPdf(journey: JourneyDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "LETTER", margin: M });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const snap = parseSnapshot(journey);
    const er = snap?.eligibilityResult;
    const score = er ? scoreFromResult(er) : 0;
    const rating = er ? eligibilityRating(score, er.status) : "";
    const TOTAL_PAGES = 6;
    let pageNum = 1;

    // ----- Page 1 cover -----
    const heroPath = safeImage("content/images/about/adu-evening-duo.png") ?? safeImage("content/images/property.png");
    if (heroPath) {
      try {
        doc.save();
        doc.image(heroPath, 0, 0, { width: PAGE_W, height: 200 });
        doc.restore();
      } catch {
        /* skip broken image */
      }
    } else {
      doc.rect(0, 0, PAGE_W, 200).fill(COLORS.tealDark);
    }

    doc.y = 216;
    doc.font("Helvetica-Bold").fontSize(26).fillColor(COLORS.ink).text("Your ADU Snapshot", { align: "center" });
    doc.moveDown(0.2);
    doc.font("Helvetica").fontSize(11).fillColor(COLORS.muted).text("Eligibility · Rent · Selections · Next steps", {
      align: "center",
    });
    doc.moveDown(0.6);

    if (journey.contact) {
      doc.font("Helvetica-Bold").fontSize(12).fillColor(COLORS.ink);
      doc.text(
        `Prepared for: ${journey.contact.firstName} ${journey.contact.lastName}`,
        M,
        doc.y,
        { width: PAGE_W - 2 * M }
      );
      doc.moveDown(0.25);
      doc.font("Helvetica").fontSize(11).fillColor(COLORS.muted);
      doc.text(journey.contact.email, { width: PAGE_W - 2 * M });
      doc.text(journey.contact.phone, { width: PAGE_W - 2 * M });
    }

    doc.moveDown(0.35);
    doc.font("Helvetica-Bold").fontSize(11).fillColor(COLORS.ink);
    doc.text(snap?.address ?? "Property address on file", { width: PAGE_W - 2 * M });

    const adu = er?.aduSize;
    const metrics: string[] = [];
    if (adu) {
      metrics.push(`Max ADU: up to ${adu.maxAduSizeSqFt.toLocaleString()} SF`);
      if (adu.primaryDwellingSizeSqFt)
        metrics.push(`Primary dwelling ~${adu.primaryDwellingSizeSqFt.toLocaleString()} SF`);
    }
    if (er) {
      metrics.push(`${er.passCount} checks pass · ${er.flagCount} verify · ${er.failCount} blocked`);
    }
    doc.font("Helvetica").fontSize(10).fillColor(COLORS.muted);
    if (metrics.length) doc.text(metrics.join("  ·  "), { width: PAGE_W - 2 * M });

    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(9).fillColor(COLORS.muted);
    doc.text(
      "This Snapshot summarizes what you explored in WeStay — eligibility signals, rent context, and your configuration choices. It is not a commitment to build, a loan offer, or financial advice. Your full Pathway Report is prepared after your discovery call.",
      { width: PAGE_W - 2 * M, align: "justify" }
    );

    pageFooter(doc, pageNum++, TOTAL_PAGES);
    doc.addPage();

    // ----- Page 2 eligibility -----
    doc.font("Helvetica-Bold").fontSize(16).fillColor(COLORS.ink).text("ELIGIBILITY");
    doc.moveDown(0.5);
    if (er) {
      const meterY = doc.y + 8;
      doc.font("Helvetica-Bold").fontSize(36).fillColor(COLORS.ink);
      doc.text(`${score}%`, M, meterY, { width: PAGE_W - 2 * M, align: "center" });
      doc.font("Helvetica").fontSize(10).fillColor(COLORS.muted);
      doc.text("Your eligibility — estimated pass rate across automated checks", M, meterY + 42, {
        width: PAGE_W - 2 * M,
        align: "center",
      });
      drawScoreMeter(doc, M, meterY + 62, PAGE_W - 2 * M, score);
      doc.y = meterY + 92;
      doc.font("Helvetica").fontSize(11).fillColor(COLORS.ink).text(rating, { width: PAGE_W - 2 * M, align: "justify" });
      doc.moveDown(0.8);

      const passG = er.gates.filter((g) => g.status === "pass");
      const flagG = er.gates.filter((g) => g.status === "flag");
      const badG = er.gates.filter((g) => g.status === "fail" || g.status === "pending");

      const colW = (PAGE_W - 2 * M - 24) / 3;
      let colX = M;
      const boxY = doc.y;
      const drawCol = (title: string, gates: typeof passG, color: string) => {
        doc.lineWidth(1).strokeColor(color).roundedRect(colX, boxY, colW, 168, 6).stroke();
        doc.font("Helvetica-Bold").fontSize(10).fillColor(color).text(title, colX + 8, boxY + 8, {
          width: colW - 16,
        });
        doc.font("Helvetica").fontSize(8).fillColor(COLORS.ink);
        const lines = gates.slice(0, 5).map((g) => `• ${g.name}: ${g.message}`);
        doc.text(lines.join("\n") || "—", colX + 8, boxY + 26, { width: colW - 16 });
        if (gates.length > 5) {
          doc.fillColor(COLORS.muted).text(`+${gates.length - 5} more…`, colX + 8, boxY + 150, { width: colW - 16 });
        }
        colX += colW + 12;
      };
      drawCol("Checks pass", passG, COLORS.ok);
      drawCol("Needs verification", flagG, "#B8860B");
      drawCol("Blocked / pending", badG, COLORS.bad);
      doc.y = boxY + 180;
    } else {
      doc.font("Helvetica").fillColor(COLORS.muted).text("No eligibility snapshot stored for this journey.");
    }

    pageFooter(doc, pageNum++, TOTAL_PAGES);
    doc.addPage();

    // ----- Page 3 numbers -----
    doc.font("Helvetica-Bold").fontSize(16).fillColor(COLORS.ink).text("ESTIMATED NUMBERS");
    doc.moveDown(0.4);
    doc.font("Helvetica").fontSize(10).fillColor(COLORS.muted);
    doc.text(
      "Figures below use your ZIP-level rent comps where available. Hard construction costs and loan payment scenarios are finalized on your discovery call.",
      { width: PAGE_W - 2 * M }
    );
    doc.moveDown(0.6);

    const rent = snap?.rentalData?.rentals?.[0];
    const cardW = (PAGE_W - 2 * M - 16) / 2;
    if (rent) {
      drawStatCard(
        doc,
        M,
        doc.y,
        cardW,
        "Est. monthly rent (1st comp row)",
        `$${rent.estimate.toLocaleString()}`,
        `$${rent.min.toLocaleString()}–$${rent.max.toLocaleString()} · ${rent.comparableCount} comps`
      );
    } else {
      drawStatCard(doc, M, doc.y, cardW, "Est. monthly rent", "—", "No rent row stored for this snapshot.");
    }
    drawStatCard(
      doc,
      M + cardW + 16,
      doc.y - 72,
      cardW,
      "Eligibility score",
      er ? `${score}%` : "—",
      er ? `${er.passCount}/${er.gates.length} checks passing` : ""
    );
    doc.y += 88;

    if (snap?.rentalData?.rentals?.length) {
      drawRentalBars(doc, M, doc.y, PAGE_W - 2 * M, snap.rentalData.rentals);
      doc.y += 150;
    }

    doc.font("Helvetica").fontSize(9).fillColor(COLORS.muted);
    doc.text(
      "Annual income and property-value impact statements in marketing snapshots are directional only. Your advisor will align numbers to your lender, appraisal, and tax context.",
      { width: PAGE_W - 2 * M, align: "justify" }
    );

    pageFooter(doc, pageNum++, TOTAL_PAGES);
    doc.addPage();

    // ----- Page 4 process -----
    doc.font("Helvetica-Bold").fontSize(16).fillColor(COLORS.ink).text("THE WESTAY PROCESS");
    doc.moveDown(0.4);
    doc.font("Helvetica").fontSize(11).fillColor(COLORS.ink);
    const steps = [
      ["Click", "You checked eligibility and captured this Snapshot — next is your discovery call."],
      ["Plan", "Lending, architecture, and site context roll into one coordinated package."],
      ["Permit", "Permit strategy aligned with Honolulu DPP expectations and third-party review."],
      ["Build", "Construction milestones, draws, and updates through the WeStay portal."],
      ["Stay", "Optional rental activation and property management when you are ready."],
    ];
    for (let i = 0; i < steps.length; i++) {
      doc.font("Helvetica-Bold").fillColor(COLORS.tealDark).text(`${i + 1}. ${steps[i][0]}`);
      doc.font("Helvetica").fillColor(COLORS.muted).text(steps[i][1], { width: PAGE_W - 2 * M });
      doc.moveDown(0.55);
    }

    const processImg = safeImage("content/images/about/richie-story.png");
    if (processImg) {
      try {
        doc.image(processImg, M, doc.y, { width: PAGE_W - 2 * M, height: 140 });
        doc.y += 148;
      } catch {
        doc.moveDown(0.5);
      }
    }

    pageFooter(doc, pageNum++, TOTAL_PAGES);
    doc.addPage();

    // ----- Page 5 pathway + configuration -----
    doc.font("Helvetica-Bold").fontSize(16).fillColor(COLORS.ink).text("YOUR PATHWAY & CONFIGURATION");
    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(10).fillColor(COLORS.muted);
    doc.text(
      "The full Pathway Report covers named partners, financing comparisons, line-item costs, and a phased timeline. Below is what we already know from your session.",
      { width: PAGE_W - 2 * M }
    );
    doc.moveDown(0.6);

    if (journey.buildSelections) {
      const b = journey.buildSelections;
      doc.font("Helvetica-Bold").fontSize(11).fillColor(COLORS.ink).text("Build path");
      doc.font("Helvetica").fontSize(10).fillColor(COLORS.muted);
      doc.text(
        `Goal: ${b.goalId ?? "—"} · Timeline: ${b.timelineId ?? "—"} · ADU type: ${b.aduTypeId ?? "—"} · Preference: ${b.buildPreferenceId ?? "—"}`,
        { width: PAGE_W - 2 * M }
      );
      doc.moveDown(0.6);
    }

    if (journey.configuratorSummary) {
      const c = journey.configuratorSummary;
      doc.font("Helvetica-Bold").fontSize(11).fillColor(COLORS.ink).text("3D configurator");
      doc.font("Helvetica").fontSize(10).fillColor(COLORS.muted);
      doc.text(
        `Plan ${c.planId} · Siding ${c.sidingId} · Cladding ${c.claddingId} · Roof ${c.roofStyle} · Interior ${c.interiorId} · Funding ${c.fundingId}`,
        { width: PAGE_W - 2 * M }
      );
      doc.text(
        `Features: deck ${c.features.deck ? "yes" : "no"} · lanai ${c.features.lanai ? "yes" : "no"} · shower ${c.features.shower ? "yes" : "no"}`,
        { width: PAGE_W - 2 * M }
      );
      doc.moveDown(0.4);
      doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.ink).text("Selection chips");
      doc.font("Helvetica").fontSize(8).fillColor(COLORS.muted);
      doc.text(c.chipLabels.slice(0, 18).join(" · ") || "—", { width: PAGE_W - 2 * M });
      if (c.chipLabels.length > 18) doc.text(`+${c.chipLabels.length - 18} more…`);
    }

    const interiorImg =
      safeImage("content/images/two bedroom/two bedroom with office sormwood drift.png") ??
      safeImage("content/interior/kai interior.png") ??
      safeImage("content/images/figma-node-87-824.png");
    if (interiorImg) {
      try {
        doc.moveDown(0.5);
        doc.image(interiorImg, M, doc.y, { width: PAGE_W - 2 * M, height: 130 });
        doc.y += 138;
      } catch {
        /* skip */
      }
    }

    pageFooter(doc, pageNum++, TOTAL_PAGES);
    doc.addPage();

    // ----- Page 6 next step -----
    doc.font("Helvetica-Bold").fontSize(18).fillColor(COLORS.ink).text("NEXT STEP", { align: "center" });
    doc.moveDown(0.3);
    doc.font("Helvetica-Bold").fontSize(12).fillColor(COLORS.tealDark).text("Schedule your discovery call", {
      align: "center",
    });
    doc.moveDown(0.8);
    doc.font("Helvetica").fontSize(11).fillColor(COLORS.ink);
    doc.text(`Book online:\n${DISCOVERY_BOOKING_URL}`, { align: "center" });
    doc.moveDown(0.6);
    doc.text(`Email:\n${CONTACT_EMAIL}`, { align: "center" });
    doc.moveDown(1);
    doc.fontSize(10).fillColor(COLORS.muted);
    doc.text(
      "On the call we walk through this Snapshot, answer cost and timeline questions, and outline your Pathway Report. No cost and no obligation for this introductory session.",
      M,
      doc.y,
      { width: PAGE_W - 2 * M, align: "center" }
    );
    doc.moveDown(1.2);
    doc.fontSize(8).fillColor("#9CA3AF");
    doc.text(`Journey ${journey.journeyId ?? "—"} · Generated ${new Date().toISOString()}`, {
      align: "center",
    });

    pageFooter(doc, pageNum, TOTAL_PAGES);
    doc.end();
  });
}
