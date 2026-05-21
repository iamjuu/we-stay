"use client";

import { Caroeal1, Caroeal2, Caroeal3 } from "@/content";
import { useState, useEffect, useRef, useCallback, type CSSProperties } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import Image from "next/image";
import CtaButton from "../ctaButton/ctaButton";

type CarouselBreakpoint = "sm" | "md" | "lg";

function useCarouselBreakpoint(): CarouselBreakpoint {
  const [bp, setBp] = useState<CarouselBreakpoint>("lg");
  useEffect(() => {
    const qSm = window.matchMedia("(max-width: 639px)");
    const qMd = window.matchMedia("(max-width: 1023px)");
    const update = () => {
      if (qSm.matches) setBp("sm");
      else if (qMd.matches) setBp("md");
      else setBp("lg");
    };
    update();
    qSm.addEventListener("change", update);
    qMd.addEventListener("change", update);
    return () => {
      qSm.removeEventListener("change", update);
      qMd.removeEventListener("change", update);
    };
  }, []);
  return bp;
}

function slideStyles(
  bp: CarouselBreakpoint,
  isActive: boolean,
  isNext: boolean,
  isPrev: boolean
): CSSProperties {
  const transition = "all 0.65s cubic-bezier(0.4, 0, 0.2, 1)";
  
  let left = "120%";
  let width = "68%";
  let height = "100%";
  let top = "0px";
  let opacity = 0;
  let zIndex = 1;
  let borderRadius = "24px";

  if (bp === "sm") {
    if (isActive) {
      left = "0%";
      width = "100%";
      opacity = 1;
      zIndex = 10;
    } else if (isNext) {
      // Small gap for mobile to keep preview visible
      left = "calc(100% + 16px)"; 
      width = "100%";
      opacity = 1;
      zIndex = 5;
    } else if (isPrev) {
      left = "calc(-100% - 16px)";
      width = "100%";
      opacity = 0;
    }
  } 
  else if (bp === "md") {
    if (isActive) {
      left = "0%";
      width = "72%";
      opacity = 1;
      zIndex = 10;
    } else if (isNext) {
      left = "calc(72% + 40px)"; // 40px gap on tablet
      width = "38%";
      height = "78%";
      top = "11%";
      opacity = 1;
      zIndex = 5;
      borderRadius = "24px 0px 0px 24px";
    } else if (isPrev) {
      left = "-40%";
      width = "34%";
      height = "78%";
      top = "11%";
      opacity = 0;
    }
  } 
  else {
    // LG and 2XL logic
    if (isActive) {
      left = "0%";
      width = "68%";
      opacity = 1;
      zIndex = 10;
    } else if (isNext) {
      // This creates the 100px gap on 2xl width
      left = "calc(68% + 100px)"; 
      width = "30%";
      height = "78%";
      top = "11%";
      opacity = 1;
      zIndex = 5;
      borderRadius = "24px 0px 0px 24px";
    } else if (isPrev) {
      left = "calc(-30% - 100px)";
      width = "30%";
      height = "78%";
      top = "11%";
      opacity = 0;
    }
  }

  return { left, width, height, top, opacity, zIndex, borderRadius, transition, position: 'absolute' };
}

const properties = [
  { id: 1, title: "Backyard Home", description: "A separate detached unit.", image: Caroeal1 },
  { id: 2, title: "Attached Addition", description: "Connected to your current home.", image: Caroeal2 },
  { id: 3, title: "Second Story Addition", description: "Build upward when space is limited.", image: Caroeal3 },
];

/** Left rail: two 42px buttons + 8px gap — slides extend here and pass underneath on desktop */
const ARROW_RAIL_PX = -20;

export default function PropertyCarousel() {
  const [current, setCurrent] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const bp = useCarouselBreakpoint();
  const n = properties.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const draggingActiveRef = useRef(false);
  const dragOffsetRef = useRef(0);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + n) % n), [n]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % n), [n]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    draggingActiveRef.current = true;
    dragOffsetRef.current = 0;
    dragStartXRef.current = e.clientX;
    setDragX(0);
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingActiveRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    dragOffsetRef.current = dx;
    setDragX(dx);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingActiveRef.current) return;
    draggingActiveRef.current = false;
    const w = viewportRef.current?.offsetWidth ?? 320;
    const threshold = Math.min(100, Math.max(56, w * 0.12));
    const x = dragOffsetRef.current;
    dragOffsetRef.current = 0;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    setIsDragging(false);
    setDragX(0);

    if (x > threshold) prev();
    else if (x < -threshold) next();
  };

  const onLostPointerCapture = () => {
    draggingActiveRef.current = false;
    dragOffsetRef.current = 0;
    setIsDragging(false);
    setDragX(0);
  };

  return (
    <div className="w-full overflow-x-hidden px-4 pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] sm:px-6 lg:px-8 2xl:px-50">
      <div className="mx-auto max-w-7xl 2xl:max-w-none">

        {/* Top Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
          <div>
            <h1 className="carousel-heading text-gray-900">Choose What Fits</h1>
            <p className="carousel-heading !text-[#93928E]">Your Property</p>
          </div>
          <div className="shrink-0 w-full sm:w-auto">
            <CtaButton
              buttonName="Explore My Options"
              href="/#home-hero"
            />
          </div>
        </div>

        {/* Carousel — desktop: arrows in left rail; slides fade/pass underneath when exiting left */}
        <div className="relative min-w-0 w-full sm:-mr-6 lg:-mr-8 2xl:-mr-[100px]">
          <div
            className="relative w-full sm:pl-[92px]"
            style={{ ["--arrow-rail" as string]: `${ARROW_RAIL_PX}px` }}
          >
            <div className="absolute left-0 top-6 z-40 hidden sm:flex gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="flex h-[42px] w-[42px] items-center justify-center rounded-[8px] border-[1.5px] border-[#ccc] bg-white hover:bg-gray-50 transition-colors"
              >
                <MoveLeft className="h-5 w-5 text-gray-500" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="flex h-[42px] w-[42px] items-center justify-center rounded-[8px] border-[1.5px] border-[#f05c4a] bg-white hover:bg-red-50 transition-colors"
              >
                <MoveRight className="h-5 w-5 text-[#f05c4a]" />
              </button>
            </div>

            <div
            ref={viewportRef}
            role="presentation"
            className="relative w-full cursor-grab touch-none select-none overflow-hidden active:cursor-grabbing"
            style={{ height: "clamp(300px, 50vw, 600px)" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={onLostPointerCapture}
          >

              <div
                className="absolute inset-0 will-change-transform sm:-left-[var(--arrow-rail)] sm:w-[calc(100%+var(--arrow-rail))]"
                style={{
                  transform: `translateX(${dragX}px)`,
                  transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
              <div className="relative h-full w-full">
                {properties.map((property, index) => {
                  const isActive = index === current;
                  const isNext = index === (current + 1) % n;
                  const isPrev = index === (current - 1 + n) % n;
                  const base = slideStyles(bp, isActive, isNext, isPrev);

                  return (
                    <div
                      key={property.id}
                      className="group shadow-xl"
                      style={{
                        ...base,
                        transition: isDragging ? "none" : base.transition,
                      }}
                    >
                      <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
                        <Image
                          alt={property.title}
                          src={property.image}
                          fill
                          className="pointer-events-none origin-center object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 70vw"
                          priority={isActive}
                          draggable={false}
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {isNext && (
                          <div
                            className="pointer-events-none absolute inset-0 z-10"
                            style={{
                              background:
                                "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0.93) 100%)",
                            }}
                          />
                        )}

                        {isActive && (
                          <div className="pointer-events-none absolute bottom-4 right-4">
                            <div className="flex min-w-auto flex-col gap-[3.89px] rounded-[11.14px] border border-white/25 bg-[#0C1B2A]/30 px-[7.78px] py-[36px] backdrop-blur-md">
                              <h3
                                className={
                                  bp === "lg"
                                    ? "section-three-card-heading font-semibold text-white"
                                    : "font-dm-sans text-[14.6px] font-semibold leading-[14.6px] text-white"
                                }
                              >
                                {property.title}
                              </h3>
                              <p
                                className={
                                  bp === "lg"
                                    ? "section-three-card-paragraph text-white/90"
                                    : "font-dm-sans text-[10.89px] font-normal leading-[15.14px] tracking-[-0.47px] text-white/90"
                                }
                              >
                                {property.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-12">
          {properties.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-[6px] w-8 rounded-full transition-all duration-500 ${index === current ? "bg-[#4DB6AC]" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}