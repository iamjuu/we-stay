"use client";

import { ContainerImage1 } from "@/public";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const STACK_GAP = 50;

const joinSteps = [
  {
    title: "Enter Your Address",
    description: "Start with your property.",
    icon: MapPin,
    rotation: "-4deg",
    offset: "0px",
    zIndex: 10,
  },
  {
    title: "Check Eligibility",
    description: "See what your lot can support.",
    icon: MapPin,
    rotation: "3deg",
    offset: "18px",
    zIndex: 20,
  },
  {
    title: "Check Eligibility",
    description: "See what your lot can support.",
    icon: MapPin,
    rotation: "3deg",
    offset: "18px",
    zIndex: 20,
  },
  {
    title: "Check Eligibility",
    description: "See what your lot can support.",
    icon: MapPin,
    rotation: "3deg",
    offset: "18px",
    zIndex: 20,
  },
  {
    title: "Compare Options",
    description: "Review the best ADU path for your goals.",
    icon: MapPin,
    rotation: "-2deg",
    offset: "36px",
    zIndex: 30,
  },
  {
    title: "Book Your Discovery Call",
    description: "Talk with our team and take the next step.",
    icon: MapPin,
    rotation: "5deg",
    offset: "56px",
    zIndex: 40,
  },
];

export default function JoinCard() {
  const [activeIndex, setActiveIndex] = useState(joinSteps.length - 1);

  return (
    <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col  gap-3 text-left">
          <h2
            style={{ fontFamily: "DM Sans" }}
            className="section-heading text-left leading-[65px] font-[500] text-[#111111]"
          >
            A Simpler Path to <br />
            <span className="text-[#93928E]">Building an ADU</span>
          </h2>
        </div>

        <div className="grid gap-[100px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
          <div className="overflow-hidden rounded-[20px]">
            <Image
              src={ContainerImage1}
              width={634}
              height={596}
              className="h-full w-full object-cover"
              alt="Homeowners planning an ADU project"
            />
          </div>

          <div className="relative min-h-[280px]   pt-10 sm:min-h-[300px] lg:min-h-[360px]">
            {joinSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeIndex;

              return (
                <button
                  type="button"
                  key={step.title}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    top: `calc(${step.offset} + ${index * STACK_GAP}px)`,
                    zIndex: isActive ? 100 : step.zIndex,
                    rotate: step.rotation,
                  }}
                  className="absolute left-0 right-0 flex min-h-[220px] cursor-pointer flex-col justify-between rounded-[20px] border border-[#E3E3E3] bg-[#F5F7FA] px-6 py-6 text-left shadow-[0_1px_0_rgba(12,27,42,0.05)] transition-[transform,box-shadow,z-index] duration-300 hover:shadow-[0_12px_30px_rgba(12,27,42,0.12)] sm:px-8 sm:py-7 lg:min-h-[250px] lg:px-10 lg:py-8 xl:px-[37px] xl:py-10"
                >
                  <div className="flex h-14 w-12 items-center text-[#0C1B2A] sm:h-16 sm:w-14 xl:h-[74px] xl:w-[60px]">
                    <Icon
                      strokeWidth={2.2}
                      className="h-10 w-10 sm:h-12 sm:w-12 xl:h-[56px] xl:w-[56px]"
                    />
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <h3
                      style={{ fontFamily: "DM Sans" }}
                      className="card-title font-[600] text-[#0C1B2A]"
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{ fontFamily: "DM Sans" }}
                      className="card-paragraph font-[400] text-[#93928E]"
                    >
                      {step.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
