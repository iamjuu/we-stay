"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
    quote: "The eligibility check alone saved us months of confusion.",
    author: "Lorem ipsum.",
    role: "Business Owner",
    image: Men1,
    imageAlt: "Portrait of testimonial author",
  },
  {
    id: 2,
    quote:
      "My husband and I are doing all we can to increase our retirement portfolio. There's no better return on your money like Real Estate. Our goal is to have an ADU on every one of our rental properties. After building our first two ADUs, the traditional way, we found WeStay.",
    author: "Lorem ipsum.",
    role: "Business Owner",
    image: Men1,
    imageAlt: "Portrait of testimonial author",
  },
  {
    id: 3,
    quote:
      "My husband and I are doing all we can to increase our retirement portfolio. There's no better return on your money like Real Estate. Our goal is to have an ADU on every one of our rental properties. After building our first two ADU's, the traditional way, we found WeStay.",
    author: "Lorem ipsum.",
    role: "Business Owner",
    image: Men2,
    imageAlt: "Portrait of testimonial author",
  },
  {
    id: 4,
    quote:
      "We never thought ADU building could be this streamlined. WeStay made every step clear.",
    author: "Lorem ipsum.",
    role: "Property Investor",
    image: Men1,
    imageAlt: "Portrait of testimonial author",
  },
];

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/** Shortest wrap direction on the ring (for slide hint animation). */
function stepDirection(from: number, to: number, len: number): "next" | "prev" {
  if (len <= 1) return "next";
  const d = mod(to - from, len);
  return d <= len / 2 ? "next" : "prev";
}


// ── SIDE CARD — intentionally plain, greyed out ───────────────────────────────
function SideCard({
  t,
  onClick = () => {},
  side,
  onNavigate,
}: {
  t: (typeof testimonials)[0];
  onClick?: () => void;
  side: "left" | "right";
  /** Chevron only — does not expand; use for prev/next carousel without stealing the card click. */
  onNavigate?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      title="Click to expand this testimonial"
      className="
        group relative w-full h-[220px] rounded-2xl overflow-hidden flex
        cursor-pointer select-none
        bg-[#EDEDEE] border border-[#E0E0E2]
        opacity-50 scale-[0.94]
        hover:opacity-70 hover:scale-[0.96]
        transition-[transform,opacity,box-shadow] duration-300 ease-out
        motion-safe:active:scale-[0.98]
      "
    >
      {/* Dimming overlay so it reads as "inactive" */}
      <div className="absolute inset-0 bg-white/30 z-10 pointer-events-none" />

      <div className="relative z-20 flex flex-1 flex-col justify-between overflow-hidden py-5 pl-5 pr-3 min-w-0">
        <p className="text-[12.5px] leading-[1.55] text-[#0C1B2A]/55 line-clamp-5 italic">
          &ldquo;{t.quote}&rdquo;
        </p>
        <div>
          <p className="text-[12px] font-medium text-[#0C1B2A]/60">{t.author}</p>
          <p className="text-[11px] text-[#0C1B2A]/35 mt-0.5">{t.role}</p>
        </div>
      </div>

      {/* Avatar strip — greyscale and faded */}
      <div
        className={`relative z-20 w-[70px] shrink-0 overflow-hidden bg-[#D5D5D8] ${
          side === "right" ? "rounded-r-2xl" : "rounded-l-2xl"
        }`}
      >
        <Image
          src={t.image}
          alt={t.imageAlt}
          fill
          className="object-cover object-top grayscale opacity-40"
          sizes="70px"
        />
      </div>

      {/* Click hint arrow */}
      <div
        className={`absolute z-30 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          side === "left" ? "right-3" : "left-3"
        }`}
      >
        <div
          role={onNavigate ? "button" : undefined}
          tabIndex={onNavigate ? 0 : undefined}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.();
          }}
          onKeyDown={(e) => {
            if (!onNavigate) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onNavigate();
            }
          }}
          className="bg-white/80 rounded-full w-7 h-7 flex items-center justify-center shadow-sm"
        >
          {side === "left" ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 10l4-3-4-3" stroke="#0C1B2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 4L5 7l4 3" stroke="#0C1B2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CENTER CARD — full featured, clearly the "active" card ───────────────────
function CenterCard({
  t,
  animKey,
  onClick = () => {},
  className,
}: {
  t: (typeof testimonials)[0];
  animKey: number;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        ${className ?? "w-[480px] shrink-0"}
        rounded-2xl overflow-hidden flex flex-col z-10
        bg-gradient-to-r from-[#E7EAEE] to-white
        shadow-[5px_5px_32px_0_rgba(0,0,0,0.13)]
        ring-1 ring-black/5
        cursor-pointer
        transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]
        active:scale-[0.99]
        animate-expandPop
      `}
    >
      {/* Quote row */}
      <div className="flex items-start justify-between gap-4 px-8 pt-10 pb-8">
        <div key={animKey} className="flex-1 min-w-0 animate-fadeIn">
          <p className="text-[15px] leading-[1.75] text-[#0C1B2A]/90 font-normal">
            {t.quote}
          </p>
        </div>
        <div className="shrink-0 w-[52px] h-[52px] rounded-full overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.18)] ml-2 mt-1">
          <Image
            src={t.image}
            alt={t.imageAlt}
            width={52}
            height={52}
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>

      {/* Author footer — distinctly styled */}
      <div className="bg-[#0C1B2A]/[0.07]   flex flex-col gap-0.5  px-5 rounded-xl">
        <p
          style={{ fontFamily: "DM Sans" }}
          className="text-[19px] font-semibold text-[#0C1B2A] leading-tight"
        >
          {t.author}
        </p>
        <p
          style={{ fontFamily: "DM Sans" }}
          className="text-[13px] text-[#0C1B2A]/55"
        >
          {t.role}
        </p>
      </div>
    </div>
  );
}

// ── MODAL — full detail view when center card is clicked ─────────────────────
function TestimonialModal({
  initialIndex,
  onClose,
}: {
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const t = testimonials[idx];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      style={{ animation: "fadeIn 0.2s ease forwards" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-[22px] overflow-hidden bg-gradient-to-br from-[#E7EAEE] to-white shadow-[0_24px_64px_rgba(0,0,0,0.22)] ring-1 ring-black/5"
        style={{ animation: "cardIn 0.28s ease forwards" }}
      >
        {/* Body */}
        <div className="px-9 pt-9 pb-6 flex flex-col gap-7">
          <p
            key={idx}
            className="text-[16px] leading-[1.78] text-[#0C1B2A]/88"
            style={{ animation: "fadeIn 0.3s ease forwards" }}
          >
            &ldquo;{t.quote}&rdquo;
          </p>
          <div className="flex items-center gap-4">
            <div className="w-[54px] h-[54px] rounded-full overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.16)] flex-shrink-0">
              <Image
                src={t.image}
                alt={t.imageAlt}
                width={54}
                height={54}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div key={`${idx}-meta`} style={{ animation: "fadeIn 0.3s ease forwards" }}>
              <p style={{ fontFamily: "DM Sans" }} className="text-[16px] font-semibold text-[#0C1B2A]">
                {t.author}
              </p>
              <p style={{ fontFamily: "DM Sans" }} className="text-[13px] text-[#0C1B2A]/50 mt-0.5">
                {t.role}
              </p>
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div className="bg-[#0C1B2A]/[0.07] mx-3 mb-3 px-5 py-3 rounded-xl flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setIdx((i) => mod(i - 1, testimonials.length))}
              aria-label="Previous"
              className="w-8 h-8 rounded-full border border-[#0C1B2A]/20 flex items-center justify-center text-[#0C1B2A] hover:bg-[#0C1B2A]/08 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => setIdx((i) => mod(i + 1, testimonials.length))}
              aria-label="Next"
              className="w-8 h-8 rounded-full border border-[#0C1B2A]/20 flex items-center justify-center text-[#0C1B2A] hover:bg-[#0C1B2A]/08 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Dots */}
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  i === idx ? "w-5 h-2 bg-[#0C1B2A]" : "w-2 h-2 bg-[#0C1B2A]/25"
                }`}
              />
            ))}
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full border border-[#0C1B2A]/20 flex items-center justify-center text-[#0C1B2A]/50 hover:text-[#0C1B2A] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
const AUTO_ADVANCE_MS = 5200;

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  /** Which visible testimonial index uses the expanded layout; `null` = all slots collapsed. */
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const autoPausedRef = useRef(false);
  const expandedRef = useRef<number | null>(null);
  /** Cards-only region: clicks outside this collapse an expanded card. */
  const carouselCardsRef = useRef<HTMLDivElement>(null);
  /** Brief horizontal nudge when the slide index changes (infinite loop feel). */
  const [deckAnim, setDeckAnim] = useState<null | "next" | "prev">(null);
  const deckAnimClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const suppressMobileClickRef = useRef(false);

  const playDeckAnim = useCallback((dir: "next" | "prev") => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    if (deckAnimClearRef.current) clearTimeout(deckAnimClearRef.current);
    setDeckAnim(dir);
    deckAnimClearRef.current = setTimeout(() => {
      setDeckAnim(null);
      deckAnimClearRef.current = null;
    }, 460);
  }, []);

  useEffect(() => {
    return () => {
      if (deckAnimClearRef.current) clearTimeout(deckAnimClearRef.current);
    };
  }, []);

  useEffect(() => {
    expandedRef.current = expandedIndex;
  }, [expandedIndex]);

  useEffect(() => {
    if (expandedIndex === null || modalIndex !== null) return undefined;

    function handlePointerDown(e: PointerEvent) {
      const root = carouselCardsRef.current;
      if (!root || root.contains(e.target as Node)) return;
      setExpandedIndex(null);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [expandedIndex, modalIndex]);

  /** Infinite auto-advance — true pause on hover (timer resets when hover ends). */
  useEffect(() => {
    if (modalIndex !== null) return undefined;

    function startTimer() {
      return window.setInterval(() => {
        if (autoPausedRef.current) return;
        if (expandedRef.current !== null) return;
        setExpandedIndex(null);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduceMotion) playDeckAnim("next");
        setCurrent((c) => mod(c + 1, testimonials.length));
      }, AUTO_ADVANCE_MS);
    }

    let id = startTimer();

    // Restart the timer on mouseleave so the next advance is always
    // a full AUTO_ADVANCE_MS away — no "instant fire" after hover ends.
    const cardsEl = carouselCardsRef.current;
    function onMouseLeave() {
      window.clearInterval(id);
      id = startTimer();
    }
    cardsEl?.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.clearInterval(id);
      cardsEl?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [modalIndex, playDeckAnim]);

  function goTo(index: number) {
    const next = mod(index, testimonials.length);
    if (next === current) return;
    playDeckAnim(stepDirection(current, next, testimonials.length));
    setExpandedIndex(null);
    setCurrent(next);
  }

  const prevIdx = mod(current - 1, testimonials.length);
  const nextIdx = mod(current + 1, testimonials.length);

  return (
    <>
      {/* ── INTRO ── */}
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

      {/* ── CAROUSEL ── */}
      <section className="w-full px-3 sm:px-4 lg:pl-0 lg:pr-0">
        <h2 className="carousel-heading text-center text-2xl sm:text-4xl font-medium text-gray-900 mb-8 sm:mb-10 leading-snug px-1">
          Homeowners Want <br /> Confidence.{" "}
          <span className="text-gray-400">We Build It.</span>
        </h2>

        <div
          ref={carouselCardsRef}
          onMouseEnter={() => {
            autoPausedRef.current = true;
          }}
          onMouseLeave={() => {
            autoPausedRef.current = false;
          }}
          onTouchStart={() => {
            autoPausedRef.current = true;
          }}
          onTouchEnd={() => {
            autoPausedRef.current = false;
          }}
          className={
            (deckAnim === "next"
              ? "animate-testimonialDeckNext "
              : deckAnim === "prev"
                ? "animate-testimonialDeckPrev "
                : "") + "overflow-x-visible"
          }
        >
        {/* Mobile — collapsed until tapped; expanded card opens modal on tap */}
        <div
          className="lg:hidden w-full max-w-lg mx-auto"
          onTouchStart={(e) => {
            touchStartXRef.current = e.targetTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchStartXRef.current;
            touchStartXRef.current = null;
            if (start == null) return;
            const end = e.changedTouches[0]?.clientX;
            if (end == null) return;
            const dx = end - start;
            if (Math.abs(dx) < 48) return;
            suppressMobileClickRef.current = true;
            if (dx > 0) goTo(current - 1);
            else goTo(current + 1);
          }}
          onClick={(e) => {
            if (suppressMobileClickRef.current) {
              suppressMobileClickRef.current = false;
              return;
            }
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x > rect.width * 0.65) {
              goTo(current + 1);
              return;
            }
            if (x < rect.width * 0.35) {
              goTo(current - 1);
              return;
            }
            if (expandedIndex === current) setModalIndex(current);
            else setExpandedIndex(current);
          }}
        >
          {expandedIndex === current ? (
            <CenterCard t={testimonials[current]} animKey={current} />
          ) : (
            <SideCard t={testimonials[current]} side="right" />
          )}
        </div>

        {/* Desktop — three columns; expanded layout only after click */}
        <div className="hidden lg:grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-6 py-4 items-center">

          {/* LEFT */}
          <div className="flex min-w-0 justify-end">
            {expandedIndex === prevIdx ? (
              <CenterCard
                t={testimonials[prevIdx]}
                animKey={prevIdx}
                onClick={() => setModalIndex(prevIdx)}
                className="w-full max-w-[440px] shrink-0"
              />
            ) : (
              <SideCard
                t={testimonials[prevIdx]}
                onClick={() => setExpandedIndex(prevIdx)}
                onNavigate={() => goTo(current - 1)}
                side="left"
              />
            )}
          </div>

          {/* CENTER */}
          {expandedIndex === current ? (
            <CenterCard
              t={testimonials[current]}
              animKey={current}
              onClick={() => setModalIndex(current)}
            />
          ) : (
            <div className="w-[480px] max-w-[480px] shrink-0">
              <SideCard
                t={testimonials[current]}
                onClick={() => setExpandedIndex(current)}
                side="right"
              />
            </div>
          )}

          {/* RIGHT */}
          <div className="flex min-w-0 justify-start">
            {expandedIndex === nextIdx ? (
              <CenterCard
                t={testimonials[nextIdx]}
                animKey={nextIdx}
                onClick={() => setModalIndex(nextIdx)}
                className="w-full max-w-[440px] shrink-0"
              />
            ) : (
              <SideCard
                t={testimonials[nextIdx]}
                onClick={() => setExpandedIndex(nextIdx)}
                onNavigate={() => goTo(current + 1)}
                side="right"
              />
            )}
          </div>
        </div>

        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`rounded-full transition-all duration-200 ${
                i === current
                  ? "w-5 h-2 bg-[#0C1B2A]"
                  : "w-2 h-2 bg-[#0C1B2A]/20 hover:bg-[#0C1B2A]/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Modal */}
      {modalIndex !== null && (
        <TestimonialModal
          initialIndex={modalIndex}
          onClose={() => setModalIndex(null)}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes expandPop {
          0% { opacity: 0.9; transform: scale(0.9); }
          70% { opacity: 1; transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.32s ease forwards; }
        .animate-cardIn { animation: cardIn 0.32s ease forwards; }
        .animate-expandPop { animation: expandPop 0.48s cubic-bezier(0.34, 1.25, 0.64, 1) forwards; }
        @keyframes testimonialDeckNext {
          0% { transform: translateX(0); }
          45% { transform: translateX(-20px); }
          100% { transform: translateX(0); }
        }
        @keyframes testimonialDeckPrev {
          0% { transform: translateX(0); }
          45% { transform: translateX(20px); }
          100% { transform: translateX(0); }
        }
        :global(.animate-testimonialDeckNext) {
          animation: testimonialDeckNext 0.45s ease-out;
        }
        :global(.animate-testimonialDeckPrev) {
          animation: testimonialDeckPrev 0.45s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-expandPop { animation: none; opacity: 1; transform: none; }
          :global(.animate-testimonialDeckNext),
          :global(.animate-testimonialDeckPrev) {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}