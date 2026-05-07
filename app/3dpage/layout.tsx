import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ADU Configurator | WeStay",
  description: "Choose a plan and preview finishes with an interactive model.",
};

export default function AduConfiguratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
