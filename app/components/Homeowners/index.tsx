import { NaturalImage } from "@/content";
import Image from "next/image";
import React from "react";

const  index = () => {
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
    <section className="w-full px-4 pt-[120px] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-12 text-left">
          <h2
            style={{ fontFamily: "DM Sans" }}
            className="section-heading font-[500] text-[#111111]"
          >
            Built for Homeowners <br />
            <span className="text-[#93928E]">Who Need Clarity</span>
          </h2>
        </div>

        {/* Two-column layout: grid cards + image */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-[100px]">

          {/* Feature Grid */}
          <div className="grid grid-cols-2 rounded-[20px] border border-[#E3E3E3] overflow-hidden">
            {features.map((feature, idx) => (
              <div
                key={feature.number}
                className={`
                  flex flex-col gap-[40px] bg-[#F5F7FA]
                  pt-[31px] px-[24px] pb-[31px]
                  sm:px-[38px]
                  ${idx % 2 === 0 ? "border-r border-[#E3E3E3]" : ""}
                  ${idx < 2 ? "border-b border-[#E3E3E3]" : ""}
                `}
              >
                <span
                  style={{ fontFamily: "Playfair Display" }}
                  className="text-[48px] sm:text-[64px] lg:text-[84px] leading-[32px] font-[500] text-[#C4C2BC]"
                >
                  {feature.number}
                </span>
                <div className="flex flex-col gap-[10px]">
                  <h3
                    style={{ fontFamily: "DM Sans" }}
                    className="card-title font-[600] text-[#0C1B2A]"
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{ fontFamily: "DM Sans" }}
                    className="text-sm sm:text-base leading-[1.6] font-[400] text-[#93928E]"
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Image */}
          <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-0">
            <Image
              src={NaturalImage}
              fill
              className="object-cover rounded-[20px]"
              alt="Homeowners planning an ADU project"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default index;