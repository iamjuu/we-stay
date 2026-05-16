"use client";

import { NaturalImage } from "@/content";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

const index = () => {
  const imgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const img = imgRef.current;
      if (!section || !img) return;
    
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
    
      if (sectionTop < windowHeight && sectionTop > -section.offsetHeight) {
        // This creates a 0 to 1 value based on scroll position
        const progress = (windowHeight - sectionTop) / (windowHeight + section.offsetHeight);
        
        // CHANGE: Removed the minus sign from 60. 
        // Positive values move the image DOWN relative to its container 
        // as you scroll DOWN, creating the "opposite" parallax feel.
        const moveY = progress * 60; 
        
        img.style.transform = `translate3d(0, ${moveY}px, 0)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      number: "1",
      title: "Guided Journey",
      description: "Know what comes next at every stage.",
    },
    {
      number: "2",
      title: "Trusted Partners",
      description: "Builders, financing, and experts aligned.",
    },
    {
      number: "3",
      title: "Simpler Decisions",
      description: "No overwhelm. Just clear next steps.",
    },
    {
      number: "4",
      title: "Built for Real Life",
      description: "For rental potential, family space, or long-term value",
    },
  ];

  const cardNumberStyle: React.CSSProperties = {
    fontFamily: '"Playfair Display", serif',
    fontWeight: 600,
    fontSize: "clamp(32px, 3vw, 56px)",
    lineHeight: 1,
    letterSpacing: 0,
  };

  const cardTitleStyle: React.CSSProperties = {
    fontFamily: '"DM Sans", sans-serif',
    lineHeight: 1.2,
    letterSpacing: 0,
  };

  const cardDescriptionStyle: React.CSSProperties = {
    fontFamily: '"DM Sans", sans-serif',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: "-0.0429em",
    color: "#93928E",
  };

  return (
    <section
      ref={sectionRef}
      className="w-full px-4 pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] sm:px-6 lg:px-8 2xl:px-50"
    >
      <div className="mx-auto max-w-7xl 2xl:max-w-none">

        {/* Heading */}
        <div className="mb-8 sm:mb-10 lg:mb-12 2xl:mb-8 text-left">
          <h2
            style={{ fontFamily: "DM Sans" }}
            className="section-heading font-[500] text-[#111111]"
          >
            Built for Homeowners <br />
            <span className="text-[#93928E]">Who Need Clarity</span>
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-[100px] items-stretch lg:h-100 xl:h-115 2xl:h-130">

          {/* Feature Grid */}
          <div className="grid grid-cols-2 grid-rows-[1fr_1fr] overflow-visible rounded-[20px] ring-1 ring-[#E3E3E3]">
            {features.map((feature, idx) => (
              <div
                key={feature.number}
                className={`
                  group relative flex flex-col justify-between gap-4 bg-[#F5F7FA]
                  min-[1489px]:max-[2059px]:justify-start
                  p-5 sm:p-6
                  lg:pt-6 lg:px-6 lg:pb-6
                  xl:pt-7 xl:px-8 xl:pb-7
                  2xl:pt-8 2xl:px-10 2xl:pb-8
                  min-h-[160px] lg:min-h-0
                  transition-shadow duration-300 ease-in-out
                  hover:shadow-[0_10px_28px_rgba(12,27,42,0.12)]
                  ${idx === 0 ? "rounded-tl-[20px]" : ""}
                  ${idx === 1 ? "rounded-tr-[20px]" : ""}
                  ${idx === 2 ? "rounded-bl-[20px]" : ""}
                  ${idx === 3 ? "rounded-br-[20px]" : ""}
                  ${idx % 2 === 0 ? "border-r border-[#E3E3E3]" : ""}
                  ${idx < 2 ? "border-b border-[#E3E3E3]" : ""}
                `}
              >
                <span
                  className="shrink-0 text-[#C4C2BC] transition-colors duration-300 ease-in-out group-hover:text-[#4DB6AC]"
                  style={cardNumberStyle}
                >
                  {feature.number}
                </span>
                <div className="flex min-h-0 flex-col gap-1 sm:gap-2 lg:gap-2">
                  <h3
                    className="card-title font-semibold text-[#0C1B2A] text-sm sm:text-base lg:text-lg xl:text-xl transition-colors duration-300 ease-in-out group-hover:text-[#4DB6AC]"
                    style={cardTitleStyle}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base" style={cardDescriptionStyle}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

      {/* Image with parallax + hover zoom */}
<div className="group relative min-h-100 lg:min-h-0 lg:h-full w-full rounded-[20px] overflow-hidden cursor-pointer">

  {/* Parallax image layer */}
  <div
    ref={imgRef}
    className="absolute left-0 right-0"
    style={{
      top: "-10%",
      height: "120%",
      willChange: "transform",
    }}
  >
    <Image
      src={NaturalImage}
      alt="Homeowners planning an ADU project"
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
    />
  </div>

  {/* Overlay fades out on hover */}
  <div className="absolute inset-0 bg-black/10 rounded-[20px] z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0" />
</div>

        </div>
      </div>
    </section>
  );
};

export default index;