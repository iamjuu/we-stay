import React from 'react';
import Image from 'next/image';

interface StoryProps {
  titlePrimary: string;
  titleSecondary: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  isImageLeft?: boolean; // Renamed for clarity, default can be true
}

const StorySection = ({ 
  titlePrimary, 
  titleSecondary, 
  description, 
  imageSrc, 
  imageAlt,
  isImageLeft = true // Defaulting to true as per your initial design
}: StoryProps) => {
  return (
    <section className='w-full px-4 pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] sm:px-6 lg:px-8 2xl:px-[100px]'>
    <div className="mx-auto max-w-7xl 2xl:max-w-none">
      <div className={`flex flex-col items-center gap-[100px] ${
        isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}>
        
        {/* Image Container */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content Container */}
        <div className="w-full md:w-1/2 flex flex-col gap-[20px]">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black">
            {titlePrimary}
            <span className="block text-gray-400 mt-1">
              {titleSecondary}
            </span>
          </h2>
          
          <p className="text-gray-500 text-lg leading-relaxed max-w-md">
            {description}
          </p>
        </div>

      </div>
    </div>
    </section>
  );
};

export default StorySection;