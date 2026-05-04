import Image from "next/image";
import { Property } from "@/content";
import CtaButton from "../ctaButton/ctaButton";

export default function Eligibility() {
  return (
    <section className="w-full px-4 pt-[120px] sm:px-6 lg:px-8 2xl:px-[100px]">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
        <Image
          src={Property}
          alt=""
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-black/50"
          aria-hidden
        />

        <div className="relative flex min-h-[min(70vw,520px)] flex-col items-center justify-center gap-8 px-6 py-16 text-center sm:min-h-[440px] sm:px-10 sm:py-20">
          <div className="flex max-w-xl flex-col gap-5">
            <h2 className="semi-heading font-dm-sans text-balance text-white">
              Your Property May Hold More Potential Than You Think
            </h2>
            <p
              className="font-dm-sans text-[clamp(17px,2vw,22px)] font-normal leading-snug text-white/95"
              style={{
                fontVariationSettings: "'opsz' 14",
              }}
            >
              Start with a quick check and see what&apos;s possible.
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <CtaButton buttonName="Check Eligibility" />
            <button
              type="button"
              className="flex h-[46px] shrink-0 items-center justify-center rounded-[25px] border border-white/90 bg-transparent px-6 text-[14px] font-semibold leading-[14px] text-white transition-colors duration-200 hover:bg-white/10"
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontVariationSettings: "'opsz' 14",
              }}
            >
              Book Discovery Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
