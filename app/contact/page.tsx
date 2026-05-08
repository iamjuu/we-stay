import Image from 'next/image';
import Navbar from '@/app/components/navbar/navbar';
import Footer from '@/app/components/footer/footer';
import { About3 } from '@/content';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl 2xl:max-w-none">
          <Navbar />

          <div className="mt-8 mb-16">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">

                {/* Left: contact info */}
                <div className="p-8 lg:p-12 flex flex-col gap-6">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-3">
                      Get In Touch
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Questions about ADUs, pricing, or next steps? Reach out and our team will
                      guide you with clear answers and expert support.
                    </p>
                  </div>

                  {/* Contact details */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-[#F05C4A] text-sm">
                      <svg
                        className="w-4 h-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>loremipsum, address</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#F05C4A] text-sm">
                      <svg
                        className="w-4 h-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span>westay@example.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#F05C4A] text-sm">
                      <svg
                        className="w-4 h-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.03 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      <span>+000 000 0000</span>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="rounded-xl overflow-hidden h-[200px] w-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.27405069!2d-118.69192!3d34.02016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fefa2c9e6c5d1!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="WeStay location map"
                    />
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    className="w-full bg-[#F05C4A] text-white rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#e04a38] transition-colors duration-200"
                  >
                    Book Discovery Call
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Right: image */}
                <div className="relative min-h-[400px]">
                  <Image
                    src={About3}
                    alt="WeStay ADU home"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
