import { FacebookIcon, FooterLogo, InstagramIcon, LinkedInIcon, TwitterIcon } from "@/content";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

type FooterQuickLink = {
  label: string;
  href: string;
};

const FOOTER_QUICK_LINKS: FooterQuickLink[] = [
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "/contact" },
  { label: "Blog", href: "#" },
  { label: "FAQ", href: "#" },
];

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
    <footer className="bg-[#0f1e2e] text-white px-6 py-14 sm:px-12 lg:px-20 lg:py-16 2xl:px-30">
      <div className="mx-auto max-w-7xl 2xl:max-w-none">
        {/* 
            Grid: 1 column on mobile, 2 columns on lg (1024px+). 
            Using justify-between instead of a hardcoded 400px gap for flexibility.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-x-20 justify-between">

          {/* Brand Section */}
          <div className="brand max-w-sm">
            <div className="">
              <Image src={FooterLogo} className="w-[352px] mb-[30px] " alt="WeStay" priority />            </div>
            <p
              style={{
                fontFamily: 'DM Sans',
              }}
              className="footer-section-one text-[#b0bec5] text-nowrap leading-relaxed">
              WeStay helps homeowners unlock   the <br/> value of their property through smarter <br/> ADU pathways.
            </p>
          </div>

          {/* Links and Socials Wrapper */}
          <div className="flex flex-col sm:flex-row justify-between gap-10 lg:justify-around lg:gap-32">

            {/* Quick Links */}
            <div>
            <h4 className="font-dm-sans mb-6 font-bold leading-normal text-white text-[18px] sm:text-[20px] md:text-[22px] lg:text-[26px] xl:text-[32px]">
  Quick Links
</h4>             <ul className="flex flex-col gap-3">
                {FOOTER_QUICK_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="quick-link text-[#b0bec5] text-sm hover:text-white transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials */}
            <div>
            <h4 className="font-dm-sans mb-6 font-bold leading-normal text-white text-[18px] sm:text-[20px] md:text-[22px] lg:text-[26px] xl:text-[32px]">
                Socials</h4>

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


      </div>
    </footer>
  );
}
