"use client";

import { useState, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { Men1, Men2 } from "@/content";

const testimonials: {
    id: number;
    quote: string;
    author: string;
    role: string;
    image: StaticImageData;
    imageAlt: string;
}[] = [
        {
            id: 1,
            quote: "The eligibility check alone saved us months of confusion.",
            author: "Lorem ipsum.",
            role: "Business Owner",
            image: Men1,
            imageAlt: "Portrait of testimonial author",
        },
        {
            id: 2,
            quote:
                "My husband and I are doing all we can to increase our retirement portfolio. There's no better return on your money like Real Estate. Our goal is to have an ADU on every one of our rental properties. After building our first two ADUs, the traditional way, we found WeStay.",
            author: "Lorem ipsum.",
            role: "Business Owner",
            image: Men1,
            imageAlt: "Portrait of testimonial author",
        },
        {
            id: 3,
            quote:
                "My husband and I are doing all we can to increase our retirement portfolio. There's no better return on your money like Real Estate. Our goal is to have an ADU on every one of our rental properties. After building our first two ADU's, the traditional way, we found WeStay.",
            author: "Lorem ipsum.",
            role: "Business Owner",
            image: Men2,
            imageAlt: "Portrait of testimonial author",
        },
        {
            id: 4,
            quote:
                "We never thought ADU building could be this streamlined. WeStay made every step clear.",
            author: "Lorem ipsum.",
            role: "Property Investor",
            image: Men1,
            imageAlt: "Portrait of testimonial author",
        },
    ];

function AvatarSide({ src, alt }: { src: StaticImageData; alt: string }) {
    return (
        <div className="relative h-full w-[90px] shrink-0 overflow-hidden rounded-r-2xl">
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover object-top"
                sizes="90px"
            />
        </div>
    );
}

// Shared card bg: #E7EAEE → white, left to right
const cardBg =
    "bg-gradient-to-r from-[#E7EAEE] to-white shadow-[5px_5px_20px_0_rgba(0,0,0,0.08)]";

function FeaturedTestimonialCard({
    quote,
    author,
    role,
    image,
    imageAlt,
    animKey,
    outerClassName,
    innerPx,
}: {
    quote: string;
    author: string;
    role: string;
    image: StaticImageData;
    imageAlt: string;
    animKey: number;
    outerClassName: string;
    innerPx: string;
}) {
    return (
        <div className={`${cardBg} z-10 rounded-2xl overflow-hidden flex flex-col gap-8 lg:gap-[60px] ${outerClassName}`}>
            <div className={`flex items-start  px-[30px] justify-between gap-4 pt-8 lg:pt-[50px] ${innerPx}`}>
                <div key={animKey} className="flex-1 min-w-0 animate-fadeIn">
                    <p className="text-[15px]  leading-relaxed text-[#0C1B2A]/90">{quote}</p>
                </div>
                <div className="shrink-0 w-[52px] h-[52px] rounded-full overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
                    <Image
                        src={image}
                        alt={imageAlt}
                        width={52}
                        height={52}
                        className="h-full w-full object-contain"
                    />
                </div>
            </div>
            <div className={`bg-[#0C1B2A]/10 flex flex-col py-[15px] rounded-[20px]  px-[30px] ${innerPx}`}>
                <p
                    style={{ fontFamily: "DM Sans" }}
                    className="text-[20px] leading-tight font-medium text-[#0C1B2A]"
                >
                    {author}
                </p>
                <p
                    style={{ fontFamily: "DM Sans" }}
                    className="text-[14px] leading-normal text-[#0C1B2A]/60"
                >
                    {role}
                </p>
            </div>
        </div>
    );
}

export default function TestimonialCarousel() {
    const [current, setCurrent] = useState(1);
    const [animating, setAnimating] = useState(false);
    const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    function navigate(dir: "prev" | "next") {
        if (animating) return;
        if (dir === "next" && current >= testimonials.length - 1) return;
        if (dir === "prev" && current <= 0) return;
        setSlideDir(dir === "next" ? "left" : "right");
        setAnimating(true);
        setTimeout(() => {
            setCurrent((c) => (dir === "next" ? c + 1 : c - 1));
            setSlideDir(null);
            setAnimating(false);
        }, 400);
    }

    function handleWrapperClick(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x > rect.width * 0.65) navigate("next");
        else if (x < rect.width * 0.35) navigate("prev");
    }

    const prevT = testimonials[current - 1] ?? null;
    const centerT = testimonials[current];
    const nextT = testimonials[current + 1] ?? null;

    return (

        <>
        <section className="w-full px-4 py-16 sm:py-20 md:py-24 lg:py-[120px] sm:px-6 lg:px-8 2xl:px-[100px]">
  <div className="mx-auto max-w-7xl 2xl:max-w-none">
    {/* 1 column on mobile, 2 columns on large screens. Gap reduces on mobile. */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[100px] w-full">
      
      <div className="carousel-heading flex flex-col">
        Built by People Who
        <span className="text-[#93928E]">
          Understand What’s at Stake
        </span>
      </div>

      <div className="min-w-0 flex-1">
        {/* Removed flex-wrap here to let the paragraph flow naturally */}
        <div className="block">
          <p className="carousel-subheading m-0 inline">
            Building an ADU is a major decision. It involves your home, your
            money, and your future. WeStay was built to make that journey clearer,
            smarter, and easier to navigate.
            
            {/* The Button - Inline-flex keeps it on the same line as the text */}
            <button className="inline-flex leading-[14px] items-center justify-center ml-2 bg-transparent border-2 border-[#F05C4A] text-[#F05C4A] hover:bg-[#F05C4A] hover:text-white transition-all duration-300 font-bold rounded-full text-[13px] py-2 px-6 whitespace-nowrap align-middle">
              Know More
            </button>
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

            <section className="w-full  px-3 sm:px-4 lg:pl-0 lg:pr-0">

                {/* Heading */}
                <h2 className=" carousel-heading text-center text-2xl sm:text-4xl font-medium text-gray-900 mb-8 sm:mb-10 leading-snug px-1">
                    Homeowners Want <br /> Confidence.{" "}
                    <span className="text-gray-400">We Build It.</span>
                </h2>

                {/* Carousel */}
                <div
                    ref={wrapperRef}
                    className="relative w-full overflow-hidden cursor-pointer"
                    onClick={handleWrapperClick}
                >
                    {/* Small screens: featured card only */}
                    <div className="lg:hidden w-full max-w-lg mx-auto   ">
                        <FeaturedTestimonialCard
                            quote={centerT.quote}
                            author={centerT.author}
                            role={centerT.role}
                            image={centerT.image}
                            imageAlt={centerT.imageAlt}
                            animKey={current}
                            outerClassName="w-full"
                            innerPx="px-4"
                        />
                    </div>

                    <div className="hidden lg:grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 py-2 items-center">

                        {/* ── LEFT CARD (anchored toward center for symmetric layout) ── */}
                        <div className="flex min-w-0 justify-end">
                            <div
                                className={`
                ${cardBg}
                w-full h-[260px] rounded-2xl overflow-hidden flex min-w-0
                transition-[opacity,transform] duration-[400ms]
                ${animating && slideDir === "right" ? "opacity-0 translate-x-8" : "opacity-[0.72] scale-[0.97]"}
                ${!prevT ? "invisible" : ""}
              `}
                            >
                                {prevT && (
                                    <>
                                        <div className="flex flex-1 flex-col justify-between overflow-hidden py-6 pl-4 pr-2 min-w-0">
                                            <p className="text-[13.5px] leading-relaxed text-[#0C1B2A]/75 line-clamp-5">
                                                "{prevT.quote}"
                                            </p>
                                            <div>
                                                <p className="text-sm font-medium text-[#0C1B2A]">{prevT.author}</p>
                                                <p className="mt-0.5 text-xs text-[#0C1B2A]/55">{prevT.role}</p>
                                            </div>
                                        </div>
                                        <AvatarSide src={prevT.image} alt={prevT.imageAlt} />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ── CENTER CARD ── */}
                        <FeaturedTestimonialCard
                            quote={centerT.quote}
                            author={centerT.author}
                            role={centerT.role}
                            image={centerT.image}
                            imageAlt={centerT.imageAlt}
                            animKey={current}
                            outerClassName="w-[480px] shrink-0"
                            innerPx="px-0"
                        />

                        {/* ── RIGHT CARD ── */}
                        <div className="flex min-w-0 justify-start">
                            <div
                                className={`
                ${cardBg}
                w-full h-[260px] rounded-2xl overflow-hidden flex min-w-0
                transition-[opacity,transform] duration-[400ms]
                ${animating && slideDir === "left" ? "opacity-0 -translate-x-8" : "opacity-[0.72] scale-[0.97]"}
                ${!nextT ? "invisible" : ""}
              `}
                            >
                                {nextT && (
                                    <>
                                        <div className="flex flex-1 flex-col justify-between overflow-hidden py-6 pl-4 pr-2 min-w-0">
                                            <p className="text-[13.5px] leading-relaxed text-[#0C1B2A]/75 line-clamp-5">
                                                "{nextT.quote}"
                                            </p>
                                            <div className="">
                                                <p className="text-sm font-medium text-[#0C1B2A]">{nextT.author}</p>
                                                <p className="mt-0.5 text-xs text-[#0C1B2A]/55">{nextT.role}</p>
                                            </div>
                                        </div>
                                        <AvatarSide src={nextT.image} alt={nextT.imageAlt} />
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>



                <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease forwards;
        }
      `}</style>
            </section>
        </>
    );
}