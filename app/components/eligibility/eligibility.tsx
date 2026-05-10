import Image from "next/image";
import CtaButton from "../ctaButton/ctaButton";
import { Property } from "@/content";

const BOOKING_URL = "https://links.womcom.com/widget/bookings/westay-discovery-call";

export default function Eligibility() {
  return (
    <section className="w-full px-4 py-[120px] sm:px-6 lg:px-8 2xl:px-[35px]">
      {/* 1. Added 'relative' and 'overflow-hidden' here */}
      <div className="mx-auto max-w-7xl 2xl:max-w-none relative overflow-hidden rounded-[24px]">
        
        <Image
          src={Property}
          alt="Property potential"
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover"
        />
        
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 z-10"
          aria-hidden="true"
        />

        {/* 2. Added 'z-20' to ensure content stays above the image and overlay */}
        <div className="relative z-20 flex min-h-[400px] md:min-h-[520px] flex-col items-center justify-center gap-8 px-6 py-16 text-center sm:px-10 sm:py-20">
          <div className="flex max-w-2xl flex-col gap-5">
            <h2 className="semi-heading font-dm-sans text-balance text-white">
              Your Property May Hold More Potential Than You Think
            </h2>
            <p className="font-dm-sans text-[clamp(17px,2vw,22px)] font-normal leading-snug text-white/95">
              Start with a quick check and see what&apos;s possible.
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <CtaButton buttonName="Check Eligibility" href="/#home-hero" />
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[46px] shrink-0 items-center justify-center rounded-[25px] border border-[#F05C4A] bg-transparent px-6 text-[14px] font-semibold leading-[14px] text-[#F05C4A] transition-colors duration-200 hover:bg-white/10"
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontVariationSettings: "'opsz' 14",
              }}
            >
              Book Discovery Call
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}