import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1 BHK Interior Tour | WeStay",
  description: "360° room views — drag to look around and switch spaces.",
};

export default function TourLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
