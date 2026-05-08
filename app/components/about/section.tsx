import Image from 'next/image';

interface StoryProps {
  titlePrimary?: string;
  titleSecondary?: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  isImageLeft?: boolean;
}

const StorySection = ({
  titlePrimary,
  titleSecondary,
  paragraphs,
  imageSrc,
  imageAlt,
  isImageLeft = true,
}: StoryProps) => {
  return (
    <section className="w-full px-4 pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] sm:px-6 lg:px-8 2xl:px-[100px]">
      <div className="mx-auto max-w-7xl 2xl:max-w-none">
        <div
          className={`flex flex-col items-start gap-12 lg:gap-[80px] ${
            isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
          }`}
        >
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-xl">
              <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority />
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-5 justify-center">
            {(titlePrimary || titleSecondary) && (
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black">
                {titlePrimary}
                {titleSecondary && (
                  <span className="block text-gray-400 mt-1">{titleSecondary}</span>
                )}
              </h2>
            )}

            <div className="flex flex-col gap-4">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-gray-500 text-base leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
