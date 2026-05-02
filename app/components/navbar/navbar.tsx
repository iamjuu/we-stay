"use client";

import { Logo } from "@/content";
import CtaButton from "../ctaButton/ctaButton";
import Image from "next/image";
import Link from "next/link"; // Import Link for better Next.js navigation
import { useState } from "react";

const navItems = ["How It Works", "ADU Options", "Peek Inside", "About"];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full px-4 py-4 sm:px-6 lg:px-8">
      <div
        className="mx-auto flex w-full max-w-[1280px] flex-col rounded-[34px] border-b border-r border-[#bdbdbd] bg-[rgba(255,255,255,0.3)] shadow-[0px_3px_10px_0px_rgba(0,0,0,0.05),0px_3px_10px_0px_rgba(0,0,0,0.1)] backdrop-blur-[10px] sm:rounded-[40px] lg:rounded-[50px]"
      >
        {/* Main row — always visible */}
        <div className="flex  items-center justify-between px-5 py-3 sm:px-7 lg:px-[42px] lg:py-[10px]">
          {/* Logo */}
          <div className=" flex items-center justify-between w-full">
            <div className="">
              <Image
                alt="WeStay logo"
                className="h-full w-full object-contain"
                src={Logo}
              />
            </div>

            {/* Desktop nav items */}
            <div
              className="hidden items-center gap-[50px] text-[16px] font-normal leading-none text-black lg:flex"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              {navItems.map((item) => (
                <Link // Fixed: Added Link/a tag
                  key={item}
                  href="#"
                  className="whitespace-nowrap transition-opacity duration-200 hover:opacity-70"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <CtaButton buttonName="Book A Call" />
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] lg:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line
                x1="7.125"
                y1="10.875"
                x2="25.875"
                y2="10.875"
                stroke="black"
                strokeWidth="2.25"
                strokeLinecap="round"
              />
              <line
                x1="10.125"
                y1="4.875"
                x2="25.875"
                y2="4.875"
                stroke="black"
                strokeWidth="2.25"
                strokeLinecap="round"
              />
              <line
                x1="4.125"
                y1="16.875"
                x2="25.875"
                y2="16.875"
                stroke="black"
                strokeWidth="2.25"
                strokeLinecap="round"
              />
            </svg>

          </button>
        </div>

        {/* Mobile dropdown */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${menuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div
            className="flex flex-col items-center gap-5 px-5 pb-6 pt-2 text-[16px] font-normal text-black sm:px-7"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            {navItems.map((item) => (
              <Link // Fixed: Added Link/a tag
                key={item}
                href="#"
                className="whitespace-nowrap transition-opacity duration-200 hover:opacity-70"
                style={{ fontVariationSettings: "'opsz' 14" }}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <CtaButton buttonName="Book A Call" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;