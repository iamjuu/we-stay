import Navbar from "./components/navbar/navbar";
import HeroEligibility from "./components/hero-eligibility/hero-eligibility";
import { Avatar1, Avatar2, Avatar3, Avatar4, SectionTwo } from "@/content";

/** Hero background — `public/c7ce8d3f5b95b6b50f07aef058275d6266d8379d (1).png` */
const HERO_BACKGROUND_URL =
  "/c7ce8d3f5b95b6b50f07aef058275d6266d8379d%20(1).png";
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

/** Headlines in the flip-clock strip — tighter type + padding below 709px */
const flipClockStripHeadingClass =
  "semi-heading max-[709px]:w-full max-[709px]:max-w-[min(100%,26rem)] max-[709px]:text-balance max-[709px]:text-center max-[709px]:text-[clamp(1.25rem,4.8vw,2rem)] max-[709px]:leading-snug";

/** Top-of-hero vignette — always painted on `/` above the photo, below copy (z-stacking). */
const HERO_TOP_VIGNETTE =
  "linear-gradient(180deg, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.72) 22%, rgba(0, 0, 0, 0.38) 48%, rgba(0, 0, 0, 0) 100%)";

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
      {/* Navbar is fixed above the viewport; hero extends to the top behind it */}
      <Navbar />
      <div
        style={{
          backgroundImage: ` url("${HERO_BACKGROUND_URL}")`,
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat",
        }}
        id="home-hero"
        className="relative min-h-screen bg-[#0C1B2A]"
      >
        {/* Hero top fade — full viewport height so the vignette always reads on `/` (with or without modal) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 min-h-screen w-full"
          style={{ background: HERO_TOP_VIGNETTE }}
          aria-hidden
        />

        {/* Modal dimmer portals here — above hero BG, below main hero content */}
        <div
          id="home-hero-modal-scrim-mount"
          className="pointer-events-none absolute inset-0 z-[1]"
          aria-hidden="true"
        />
        <div className="relative z-[2] flex min-h-screen flex-col justify-between">
        <div className="relative z-20">
          <div>
            <div className="mx-auto mb-[120px] flex w-full max-w-275 flex-col items-center gap-14 px-4 md:px-20 md:gap-20" style={{ paddingTop: 'max(80px, 13vh)' }}>
              <div className="flex w-full flex-col items-center gap-0 text-center">
                <p
                  className="mt-10 max-w-xl font-dm-sans font-normal tracking-tight text-white/95 sm:mt-12 md:mt-14"
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
                  className="mt-2 w-full shrink-0"
                  style={{
                    width: 'min(275px, 100%)',
                    height: '1.49px',
                    background:
                      'linear-gradient(90deg, rgba(255,255,255,0) 0%, #FFFFFF 30%, #FFFFFF 70%, rgba(255,255,255,0) 100%)',
                    opacity: 1,
                  }}
                  aria-hidden
                />
                <h1 className="hero-heading m-0 mt-2 w-full p-0 font-playfair-display font-bold leading-[1.06] text-white tracking-tight">
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

      {/* <Eligibility /> */}

      <div className="flex flex-col items-center gap-0 bg-[#0C1B2A] py-[120px] max-[709px]:gap-3 max-[709px]:px-5 max-[709px]:py-16">
        <h1
          style={{
            fontFamily: "DM Sans",
          }}
          className={`${flipClockStripHeadingClass} text-white`}>
          No matter what your reason
        </h1>
        <FlipClockHeadline
          style={{ fontFamily: "DM Sans" }}
          className={`${flipClockStripHeadingClass} text-[#F05C4A]`}
        />
        <h1
          style={{
            fontFamily: "DM Sans",
          }}
          className={`${flipClockStripHeadingClass} text-white`}>
          WeStay is for homeowners that need clarity
        </h1>
      </div>

      <div className="w-full px-4 py-[120px] sm:px-6 lg:px-8 2xl:px-50">
        <div className="mx-auto max-w-7xl 2xl:max-w-none">
          <div className="flex flex-col overflow-hidden rounded-[20px] border border-[#E1E0DB] bg-[#F5F7FA] lg:flex-row">
            <div className="group relative w-full min-h-[240px] shrink-0 overflow-hidden rounded-t-[20px] lg:min-h-0 lg:w-[46%] lg:rounded-[20px]">
              <Image
                src={SectionTwo}
                className="h-full min-h-[240px] w-full object-cover lg:min-h-full transition-transform duration-500 group-hover:scale-105"
                alt="Homeowners planning an ADU project"
              />
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 xl:py-16 min-[1850px]:justify-start min-[1850px]:py-[65px]! min-[1850px]:px-16">
              <div className="flex flex-col gap-4 lg:gap-5">
                <div className="flex w-full flex-col gap-0">
                  <h1
                    style={{ fontFamily: "DM Sans" }}
                    className="flex flex-col gap-1 text-left font-medium  leading-[1.12] sm:text-[30px] md:text-[35px] min-[1849px]:text-[50px]! min-[1849px]:leading-[1.06] md:tracking-[-0.06em]"
                  >
                    Most Homeowners Want to Build,
                    <span className="text-[#93928E]">
                      But Don&apos;t Know Where to Start
                    </span>
                  </h1>
                </div>
                <p className="list-data-heading">Many homeowners are unsure:</p>
              </div>

              <div className="mt-[20px] flex flex-col gap-[12px]">
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

      <div id="how-it-works">
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
      <div id="adu-options">
        <RoofComponent />
      </div>
      <div id="peek-inside">
        <InteriorTourClient />
      </div>
      <div>
        <BuilderNetwork />
      </div>
      <div>
        <TestimonialCarousel />
      </div>
      <div id="eligibility" className="scroll-mt-28">
        <Eligibility />
      </div>
      <div className=" pt-[120px]">
        <Footer />
      </div>
    </>
  );
}
