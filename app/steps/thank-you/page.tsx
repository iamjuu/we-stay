"use client";

import Navbar from "@/app/components/navbar/navbar";

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="24" cy="24" r="24" fill="#4DB6AC" />
    <path d="M14 24L20 30L34 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ThankYouAfterConfigurator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C1B2A] via-[#1a2f42] to-[#0C1B2A]">
      <Navbar />
      <div className="container mx-auto px-4 pb-16 pt-24 sm:pt-28">
        <div className="relative mx-auto flex w-full max-w-[640px] flex-col items-center rounded-[40px] p-8 text-center sm:p-11">
          <div className="flex flex-col items-center gap-6">
            <CheckIcon />
            <div className="flex flex-col gap-3">
              <h1
                className="font-dm-sans text-[28px] font-semibold leading-tight text-white sm:text-[36px]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Thank You!
              </h1>
              <p
                className="font-dm-sans text-lg leading-7 text-[#F5F7FA] sm:text-[22px] sm:leading-8"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Your report is being prepared.
                <br />
                We&apos;ll contact you shortly with your ADU eligibility results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
