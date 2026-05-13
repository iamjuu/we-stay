import Image, { type StaticImageData } from 'next/image';

interface StoryProps {
  titlePrimary?: string;
  titleSecondary?: string;
  paragraphs: string[];
  imageSrc: string | StaticImageData;
  imageAlt: string;
  isImageLeft?: boolean;
  featured?: boolean;
  imagePreset?: 'portrait745' | 'landscape633';
}

const IMAGE_CARD_BASE =
  'relative mx-auto w-full h-full shrink-0 overflow-hidden rounded-[20px] shadow-xl lg:mx-0';

const CARD_PORTRAIT = `${IMAGE_CARD_BASE} max-w-[745px]`;
const CARD_LANDSCAPE = `${IMAGE_CARD_BASE} max-w-[633px]`;

const BODY_SPEC =
  'font-dm-sans text-[clamp(17px,1.46vw,28px)] font-normal leading-[1.5] tracking-normal text-[#93928E]';

const StorySection = ({
  titlePrimary,
  titleSecondary,
  paragraphs,
  imageSrc,
  imageAlt,
  isImageLeft = true,
  featured = false,
  imagePreset: imagePresetProp,
}: StoryProps) => {
  const imagePreset =
    imagePresetProp ?? (featured ? 'portrait745' : 'landscape633');

  const imageCardClass =
    imagePreset === 'portrait745' ? CARD_PORTRAIT : CARD_LANDSCAPE;

  const imageColMax =
    imagePreset === 'portrait745' ? 'lg:max-w-[745px]' : 'lg:max-w-[633px]';

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 2xl:px-50">
      <div className="mx-auto max-w-7xl 2xl:max-w-none">
        <div
          className={`flex flex-col items-stretch gap-[23px] ${
            featured ? 'lg:items-stretch' : 'lg:items-stretch'
          } ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
        >
          {/* IMAGE COLUMN (will stretch to match content height) */}
          <div className={`w-full lg:flex-1 ${imageColMax}`}>
            <div className={imageCardClass}>
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover object-center"
                priority={featured}
              />
            </div>
          </div>

          {/* CONTENT COLUMN (controls the height) */}
          <div
            className={`flex w-full flex-col gap-10 lg:flex-1 ${
              featured ? 'lg:justify-between' : 'justify-center'
            }`}
          >
            {(titlePrimary || titleSecondary) && featured && (
           <h2 className="font-dm-sans flex flex-col font-medium tracking-[-1px] text-black leading-[65px]">
           {titlePrimary && (
             <span className="block text-[clamp(32px,2.9vw,52px)] lg:whitespace-nowrap xl:text-[52px]">
               {titlePrimary}
             </span>
           )}
           {titleSecondary && (
             <span className="mt-3 block text-[clamp(32px,2.9vw,52px)] font-medium tracking-[-1px] text-[#93928E] xl:mt-[10px] xl:text-[52px]">
               {titleSecondary}
             </span>
           )}
         </h2>
            )}

            {(titlePrimary || titleSecondary) && !featured && (
              <h2 className="text-4xl font-medium tracking-tight text-black md:text-5xl">
                {titlePrimary}
                {titleSecondary && (
                  <span className="mt-1 block font-medium text-gray-400">
                    {titleSecondary}
                  </span>
                )}
              </h2>
            )}

            <div className="flex flex-col gap-10">
              {paragraphs.map((para, i) => (
                <p key={i} className={BODY_SPEC}>
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