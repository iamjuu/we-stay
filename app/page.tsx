import Navbar from "./components/navbar/navbar";
import HeroButton from "./components/herobutton/herobutton";
import { ContainerImage1, PlaceholderImage } from "@/public";
import WeStaySection from "./components/card";
import JoinCard from "./components/westay";
import Homeowners from "./components/Homeowners";
import { FaStar } from "react-icons/fa6";

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
          backgroundImage: 'url("/images/Hero Img.png")',
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

            <div className="px-[80px] md:mt-[104px] font-dm-sans  text-white">
              <p className="section-paragraph font-[400]">
                Check your ADU eligibility, <br />
                explore your options, and <br /> move forward with <br />{" "}
                guidance you can trust.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="bg-[#F3FFFE] rounded-full  border-[7px] border-white flex gap-3 p-[15px]">
            <div className="flex  -space-x-3  ">
              {image.map((item, index) => (
                <img
                  key={index}
                  src={item.src}
                  alt={item.alt}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div>
              <p className="flex">
                <FaStar color="#3D3D3D" />
                <FaStar color="#3D3D3D" />
                <FaStar color="#3D3D3D" />
                <FaStar color="#3D3D3D" />
                <FaStar color="#3D3D3D" />
              </p>
              <p
                style={{ fontFamily: "DM Sans" }}
                className="text-[#3D3D3D] text-[12px] leading-[26px] font-[300]"
              >
                Trusted by 5.000+ Customers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col overflow-hidden rounded-[20px] border border-[#E1E0DB] bg-[#F5F7FA] lg:flex-row">
            <div className="w-full lg:w-[46%]">
              <img
                src={ContainerImage1}
                className="h-full w-full object-cover"
                alt="Homeowners planning an ADU project"
              />
            </div>
            <div className="flex py-[65px] flex-col px-6  sm:px-10 lg:px-12 xl:pr-16">
              <div className="flex flex-col gap-4 lg:gap-5">
                <h1
                  style={{ fontFamily: "DM Sans" }}
                  className="section-heading flex flex-col text-left font-[400]"
                >
                  Most Homeowners Want to Build,
                  <span className="text-[#93928E] font-[400]">
                    But Don’t Know Where to Start
                  </span>
                </h1>
                <p
                  style={{ fontFamily: "DM Sans" }}
                  className="section-paragraph font-[400] text-[#93928E]"
                >
                  Many homeowners are unsure:
                </p>
              </div>

              <div className="mt-[28px] flex flex-col gap-[12px]">
                {homeownerQuestions.map((item) => (
                  <div
                    key={item}
                    className="flex h-[49px] w-full items-center rounded-[6px] border border-[#E2E2E2] bg-[#FAFAFA] shadow-[inset_0_1px_6px_rgba(0,0,0,0.18)]"
                  >
                    <div className="h-full w-[4px] rounded-l-[6px] bg-[#8ED9D8]" />
                    <span
                      style={{ fontFamily: "DM Sans" }}
                      className="px-6 text-[22px] font-normal leading-[32px] font-[400] text-[#9B9B9B]"
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <div></div>
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
    </>
  );
}
