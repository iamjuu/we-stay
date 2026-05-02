import Navbar from "./components/navbar/navbar";
import HeroButton from "./components/herobutton/herobutton";
import {
  ContainerImage1,
  HeroImage,
  PlaceholderImage,
  SectionTwo,
} from "@/content";
import WeStaySection from "./components/card";
import JoinCard from "./components/westay";
import Homeowners from "./components/Homeowners";
import { FaStar } from "react-icons/fa6";
import Image from "next/image";
import PropertyCarousel from "./components/caroseal/caroseal";
import RoofComponent from "./components/roof-component/roofcomponent";
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
      src: PlaceholderImage,
      alt: "Hero Image",
    },
    {
      src: PlaceholderImage,
      alt: "Hero Image",
    },
    {
      src: PlaceholderImage,
      alt: "Hero Image",
    },
    {
      src: PlaceholderImage,
      alt: "Hero Image",
    },
    {
      src: PlaceholderImage,
      alt: "Hero Image",
    },
    {
      src: PlaceholderImage,
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
        className="min-h-screen flex flex-col justify-between bg-gray-100 relative"
      >
        <div className="">
          <Navbar />
          <div>
            <div className=" mt-[80px] flex flex-col items-center gap-[118px]">
              <h1 className="hero-heading  font-playfair-display text-center font-[700] text-white">
                See What Your
                <br />
                Backyard Can Build
              </h1>
              <HeroButton />
            </div>

            <div className="hidden lg:block px-[80px] lg:mt-[104px] mb-[120px] font-dm-sans text-white">
              <p className="section-paragraph font-[400]">
                Check your ADU eligibility, <br />
                explore your options, and <br />
                move forward with <br />
                guidance you can trust.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
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
            <div className="flex flex-col justify-center gap-0">
              <div className="flex flex-row items-center gap-[2px]">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color="#3D3D3D" size={10} />
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
      <div className="flex   py-[100px]   flex-col items-center bg-[#0C1B2A]">
        <h1
          style={{
            fontFamily: "DM Sans",
          }}
          className="semi-heading text-white">
          No matter what your reason
        </h1>
        <span
          style={{
            fontFamily: "DM Sans",
          }}
          className=" semi-heading text-[#F05C4A]">
          Generate rental income
        </span>
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

      {/* Image */}
      <div className="w-full lg:w-[46%] shrink-0">
        <Image
          src={SectionTwo}
          className="h-full w-full object-cover"
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
              className="flex h-[49px] w-full items-center rounded-[6px] border border-[#E2E2E2] bg-[#FAFAFA] shadow-[inset_0_1px_6px_rgba(0,0,0,0.18)]"
            >
              <div className="h-full w-[4px] rounded-l-[6px] bg-[#8ED9D8]" />
              <span className="second-section-list-data py-[10px] px-6">
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
    </>
  );
}
