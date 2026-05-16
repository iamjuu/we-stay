'use client';

import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import Img400Coastal from '@/content/images/400/Studio coastal milky white.png';
import Img400Sandstorm from '@/content/images/400/Studio sandstorm wood.png';
import Img400Sage from '@/content/images/400/Studio soft sage.png';
import Img400Stormwood from '@/content/images/400/Studio stormwood drift.png';
import Img400Bronze from '@/content/images/400/Studio dark bronze.png';

import Img600Coastal from '@/content/images/600/one bedroom coastal milky white.png';
import Img600Sandstorm from '@/content/images/600/one bedroom brushed sandorm.png';
import Img600Sage from '@/content/images/600/onebedroomsoftsage.png';
import Img600Stormwood from '@/content/images/600/one bedroom stormwood drift.png';
import Img600Bronze from '@/content/images/600/one bedroom dark bronze (2).png';

import Img2BrCoastal from '@/content/images/two bedroom/two bedroom with office coastal mik white.png';
import Img2BrSandstorm from '@/content/images/two bedroom/two bedroom with office brushed sandstorm.png';
import Img2BrSage from '@/content/images/two bedroom/two bedroom with office soft sage.png';
import Img2BrStormwood from '@/content/images/two bedroom/two bedroom with office sormwood drift.png';
import Img2BrBronze from '@/content/images/two bedroom/two bedroom with office dark bronze.png';

import Img660Coastal from '@/content/images/two-660/two bedroom coastal milk white.png';
import Img660Sandstorm from '@/content/images/two-660/two bedroom brushed sandstorm.png';
import Img660Sage from '@/content/images/two-660/two bedroom soft sage.png';
import Img660Stormwood from '@/content/images/two-660/two bedroom stormwood drift.png';
import Img660Bronze from '@/content/images/two-660/two bedroom dark bronze.png';

const FINISH_SWATCHES = [
  { name: 'Coastal milky white', color: '#EDE7E1' },
  { name: 'Brushed sandstorm', color: '#D9CBBB' },
  { name: 'Soft sage', color: '#CBC7B5' },
  { name: 'Stormwood drift', color: '#A28D71' },
  { name: 'Dark bronze', color: '#2E2E2C' },
] as const;

type ModelSlide = {
  title: string;
  subtitle: string;
  specs: string;
  /** Ordered to align with FINISH_SWATCHES indices */
  images: StaticImageData[];
};

const MODEL_SLIDES: ModelSlide[] = [
  {
    title: 'Studio',
    subtitle: 'The one space that does it all',
    specs: '400 sq.ft',
    images: [
      Img400Coastal,
      Img400Sandstorm,
      Img400Sage,
      Img400Stormwood,
      Img400Bronze,
    ],
  },
  {
    title: 'One bedroom',
    subtitle: 'Room to stretch out',
    specs: '600 sq.ft ',
    images: [
      Img600Coastal,
      Img600Sandstorm,
      Img600Sage,
      Img600Stormwood,
      Img600Bronze,
    ],
  },
  {
    title: 'Two bedroom',
    subtitle: 'Extra room for the way you live',
    specs: '660 sq.ft',
    images: [
      Img660Coastal,
      Img660Sandstorm,
      Img660Sage,
      Img660Stormwood,
      Img660Bronze,
    ],
  },
  {
    title: 'Two bedroom with office',
    subtitle: 'Space for living and working',
    specs: '800 sq.ft',
    images: [
      Img2BrCoastal,
      Img2BrSandstorm,
      Img2BrSage,
      Img2BrStormwood,
      Img2BrBronze,
    ],
  },
];

const SLIDE_RAIL_CARD_CLASS =
  'shrink-0 cursor-pointer min-w-[min(88%,560px)] sm:min-w-[min(84%,620px)] lg:min-w-[min(78%,660px)] xl:min-w-[min(72%,700px)]';

const SLIDE_IMAGE_STAGE_CLASS =
  'mx-auto flex h-[320px] w-full max-w-[min(94vw,900px)] items-center justify-center overflow-hidden sm:h-[380px] lg:h-[420px]';

/** Tailwind `gap-4` between flex items */
const CAROUSEL_GAP_PX = 16;

/** How long the finish swatch column stays visible after the last interaction */
const FINISH_BAR_VISIBLE_MS = 4000;

const ACCENT_COLOR = '#0D9488';

const LG_UP_MEDIA = '(min-width: 965px)';

function subscribeLgUp(cb: () => void) {
  const mq = window.matchMedia(LG_UP_MEDIA);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function getLgUpSnapshot() {
  return window.matchMedia(LG_UP_MEDIA).matches;
}

function getLgUpServerSnapshot() {
  return true;
}

const RoofComponent = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeSlideRef = useRef(0);

  const [activeSlide, setActiveSlide] = useState(0);

  /** Side padding inside the track so slide 0 / last slide can scroll to true center */
  const [edgeSpacerPx, setEdgeSpacerPx] = useState(0);

  /** Finish per model; shared swatch row only edits `activeSlide` */
  const [finishBySlide, setFinishBySlide] = useState<number[]>(() =>
    MODEL_SLIDES.map(() => 0)
  );

  const activeFinish = finishBySlide[activeSlide] ?? 0;

  /** Drag-to-scroll the horizontal model rail */
  const railDragActiveRef = useRef(false);
  const railDragStartXRef = useRef(0);
  const railScrollLeftStartRef = useRef(0);
  const railDragMovedRef = useRef(false);

  /**
   * IntersectionObserver must not drive `activeSlide` until edge spacers + scroll position
   * have settled; otherwise the first paint can pick the wrong slide.
   */
  const observerCanUpdateActiveRef = useRef(false);

  /** Finish swatch column: lg+ auto-hides ~4s after interaction; below lg always visible at bottom */
  const [finishBarVisible, setFinishBarVisible] = useState(false);
  const finishBarTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const isLgUp = useSyncExternalStore(
    subscribeLgUp,
    getLgUpSnapshot,
    getLgUpServerSnapshot
  );

  const showFinishBar = useCallback(() => {
    setFinishBarVisible(true);

    if (finishBarTimeoutRef.current) {
      clearTimeout(finishBarTimeoutRef.current);
      finishBarTimeoutRef.current = null;
    }

    if (!window.matchMedia(LG_UP_MEDIA).matches) {
      return;
    }

    finishBarTimeoutRef.current = setTimeout(() => {
      setFinishBarVisible(false);
      finishBarTimeoutRef.current = null;
    }, FINISH_BAR_VISIBLE_MS);
  }, []);

  useEffect(() => {
    if (!isLgUp) {
      setFinishBarVisible(true);
      if (finishBarTimeoutRef.current) {
        clearTimeout(finishBarTimeoutRef.current);
        finishBarTimeoutRef.current = null;
      }
    } else {
      setFinishBarVisible(false);
    }
  }, [isLgUp]);

  useEffect(() => {
    return () => {
      if (finishBarTimeoutRef.current) {
        clearTimeout(finishBarTimeoutRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  const setSlideRef = useCallback((el: HTMLDivElement | null, index: number) => {
    slideRefs.current[index] = el;
  }, []);

  const updateEdgeSpacers = useCallback(() => {
    const scroller = scrollRef.current;
    const slide0 = slideRefs.current[0];

    if (!scroller || !slide0) return;

    const W = scroller.clientWidth;
    const L = slide0.offsetWidth;

    setEdgeSpacerPx(Math.max(0, W / 2 - L / 2 - CAROUSEL_GAP_PX));
  }, []);

  const scrollRailToSlideCenter = useCallback(
    (index: number, behavior: ScrollBehavior = 'auto') => {
      const scroller = scrollRef.current;
      const slide = slideRefs.current[index];

      if (!scroller || !slide) return;

      const sr = scroller.getBoundingClientRect();
      const er = slide.getBoundingClientRect();

      const slideLeftInContent = scroller.scrollLeft + (er.left - sr.left);

      const desired =
        slideLeftInContent + er.width / 2 - scroller.clientWidth / 2;

      const maxScroll = Math.max(
        0,
        scroller.scrollWidth - scroller.clientWidth
      );

      const left = Math.max(0, Math.min(desired, maxScroll));

      scroller.scrollTo({ left, behavior });
    },
    []
  );

  const runAfterLayout = useCallback((fn: () => void) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(fn);
    });
  }, []);

  const snapRailToNearestSlide = useCallback(() => {
    const scroller = scrollRef.current;

    if (!scroller) return;

    const mid = scroller.scrollLeft + scroller.clientWidth / 2;

    let best = 0;
    let bestDist = Infinity;

    for (let idx = 0; idx < slideRefs.current.length; idx++) {
      const slide = slideRefs.current[idx];

      if (!slide) continue;

      const sr = scroller.getBoundingClientRect();
      const er = slide.getBoundingClientRect();

      const center = scroller.scrollLeft + (er.left - sr.left) + er.width / 2;
      const dist = Math.abs(center - mid);

      if (dist < bestDist) {
        bestDist = dist;
        best = idx;
      }
    }

    setActiveSlide(best);
    runAfterLayout(() => scrollRailToSlideCenter(best, 'smooth'));
  }, [runAfterLayout, scrollRailToSlideCenter]);

  useLayoutEffect(() => {
    updateEdgeSpacers();
  }, [updateEdgeSpacers]);

  useLayoutEffect(() => {
    observerCanUpdateActiveRef.current = false;

    const sync = () => {
      scrollRailToSlideCenter(activeSlideRef.current, 'auto');
    };

    sync();

    let rafInner = 0;
    let rafEnable = 0;

    const rafOuter = requestAnimationFrame(() => {
      sync();

      rafInner = requestAnimationFrame(() => {
        sync();

        rafEnable = requestAnimationFrame(() => {
          observerCanUpdateActiveRef.current = true;
        });
      });
    });

    return () => {
      cancelAnimationFrame(rafOuter);
      cancelAnimationFrame(rafInner);
      cancelAnimationFrame(rafEnable);
    };
  }, [edgeSpacerPx, scrollRailToSlideCenter]);

  useEffect(() => {
    const scroller = scrollRef.current;

    if (!scroller || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => {
      updateEdgeSpacers();
    });

    ro.observe(scroller);

    const id = requestAnimationFrame(() => {
      const s0 = slideRefs.current[0];
      if (s0) ro.observe(s0);
    });

    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
  }, [updateEdgeSpacers]);

  useEffect(() => {
    const slides = slideRefs.current.filter(
      (n): n is HTMLDivElement => n != null
    );

    if (slides.length === 0) return;

    const ratiosRef = { current: MODEL_SLIDES.map(() => 0) };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!observerCanUpdateActiveRef.current) return;

        for (const entry of entries) {
          const idx = slides.indexOf(entry.target as HTMLDivElement);

          if (idx < 0) continue;

          ratiosRef.current[idx] = entry.intersectionRatio;
        }

        const ratios = ratiosRef.current;

        let bestIdx = 0;
        let bestRatio = ratios[0] ?? 0;

        for (let i = 1; i < ratios.length; i++) {
          if ((ratios[i] ?? 0) > bestRatio) {
            bestRatio = ratios[i] ?? 0;
            bestIdx = i;
          }
        }

        if (bestRatio > 0.05) {
          setActiveSlide(bestIdx);
        }
      },
      {
        root: scrollRef.current ?? undefined,
        rootMargin: '0px',
        threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95, 1],
      }
    );

    slides.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      const i = Math.max(0, Math.min(MODEL_SLIDES.length - 1, index));

      setActiveSlide(i);
      runAfterLayout(() => scrollRailToSlideCenter(i, 'smooth'));
    },
    [scrollRailToSlideCenter, runAfterLayout]
  );

  const scrollCarousel = useCallback(
    (dir: -1 | 1) => {
      setActiveSlide((prev) => {
        const next = Math.max(
          0,
          Math.min(MODEL_SLIDES.length - 1, prev + dir)
        );

        runAfterLayout(() => scrollRailToSlideCenter(next, 'smooth'));

        return next;
      });
    },
    [scrollRailToSlideCenter, runAfterLayout]
  );

  const onRailPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;

      const el = scrollRef.current;

      if (!el) return;

      railDragMovedRef.current = false;
      railDragActiveRef.current = true;
      railDragStartXRef.current = e.clientX;
      railScrollLeftStartRef.current = el.scrollLeft;

      e.currentTarget.setPointerCapture(e.pointerId);
    },
    []
  );

  const onRailPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!railDragActiveRef.current || !scrollRef.current) return;

      const dx = e.clientX - railDragStartXRef.current;

      if (Math.abs(dx) > 6) {
        railDragMovedRef.current = true;
      }

      scrollRef.current.scrollLeft = railScrollLeftStartRef.current - dx;
    },
    []
  );

  const endRailPointerDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!railDragActiveRef.current) return;

      const didMove = railDragMovedRef.current;

      railDragActiveRef.current = false;

      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* ignore */
      }

      if (didMove) {
        snapRailToNearestSlide();
      }
    },
    [snapRailToNearestSlide]
  );

  const onRailLostPointerCapture = useCallback(() => {
    if (!railDragActiveRef.current) return;

    const didMove = railDragMovedRef.current;

    railDragActiveRef.current = false;

    if (didMove) {
      snapRailToNearestSlide();
    }
  }, [snapRailToNearestSlide]);

  return (
    <section className="w-full px-4 pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] sm:px-6 lg:px-8 2xl:px-50">
      <div className="mx-auto max-w-7xl 2xl:max-w-none">
        <h1 className="roof-section-heading mb-8 text-center text-gray-900 sm:mb-10 lg:mb-12">
          Designed for your space.{' '}
          <span className="text-gray-500">Finished for your style.</span>
        </h1>

        <div className="relative rounded-2xl bg-[#F5F7FA] px-4 py-8 sm:px-6 sm:py-10">
          <div className={`flex items-stretch ${isLgUp ? 'flex-row gap-10 xl:gap-14' : 'flex-col gap-6 sm:gap-8'}`}>
            <div className={`relative min-w-0 flex-1 overflow-hidden ${isLgUp ? 'order-2' : 'order-1'}`}>
              {/* Light edge blur + fade — hidden below 965px so images aren't cut off */}
              {isLgUp && (
                <>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-3 left-0 z-[6] w-[clamp(14px,3.5vw,32px)] bg-gradient-to-r from-[#F5F7FA]/90 via-[#F5F7FA]/35 to-transparent backdrop-blur-sm"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-3 right-0 z-[6] w-[clamp(14px,3.5vw,32px)] bg-gradient-to-l from-[#F5F7FA]/90 via-[#F5F7FA]/35 to-transparent backdrop-blur-sm"
                  />
                </>
              )}

              <div
                ref={scrollRef}
                role="presentation"
                onPointerDown={onRailPointerDown}
                onPointerMove={onRailPointerMove}
                onPointerUp={endRailPointerDrag}
                onPointerCancel={endRailPointerDrag}
                onLostPointerCapture={onRailLostPointerCapture}
                className="-mx-1 flex min-w-0 w-full cursor-pointer touch-none select-none gap-4 overflow-x-auto scroll-auto pb-2 active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                <div
                  aria-hidden
                  className="shrink-0"
                  style={{
                    width: edgeSpacerPx,
                  }}
                />

                {MODEL_SLIDES.map((model, slideIndex) => {
                  const isActive = slideIndex === activeSlide;
                  const fIdx = finishBySlide[slideIndex] ?? 0;

                  const img =
                    model.images[Math.min(fIdx, model.images.length - 1)] ??
                    model.images[0];

                  return (
                    <div
                      key={model.title}
                      ref={(el) => setSlideRef(el, slideIndex)}
                      role="button"
                      tabIndex={0}
                      onMouseEnter={showFinishBar}
                      onFocus={showFinishBar}
                      onClick={() => {
                        showFinishBar();
                        if (railDragMovedRef.current) return;
                        goToSlide(slideIndex);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          showFinishBar();
                          goToSlide(slideIndex);
                        }
                      }}
                      aria-label={`Select ${model.title}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={SLIDE_RAIL_CARD_CLASS}
                    >
                      <div className="px-4 py-8 sm:px-8">
                        <p className="text-center text-[30px] font-normal leading-[36px] text-gray-900">
                          {model.title}
                        </p>

                        <p className="text-center text-[18px] font-normal leading-[23.94px] text-black">
                          {model.specs}
                        </p>

                        <p className="mb-4 text-center text-[18px] font-normal leading-[23.94px] text-gray-500">
                          {model.subtitle}
                        </p>

                        <div
                          key={`${slideIndex}-${fIdx}`}
                          className={SLIDE_IMAGE_STAGE_CLASS}
                        >
                          <Image
                            src={img}
                            alt={`${model.title} — ${
                              FINISH_SWATCHES[fIdx]?.name ?? 'render'
                            }`}
                            width={img.width}
                            height={img.height}
                            className="pointer-events-none h-full w-auto max-w-full object-contain"
                            draggable={false}
                            priority={slideIndex === 0}
                            sizes="(max-width: 1023px) 96vw, 900px"
                            onLoad={updateEdgeSpacers}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div
                  aria-hidden
                  className="shrink-0"
                  style={{
                    width: edgeSpacerPx,
                  }}
                />
              </div>

              {/* Tap left / right of viewport to center previous or next model */}
              <div className="pointer-events-none absolute inset-0 z-5 flex items-stretch">
                <button
                  type="button"
                  aria-label="Show previous model"
                  className="pointer-events-auto h-full w-[20%] max-w-[132px] shrink-0 cursor-pointer bg-transparent sm:max-w-[160px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollCarousel(-1);
                  }}
                />

                <span
                  className="pointer-events-none min-h-0 min-w-0 flex-1"
                  aria-hidden
                />

                <button
                  type="button"
                  aria-label="Show next model"
                  className="pointer-events-auto h-full w-[20%] max-w-[132px] shrink-0 cursor-pointer bg-transparent sm:max-w-[160px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollCarousel(1);
                  }}
                />
              </div>
            </div>

            <aside
              className={`flex shrink-0 rounded-2xl border border-black/6 bg-[#E8EAED] transition-opacity duration-300 ${
                isLgUp
                  ? `order-1 w-[72px] sm:w-[84px] flex-col items-center justify-center gap-4 self-center px-4 py-10 sm:gap-5 sm:px-5 sm:py-12 ${
                      finishBarVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`
                  : 'order-2 w-full flex-row flex-wrap items-center justify-center gap-4 self-stretch rounded-xl px-6 py-4 opacity-100'
              }`}
              aria-label="Exterior finish"
              aria-hidden={isLgUp && !finishBarVisible}
              onMouseEnter={isLgUp ? showFinishBar : undefined}
              onMouseMove={isLgUp ? showFinishBar : undefined}
            >
              <div className={`flex gap-4 ${
                isLgUp
                  ? 'flex-col items-center justify-center'
                  : 'w-full flex-row flex-wrap items-center justify-center'
              }`}>
                {FINISH_SWATCHES.map((opt, idx) => (
                  <div key={opt.name} className="group relative flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        showFinishBar();
                        setFinishBySlide((prev) => {
                          const next = [...prev];
                          next[activeSlide] = idx;
                          return next;
                        });
                      }}
                      aria-label={`${
                        MODEL_SLIDES[activeSlide]?.title ?? 'Model'
                      }: ${opt.name}`}
                      className={`h-9 w-9 shrink-0 cursor-pointer rounded-full border-2 transition sm:h-10 sm:w-10 ${
                        activeFinish === idx ? 'scale-105' : 'border-gray-300'
                      }`}
                      style={{
                        backgroundColor: opt.color,
                        borderColor: activeFinish === idx ? ACCENT_COLOR : undefined,
                      }}
                    />

                    <span
                      className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-medium opacity-0 shadow-sm ring-1 ring-black/5 transition-opacity duration-200 group-hover:opacity-100 ${
                        isLgUp
                          ? 'left-full top-1/2 ml-3 -translate-y-1/2'
                          : 'left-1/2 top-0 ml-0 -translate-x-1/2 -translate-y-[calc(100%+6px)]'
                      }`}
                      style={{ color: ACCENT_COLOR }}
                    >
                      {opt.name}
                    </span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>

    </section>
  );
};

export default RoofComponent;