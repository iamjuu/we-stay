import { FooterLogo } from "@/content";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f1e2e] text-white px-6 py-14 sm:px-12 lg:px-20 lg:py-16 2xl:px-50">
      <div className="mx-auto max-w-7xl 2xl:max-w-none">
        {/* 
            Grid: 1 column on mobile, 2 columns on lg (1024px+). 
            Using justify-between instead of a hardcoded 400px gap for flexibility.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-x-20 justify-between">

          {/* Brand Section */}
          <div className="brand max-w-sm">
            <div className="">
            <Image src={FooterLogo} className="w-[200px] mb-[30px] h-auto" alt="WeStay" priority />            </div>
            <p className="footer-section-one text-[#b0bec5] leading-relaxed">
              WeStay helps homeowners unlock the value of their property through smarter ADU pathways.
            </p>
          </div>

          {/* Links and Socials Wrapper */}
          <div className="flex flex-col sm:flex-row justify-between gap-10 lg:justify-end lg:gap-32">
            
            {/* Quick Links */}
            <div>
              <h4 className="text-base font-bold mb-6 text-white">Quick Links</h4>
              <ul className="flex flex-col gap-3">
                {["About us", "Contact us", "Blog", "FAQ"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="quick-link text-[#b0bec5] text-sm hover:text-white transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials */}
            <div>
              <h4 className="text-base font-bold mb-6 text-white">Socials</h4>
              <div className="flex gap-3">
                {[
                  { label: "Facebook", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z", type: "path" },
                  { label: "Twitter", path: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z", type: "path" },
                  { label: "LinkedIn", path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z", type: "path" }
                ].map((social) => (
                  <a 
                    key={social.label}
                    href="#" 
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-[#1e3248] flex items-center justify-center hover:bg-[#F05C4A] transition-colors duration-300"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
                
                {/* Instagram (Special stroke-based icon) */}
                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-[#1e3248] flex items-center justify-center hover:bg-[#F05C4A] transition-colors duration-300">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Optional but recommended for premium feel) */}
        <div className="mt-16 pt-8 border-t border-white/5 text-xs text-[#b0bec5] flex flex-col sm:flex-row justify-between gap-4">
          <p>© 2026 WeStay. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}