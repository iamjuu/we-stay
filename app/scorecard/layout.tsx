import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property scorecard | WeStay",
  description: "Oʻahu ADU eligibility preview from your address",
};

export default function ScorecardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className="min-h-screen bg-linear-to-br from-[#0C1B2A] via-[#1a2f42] to-[#0C1B2A] font-dm-sans antialiased"
    >
      {children}
    </div>
  );
}
