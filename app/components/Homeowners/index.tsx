import { ContainerImage1 } from "@/public";
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
    <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className=" gap-[100px flex]">
        <div className="mb-12 flex flex-col   text-left">
          <h2
            style={{ fontFamily: "DM Sans" }}
            className="section-heading text-lef font-[500] text-[#111111]"
          >
            Built for Homeowners <br />
            <span className="text-[#93928E]">Who Need Clarity</span>
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
          <div className="grid grid-cols-2 rounded-[20px] border border-[#E3E3E3] overflow-hidden">
            {features.map((feature, index) => (
              <div
                key={feature.number}
                className={`flex  bg-[#F5F7FA] flex-col gap-3 p-6 sm:p-8
        ${index % 2 === 0 ? "border-r border-[#E3E3E3]" : ""}
        ${index < 2 ? "border-b border-[#E3E3E3]" : ""}
      `}
              >
                <span
                  style={{ fontFamily: "" }}
                  className="text-[48px] sm:text-[56px] font-[500] leading-none text-[#C4C2BC]"
                >
                  {feature.number}
                </span>
                <div className="flex flex-col gap-1">
                  <h3
                    style={{ fontFamily: "DM Sans" }}
                    className="card-title font-[600] text-[#0C1B2A]"
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{ fontFamily: "DM Sans" }}
                    className="card-paragraph font-[400] text-[#93928E]"
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-[20px]">
            <Image
              src={ContainerImage1}
              width={634}
              height={596}
              className="h-full w-full object-cover"
              alt="Homeowners planning an ADU project"
            />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default index;
