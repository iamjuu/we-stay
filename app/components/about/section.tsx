import Image, { type StaticImageData } from 'next/image';

interface StoryProps {
  titlePrimary?: string;
  titleSecondary?: string;
  paragraphs: string[];
  imageSrc: string | StaticImageData;
  imageAlt: string;
  isImageLeft?: boolean;
  /** Typography + sizing aligned with 1920px Figma (first block below hero). */
  featured?: boolean;
  /** Portrait 745×890 (primary) vs landscape 633×400 (secondary layout). Defaults from `featured`. */
  imagePreset?: 'portrait745' | 'landscape633';
}

const IMAGE_CARD_BASE =
  'relative mx-auto w-full shrink-0 overflow-hidden rounded-[20px] shadow-xl lg:mx-0';
const CARD_PORTRAIT = `${IMAGE_CARD_BASE} aspect-[745/890] max-w-[745px]`;
const CARD_LANDSCAPE = `${IMAGE_CARD_BASE} aspect-[633/400] max-w-[633px]`;

/** Body copy — DM Sans 400, up to ~28px, comfortable line-height, #93928E. */
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
  const imagePreset = imagePresetProp ?? (featured ? 'portrait745' : 'landscape633');
  const imageCardClass = imagePreset === 'portrait745' ? CARD_PORTRAIT : CARD_LANDSCAPE;
  const imageColMax = imagePreset === 'portrait745' ? 'lg:max-w-[745px]' : 'lg:max-w-[633px]';

  return (
    <section className={`w-full px-4 sm:px-6 lg:px-8 2xl:px-[100px] [@media(min-width:1920px)]:px-[200px] ${featured ? 'pt-16 sm:pt-20 md:pt-24 lg:pt-[120px]' : 'pt-10 sm:pt-12 md:pt-16 lg:pt-[80px]'}`}>
      <div className="mx-auto max-w-7xl 2xl:max-w-none">
        <div
          className={`flex flex-col items-start gap-12 lg:gap-[80px] ${
            featured ? 'lg:items-stretch' : 'lg:items-start'
          } ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
        >
          <div className={`w-full lg:w-auto lg:flex-1 ${imageColMax}`}>
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

          <div className={`flex w-full flex-col gap-10 lg:flex-1 ${featured ? 'lg:justify-between' : 'justify-center'}`}>
            {(titlePrimary || titleSecondary) && featured && (
              <h2 className="font-dm-sans font-medium tracking-[-1px] text-black">
                {titlePrimary && (
                  <span className="block lg:whitespace-nowrap text-[clamp(32px,2.9vw,52px)] leading-[1.06] xl:text-[52px] xl:leading-[65px]">
                    {titlePrimary}
                  </span>
                )}
                {titleSecondary && (
                  <span className="mt-3 block font-medium tracking-[-1px] text-[#93928E] text-[clamp(32px,2.9vw,52px)] leading-[1.06] xl:mt-[10px] xl:text-[52px] xl:leading-[65px]">
                    {titleSecondary}
                  </span>
                )}
              </h2>
            )}
            {(titlePrimary || titleSecondary) && !featured && (
              <h2 className="text-4xl font-medium tracking-tight text-black md:text-5xl">
                {titlePrimary}
                {titleSecondary && (
                  <span className="mt-1 block font-medium text-gray-400">{titleSecondary}</span>
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
