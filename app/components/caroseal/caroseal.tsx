"use client";

import { Caroeal1, Caroeal2, Caroeal3 } from "@/content";
import { useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import Image from "next/image";
import CtaButton from "../ctaButton/ctaButton";

const properties = [
  { id: 1, title: "Backyard Home", description: "A separate detached unit.", image: Caroeal1 },
  { id: 2, title: "Attached Addition", description: "Connected to your current home.", image: Caroeal2 },
  { id: 3, title: "Second Story Addition", description: "Build upward when space is limited.", image: Caroeal3 },
];

export default function PropertyCarousel() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c - 1 + properties.length) % properties.length);
  const next = () => setCurrent((c) => (c + 1) % properties.length);

  return (
    <div className="w-full px-4 py-[120px] sm:px-6 lg:px-8 2xl:px-[100px]">
      <div className="mx-auto max-w-7xl 2xl:max-w-none">

        {/* Top Row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="carousel-heading text-gray-900">Choose What Fits</h1>
            <p className="carousel-heading text-gray-400 font-normal mt-1">Your Property</p>
          </div>
        <CtaButton buttonName="  Explore My Options"/>
        </div>

        {/* Nav Buttons */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={prev}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-[8px] border-[1.5px] border-[#ccc] bg-white hover:bg-gray-50 transition-colors"
          >
            <MoveLeft className="h-5 w-5 text-gray-500" />
          </button>
          <button
            onClick={next}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-[8px] border-[1.5px] border-[#f05c4a] bg-white hover:bg-red-50 transition-colors"
          >
            <MoveRight className="h-5 w-5 text-[#f05c4a]" />
          </button>
        </div>

        {/* Carousel */}
        <div className="relative h-[500px] overflow-hidden">
          {properties.map((property, index) => {
            const isActive = index === current;
            const isNext = index === (current + 1) % properties.length;

            if (!isActive && !isNext) {
              return (
                <div
                  key={property.id}
                  className="absolute transition-all duration-700 ease-in-out"
                  style={{
                    left: "-100%",
                    width: "25%",
                    height: "380px",
                    zIndex: 1,
                    opacity: 0,
                    pointerEvents: "none",
                    top: "60px",
                  }}
                />
              );
            }

            return (
              <div
                key={property.id}
                className="absolute rounded-[24px] overflow-hidden shadow-xl transition-all duration-700 ease-in-out"
                style={
                  isActive
                    ? {
                        left: "0%",
                        right: "auto",
                        width: "68%",
                        height: "500px",
                        zIndex: 10,
                        opacity: 1,
                        top: "0px",
                      }
                    : {
                        right: "0%",
                        left: "auto",
                        width: "29%",
                        height: "380px",
                        zIndex: 5,
                        opacity: 1,
                        top: "60px",
                      }
                }
              >
                <div className="relative w-full h-full">
                  <Image
                    alt={property.title}
                    src={property.image}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 70vw"
                    priority={isActive}
                  />

                  {/* Bottom gradient for label readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* ✅ White fade overlay — only on the next/preview card */}
                  {isNext && (
                    <div
                      className="absolute inset-0 rounded-[24px]"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.92) 100%)",
                        zIndex: 10,
                      }}
                    />
                  )}

                  {/* Label */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="bg-black/30 backdrop-blur-sm rounded-[16px] px-4 py-3 inline-block">
                        <h3 className="text-white font-bold text-xl mb-1">
                          {property.title}
                        </h3>
                        <p className="text-white/80 text-sm">
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

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-8">
          {properties.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-[6px] w-8 rounded-full transition-all ${
                index === current ? "bg-[#f05c4a]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}