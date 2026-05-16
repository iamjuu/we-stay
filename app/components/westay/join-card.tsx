"use client";

import { ContainerImage1 } from "@/content";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const joinSteps = [
  {
    title: "Enter Your Address",
    description: "Start with your property.",
    icon: (
      <svg width="60" height="75" viewBox="0 0 60 75" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 37.3585C32.0625 37.3585 33.8281 36.6269 35.2969 35.1637C36.7656 33.7005 37.5 31.9415 37.5 29.8868C37.5 27.8321 36.7656 26.0731 35.2969 24.6099C33.8281 23.1467 32.0625 22.4151 30 22.4151C27.9375 22.4151 26.1719 23.1467 24.7031 24.6099C23.2344 26.0731 22.5 27.8321 22.5 29.8868C22.5 31.9415 23.2344 33.7005 24.7031 35.1637C26.1719 36.6269 27.9375 37.3585 30 37.3585ZM30 64.817C37.625 57.8434 43.2812 51.508 46.9688 45.8108C50.6562 40.1137 52.5 35.0547 52.5 30.634C52.5 23.8472 50.3281 18.2901 45.9844 13.9627C41.6406 9.63538 36.3125 7.4717 30 7.4717C23.6875 7.4717 18.3594 9.63538 14.0156 13.9627C9.67188 18.2901 7.5 23.8472 7.5 30.634C7.5 35.0547 9.34375 40.1137 13.0312 45.8108C16.7188 51.508 22.375 57.8434 30 64.817ZM30 74.717C19.9375 66.1868 12.4219 58.2637 7.45312 50.9476C2.48437 43.6316 0 36.8604 0 30.634C0 21.2943 3.01562 13.8538 9.04688 8.31226C15.0781 2.77075 22.0625 0 30 0C37.9375 0 44.9219 2.77075 50.9531 8.31226C56.9844 13.8538 60 21.2943 60 30.634C60 36.8604 57.5156 43.6316 52.5469 50.9476C47.5781 58.2637 40.0625 66.1868 30 74.717Z" fill="currentColor"/>
      </svg>
    ),
    rotation: "-4deg",
    offset: "0px",
    zIndex: 10,
  },
  {
    title: "Get Your Eligibility Score",
    description: "See your property potential instantly.",
    icon: (
      <svg width="60" height="54" viewBox="0 0 60 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 54C4.35 54 2.9375 53.4125 1.7625 52.2375C0.5875 51.0625 0 49.65 0 48V6C0 4.35 0.5875 2.9375 1.7625 1.7625C2.9375 0.5875 4.35 0 6 0H54C55.65 0 57.0625 0.5875 58.2375 1.7625C59.4125 2.9375 60 4.35 60 6V48C60 49.65 59.4125 51.0625 58.2375 52.2375C57.0625 53.4125 55.65 54 54 54H6ZM6 48H54V6H6V48ZM9 42H24V36H9V42ZM37.65 36L52.5 21.15L48.225 16.875L37.65 27.525L33.375 23.25L29.175 27.525L37.65 36ZM9 30H24V24H9V30ZM9 18H24V12H9V18Z" fill="currentColor"/>
      </svg>
    ),
    rotation: "3deg",
    offset: "18px",
    zIndex: 20,
  },
  {
    title: "Choose your Goals",
    description: "Income, family living, office, flexibility.",
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.3902 46.8293C23.7073 46.5854 19.7561 44.7805 16.5366 41.4146C13.3171 38.0488 11.7073 34 11.7073 29.2683C11.7073 24.3902 13.4146 20.2439 16.8293 16.8293C20.2439 13.4146 24.3902 11.7073 29.2683 11.7073C34 11.7073 38.0488 13.3171 41.4146 16.5366C44.7805 19.7561 46.5854 23.7073 46.8293 28.3902L40.6829 26.561C40.0488 23.9268 38.6829 21.7683 36.5854 20.0854C34.4878 18.4024 32.0488 17.561 29.2683 17.561C26.0488 17.561 23.2927 18.7073 21 21C18.7073 23.2927 17.561 26.0488 17.561 29.2683C17.561 32.0488 18.4024 34.4878 20.0854 36.5854C21.7683 38.6829 23.9268 40.0488 26.561 40.6829L28.3902 46.8293ZM31.9024 58.3902C31.4634 58.4878 31.0244 58.5366 30.5854 58.5366C30.1463 58.5366 29.7073 58.5366 29.2683 58.5366C25.2195 58.5366 21.4146 57.7683 17.8537 56.2317C14.2927 54.6951 11.1951 52.6098 8.56098 49.9756C5.92683 47.3415 3.84146 44.2439 2.30488 40.6829C0.768293 37.122 0 33.3171 0 29.2683C0 25.2195 0.768293 21.4146 2.30488 17.8537C3.84146 14.2927 5.92683 11.1951 8.56098 8.56098C11.1951 5.92683 14.2927 3.84146 17.8537 2.30488C21.4146 0.768293 25.2195 0 29.2683 0C33.3171 0 37.122 0.768293 40.6829 2.30488C44.2439 3.84146 47.3415 5.92683 49.9756 8.56098C52.6098 11.1951 54.6951 14.2927 56.2317 17.8537C57.7683 21.4146 58.5366 25.2195 58.5366 29.2683C58.5366 29.7073 58.5366 30.1463 58.5366 30.5854C58.5366 31.0244 58.4878 31.4634 58.3902 31.9024L52.6829 30.1463V29.2683C52.6829 22.7317 50.4146 17.1951 45.8781 12.6585C41.3415 8.12195 35.8049 5.85366 29.2683 5.85366C22.7317 5.85366 17.1951 8.12195 12.6585 12.6585C8.12195 17.1951 5.85366 22.7317 5.85366 29.2683C5.85366 35.8049 8.12195 41.3415 12.6585 45.8781C17.1951 50.4146 22.7317 52.6829 29.2683 52.6829C29.4146 52.6829 29.561 52.6829 29.7073 52.6829C29.8537 52.6829 30 52.6829 30.1463 52.6829L31.9024 58.3902ZM54.2195 60L41.7073 47.4878L38.0488 58.5366L29.2683 29.2683L58.5366 38.0488L47.4878 41.7073L60 54.2195L54.2195 60Z" fill="currentColor"/>
      </svg>
    ),
    rotation: "-2deg",
    offset: "36px",
    zIndex: 30,
  },
  {
    title: "Customize Your ADU",
    description: "Explore layouts, finishes, upgrades.",
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 48V27H15V48H9ZM27 48V27H33V48H27ZM0 60V54H60V60H0ZM45 48V27H51V48H45ZM0 21V15L30 0L60 15V21H0ZM13.35 15H30H46.65H13.35ZM13.35 15H46.65L30 6.75L13.35 15Z" fill="currentColor"/>
      </svg>
    ),
    rotation: "5deg",
    offset: "56px",
    zIndex: 40,
  },
  {
    title: "Review Funding Options",
    description: "Understand how to move forward.",
    icon: (
      <svg width="60" height="67" viewBox="0 0 60 67" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.66667 66.6667C4.83333 66.6667 3.26389 66.0139 1.95833 64.7083C0.652778 63.4028 0 61.8333 0 60V13.3333C0 11.5 0.652778 9.93056 1.95833 8.625C3.26389 7.31944 4.83333 6.66667 6.66667 6.66667H10V0H16.6667V6.66667H43.3333V0H50V6.66667H53.3333C55.1667 6.66667 56.7361 7.31944 58.0417 8.625C59.3472 9.93056 60 11.5 60 13.3333V60C60 61.8333 59.3472 63.4028 58.0417 64.7083C56.7361 66.0139 55.1667 66.6667 53.3333 66.6667H6.66667ZM6.66667 60H53.3333V26.6667H6.66667V60ZM6.66667 20H53.3333V13.3333H6.66667V20ZM6.66667 20V13.3333V20Z" fill="currentColor"/>
      </svg>
    ),
    rotation: "-2deg",
    offset: "76px",
    zIndex: 50,
  },
  {
    title: "Book Your Discovery Call",
    description: "Talk with our team and take the next step.",
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 60C4.35 60 2.9375 59.4125 1.7625 58.2375C0.5875 57.0625 0 55.65 0 54V12C0 10.35 0.5875 8.9375 1.7625 7.7625C2.9375 6.5875 4.35 6 6 6H12V0H18V6H42V0H48V6H54C55.65 6 57.0625 6.5875 58.2375 7.7625C59.4125 8.9375 60 10.35 60 12V54C60 55.65 59.4125 57.0625 58.2375 58.2375C57.0625 59.4125 55.65 60 54 60H6ZM6 54H54V24H6V54ZM6 18H54V12H6V18ZM30 36C28.7 36 27.625 35.575 26.775 34.725C25.925 33.875 25.5 32.8 25.5 31.5C25.5 30.2 25.925 29.125 26.775 28.275C27.625 27.425 28.7 27 30 27C31.3 27 32.375 27.425 33.225 28.275C34.075 29.125 34.5 30.2 34.5 31.5C34.5 32.8 34.075 33.875 33.225 34.725C32.375 35.575 31.3 36 30 36ZM18 36C16.7 36 15.625 35.575 14.775 34.725C13.925 33.875 13.5 32.8 13.5 31.5C13.5 30.2 13.925 29.125 14.775 28.275C15.625 27.425 16.7 27 18 27C19.3 27 20.375 27.425 21.225 28.275C22.075 29.125 22.5 30.2 22.5 31.5C22.5 32.8 22.075 33.875 21.225 34.725C20.375 35.575 19.3 36 18 36ZM42 36C40.7 36 39.625 35.575 38.775 34.725C37.925 33.875 37.5 32.8 37.5 31.5C37.5 30.2 37.925 29.125 38.775 28.275C39.625 27.425 40.7 27 42 27C43.3 27 44.375 27.425 45.225 28.275C46.075 29.125 46.5 30.2 46.5 31.5C46.5 32.8 46.075 33.875 45.225 34.725C44.375 35.575 43.3 36 42 36ZM30 48C28.7 48 27.625 47.575 26.775 46.725C25.925 45.875 25.5 44.8 25.5 43.5C25.5 42.2 25.925 41.125 26.775 40.275C27.625 39.425 28.7 39 30 39C31.3 39 32.375 39.425 33.225 40.275C34.075 41.125 34.5 42.2 34.5 43.5C34.5 44.8 34.075 45.875 33.225 46.725C32.375 47.575 31.3 48 30 48ZM18 48C16.7 48 15.625 47.575 14.775 46.725C13.925 45.875 13.5 44.8 13.5 43.5C13.5 42.2 13.925 41.125 14.775 40.275C15.625 39.425 16.7 39 18 39C19.3 39 20.375 39.425 21.225 40.275C22.075 41.125 22.5 42.2 22.5 43.5C22.5 44.8 22.075 45.875 21.225 46.725C20.375 47.575 19.3 48 18 48Z" fill="currentColor"/>
      </svg>
    ),
    rotation: "3deg",
    offset: "96px",
    zIndex: 60,
  },
];

/** Matches the inline `top: ${stickyTop}px` set on each sticky card */
const getStickyTop = (index: number) => 100 + index * 16;

export default function JoinCard() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const checkLg = () => setIsLg(window.innerWidth >= 1024);
    checkLg();
    window.addEventListener("resize", checkLg);
    return () => window.removeEventListener("resize", checkLg);
  }, []);

  useEffect(() => {
    const compute = () => {
      let next = -1;

      for (let i = 0; i < cardRefs.current.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const stickyTop = getStickyTop(i);

        // Card is "docked" the moment its top reaches its own sticky-top.
        // The last index that satisfies this is the visually topmost card
        // in the stack (later cards have higher zIndex by design).
        if (rect.top <= stickyTop + 1) {
          next = i;
        }
      }

      setActiveIndex((prev) => (prev === next ? prev : next));
    };

    let raf = 0;
    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    <section className="w-full px-4 pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] sm:px-6 lg:px-8 2xl:px-50">
      <div className="mx-auto max-w-7xl 2xl:max-w-none">

        {/* Heading */}
        <div className="mb-8 sm:mb-10 lg:mb-12 text-left">
          <h2
            style={{ fontFamily: "DM Sans" }}
            className="section-heading font-[500] text-[#111111]"
          >
            A Simpler Path to <br />
            <span className="text-[#93928E]">Building an ADU</span>
          </h2>
        </div>

        {/* Layout */}
        <div
          className="relative flex flex-col gap-12 lg:grid lg:gap-[60px] xl:gap-[100px]"
          style={{
            gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
          }}
        >
          {/* LEFT — Sticky Image */}
          <div className="group lg:sticky lg:top-25 lg:self-start overflow-hidden rounded-[20px] w-full">
            <Image
              src={ContainerImage1}
              width={634}
              height={596}
              className="h-[260px] w-full object-cover sm:h-[380px] lg:h-[500px] xl:h-[560px] transition-transform duration-500 group-hover:scale-105"
              alt="Homeowners planning an ADU project"
            />
          </div>

          {/* RIGHT — Scroll-driven stacking cards */}
          <div
            className="relative lg:self-start"
            style={{
              paddingBottom: isLg ? `${joinSteps.length * 40}px` : "0px",
            }}
          >
            {joinSteps.map((step, index) => {
              const stickyTop = getStickyTop(index);
              const isActive = index === activeIndex;
              const accentClass = isActive
                ? "text-[#4DB6AC]"
                : "text-[#0C1B2A]";

              return (
                <div
                  key={`join-step-${index}`}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  style={{
                    top: `${stickyTop}px`,
                    zIndex: step.zIndex,
                    rotate: isLg ? step.rotation : "0deg",
                    marginLeft: isLg ? step.offset : "0px",
                    marginTop: index === 0 ? "0px" : "20px",
                  }}
                  className="
                    sticky mb-3
                    flex flex-col justify-between
                    min-h-[180px] sm:min-h-[220px] lg:min-h-[250px] xl:min-h-[300px] max-h-[300px]
                    cursor-pointer rounded-[16px] sm:rounded-[20px]
                    border border-[#E3E3E3] bg-[#F5F7FA]
                    px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 xl:px-[37px] xl:py-8
                    text-left
                    shadow-[0_1px_0_rgba(12,27,42,0.05)]
                    transition-shadow duration-300
                    hover:shadow-[0_12px_30px_rgba(12,27,42,0.12)]
                  "
                >
                  {/* Icon */}
                  <div
                    className={`flex items-center transition-colors duration-300 ${accentClass}`}
                  >
                    {step.icon}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-[6px] sm:gap-[8px] lg:gap-[10px]">
                    <h3
                      className={`section-three-card-heading transition-colors duration-300 ${accentClass}`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="section-three-card-paragraph text-[#93928E]"
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}