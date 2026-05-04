import { Logo, WhiteLogo } from "@/content";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f1e2e]  text-white px-20 py-14 
     gap-[400px] grid grid-cols-2">

      {/* Brand */}
      <div className="brand">
        <div className="brand-logo">

          <Image src={Logo} alt="WeStay" />
        </div>
        <p className="footer-section-one">
          WeStay helps homeowners unlock the value of their property through smarter ADU pathways.
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex justify-between">
      <div>
        <h4 className="text-base font-bold mb-5 text-white">Quick Links</h4>
        <ul className="flex flex-col gap-3">
          {["About us", "Contact us", "Blog", "FAQ"].map((item) => (
            <li   key={item}>
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
        <h4 className="text-base font-bold mb-5 text-white">Socials</h4>
        <div className="flex gap-3">

          {/* Facebook */}
          <a href="#" aria-label="Facebook"
            className="w-10 h-10 rounded-full bg-[#1e3248] flex items-center justify-center hover:bg-[#2a4460] transition-colors duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </a>

          {/* Twitter */}
          <a href="#" aria-label="Twitter"
            className="w-10 h-10 rounded-full bg-[#1e3248] flex items-center justify-center hover:bg-[#2a4460] transition-colors duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="#" aria-label="LinkedIn"
            className="w-10 h-10 rounded-full bg-[#1e3248] flex items-center justify-center hover:bg-[#2a4460] transition-colors duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>

          {/* Instagram */}
          <a href="#" aria-label="Instagram"
            className="w-10 h-10 rounded-full bg-[#1e3248] flex items-center justify-center hover:bg-[#2a4460] transition-colors duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none" />
            </svg>
          </a>

        </div>
      </div>
      </div>

    </footer>
  );
}