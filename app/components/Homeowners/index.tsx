import { NaturalImage } from "@/content";
import Image from "next/image";
import React from "react";

const index = () => {
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
    <section className="w-full px-4 pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] sm:px-6 lg:px-8 2xl:px-[100px]">
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

        {/* Two-column layout — items-stretch so both columns are equal height */}
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-[100px] lg:items-stretch">

          {/* Feature Grid — h-full so it fills the row height set by the image */}
          <div className="grid grid-cols-2 rounded-[20px] border border-[#E3E3E3] overflow-hidden h-full">
            {features.map((feature, idx) => (
              <div
                key={feature.number}
                className={`
                  flex flex-col justify-between bg-[#F5F7FA]
                  p-5 sm:p-6 lg:pt-[31px] lg:px-[24px] lg:pb-[31px]
                  xl:px-[38px]
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

          {/* Image — h-full so it anchors the row height */}
          <div className="w-full h-full rounded-[20px] overflow-hidden">
            <Image
              src={NaturalImage}
              alt="Homeowners planning an ADU project"
              width={0}
              height={0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-auto rounded-[20px] lg:h-full lg:object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default index;