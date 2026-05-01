import React from "react";

type CtaButtonProps = {
  buttonName: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const CtaButton = ({
  buttonName,
  className = "",
  style,
  ...props
}: CtaButtonProps) => {
  return (
    <>
     <style>{`
  @property --cta-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }

  @keyframes cta-spin-and-fade {
    0% { 
      --cta-angle: 0deg; 
      opacity: 1; 
    }
    90% { 
      opacity: 1; 
    }
    100% { 
      --cta-angle: 360deg; 
      opacity: 0; /* Fade out at the very end */
    }
  }

  .cta-animated-border {
    position: relative;
    isolation: isolate;
  }

  .cta-animated-border::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 27px;
    background: conic-gradient(
      from var(--cta-angle, 0deg),
      transparent 0deg,
      transparent 60deg,
      white 80deg,
      white 100deg,
      transparent 120deg,
      transparent 240deg,
      white 260deg,
      white 280deg,
      transparent 300deg,
      transparent 360deg
    );
    /* Set animation to run once and then stay at 0% opacity */
    animation: cta-spin-and-fade 2s linear 1 forwards; 
    z-index: -1;
  }

  .cta-animated-border::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 23px;
    background: #ff6b5c;
    transition: background 0.2s;
    z-index: -1;
  }

  .cta-animated-border:hover::after {
    background: #f45c4d;
  }
`}</style>

      <button
        type="button"
        {...props}
        className={`${className} cta-animated-border flex h-[46px] shrink-0 items-center justify-center self-center overflow-hidden rounded-[25px] bg-[#ff6b5c] px-6 text-[14px] font-semibold leading-[14px] text-white transition-colors duration-200 hover:bg-[#f45c4d] lg:self-auto`}
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontVariationSettings: "'opsz' 14",
          ...style,
        }}
      >
        <span className="relative z-10">{buttonName}</span>
      </button>
    </>
  );
};

export default CtaButton;