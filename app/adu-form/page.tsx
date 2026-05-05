"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Merged flow: step UIs live under `/steps/step-*`; send users to the start of the flow. */
export default function AduFormPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/steps/step-1");
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0C1B2A] text-white">
      <p style={{ fontFamily: '"DM Sans", sans-serif' }}>Loading…</p>
    </div>
  );
}
