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
      description: "Rental income, family space, long-term value.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full px-4 pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] sm:px-6 lg:px-8 2xl:px-[100px]"
    >
      <div className="mx-auto max-w-7xl 2xl:max-w-none">

        {/* Heading */}
        <div className="mb-8 sm:mb-10 lg:mb-12 text-left">
          <h2
            style={{ fontFamily: "DM Sans" }}
            className="section-heading font-[500] text-[#111111]"
          >
            Built for Homeowners <br />
            <span className="text-[#93928E]">Who Need Clarity</span>
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-[100px] items-stretch">

          {/* Feature Grid */}
          <div className="grid grid-cols-2 grid-rows-2 rounded-[20px] border border-[#E3E3E3] overflow-hidden">
            {features.map((feature, idx) => (
              <div
                key={feature.number}
                className={`
                  flex flex-col justify-between bg-[#F5F7FA]
                  p-5 sm:p-6 lg:pt-[31px] lg:px-[24px] lg:pb-[31px]
                  xl:px-[38px] min-h-[200px] lg:min-h-[240px]
                  transition-transform duration-300 ease-in-out
                  hover:scale-105 hover:z-10 relative
                  ${idx % 2 === 0 ? "border-r border-[#E3E3E3]" : ""}
                  ${idx < 2 ? "border-b border-[#E3E3E3]" : ""}
                `}
              >
                <span
                  style={{ fontFamily: "Playfair Display" }}
                  className="text-[40px] sm:text-[56px] lg:text-[84px] leading-none font-[500] text-[#C4C2BC]"
                >
                  {feature.number}
                </span>
                <div className="flex flex-col gap-2 sm:gap-[10px]">
                  <h3
                    style={{ fontFamily: "DM Sans" }}
                    className="card-title font-[600] text-[#0C1B2A] text-sm sm:text-base lg:text-lg"
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{ fontFamily: "DM Sans" }}
                    className="text-xs sm:text-sm lg:text-base leading-[1.6] font-[400] text-[#93928E]"
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

      {/* Image as background with parallax */}
{/* Added 'h-full' and 'min-h-[400px]' so it matches the left side height on desktop */}
<div className="relative w-full h-full min-h-[400px] lg:min-h-0 rounded-[20px] overflow-hidden">
  
  {/* Parallax image layer */}
  <div
    ref={imgRef}
    className="absolute left-0 right-0"
    style={{
      /* Increased height to 120% and offset top to -10% so the image 
         is larger than the container, allowing it to move without showing gaps */
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
      className="object-cover" 
      /* Removed rounded-[20px] here because the parent wrapper handles the clipping */
    />
  </div>

  {/* Optional dark overlay for depth */}
  <div className="absolute inset-0 bg-black/10 rounded-[20px] z-10 pointer-events-none" />
</div>

        </div>
      </div>
    </section>
  );
};

export default index;