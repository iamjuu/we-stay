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
  /* ── Base button ── */
  .cta-animated-border {
    position: relative;
    isolation: isolate;
    box-shadow: 0 0 18px rgba(240,92,74,0.55), 0 4px 10px rgba(0,0,0,0.18);
    transition: filter 0.2s, transform 0.1s;
  }

  .cta-animated-border:hover  { filter: brightness(1.06); }
  .cta-animated-border:active { transform: scale(0.975); filter: brightness(0.97); }

  /* Coral fill */
  .cta-animated-border::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(175deg, #ff8070 0%, #ff6b5c 35%, #f55f50 68%, #e85244 100%);
    z-index: -1;
  }

  /* Sheen container */
  .cta-glass-top {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    overflow: hidden;
    z-index: 1;
    pointer-events: none;
  }

  /* Hover-triggered sheen sweep */
  .cta-glass-top::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
    transition: left 0.5s ease;
    transition-delay: 0.5s;
  }
  .cta-animated-border:hover .cta-glass-top::after { left: 100%; }

  /* ── 4 border-line spans ── */
  .cta-border-t, .cta-border-l, .cta-border-b, .cta-border-r {
    position: absolute;
    display: block;
    background: rgba(255,255,255,0.75);
    transition: 0.5s ease;
    pointer-events: none;
    z-index: 3;
  }

  .cta-border-t { top: 0; left: 0; width: 0; height: 1px; }
  .cta-animated-border:hover .cta-border-t { width: 100%; transform: translateX(100%); }

  .cta-border-l { top: 0; left: 0; width: 1px; height: 0; }
  .cta-animated-border:hover .cta-border-l { height: 100%; transform: translateY(100%); }

  .cta-border-b { bottom: 0; right: 0; width: 0; height: 1px; }
  .cta-animated-border:hover .cta-border-b { width: 100%; transform: translateX(-100%); }

  .cta-border-r { bottom: 0; right: 0; width: 1px; height: 0; }
  .cta-animated-border:hover .cta-border-r { height: 100%; transform: translateY(-100%); }

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

  const glassLayers = (
    <>
      <span className="cta-glass-top" aria-hidden="true" />
      <span className="cta-border-t"  aria-hidden="true" />
      <span className="cta-border-l"  aria-hidden="true" />
      <span className="cta-border-b"  aria-hidden="true" />
      <span className="cta-border-r"  aria-hidden="true" />
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
