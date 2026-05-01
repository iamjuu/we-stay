import React from "react";

export const ctaButton = ({ className, buttonName }) => {
  return (
    <button
      className={`${className} flex h-[46px] shrink-0 items-center justify-center self-center rounded-[25px] bg-[#ff6b5c] px-6 text-[14px] font-semibold leading-[14px] text-white transition-colors duration-200 hover:bg-[#f45c4d] lg:self-auto`}
    >
     {buttonName}   
    </button>
  );
};

