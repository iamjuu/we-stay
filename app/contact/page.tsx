import Image from "next/image";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import Navbar from "@/app/components/navbar/navbar";
import Footer from "@/app/components/footer/footer";
import { ContactImage } from "@/content";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white pt-[140px]">
      <div className="flex flex-1 flex-col px-4 pb-4 sm:px-6 [@media(min-width:1024px)_and_(max-width:1764px)]:px-20 [@media(min-width:1765px)_and_(max-width:1919px)]:px-16 [@media(min-width:1920px)]:px-[200px]">
        <div className="mx-auto w-full">
          <Navbar />

          <div className="mx-auto mb-16 mt-8 w-full max-w-[1520px]">
            <section className="grid grid-cols-1 gap-12 rounded-[20px] border border-[#E1E0DB] bg-[#F5F7FA] px-6 py-8 md:p-[40px] xl:grid-cols-2 xl:gap-[110px]">
              {/* Left stack */}
              <div className="flex w-full flex-col justify-between gap-[40px]">
                {/* Heading + Paragraph */}
                <div className="flex flex-col gap-4 xl:gap-5">
                  <h1 className="font-dm-sans font-normal tracking-normal text-[clamp(34px,2.7vw,52px)] leading-[1.1] text-gray-900 lg:font-medium lg:text-[52px] lg:leading-[60px]">
                    Get In Touch
                  </h1>

                  <p className="max-w-[640px] font-dm-sans font-normal text-[17px] leading-[26px] tracking-normal text-[#93928E] lg:text-[24px] lg:leading-[38px]">
                    Questions about ADUs, pricing, or next steps? Reach out and our team will
                    guide you with clear answers and expert support.
                  </p>
                </div>

                {/* Contact points */}
                <ul className="flex flex-col gap-[30px]">
                  <li className="flex items-center gap-[10px] font-dm-sans text-[clamp(13px,0.94vw,16px)] font-normal leading-[25px] text-[#4DB6AC]">
                    <MapPin className="size-[19px] shrink-0 opacity-95" aria-hidden strokeWidth={2} />
                    <span>loremipsum, address</span>
                  </li>

                  <li className="flex items-center gap-[10px] font-dm-sans text-[clamp(13px,0.94vw,16px)] font-normal leading-[25px] text-[#4DB6AC]">
                    <Mail className="size-[19px] shrink-0 opacity-95" aria-hidden strokeWidth={2} />
                    <span>westay@example.com</span>
                  </li>

                  <li className="flex items-center gap-[10px] font-dm-sans text-[clamp(13px,0.94vw,16px)] font-normal leading-[25px] text-[#4DB6AC]">
                    <Phone className="size-[19px] shrink-0 opacity-95" aria-hidden strokeWidth={2} />
                    <span>+000 000 0000</span>
                  </li>
                </ul>

                {/* Map + CTA */}
                <div className="flex w-full flex-col gap-[40px]">
                  <div className="w-full overflow-hidden rounded-[20px] bg-gray-100 h-[220px] sm:h-[290px]">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.27405069!2d-118.69192!3d34.02016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fefa2c9e6c5d1!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1"
                      className="h-full w-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="WeStay location map"
                    />
                  </div>

                  <button
                    type="button"
                    className="flex h-[56px] w-full shrink-0 items-center justify-center gap-[9px] rounded-full px-10 font-dm-sans text-[15px] font-semibold text-white shadow-sm transition-colors hover:opacity-[0.94] active:opacity-90 sm:h-16 sm:px-14"
                    style={{ backgroundColor: "#F05C4A" }}
                  >
                    Book Discovery Call
                    <ArrowRight className="size-[18px] shrink-0" aria-hidden strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Right — Image (height auto based on left content) */}
              <div className="w-full">
                <Image
                  src={ContactImage}
                  alt="WeStay ADU home"
                  className="h-full w-full rounded-[20px] object-cover"
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