import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | WeStay",
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-dm-sans min-h-dvh bg-[#f5f7fa] text-[#0f1412]">{children}</div>
  );
}
