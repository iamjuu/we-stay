'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const colorOptions = [
  { name: 'White', color: '#F5F5F0', image: '/images/house-white.png' },
  { name: 'Beige', color: '#E8DCC8', image: '/images/house-beige.png' },
  { name: 'Tan', color: '#C9A67A', image: '/images/house-tan.png' },
  { name: 'Brown', color: '#8B6F47', image: '/images/house-brown.png' },
  { name: 'Black', color: '#2C2C2C', image: '/images/house-black.png' },
];

const RoofComponent = () => {
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <section className="w-full px-4 pt-[120px] sm:px-6 lg:px-8 2xl:px-[100px]">
      <div className="mx-auto max-w-7xl 2xl:max-w-none">
<div className='flex flex-col gap-[50px]'>
        {/* Heading */}
        <div className="mb-8 flex w-full items-center  justify-center sm:mb-10 lg:mb-12">
          <h2 className="roof-section-heading text-gray-900">Four sizes.</h2>
          <p className="roof-section-heading !text-[#93928E]  mt-1">
            Tons of Possibility.
          </p>
        </div>


        {/* Image — bleeds to right edge, same as carousel */}
        <div className="-mr-4 sm:-mr-6 lg:-mr-8 2xl:-mr-[100px]">
          <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] lg:h-[580px] xl:h-[640px] overflow-hidden rounded-tl-[24px] rounded-bl-[24px]">
            {colorOptions.map((option, index) => (
              <Image
                key={index}
                src={option.image}
                alt={`House in ${option.name}`}
                fill
                className={`object-cover transition-opacity duration-500 ${selectedColor === index ? 'opacity-100' : 'opacity-0'
                  }`}
                sizes="100vw"
                priority={index === 0}
              />
            ))}

            {/* Bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Label on image */}
            <div className="absolute bottom-0 left-0 p-5 sm:p-8">
              <div className="bg-black/30 backdrop-blur-sm rounded-[16px] px-4 py-3 inline-block">
                <h3 className="text-white font-bold text-lg sm:text-xl mb-1">
                  One bedroom
                </h3>
                <p className="text-white/80 text-sm">
                  540 sq ft · 1 bedroom · 1 bath
                </p>
              </div>
            </div>
          </div>
        </div>

        </div>
        <div className='flex w-full items-center justify-center mt-[30px]'>
          {/* Color swatches — inside container */}
          <div className="flex items-center gap-2 sm:gap-3 mb-8 flex-wrap">
          {colorOptions.map((option, index) => (
  <button
    key={index}
    onClick={() => setSelectedColor(index)}
    className={`relative rounded-full transition-all duration-300 hover:scale-110 focus:outline-none ${
      selectedColor === index
        ? 'p-[3px] bg-[#4DB6AC]'
        : 'p-[3px] bg-transparent'
    }`}
    aria-label={`Select ${option.name} color`}
  >
    {/* White gap between teal ring and gray ring */}
    <div
      className={`rounded-full p-[3px] ${
        selectedColor === index ? 'bg-white' : 'bg-transparent'
      }`}
    >
      {/* Gray ring */}
      <div
        className={`rounded-full p-[2px] ${
          selectedColor === index ? 'bg-gray-300' : 'bg-transparent'
        }`}
      >
        {/* Color swatch */}
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300"
          style={{
            backgroundColor: option.color,
            boxShadow:
              selectedColor === index
                ? '0 4px 12px rgba(0,0,0,0.15)'
                : '0 2px 4px rgba(0,0,0,0.1)',
          }}
        />
      </div>
    </div>
  </button>
))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoofComponent;