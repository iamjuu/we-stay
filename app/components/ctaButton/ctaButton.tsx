"use client";

import React, { useEffect, useState, useRef, useId } from "react";

/* ─────────────────────────────────────────────────────────────
   GlassSurface — kept intact for use elsewhere in your project
   (Not applied directly on the button to avoid colour fringing)
   ───────────────────────────────────────────────────────────── */

const GLASS_CSS = `
  .glass-surface {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: opacity 0.26s ease-out;
  }
  .glass-surface__filter {
    width: 100%;
    height: 100%;
    pointer-events: none;
    position: absolute;
    inset: 0;
    opacity: 0;
    z-index: -1;
  }
  .glass-surface__content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: inherit;
    position: relative;
    z-index: 1;
  }
  .glass-surface--svg {
    background: light-dark(hsl(0 0% 100% / var(--glass-frost, 0)), hsl(0 0% 0% / var(--glass-frost, 0)));
    backdrop-filter: var(--filter-id, url(#glass-filter)) saturate(var(--glass-saturation, 1));
    box-shadow:
      0 0 2px 1px light-dark(color-mix(in oklch, black, transparent 85%), color-mix(in oklch, white, transparent 65%)) inset,
      0 0 10px 4px light-dark(color-mix(in oklch, black, transparent 90%), color-mix(in oklch, white, transparent 85%)) inset,
      0px 4px 16px rgba(17,17,26,0.05),
      0px 8px 24px rgba(17,17,26,0.05),
      0px 16px 56px rgba(17,17,26,0.05),
      0px 4px 16px rgba(17,17,26,0.05) inset,
      0px 8px 24px rgba(17,17,26,0.05) inset,
      0px 16px 56px rgba(17,17,26,0.05) inset;
  }
  .glass-surface--fallback {
    background: rgba(255,255,255,0.25);
    backdrop-filter: blur(12px) saturate(1.8) brightness(1.1);
    -webkit-backdrop-filter: blur(12px) saturate(1.8) brightness(1.1);
    border: 1px solid rgba(255,255,255,0.3);
    box-shadow:
      0 8px 32px 0 rgba(31,38,135,0.2),
      0 2px 16px 0 rgba(31,38,135,0.1),
      inset 0 1px 0 0 rgba(255,255,255,0.4),
      inset 0 -1px 0 0 rgba(255,255,255,0.2);
  }
  @media (prefers-color-scheme: dark) {
    .glass-surface--fallback {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(12px) saturate(1.8) brightness(1.2);
      -webkit-backdrop-filter: blur(12px) saturate(1.8) brightness(1.2);
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow:
        inset 0 1px 0 0 rgba(255,255,255,0.2),
        inset 0 -1px 0 0 rgba(255,255,255,0.1);
    }
  }
`;

interface GlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: string;
  yChannel?: string;
  mixBlendMode?: string;
  className?: string;
  style?: React.CSSProperties;
}

const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = "R",
  yChannel = "G",
  mixBlendMode = "difference",
  className = "",
  style = {},
}) => {
  const uniqueId = useId().replace(/:/g, "-");
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;

  const [svgSupported, setSvgSupported] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 400;
    const actualHeight = rect?.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);
    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"/>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})"/>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode:${mixBlendMode}"/>
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)"/>
      </svg>
    `;
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = () => {
    feImageRef.current?.setAttribute("href", generateDisplacementMap());
  };

  useEffect(() => {
    updateDisplacementMap();
    [
      { ref: redChannelRef, offset: redOffset },
      { ref: greenChannelRef, offset: greenOffset },
      { ref: blueChannelRef, offset: blueOffset },
    ].forEach(({ ref, offset }) => {
      if (ref.current) {
        ref.current.setAttribute("scale", (distortionScale + offset).toString());
        ref.current.setAttribute("xChannelSelector", xChannel);
        ref.current.setAttribute("yChannelSelector", yChannel);
      }
    });
    gaussianBlurRef.current?.setAttribute("stdDeviation", displace.toString());
  }, [
    width, height, borderRadius, borderWidth, brightness, opacity, blur,
    displace, distortionScale, redOffset, greenOffset, blueOffset,
    xChannel, yChannel, mixBlendMode,
  ]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => setTimeout(updateDisplacementMap, 0));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setTimeout(updateDisplacementMap, 0);
  }, [width, height]);

  useEffect(() => {
    const supportsSVGFilters = () => {
      if (typeof window === "undefined") return false;
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      const isFirefox = /Firefox/.test(navigator.userAgent);
      if (isSafari || isFirefox) return false;
      const div = document.createElement("div");
      div.style.backdropFilter = `url(#${filterId})`;
      return div.style.backdropFilter !== "";
    };
    setSvgSupported(supportsSVGFilters());
  }, []);

  const containerStyle: React.CSSProperties = {
    ...style,
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    ["--glass-frost" as string]: backgroundOpacity,
    ["--glass-saturation" as string]: saturation,
    ["--filter-id" as string]: `url(#${filterId})`,
  };

  return (
    <div
      ref={containerRef}
      className={`glass-surface ${svgSupported ? "glass-surface--svg" : "glass-surface--fallback"} ${className}`}
      style={containerStyle}
    >
      <svg className="glass-surface__filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
            <feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" result="dispRed" />
            <feColorMatrix in="dispRed" type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
            <feDisplacementMap ref={greenChannelRef} in="SourceGraphic" in2="map" result="dispGreen" />
            <feColorMatrix in="dispGreen" type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
            <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" result="dispBlue" />
            <feColorMatrix in="dispBlue" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>
      <div className="glass-surface__content">{children}</div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   CtaButton — coral background + realistic CSS-only glass sheen
   No SVG displacement on the button (zero colour fringing)
   ───────────────────────────────────────────────────────────── */

const CTA_CSS = `
  /* ── Custom property for sweep animation ── */
  @property --cta-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }

  /* ── Sweep border: spins once then fades ── */
  @keyframes cta-spin-and-fade {
    0%   { --cta-angle: 0deg;   opacity: 1; }
    90%  { opacity: 1; }
    100% { --cta-angle: 360deg; opacity: 0; }
  }

  /* ── Sheen slides across once on load ── */
  @keyframes cta-sheen {
    0%   { transform: translateX(-130%) skewX(-18deg); opacity: 0;   }
    15%  { opacity: 1; }
    85%  { opacity: 1; }
    100% { transform: translateX(230%)  skewX(-18deg); opacity: 0;   }
  }

  /* ── Gentle ambient pulse ── */
  @keyframes cta-pulse {
    0%, 100% { box-shadow:
      inset 0 1.5px 0 rgba(255,255,255,0.60),
      inset 0 -1px  0 rgba(0,0,0,0.20),
      inset 0 0 14px rgba(255,255,255,0.06),
      0 4px 18px rgba(255,107,92,0.42),
      0 1px 4px  rgba(0,0,0,0.22); }
    50% { box-shadow:
      inset 0 1.5px 0 rgba(255,255,255,0.60),
      inset 0 -1px  0 rgba(0,0,0,0.20),
      inset 0 0 14px rgba(255,255,255,0.06),
      0 7px 26px rgba(255,107,92,0.55),
      0 1px 4px  rgba(0,0,0,0.22); }
  }

  /* ── Base button ── */
  .cta-animated-border {
    position: relative;
    isolation: isolate;
    /* Layered shadow stack: rim highlight + glow + drop */
    box-shadow:
      inset 0 1.5px 0 rgba(255,255,255,0.60),
      inset 0 -1px  0 rgba(0,0,0,0.20),
      inset 0 0 14px rgba(255,255,255,0.06),
      0 4px 18px rgba(255,107,92,0.42),
      0 1px 4px  rgba(0,0,0,0.22);
    animation: cta-pulse 3.5s ease-in-out infinite;
    /* Prevent Tailwind hover:bg from fighting the gradient */
    transition: filter 0.2s, transform 0.1s;
  }

  .cta-animated-border:hover  { filter: brightness(1.06); }
  .cta-animated-border:active { transform: scale(0.975); filter: brightness(0.97); }

  /* Sweep border (once on mount) */
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
    animation: cta-spin-and-fade 2s linear 1 forwards;
    z-index: -1;
  }

  /* Coral fill with vertical gradient for glass depth */
  .cta-animated-border::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 23px;
    background: linear-gradient(
      175deg,
      #ff8070 0%,
      #ff6b5c 35%,
      #f55f50 68%,
      #e85244 100%
    );
    transition: background 0.2s;
    z-index: -1;
  }

  /* ── Glass layer 1: top dome highlight ──
     Simulates light hitting the upper curved surface of a pill-shaped glass */
  .cta-glass-top {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    overflow: hidden;
    z-index: 1;
    pointer-events: none;
  }

  /* Upper dome */
  .cta-glass-top::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 4%;
    right: 4%;
    height: 46%;
    border-radius: 22px 22px 58% 58% / 22px 22px 38px 38px;
    background: linear-gradient(
      180deg,
      rgba(255,255,255,0.36) 0%,
      rgba(255,255,255,0.14) 55%,
      rgba(255,255,255,0.00) 100%
    );
  }

  /* One-shot sheen sweep */
  .cta-glass-top::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 32%;
    height: 100%;
    background: linear-gradient(
      100deg,
      rgba(255,255,255,0.00) 0%,
      rgba(255,255,255,0.26) 50%,
      rgba(255,255,255,0.00) 100%
    );
    animation: cta-sheen 2s ease 0.4s 1 forwards;
    transform: translateX(-130%) skewX(-18deg);
    opacity: 0;
  }

  /* ── Glass layer 2: bottom edge micro-reflection ── */
  .cta-glass-bottom {
    position: absolute;
    bottom: 1px;
    left: 10%;
    right: 10%;
    height: 28%;
    border-radius: 0 0 22px 22px;
    background: linear-gradient(
      0deg,
      rgba(255,255,255,0.12) 0%,
      rgba(255,255,255,0.00) 100%
    );
    z-index: 1;
    pointer-events: none;
  }

  /* ── Label always on top ── */
  .cta-label {
    position: relative;
    z-index: 2;
    text-shadow: 0 1px 2px rgba(0,0,0,0.16);
    letter-spacing: 0.01em;
  }
`;

type CtaButtonProps = {
  buttonName: string;
  icon?: React.ReactNode;
  className?: string;
  href?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "href"> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "style" | "children">;

const CtaButton: React.FC<CtaButtonProps> = ({
  buttonName,
  icon,
  className = "",
  href,
  style,
  ...props
}) => {
  const sharedClassName = [
    className,
    "cta-animated-border",
    "flex h-[46px] shrink-0 items-center justify-center self-center",
    "overflow-hidden rounded-[25px]",
    "bg-[#ff6b5c] px-6",
    "text-[14px] font-semibold leading-[14px] text-white",
    "lg:self-auto",
  ]
    .filter(Boolean)
    .join(" ");

  const sharedStyle: React.CSSProperties = {
    fontFamily: '"DM Sans", sans-serif',
    fontVariationSettings: "'opsz' 14",
    ...(style as React.CSSProperties),
  };

  /* Pure-CSS glass: two absolutely-positioned spans */
  const glassLayers = (
    <>
      <span className="cta-glass-top"    aria-hidden="true" />
      <span className="cta-glass-bottom" aria-hidden="true" />
    </>
  );

  const inner = (
    <>
      <style>{GLASS_CSS + CTA_CSS}</style>
      {href ? (
        <a
          href={href}
          className={sharedClassName}
          style={sharedStyle}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {glassLayers}
          <span className="cta-label inline-flex items-center gap-2.5">
            {icon}
            <span>{buttonName}</span>
          </span>
        </a>
      ) : (
        <button
          type="button"
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          className={sharedClassName}
          style={sharedStyle}
        >
          {glassLayers}
          <span className="cta-label inline-flex items-center gap-2.5">
            {icon}
            <span>{buttonName}</span>
          </span>
        </button>
      )}
    </>
  );

  return inner;
};

export default CtaButton;
