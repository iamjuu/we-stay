"use client";
// TEMP PAGE — delete after PDF design is finalised

import { Download, FileText } from "lucide-react";

export default function PdfPreviewPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4f5f4]">
      {/* Left panel */}
      <aside className="flex w-64 shrink-0 flex-col gap-6 border-r border-[#e2e6e4] bg-white px-6 py-8">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#2A9D8F]" />
          <span className="text-[15px] font-semibold text-[#0C1B2A]">PDF Preview</span>
        </div>

        <p className="text-[12px] leading-relaxed text-[#5C6570]">
          This is a live render of the report PDF using mock journey data. Make design changes in{" "}
          <code className="rounded bg-[#f0f2f1] px-1 py-0.5 font-mono text-[11px]">
            lib/build-report-pdf.ts
          </code>{" "}
          and refresh to see them here.
        </p>

        <a
          href="/api/pdf-preview?download=1"
          download="westay-preview.pdf"
          className="flex items-center justify-center gap-2 rounded-[10px] bg-[#2A9D8F] px-4 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#1E7A70]"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </a>

        <div className="rounded-[10px] border border-[#e2e6e4] bg-[#f9faf9] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#5C6570]">Pages</p>
          <ol className="mt-2 space-y-1.5 text-[12px] text-[#0C1B2A]">
            <li>1 — Cover</li>
            <li>2 — Eligibility</li>
            <li>3 — Your Answers</li>
            <li>4 — Configuration</li>
            <li>5 — Numbers</li>
            <li>6 — Next Step</li>
          </ol>
        </div>
      </aside>

      {/* PDF viewer — A4 aspect in a scroll container */}
      <main className="flex flex-1 flex-col items-center overflow-y-auto bg-[#e8eae9] py-8">
        <iframe
          src="/api/pdf-preview"
          title="PDF preview"
          className="shadow-[0_8px_40px_rgba(0,0,0,0.18)]"
          style={{
            width: "794px",   /* A4 @ 96 dpi */
            height: "1123px", /* A4 @ 96 dpi — full page visible before scroll */
            border: "none",
            background: "#fff",
          }}
        />
      </main>
    </div>
  );
}
