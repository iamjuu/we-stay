"use client";

import Image from "next/image";
import type { CSSProperties, SVGProps } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { partnerImage } from "@/content";
import { CircleQuestionMark, Info, Search } from "lucide-react";
import CtaButton from "../ctaButton/ctaButton";

const LENDING_PARTNER_MAILTO = "mailto:richie.westayhome@gmail.com";

const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const RefreshIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M21 12a9 9 0 0 1-15.5 6.4L3 16" />
    <path d="M3 12a9 9 0 0 1 15.5-6.4L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M3 21v-5h5" />
  </svg>
);

const CornerButton = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => (
  <button
    type="button"
    aria-label={label}
    className="absolute top-4 right-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/4 text-white/65 transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
  >
    {children}
  </button>
);

/** Set false to hide the red overlap guide before shipping. */
const SHOW_BUILDER_DEBUG_OVERLAP = true;

/**
 * Optional inline position for the red guide (same keys as CSS inset).
 * Leave `{}` and use only Tailwind on the red `<div>`.
 * Do not set `top` here *and* `top-*` in className — inline wins.
 */
const DEBUG_IMAGE_OVERLAP_GUIDE: CSSProperties = {};

/** Visual constants for the desktop puzzle-piece. */
const OUTER_R = 24; // image's outer corner radius (matches rounded-3xl)
const NOTCH_R = 24; // rounded corners of the notch
const NOTCH_PAD = 6; // breathing room between Why Join and the notch wall

/**
 * Builds an SVG path for the image's outline. The notch is a rounded
 * rectangular bite cut OUT of the image's lower-left, sized to wrap around
 * Why Join's top-right corner.
 *
 *  ┌────────────────────────┐
 *  │                        │
 *  │                        │       ← image
 *  │      ┌─ notchTop       │
 *  │     /                  │
 *  │    │ Why Join sits     │       ← bite
 *  │    │ inside this bite  │
 *  │    │                   │
 *  └────┘───────────────────┘
 *      notchInX
 *
 * If Why Join doesn't actually overlap the image (e.g. tiny screen, weird
 * layout), we fall back to a plain rounded rectangle.
 */
function buildPath(
  w: number,
  h: number,
  notch: { top: number; right: number } | null,
): string {
  if (!notch) {
    return [
      `M ${OUTER_R} 0`,
      `L ${w - OUTER_R} 0`,
      `Q ${w} 0 ${w} ${OUTER_R}`,
      `L ${w} ${h - OUTER_R}`,
      `Q ${w} ${h} ${w - OUTER_R} ${h}`,
      `L ${OUTER_R} ${h}`,
      `Q 0 ${h} 0 ${h - OUTER_R}`,
      `L 0 ${OUTER_R}`,
      `Q 0 0 ${OUTER_R} 0`,
      `Z`,
    ].join(" ");
  }

  const { top, right } = notch;
  const r = OUTER_R;
  const r2 = NOTCH_R;

  return [
    `M ${r} 0`,
    `L ${w - r} 0`,
    `Q ${w} 0 ${w} ${r}`,
    `L ${w} ${h - r}`,
    `Q ${w} ${h} ${w - r} ${h}`,
    `L ${right + r2} ${h}`,
    `Q ${right} ${h} ${right} ${h - r2}`,
    `L ${right} ${top + r2}`,
    `Q ${right} ${top} ${right - r2} ${top}`,
    `L ${r2} ${top}`,
    `Q 0 ${top} 0 ${top - r2}`,
    `L 0 ${r}`,
    `Q 0 0 ${r} 0`,
    `Z`,
  ].join(" ");
}

const BuilderNetwork = () => {
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const whyJoinRef = useRef<HTMLDivElement>(null);
  const [clipPath, setClipPath] = useState<string | undefined>(undefined);

  const measure = useCallback(() => {
    const imgEl = imageWrapRef.current;
    const whyEl = whyJoinRef.current;
    if (!imgEl || !whyEl || typeof window === "undefined") return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) {
      setClipPath(undefined);
      return;
    }

    const img = imgEl.getBoundingClientRect();
    const why = whyEl.getBoundingClientRect();
    const w = img.width;
    const h = img.height;
    if (w <= 0 || h <= 0) return;

    // Why Join's edges in image-local coordinates.
    const rawTop = why.top - img.top - NOTCH_PAD;
    const rawRight = why.right - img.left + NOTCH_PAD;

    // No overlap → plain rounded rectangle.
    const overlaps =
      rawRight > OUTER_R + NOTCH_R && rawTop < h - NOTCH_R && rawTop > -NOTCH_R;

    if (!overlaps) {
      setClipPath(`path('${buildPath(w, h, null)}')`);
      return;
    }

    // Clamp so the path always renders cleanly.
    const top = Math.max(OUTER_R + NOTCH_R, Math.min(h - NOTCH_R, rawTop));
    const right = Math.max(
      NOTCH_R + 1,
      Math.min(w - OUTER_R - NOTCH_R, rawRight),
    );

    setClipPath(`path('${buildPath(w, h, { top, right })}')`);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ro = new ResizeObserver(() => measure());
    if (imageWrapRef.current) ro.observe(imageWrapRef.current);
    if (whyJoinRef.current) ro.observe(whyJoinRef.current);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [measure]);

  return (
    <div className="w-full bg-[#0C1B2A]">
      {/* Removed max-w constraints and adjusted padding */}
      <section className="w-full bg-[#0C1B2A] py-16 sm:py-20 lg:py-24">
        <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-50">
          <h2
            style={{ fontFamily: '"DM Sans", sans-serif' }}
            className="join-the-westay mb-10 text-center text-white sm:mb-12"
          >
            Join the WeStay{" "}
            <span className="text-[#93928E]">Builder Network</span>
          </h2>

          {/* Changed grid-cols-2 to grid-cols-10 for more granular control */}
          <div
            className="grid grid-cols-1 gap-3 lg:grid-cols-10 lg:gap-4"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            {/* LEFT COLUMN: Takes up 3 out of 10 columns (30%) */}
            <div className="flex flex-col gap-3 lg:col-span-4 lg:gap-4">
              <div className="group relative flex flex-col items-center gap-2 rounded-3xl border border-white/10 bg-[#162032]  text-center ">
                <div className="w-full p-[10px]  flex justify-end">
                  <div className="flex items-center justify-center rounded-lg border border-[#F5F3ED1A]/20 bg-white/10 p-[15px] text-white backdrop-blur-md transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    <Search className="transition-colors duration-300" />
                  </div>
                </div>
                <div className="flex flex-col gap-[30px] mb-[60px]">
                  <h3 className="westay-section-heading text-white transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    Who We Want
                  </h3>
                  <p className="westay-para leading-relaxed text-[#CECECE]">
                    Licensed builders | Reliable teams
                    <br />
                    Quality-first operators
                  </p>
                </div>
              </div>

              {/* Why Join */}
               <div
                ref={whyJoinRef}
                className="group relative flex flex-1 flex-col overflow-visible rounded-3xl border border-white/10 bg-[#162032]  text-center   lg:z-10 lg:-mr-[160px]"
              >
                <div className="w-full p-[10px]  flex justify-end">
                  <div className="flex items-center justify-center rounded-lg border border-[#F5F3ED1A]/20 bg-white/10 p-[15px] text-white backdrop-blur-md transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    <CircleQuestionMark className="transition-colors duration-300" />
                  </div>
                </div>
                <div className="flex flex-col gap-[30px] ">
                  <h3 className="westay-section-heading text-white transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    Why Join
                  </h3>
                  <p className="westay-para  text-[#CECECE] leading-relaxed ">
                    Qualified leads | Better projects
                    <br />
                    Less sales friction | Operational support
                    <br />
                    Growth pipeline
                  </p>
                </div>
                <div className="flex my-[60px] justify-center">
                  <CtaButton
                    buttonName="Apply Now"
                    className="px-[100px] "
                    href={LENDING_PARTNER_MAILTO}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Takes up 7 out of 10 columns (70%) */}
            <div className="relative z-0 flex flex-col gap-3 lg:col-span-6 lg:gap-4">
              <div className="relative z-0 aspect-video lg:aspect-[4/3] w-full overflow-visible">
                <div
                  ref={imageWrapRef}
                  className="absolute inset-0 z-0 overflow-hidden rounded-3xl"
                  style={
                    clipPath
                      ? { clipPath, WebkitClipPath: clipPath }
                      : undefined
                  }
                >
                  <Image
                    src="/images/tip.png"
                    alt="Modern home at sunset"
                    fill
                    priority={false}
                    sizes="(min-width: 1024px) 70vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {/* ... (Debug logic stays same) */}
              </div>

              <div className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#162032] pr-2 pl-8 py-6 sm:py-7 lg:ml-[160px] lg:min-h-[160px] lg:py-12">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-xl font-bold westay-section-heading text-white transition-colors duration-300 group-hover:text-[#4DB6AC] lg:text-2xl">
                    Process
                  </h4>
               <div className="flex items-center justify-center rounded-lg border border-[#F5F3ED1A]/20 bg-white/10 p-[15px] text-white backdrop-blur-md transition-colors duration-300 group-hover:text-[#4DB6AC]">
  <RefreshIcon className="size-[24px] transition-colors duration-300" />
</div>
                </div>
                <div className="flex items-center gap-2 px-4 text-sm text-white/65 lg:px-6 lg:text-base">
                  <span className="whitespace-nowrap font-semibold text-white">Apply</span>
                  <span className="h-px flex-1 bg-white/25" />
                  <span className="whitespace-nowrap">Review</span>
                  <span className="h-px flex-1 bg-white/25" />
                  <span className="whitespace-nowrap">Approved Network</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 lg:px-8 2xl:px-50">
        <div className="mx-auto max-w-7xl 2xl:max-w-none">
          <div className="w-full flex flex-col gap-[50px]">
            <h1 className="join-the-westay text-center text-[white] transition-colors duration-300 hover:text-[#4DB6AC]">
              Partner With WeStay{" "}
              <span className="text-[#93928E]">Financing Network</span>
            </h1>

            <Image
              src={partnerImage}
              className="block h-auto w-full"
              alt="partner"
              width={1000}
              height={1000}
              sizes="100vw"
            />
            <div className="grid grid-cols-2 gap-[20px] w-full">
              <div className="group flex border border-[#33506E] rounded-[20px] items-center flex-col">
                <div className="flex w-full  p-[10px] justify-end">
                  <p className="flex w-fit items-center gap-2 rounded-md bg-white/10 p-2 text-white transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    <Info />
                  </p>
                </div>
                <div className="flex mb-[15px] items-center flex-col gap-[15px]">
                  <h1 className="financing-network text-white transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    Why It Matters
                  </h1>
                  <p className="financing-paragraph text-center text-[#CECECE]">
                    Qualified ADU borrowers | Organized deal files <br />| Clear
                    pipeline visibility | Growth market <br /> opportunity
                  </p>
                </div>
              </div>
              <div className="group flex border border-[#33506E] rounded-[20px] items-center flex-col">
                <div className="flex w-full  p-[10px] justify-end">
                  <p className="flex w-fit items-center gap-2 rounded-md bg-white/10 p-2 text-white transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    <Image
                      src="/images/filesave.svg"
                      alt=""
                      width={27}
                      height={32}
                      className="h-6 w-auto object-contain opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:[filter:invert(67%)_sepia(47%)_saturate(462%)_hue-rotate(130deg)_brightness(94%)]"
                    />
                  </p>
                </div>
                <div className="flex mb-[15px] items-center flex-col gap-[15px]">
                  <h1 className="financing-network text-white transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    Lender-Ready File Concept
                  </h1>
                  <p className="financing-paragraph text-center text-[#CECECE]">
                    Each lead comes organized:<br />| Clear
                    Homeowner Info | Property Data | Project Scope |  <br /> Estimated Costs | Qualification Notes  
                  </p>
                </div>
              </div>
            </div>

            <div className="flex mb-[100px] justify-center">
              <CtaButton
                buttonName="Become a Lending Partner"
                href={LENDING_PARTNER_MAILTO}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BuilderNetwork;
