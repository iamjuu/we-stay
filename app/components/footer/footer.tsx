import { FacebookIcon, FooterLogo, InstagramIcon, LinkedInIcon, TwitterIcon } from "@/content";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

const FOOTER_QUICK_LINKS = [
  "About us",
  "Contact us",
  "Blog",
  "FAQ",
] as const;

type FooterSocialLink = {
  label: string;
  href: string;
  icon: StaticImageData;
};

const FOOTER_SOCIALS: FooterSocialLink[] = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Twitter", href: "#", icon: TwitterIcon },
  { label: "LinkedIn", href: "#", icon: LinkedInIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
];


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
            <p 
            style={{
              fontFamily:'DM Sans',
            }}
            className="footer-section-one text-[#b0bec5] leading-relaxed">
              WeStay helps homeowners unlock the value of their property through smarter ADU pathways.
            </p>
          </div>

          {/* Links and Socials Wrapper */}
          <div className="flex flex-col sm:flex-row justify-between gap-10 lg:justify-end lg:gap-32">

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-bold mb-6 text-white">Quick Links</h4>
              <ul className="flex flex-col gap-3">
                {FOOTER_QUICK_LINKS.map((item) => (
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
                {FOOTER_SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#F05C4A] transition-colors duration-300"
                  >
                    <Image
                      src={social.icon}
                      alt=""
                      width={social.icon.width}
                      height={social.icon.height}
                      className="h-[18px] w-[18px] object-contain"
                      aria-hidden
                    />
                  </a>
                ))}
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