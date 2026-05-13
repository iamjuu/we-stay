import Navbar from "@/app/components/navbar/navbar";
import React from "react";

const Sectioncomponent = ({
  bgImage,
  heading,
  headingsecondary,
  paragraph,
}: {
  bgImage: any;
  heading: string;
  headingsecondary: string;
  paragraph: string;
}) => {
  return (
    <>
      <style>{`
        .hero-bg {
          background-position: center center;
        }

        @media (max-width: 1024px) {
          .hero-bg {
            background-position: 60% center;
          }
        }

        @media (max-width: 768px) {
          .hero-bg {
            background-position: 65% center;
          }
        }

        @media (max-width: 480px) {
          .hero-bg {
            background-position: 70% center;
          }
        }
      `}</style>

      <div
        style={{
          backgroundImage: `url(${bgImage.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "100vh",
        }}
        className="hero-bg relative flex flex-col overflow-hidden"
      >
        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/2 bg-gradient-to-b from-black/90 to-transparent" />

        {/* Content */}
        <div className="relative z-20 flex h-full flex-col">
          <Navbar />

          <div className="flex flex-1 items-center justify-center px-4 md:px-[80px]">
            <div className="flex w-full flex-col items-center gap-5">
              <h1 className="hero-heading w-full text-center font-playfair-display font-[700] text-white">
                {heading}
                <br />
                {headingsecondary}
              </h1>

              <p className="Hero-section-main max-w-4xl text-center text-white">
                {paragraph}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sectioncomponent;