"use client";

import { Caroeal1, Caroeal2, Caroeal3 } from "@/content";
import { useState, useEffect, type CSSProperties } from "react";
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

export default function PropertyCarousel() {
  const [current, setCurrent] = useState(0);
  const bp = useCarouselBreakpoint();
  const n = properties.length;

  const prev = () => setCurrent((c) => (c - 1 + n) % n);
  const next = () => setCurrent((c) => (c + 1) % n);

  return (
    <div className="w-full overflow-x-hidden px-4 pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] sm:px-6 lg:px-8 2xl:px-[100px]">
      <div className="mx-auto max-w-7xl 2xl:max-w-none">

        {/* Top Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
          <div>
            <h1 className="carousel-heading text-gray-900">Choose What Fits</h1>
            <p className="carousel-subheading !text-[#93928E]">Your Property</p>
          </div>
          <div className="shrink-0 w-full sm:w-auto">
            <CtaButton buttonName="Explore My Options" />
          </div>
        </div>

        <div className="flex flex-row gap-16 2xl:gap-[100px]">          {/* Nav Buttons */}
          <div className="flex shrink-0 gap-2 mb-8">
            <button onClick={prev} className="flex h-[42px] w-[42px] items-center justify-center rounded-[8px] border-[1.5px] border-[#ccc] bg-white hover:bg-gray-50 transition-colors">
              <MoveLeft className="h-5 w-5 text-gray-500" />
            </button>
            <button onClick={next} className="flex h-[42px] w-[42px] items-center justify-center rounded-[8px] border-[1.5px] border-[#f05c4a] bg-white hover:bg-red-50 transition-colors">
              <MoveRight className="h-5 w-5 text-[#f05c4a]" />
            </button>
          </div>

          {/* Carousel — needs flex-1 + min-w-0: slides are position:absolute so this column has no in-flow width otherwise */}
          <div className="min-w-0 flex-1 -mr-4 sm:-mr-6 lg:-mr-8 2xl:-mr-[100px]">
            <div className="relative w-full" style={{ height: "clamp(300px, 50vw, 600px)" }}>
              {properties.map((property, index) => {
                const isActive = index === current;
                const isNext = index === (current + 1) % n;
                const isPrev = index === (current - 1 + n) % n;

                return (
                  <div
                    key={property.id}
                    className="shadow-xl"
                    style={slideStyles(bp, isActive, isNext, isPrev)}
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-[inherit]">
                      <Image
                        alt={property.title}
                        src={property.image}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 70vw"
                        priority={isActive}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {isNext && (
                        <div className="absolute inset-0 z-10" style={{
                            background: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0.93) 100%)",
                        }} />
                      )}

                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                          <div className="bg-black/30 backdrop-blur-sm rounded-[16px] px-3 py-2 sm:px-4 sm:py-3 inline-block max-w-[calc(100%-1.5rem)]">
                            <h3 className="text-white font-bold text-lg sm:text-xl mb-1">{property.title}</h3>
                            <p className="text-white/80 text-sm">{property.description}</p>
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