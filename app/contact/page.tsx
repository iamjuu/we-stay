import Image from 'next/image';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import Navbar from '@/app/components/navbar/navbar';
import Footer from '@/app/components/footer/footer';
import {   ContactImage,
} from '@/content';

/** Map + primary CTA width from 1920px Figma. */
const MAP_AND_CTA_WIDTH = 'w-full max-w-[578px]';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div
        className="flex flex-1 flex-col px-4 pb-4 pt-20 sm:px-6 sm:pt-24 [@media(min-width:1024px)_and_(max-width:1764px)]:px-20 [@media(min-width:1765px)_and_(max-width:1919px)]:px-16 [@media(min-width:1920px)]:px-[200px]"
      >
        <div className="mx-auto w-full">
          <Navbar />

          <div className="mx-auto mb-16 mt-8 w-full max-w-[1520px]">
            <section className="flex min-h-0 flex-col gap-12 rounded-[20px] border border-[#E1E0DB] bg-[#F5F7FA] px-6 py-8 md:p-[40px] shadow-sm xl:min-h-[875px] xl:flex-row xl:items-stretch xl:gap-[110px]">
              {/* Left stack — typography + contact rows + map + CTA */}
              <div className="flex flex-1 flex-col justify-between gap-10 xl:min-h-0 xl:max-w-[min(578px,calc((100%-110px)/2))] xl:flex-none">
                <div className="flex flex-col gap-8 xl:gap-10">
                  <div className="flex flex-col gap-4 xl:gap-5">
                    <h1 className="font-dm-sans font-medium tracking-normal text-[clamp(34px,2.7vw,52px)] leading-[1.1] text-gray-900 xl:text-[52px] xl:leading-[60px]">
                      Get In Touch
                    </h1>
                    <p className="max-w-[640px] font-dm-sans font-normal text-[clamp(17px,1.25vw,24px)] leading-[clamp(26px,2vw,38px)] tracking-normal text-[#93928E]">
                      Questions about ADUs, pricing, or next steps? Reach out and our team will
                      guide you with clear answers and expert support.
                    </p>
                  </div>

                  <div className={`flex flex-col gap-6 text-[#4DB6AC] ${MAP_AND_CTA_WIDTH}`}>
                    <div className="flex min-h-[25px] items-center gap-[10px] font-dm-sans text-[clamp(13px,0.94vw,16px)] font-normal leading-[25px]">
                      <MapPin className="size-[19px] shrink-0 opacity-95" aria-hidden strokeWidth={2} />
                      <span>loremipsum, address</span>
                    </div>
                    <div className="flex min-h-[25px] items-center gap-[10px] font-dm-sans text-[clamp(13px,0.94vw,16px)] font-normal leading-[25px]">
                      <Mail className="size-[19px] shrink-0 opacity-95" aria-hidden strokeWidth={2} />
                      <span>westay@example.com</span>
                    </div>
                    <div className="flex min-h-[25px] items-center gap-[10px] font-dm-sans text-[clamp(13px,0.94vw,16px)] font-normal leading-[25px]">
                      <Phone className="size-[19px] shrink-0 opacity-95" aria-hidden strokeWidth={2} />
                      <span>+000 000 0000</span>
                    </div>
                  </div>
                </div>

                <div className={`flex flex-col gap-[9px] ${MAP_AND_CTA_WIDTH} xl:mt-auto`}>
                  <div className="h-[220px] w-full shrink-0 overflow-hidden rounded-[20px] bg-gray-100 sm:h-[290px] sm:max-h-[290px] sm:max-w-[578px]">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.27405069!2d-118.69192!3d34.02016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fefa2c9e6c5d1!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1"
                      width="578"
                      height="290"
                      className="h-full min-h-[220px] w-full border-0 sm:min-h-[290px]"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="WeStay location map"
                    />
                  </div>

                  <button
                    type="button"
                    className="flex h-[56px] max-h-[64px] w-full max-w-[578px] shrink-0 items-center justify-center gap-[9px] rounded-full px-10 font-dm-sans text-[15px] font-semibold text-white shadow-sm transition-colors hover:opacity-[0.94] active:opacity-90 sm:h-16 sm:px-14"
                    style={{ backgroundColor: '#F05C4A' }}
                  >
                    Book Discovery Call
                    <ArrowRight className="size-[18px] shrink-0" aria-hidden strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Right hero image — stacks below form on narrow viewports */}
              <div className="relative mx-auto mt-2 min-h-[260px] w-full xl:mx-0 xl:mt-0 xl:min-h-0 xl:flex-1">
                <Image
                  src={  ContactImage
                  }
                  alt="WeStay ADU home"
                  fill
                  className="rounded-[20px] object-cover"
                  sizes="(min-width: 1280px) 760px, 100vw"
                  priority
                />
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
