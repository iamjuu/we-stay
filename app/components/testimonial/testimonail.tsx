"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Men1, Men2 } from "@/content";

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
}: {
  t: (typeof testimonials)[0];
  expanded: boolean;
  dimmed: boolean;
  onClick: () => void;
}) {
  return (
    <div
      data-card
      onClick={onClick}
      className="shrink-0 rounded-[20px] overflow-hidden flex flex-col cursor-pointer select-none"
      style={{
        width: expanded ? "448px" : "356px",
        height: expanded ? "390px" : "200px",
        background: expanded ? "#f2f4f7" : "#EDEDEE",
        border: expanded ? "0.5px solid rgba(0,0,0,0.12)" : "1px solid #E0E0E2",
        boxShadow: expanded
          ? "0 8px 24px rgba(12,27,42,0.10), 0 24px 56px rgba(12,27,42,0.14)"
          : "none",
        opacity: dimmed ? 0.35 : 1,
        filter: dimmed ? "blur(1.5px)" : "none",
        pointerEvents: dimmed ? "none" : "auto",
        transition:
          "width 0.4s cubic-bezier(0.4,0,0.2,1), height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, filter 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border 0.3s ease",
        zIndex: expanded ? 10 : 1,
        position: "relative",
      }}
    >
      {/* ── COLLAPSED: quote + avatar row ── */}
      {!expanded && (
        <div className="flex flex-col justify-between h-full p-5 ">
          <p className="text-[12.5px] leading-[1.65] text-[#0C1B2A]/65 italic line-clamp-3">
            &ldquo;{t.quote}&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-[#0C1B2A]/10">
              <Image
                src={t.image}
                alt={t.imageAlt}
                width={36}
                height={36}
                className="h-full w-full object-cover object-top grayscale"
              />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#0C1B2A]">{t.author}</p>
              <p className="text-[11px] text-[#0C1B2A]/40 mt-0.5">{t.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── EXPANDED: avatar top-right, quote fills card, author footer ── */}
      {expanded && (
        <div className="flex flex-col h-full">
          {/* Body: quote text + small avatar pinned top-right */}
          <div className="relative flex-1 p-6 pb-3">
            {/* Small circular avatar — top right */}
            <div className="absolute top-5 right-5 w-10 h-10 rounded-full overflow-hidden border border-[#0C1B2A]/10 flex-shrink-0">
              <Image
                src={t.image}
                alt={t.imageAlt}
                width={40}
                height={40}
                className="grayscale"
                style={{ width: "40px", height: "40px", objectFit: "cover", objectPosition: "top", display: "block" }}
              />
            </div>

            {/* Quote text */}
            <p className="text-[14px] leading-[1.78] text-[#0C1B2A]/80 pr-14">
              {t.quote}
            </p>
          </div>

          {/* Footer: author name + role */}
          <div
            className="mx-3 mb-3 px-4 py-3 rounded-xl shrink-0"
            style={{ background: "#d8dbdf" }}
          >
            <p className="text-[13px] font-semibold text-[#0C1B2A]">{t.author}</p>
            <p className="text-[11px] text-[#0C1B2A]/50 mt-0.5">{t.role}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function TestimonialCarousel() {
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const doubled = [...testimonials, ...testimonials];

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
      <section className="w-full px-4 py-16 sm:py-20 md:py-24 lg:py-[120px] sm:px-6 lg:px-8 2xl:px-[100px]">
        <div className="mx-auto max-w-7xl 2xl:max-w-none">
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
                <button className="inline-flex leading-[14px] items-center justify-center ml-2 bg-transparent border-2 border-[#F05C4A] text-[#F05C4A] hover:bg-[#F05C4A] hover:text-white transition-all duration-300 font-bold rounded-full text-[13px] py-2 px-6 whitespace-nowrap align-middle">
                  Know More
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAROUSEL SECTION ── */}
      <section className="w-full relative">
        <h2 className="carousel-heading text-center text-2xl sm:text-4xl font-medium text-gray-900 mb-8 sm:mb-10 leading-snug px-1">
          Homeowners Want <br /> Confidence.{" "}
          <span className="text-gray-400">We Build It.</span>
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
          {/* Edge fade masks */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-36 z-20"
            style={{ background: "linear-gradient(to right, white, transparent)" }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-36 z-20"
            style={{ background: "linear-gradient(to left, white, transparent)" }}
          />

          {/* Scrolling track — items-end so expanded card grows upward */}
          <div
            ref={trackRef}
            className="flex items-center gap-5 py-6"
            style={{
              width: "max-content",
              animation: `marqueeScroll ${testimonials.length * 5.5}s linear infinite`,
            }}
          >
            {doubled.map((t, i) => (
              <TestimonialCard
                key={`${t.id}-${i}`}
                t={t}
                expanded={focusedId === t.id}
                dimmed={focusedId !== null && focusedId !== t.id}
                onClick={() => setFocusedId(focusedId === t.id ? null : t.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes marqueeScroll { to { transform: none; } }
        }
      `}</style>
    </>
  );
}
