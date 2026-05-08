import Navbar from "./components/navbar/navbar";
import HeroEligibility from "./components/hero-eligibility/hero-eligibility";
import { Avatar1, Avatar2, Avatar3, Avatar4, HeroImage, PlaceholderImage, SectionTwo } from "@/content";
import WeStaySection from "./components/card";
import JoinCard from "./components/westay";
import Homeowners from "./components/Homeowners";
import { FaStar } from "react-icons/fa6";
import Image from "next/image";
import PropertyCarousel from "./components/caroseal/caroseal";
import RoofComponent from "./components/roof-component/roofcomponent";
import { InteriorTourClient } from "@/app/components/interiorTour/InteriorTourClient";
import BuilderNetwork from "./components/builder-network/builder-network";
import TestimonialCarousel from "./components/testimonial/testimonail";
import Eligibility from "./components/eligibility/eligibility";
import Footer from "./components/footer/footer";
import FlipClockHeadline from "./components/flip-clock-headline/flip-clock-headline";

export default function Home() {
  const homeownerQuestions = [
    "If their property qualifies",
    "What it may cost",
    "What type of ADU makes sense",
    "Who to trust",
    "How to move forward without costly mistakes",
  ];

  const image = [
    {
      src: Avatar1,
      alt: "Hero Image",
    },
    {
      src: Avatar2,
      alt: "Hero Image",
    },
    {
      src: Avatar3,
      alt: "Hero Image",
    },
    {
    src: Avatar4,
      alt: "Hero Image",
    },
  
  ];

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${HeroImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        id="home-hero"
        className="relative min-h-screen bg-gray-100"
      >
        {/* Modal dimmer portals here — above hero BG, below main hero content */}
        <div
          id="home-hero-modal-scrim-mount"
          className="pointer-events-none absolute inset-0 z-[1]"
          aria-hidden="true"
        />
        <div className="relative z-[2] flex min-h-screen flex-col justify-between">
        <div className="relative z-20">
          <Navbar />
          <div>
            <div className="mx-auto mb-[120px] mt-[80px] flex w-full max-w-[1100px] flex-col items-center gap-14 px-4 md:mt-[104px] lg:mt-[104px] md:px-[80px] md:gap-20">
              <div className="flex w-full flex-col items-center text-center">
                <p
                  className="mb-[4.5px] font-dm-sans font-normal tracking-tight text-white/95 max-w-xl"
                  style={{
                    fontSize: 'clamp(13px, 2vw, 16px)',
                    lineHeight: 1.45,
                    fontVariationSettings: "'opsz' 14",
                  }}
                >
                  From one of the World&apos;s leading ADU Platform
                </p>
                {/* Figma underline: 275×1.49px gradient (same stops as border-image-source) */}
                <div
                  className="w-full shrink-0"
                  style={{
                    width: 'min(275px, 100%)',
                    height: '1.49px',
                    background:
                      'linear-gradient(90deg, rgba(255,255,255,0) 0%, #FFFFFF 30%, #FFFFFF 70%, rgba(255,255,255,0) 100%)',
                    opacity: 1,
                  }}
                  aria-hidden
                />
                <h1 className="hero-heading mt-0 w-full pt-0 font-playfair-display font-bold leading-[1.06] text-white tracking-tight">
                  <span className="block leading-[1.06]">See What Your</span>
                  <span className="block leading-[1.06]">Backyard Can Build</span>
                </h1>
              </div>

              <HeroEligibility />
            </div>
          </div>
        </div>
        <div className="absolute  border-[10px] border border-[#0C1B2A] rounded-full bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
          <div className="bg-[#F3FFFE] rounded-full border-[5px] sm:border-[7px] border-white flex flex-row items-center gap-2 sm:gap-3 px-3 sm:px-4 py-[10px] sm:py-[15px]">

            {/* Avatar stack */}
            <div className="flex flex-row items-center -space-x-2">
              {image.map((item, index) => (
                <Image
                  key={index}
                  src={item.src}
                  alt={item.alt}
                  className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border-2 border-white object-cover shrink-0"
                />
              ))}
            </div>

            {/* Stars + text — vertical stack */}
            <div className="flex flex-col justify-center gap-2">
              <div className="flex flex-row items-center gap-[2px]">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color="#3D3D3D" className="size-[14px]" />
                ))}
              </div>
              <p
                style={{ fontFamily: "DM Sans" }}
                className="text-[#3D3D3D] text-[10px] sm:text-[12px] font-[300] whitespace-nowrap leading-tight"
              >
                Trusted by 5,000+ Customers
              </p>
            </div>

          </div>
        </div>
        </div>
      </div>
      <div className="flex   py-[100px]   flex-col items-center bg-[#0C1B2A]">
        <h1
          style={{
            fontFamily: "DM Sans",
          }}
          className="semi-heading text-white">
          No matter what your reason
        </h1>
        <FlipClockHeadline
          style={{ fontFamily: "DM Sans" }}
          className="semi-heading text-[#F05C4A]"
        />
        <h1
          style={{
            fontFamily: "DM Sans",
          }}
          className="semi-heading text-white">
          WeStay is for homeowners that need clarity
        </h1>
      </div>

      <div className="w-full px-4 py-[120px] sm:px-6 lg:px-8 2xl:px-[100px]">
        <div className="mx-auto max-w-7xl 2xl:max-w-none">
          <div className="flex flex-col overflow-hidden rounded-[20px] border border-[#E1E0DB] bg-[#F5F7FA] lg:flex-row">
            <div className="relative w-full min-h-[240px] shrink-0 lg:min-h-0 lg:w-[46%]">
              <Image
                src={SectionTwo}
                className="h-full min-h-[240px] w-full object-cover lg:min-h-full"
                alt="Homeowners planning an ADU project"
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 xl:px-16 xl:py-16">
              <div className="flex flex-col gap-4 lg:gap-5">
                <h1 className="second-section-heading flex flex-col text-left">
                  Most Homeowners Want to Build,
                  <span className="second-section-heading text-[#93928E]">
                    But Don't Know Where to Start
                  </span>
                </h1>
                <p className="list-data-heading">Many homeowners are unsure:</p>
              </div>

              <div className="mt-[28px] flex flex-col gap-[12px]">
                {homeownerQuestions.map((item) => (
                  <div
                    key={item}
                    className="homeowner-question-sheen relative flex h-[49px] w-full cursor-default items-center overflow-hidden rounded-[6px] border border-[#E2E2E2] bg-[#FAFAFA] shadow-[inset_0_1px_6px_rgba(0,0,0,0.18)]"
                  >
                    <div className="relative z-[1] h-full w-[4px] shrink-0 rounded-l-[6px] bg-[#8ED9D8]" />
                    <span className="relative z-[1] second-section-list-data py-[10px] px-6 text-left">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div>
        <WeStaySection />
      </div>
      <div>
        <JoinCard />
      </div>
      <div>
        <Homeowners />
      </div>
      <div>
        <PropertyCarousel />
      </div>
      <div>
        <RoofComponent />
      </div>
      <div>

        <InteriorTourClient />
      </div>
      <div>
        <BuilderNetwork />
      </div>
      <div>
        <TestimonialCarousel />
      </div>
      <div>
        <Eligibility />
      </div>
      <div className="pt-[120px]">
        <Footer />
      </div>
    </>
  );
}
