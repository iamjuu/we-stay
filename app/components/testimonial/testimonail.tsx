"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Men1, Men2 } from "@/content";

const testimonialCardBackground =
  "linear-gradient(114.49deg, rgba(57, 92, 126, 0.1) 0.47%, rgba(162, 184, 206, 0.1) 99.53%)";

/**
 * Carousel left/right edge "fade" (not filter: blur). Two absolutely positioned strips
 * paint a white → transparent gradient over the marquee so cards don't look cut off flat.
 *
 * - Spread: `carouselEdgeFadeWidthClass` — wider strip = softer, longer fade into the track.
 * - Intensity: gradient stops — more solid white at the start (higher %) = stronger hide at the rim.
 *   Match `carouselEdgeFadeLeft` / `Right` fill to your section background if it isn't `#fff`.
 */
const carouselEdgeFadeWidthClass = "w-28 sm:w-48 lg:w-60";
const carouselEdgeFadeLeft =
  "linear-gradient(to right, #ffffff 0%, #ffffff 28%, rgba(255,255,255,0) 100%)";
const carouselEdgeFadeRight =
  "linear-gradient(to left, #ffffff 0%, #ffffff 28%, rgba(255,255,255,0) 100%)";

const testimonials: {
  id: number;
  quote: string;
  author: string;
  role: string;
  image: StaticImageData;
  imageAlt: string;
}[] = [
  {
    id: 1,
    quote:
      "The eligibility check alone saved us months of confusion. WeStay made the entire process feel manageable from day one.",
    author: "James Hartwell",
    role: "Property Investor",
    image: Men1,
    imageAlt: "Portrait of James Hartwell",
  },
  {
    id: 2,
    quote:
      "My wife and I are doing all we can to grow our retirement portfolio. After building our first two ADUs the traditional way, we found WeStay — and we'll never go back.",
    author: "Michael Torres",
    role: "Business Owner",
    image: Men1,
    imageAlt: "Portrait of Michael Torres",
  },
  {
    id: 3,
    quote:
      "We never thought ADU building could be this streamlined. WeStay made every step clear and kept us informed the whole way through.",
    author: "David Nguyen",
    role: "Homeowner",
    image: Men2,
    imageAlt: "Portrait of David Nguyen",
  },
  {
    id: 4,
    quote:
      "From permits to construction, WeStay handled everything. Our rental income increased within months of finishing the ADU.",
    author: "Robert Kim",
    role: "Real Estate Owner",
    image: Men1,
    imageAlt: "Portrait of Robert Kim",
  },
  {
    id: 5,
    quote:
      "I was skeptical at first, but WeStay exceeded every expectation. The team is responsive, transparent, and genuinely cares about your outcome.",
    author: "Samuel Greene",
    role: "Landlord",
    image: Men2,
    imageAlt: "Portrait of Samuel Greene",
  },
];

// ── CARD ──────────────────────────────────────────────────────────────────────
function TestimonialCard({
  t,
  expanded,
  dimmed,
  onClick,
  isMobile,
}: {
  t: (typeof testimonials)[0];
  expanded: boolean;
  dimmed: boolean;
  onClick: () => void;
  isMobile: boolean;
}) {
  const collapsedW = isMobile ? "220px" : "356px";
  const collapsedH = isMobile ? "155px" : "200px";
  const expandedW  = isMobile ? "270px" : "448px";
  const expandedH  = isMobile ? "290px" : "390px";

  return (
    <div
      data-card
      onClick={onClick}
      className="shrink-0 rounded-[20px] overflow-hidden flex flex-col cursor-pointer select-none"
      style={{
        width:  expanded ? expandedW  : collapsedW,
        height: expanded ? expandedH : collapsedH,
        background: testimonialCardBackground,
        border: expanded ? "0.5px solid rgba(0,0,0,0.12)" : "1px solid #E0E0E2",
        boxShadow: expanded
          ? "0 8px 24px rgba(12,27,42,0.10), 0 24px 56px rgba(12,27,42,0.14)"
          : "none",
        opacity: dimmed ? 0.35 : 1,
        filter: dimmed ? "blur(1.5px)" : "none",
        pointerEvents: dimmed ? "none" : "auto",
        transition:
          "width 0.4s cubic-bezier(0.4,0,0.2,1), height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, filter 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border 0.3s ease",
        /* Above sibling cards when expanded; edge fade masks are z-20 — track lifts when focused so expanded isn't covered */
        zIndex: expanded ? 25 : 1,
        position: "relative",
      }}
    >
      {/* ── COLLAPSED: quote + avatar row ── */}
      {!expanded && (
        <div className={`flex flex-col justify-between h-full ${isMobile ? "p-3" : "p-5"}`}>
          <p
            className="leading-[1.65] text-[#0C1B2A]/65 italic line-clamp-3"
            style={{ fontSize: isMobile ? "13px" : "18.5px" }}
          >
            &ldquo;{t.quote}&rdquo;
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div
              className={`rounded-full overflow-hidden flex-shrink-0 border border-[#0C1B2A]/10 ${isMobile ? "w-7 h-7" : "w-9 h-9"}`}
            >
              <Image
                src={t.image}
                alt={t.imageAlt}
                width={isMobile ? 28 : 36}
                height={isMobile ? 28 : 36}
                className="h-full w-full object-cover object-top grayscale"
              />
            </div>
            <div>
              <p
                className="font-semibold text-[#0C1B2A]"
                style={{ fontSize: isMobile ? "11px" : "12px" }}
              >
                {t.author}
              </p>
              <p
                className="text-[#0C1B2A]/40 mt-0.5"
                style={{ fontSize: isMobile ? "10px" : "11px" }}
              >
                {t.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── EXPANDED: avatar top-right, quote fills card, author footer ── */}
      {expanded && (
        <div className="flex flex-col h-full">
          {/* Body: quote text + small avatar pinned top-right */}
          <div className={`relative flex-1 ${isMobile ? "p-4 pb-2" : "p-6 pb-3"}`}>
            {/* Small circular avatar — top right */}
            <div
              className={`absolute top-4 right-4 rounded-full overflow-hidden border border-[#0C1B2A]/10 flex-shrink-0 ${isMobile ? "w-8 h-8" : "w-10 h-10"}`}
            >
              <Image
                src={t.image}
                alt={t.imageAlt}
                width={isMobile ? 32 : 40}
                height={isMobile ? 32 : 40}
                className="grayscale"
                style={{
                  width: isMobile ? "32px" : "40px",
                  height: isMobile ? "32px" : "40px",
                  objectFit: "cover",
                  objectPosition: "top",
                  display: "block",
                }}
              />
            </div>

            {/* Quote text */}
            <p
              className="leading-[1.78] text-[#0C1B2A]/80 pr-12"
              style={{ fontSize: isMobile ? "14px" : "22px" }}
            >
              {t.quote}
            </p>
          </div>

          {/* Footer: author name + role */}
          <div
            className="mx-2 mb-2 px-3 py-2 rounded-xl shrink-0"
            style={{ background: "#d8dbdf" }}
          >
            <p
              className="font-semibold text-[#0C1B2A]"
              style={{ fontSize: isMobile ? "13px" : "16px" }}
            >
              {t.author}
            </p>
            <p
              className="text-[#0C1B2A]/50 mt-0.5"
              style={{ fontSize: isMobile ? "11px" : "14px" }}
            >
              {t.role}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function TestimonialCarousel() {
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const doubled = [...testimonials, ...testimonials];

  // Track mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Pause marquee while expanded
  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.animationPlayState =
      focusedId !== null ? "paused" : "running";
  }, [focusedId]);

  // Close on outside click
  useEffect(() => {
    if (focusedId === null) return;
    function onPointerDown(e: PointerEvent) {
      const card = (e.target as Element).closest("[data-card]");
      if (!card) setFocusedId(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [focusedId]);

  // Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFocusedId(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* ── INTRO SECTION ── */}
      <section className="w-full py-16 sm:py-20 md:py-24 lg:py-[120px]">
        <div className="mx-auto max-w-7xl 2xl:max-w-none px-4 sm:px-6 lg:px-8 2xl:px-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[100px] w-full">
            <div className="carousel-heading flex flex-col">
              Built by People Who
              <span className="text-[#93928E]">Understand What&apos;s at Stake</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="carousel-subheading m-0 inline">
                Building an ADU is a major decision. It involves your home, your money, and your
                future. WeStay was built to make that journey clearer, smarter, and easier to
                navigate.
                <Link
                  href="/about"
                  className="know-more-shiny inline-flex leading-[14px] items-center justify-center ml-2 border-2 border-[#F05C4A] bg-[#F05C4A] text-white  transition-all duration-300 font-bold rounded-full text-[13px] py-2 px-6 whitespace-nowrap align-middle relative overflow-hidden"
                >
                  <span className="km-border-t" aria-hidden="true" />
                  <span className="km-border-l" aria-hidden="true" />
                  <span className="km-border-b" aria-hidden="true" />
                  <span className="km-border-r" aria-hidden="true" />
                  <span className="km-sheen"    aria-hidden="true" />
                  Know More
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAROUSEL SECTION ── */}
      <section className="w-full relative">
        <h2 className="carousel-heading text-center text-2xl sm:text-4xl font-medium text-gray-900 mb-8 sm:mb-10 leading-snug px-1">
          Homeowners Want <br /> Confidence.{" "}
          <span className="text-gray-400">We Bring the Clarity</span>
        </h2>

        {/*
          overflowX:clip  — hides horizontal marquee overflow without creating a scroll container
          overflowY:visible — lets the expanded card grow vertically without being cut off
        */}
        <div
          className="relative w-full"
          style={{ overflowX: "clip", overflowY: "visible" }}
          onMouseEnter={() => {
            if (focusedId === null && trackRef.current)
              trackRef.current.style.animationPlayState = "paused";
          }}
          onMouseLeave={() => {
            if (focusedId === null && trackRef.current)
              trackRef.current.style.animationPlayState = "running";
          }}
        >
          {/* Edge fade masks — see carouselEdgeFade* constants for spread + intensity */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-0 z-20 hidden md:block ${carouselEdgeFadeWidthClass}`}
            style={{ background: carouselEdgeFadeLeft }}
          />
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-0 z-20 hidden md:block ${carouselEdgeFadeWidthClass}`}
            style={{ background: carouselEdgeFadeRight }}
          />

          {/* Scrolling track — items-end so expanded card grows upward */}
          <div
            ref={trackRef}
            className={`relative flex items-center py-6 ${isMobile ? "gap-3" : "gap-5"}`}
            style={{
              width: "max-content",
              animation: `marqueeScroll ${testimonials.length * 5.5}s linear infinite`,
              // Whole row above edge fades (z-20) while a card is open so expanded content isn't washed out
              zIndex: focusedId !== null ? 30 : 0,
            }}
          >
            {doubled.map((t, i) => (
              <TestimonialCard
                key={`${t.id}-${i}`}
                t={t}
                expanded={focusedId === t.id}
                dimmed={focusedId !== null && focusedId !== t.id}
                onClick={() => setFocusedId(focusedId === t.id ? null : t.id)}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes marqueeScroll { to { transform: none; } }
        }

        .km-border-t, .km-border-l, .km-border-b, .km-border-r {
          position: absolute;
          display: block;
          background: rgba(255,255,255,0.85);
          transition: 0.5s ease;
          pointer-events: none;
          z-index: 3;
        }
        .km-border-t { top: 0; left: 0; width: 0; height: 2px; }
        .know-more-shiny:hover .km-border-t { width: 100%; transform: translateX(100%); }
        .km-border-l { top: 0; left: 0; width: 2px; height: 0; }
        .know-more-shiny:hover .km-border-l { height: 100%; transform: translateY(100%); }
        .km-border-b { bottom: 0; right: 0; width: 0; height: 2px; }
        .know-more-shiny:hover .km-border-b { width: 100%; transform: translateX(-100%); }
        .km-border-r { bottom: 0; right: 0; width: 2px; height: 0; }
        .know-more-shiny:hover .km-border-r { height: 100%; transform: translateY(-100%); }

        .km-sheen {
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transition: left 0.5s ease;
          transition-delay: 0.5s;
          pointer-events: none;
          z-index: 2;
        }
        .know-more-shiny:hover .km-sheen { left: 100%; }
      `}</style>
    </>
  );
}
