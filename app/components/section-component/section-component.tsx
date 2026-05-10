import Navbar from '@/app/components/navbar/navbar'
import { HeroImage } from '@/content'
import React from 'react'

const Sectioncomponent = ({bgImage, heading, headingsecondary, paragraph}: {bgImage: any, heading: string, headingsecondary: string, paragraph: string}) => {
  return (
    <div
        style={{
          backgroundImage: `url(${bgImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="min-h-screen flex flex-col justify-between bg-gray-100 relative"
      >
        {/* Gradient overlay — top half of hero */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/2 bg-linear-to-b from-black/90 to-transparent" />

        <div className="relative z-20">
          <Navbar />
          <div>
            <div className="mt-[80px] mb-[120px] flex w-full flex-col items-center gap-5 md:mt-[124px] md:items-center md:px-[80px] lg:mt-[140px] lg:items-center">
              <h1 className="hero-heading w-full text-center font-playfair-display font-[700] text-white">
               {heading}
                <br />
                {headingsecondary}
              </h1>
              <div className='flex justify-center w-full'>

          <p className='Hero-section-main text-white max-w-4xl text-center'>
            {paragraph}
          </p>
          </div>

            </div>
          </div>
        </div>
      
      </div>
  )
}

export default Sectioncomponent
