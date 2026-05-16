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
import { Info, Search } from "lucide-react";
import { partnerImage } from "@/content";
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

const WhyJoinQuestionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 27 47"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    {...props}
  >
    <path
      d="M11.0598 24.3312C12.9397 20.8977 16.5531 18.8721 18.6527 15.8338C20.8745 12.6473 19.6293 6.69418 13.3304 6.69418C9.2043 6.69418 7.17789 9.856 6.32338 12.4744L0 9.78189C1.73344 4.52042 6.44545 0 13.306 0C19.0434 0 22.9741 2.64309 24.9761 5.95312C26.6852 8.79382 27.6861 14.1047 25.0494 18.057C22.1196 22.4292 19.3119 23.7631 17.7982 26.5791C17.1879 27.7154 16.9437 28.4564 16.9437 32.1123H9.88791C9.8635 30.1855 9.57052 27.0484 11.0598 24.3312ZM18.2133 41.993C18.2133 44.7102 16.016 46.9333 13.3304 46.9333C10.6448 46.9333 8.44745 44.7102 8.44745 41.993C8.44745 39.2758 10.6448 37.0526 13.3304 37.0526C16.016 37.0526 18.2133 39.2758 18.2133 41.993Z"
      fill="currentColor"
    />
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
      <section className="w-full bg-[#0C1B2A] py-16 sm:py-20 lg:py-24">
        <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-50">
          <h2
            style={{ fontFamily: '"DM Sans", sans-serif' }}
            className="join-the-westay mb-10 text-center text-white sm:mb-12"
          >
            Join the WeStay{" "}
            <span className="text-[#93928E]">Builder Network</span>
          </h2>

          {/*
            2-column layout: left flex-col (Who We Want + Why Join) | right flex-col (Image flex-1 + Process)
            At lg+ the grid row stretches both cols to equal height.
            Image uses flex-1 so it fills: total-height − Process-height − gap.
            With Process ≈ half Why Join's height, the image bottom naturally lands ~mid Why Join.
            The puzzle notch clip-path is measured by ResizeObserver and recomputed automatically.
          */}
          <div
            className="grid grid-cols-1 gap-3 lg:grid-cols-10 lg:gap-4"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-3 lg:col-span-4 lg:gap-4">

              {/* Who We Want */}
              <div
                style={{
                  background:
                    "linear-gradient(114.49deg, rgba(57,92,126,0.1) 0.47%, rgba(162,184,206,0.1) 99.53%)",
                  border: "1px solid #33506E",
                  boxShadow: "5px 10px 20px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
                className="group relative flex flex-col items-center gap-2 rounded-3xl border border-white/10 bg-[#162032] text-center transition-transform duration-300 ease-out hover:scale-[1.02]"
              >
                <div className="w-full p-[10px] flex justify-end">
                  <div className="flex items-center justify-center rounded-lg border border-[#F5F3ED1A]/20 bg-white/10 p-[15px] text-white backdrop-blur-md transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    <Search className="transition-colors duration-300" />
                  </div>
                </div>
                <div className="flex flex-col gap-[30px] lg:gap-[16px] mb-[60px] lg:mb-[30px]">
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
                style={{
                  background:
                    "linear-gradient(114.49deg, rgba(57,92,126,0.1) 0.47%, rgba(162,184,206,0.1) 99.53%)",
                  border: "1px solid #33506E",
                  boxShadow: "5px 10px 20px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
                ref={whyJoinRef}
                className="group relative flex flex-col overflow-visible rounded-3xl border border-white/10 bg-[#162032] text-center transition-transform duration-300 ease-out hover:scale-[1.02] lg:z-10 lg:-mr-40"
              >
                <div className="w-full p-[10px] flex justify-end">
                  <div className="flex size-[80px] lg:size-[56px] shrink-0 items-center justify-center rounded-[20px] border border-[#F5F3ED1A]/20 bg-white/10 text-white opacity-100 backdrop-blur-md transition-colors duration-300 group-hover:border-[#4DB6AC]/40 group-hover:text-[#4DB6AC]">
                    <WhyJoinQuestionIcon className="h-[46.93333435058594px] w-[26.66666603088379px] lg:h-[33px] lg:w-[19px] shrink-0" />
                  </div>
                </div>
                <div className="flex flex-col gap-[30px] lg:gap-[16px]">
                  <h3 className="westay-section-heading text-white transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    Why Join
                  </h3>
                  <p className="westay-para text-[#CECECE] leading-relaxed">
                    Qualified leads | Better projects
                    <br />
                    Less sales friction | Operational support
                    <br />
                    Growth pipeline
                  </p>
                </div>
                <div className="flex my-[40px] lg:my-[30px] justify-center">
                  <CtaButton
                    buttonName="Apply Now"
                    className="px-[100px]"
                    href={LENDING_PARTNER_MAILTO}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="relative z-0 flex flex-col gap-3 lg:col-span-6 lg:gap-4">

              {/* Image — flex-1 so it fills all space above Process, no fixed aspect at lg */}
              <div className="group relative z-0 aspect-video lg:aspect-auto lg:flex-1 lg:min-h-0 w-full overflow-visible">
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
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Process — compact so image gets ~60% of right-col height */}
              <div
                style={{
                  background:
                    "linear-gradient(114.49deg, rgba(57,92,126,0.1) 0.47%, rgba(162,184,206,0.1) 99.53%)",
                  border: "1px solid #33506E",
                  boxShadow: "5px 10px 20px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#162032] pr-2 pl-8 py-6 sm:py-7 lg:ml-[160px] lg:py-8 transition-transform duration-300 ease-out hover:scale-[1.02]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-xl font-bold westay-section-heading text-white transition-colors duration-300 group-hover:text-[#4DB6AC] lg:text-2xl">
                    Process
                  </h4>
                  <div className="flex items-center justify-center rounded-lg border border-[#F5F3ED1A]/20 bg-white/10 p-[15px] text-white backdrop-blur-md transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    <RefreshIcon className="size-[24px] transition-colors duration-300" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 text-white/65 sm:gap-2 sm:px-4 lg:px-6 lg:westay-para">
                  <span className="whitespace-nowrap text-sm text-white/65 sm:text-base md:text-lg lg:text-2xl">
                    Apply
                  </span>
                  <span
                    className="min-w-6 flex-1 self-center"
                    style={{
                      height: "1.49px",
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0) 0%, #FFFFFF 30%, #FFFFFF 70%, rgba(255,255,255,0) 100%)",
                    }}
                    aria-hidden
                  />
                  <span className="whitespace-nowrap text-sm text-white/65 sm:text-base md:text-lg lg:text-2xl">
                    Review
                  </span>
                  <span
                    className="min-w-6 flex-1 self-center"
                    style={{
                      height: "1.49px",
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0) 0%, #FFFFFF 30%, #FFFFFF 70%, rgba(255,255,255,0) 100%)",
                    }}
                    aria-hidden
                  />
                  <span className="whitespace-nowrap text-sm text-white/65 sm:text-base md:text-lg lg:text-2xl">
                    Approved Network
                  </span>
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

            <div className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl">
              <Image
                src={partnerImage}
                className="block h-auto w-full origin-center transition-transform duration-500 ease-out group-hover:scale-105"
                alt="Partner with WeStay financing network"
                width={1200}
                height={400}
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>
            <div className="grid w-full grid-cols-1 gap-4 min-[998px]:grid-cols-2 min-[998px]:gap-[20px]">
              <div className="group flex flex-col items-center rounded-[20px] border border-[#33506E] px-4 pb-5 pt-2 transition-transform duration-300 ease-out min-[998px]:px-0 min-[998px]:pb-0 min-[998px]:pt-0 min-[998px]:hover:scale-[1.02]">
                <div className="flex w-full justify-center p-[10px] min-[998px]:justify-end">
                  <p className="flex w-fit items-center gap-2 rounded-md bg-white/10 p-2 text-white transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    <Info />
                  </p>
                </div>
                <div className="mb-[15px] flex flex-col items-center gap-3 min-[998px]:gap-[15px]">
                  <h1 className="financing-network text-balance text-center text-white transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    Why It Matters
                  </h1>
                  <p className="financing-paragraph max-w-prose text-center text-[#CECECE]">
                    Qualified ADU borrowers | Organized deal files <br />| Clear
                    pipeline visibility | Growth market <br /> opportunity
                  </p>
                </div>
              </div>
              <div className="group flex flex-col items-center rounded-[20px] border border-[#33506E] px-4 pb-5 pt-2 transition-transform duration-300 ease-out min-[998px]:px-0 min-[998px]:pb-0 min-[998px]:pt-0 min-[998px]:hover:scale-[1.02]">
                <div className="flex w-full justify-center p-[10px] min-[998px]:justify-end">
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
                <div className="mb-[15px] flex flex-col items-center gap-3 min-[998px]:gap-[15px]">
                  <h1 className="financing-network text-balance text-center text-white transition-colors duration-300 group-hover:text-[#4DB6AC]">
                    Lender-Ready File Concept
                  </h1>
                  <p className="financing-paragraph max-w-prose text-center text-[#CECECE]">
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
