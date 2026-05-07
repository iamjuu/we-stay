'use client';

import type { StaticImageData } from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import Img400Coastal from '@/content/images/400/Studio coastal milky white.svg';
import Img400Sandstorm from '@/content/images/400/Studio sandstorm wood.svg';
import Img400Sage from '@/content/images/400/Studio soft sage.svg';
import Img400Stormwood from '@/content/images/400/Studio stormwood drift.svg';
import Img400Bronze from '@/content/images/400/Studio dark bronze.svg';

import Img600Coastal from '@/content/images/600/one bedroom coastal milky white.svg';
import Img600Sandstorm from '@/content/images/600/one bedroom brushed sandstorm.svg';
import Img600Sage from '@/content/images/600/one bedroom soft sage.svg';
import Img600Stormwood from '@/content/images/600/one bedroom stormwood drift.svg';
import Img600Bronze from '@/content/images/600/one bedroom dark bronze.svg';

import Img2BrCoastal from '@/content/images/two bedroom/two bedroom with office coastal mik white.svg';
import Img2BrSandstorm from '@/content/images/two bedroom/two bedroom with office brushed sandstorm.svg';
import Img2BrSage from '@/content/images/two bedroom/two bedroom with office soft sage.svg';
import Img2BrBronze from '@/content/images/two bedroom/two bedroom with office dark bronze.svg';

import Img660Coastal from '@/content/images/two-660/two bedroom coastal milk white.svg';
import Img660Sandstorm from '@/content/images/two-660/two bedroom brushed sandstorm.svg';
import Img660Sage from '@/content/images/two-660/two bedroom soft sage.svg';
import Img660Stormwood from '@/content/images/two-660/two bedroom stormwood drift.svg';
import Img660Bronze from '@/content/images/two-660/two bedroom dark bronze.svg';

const FINISH_SWATCHES = [
  { name: 'Coastal milky white', color: '#F5F5F0' },
  { name: 'Sandstorm', color: '#C9A67A' },
  { name: 'Soft sage', color: '#9CAF88' },
  { name: 'Stormwood drift', color: '#8B6F47' },
  { name: 'Dark bronze', color: '#2C2C2C' },
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
    specs: '400 sq. ft | 1 bedroom | 1 bath',
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
    specs: '600 sq. ft | 1 bedroom | 1 bath',
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
    subtitle: 'Space for living and working',
    specs: 'Two bedroom with office',
    images: [
      Img2BrCoastal,
      Img2BrSandstorm,
      Img2BrSage,
      Img660Stormwood,
      Img2BrBronze,
    ],
  },
  {
    title: 'Two bedroom 660',
    subtitle: 'Extra room for the way you live',
    specs: '660 sq. ft | 2 bedrooms | 2 baths',
    images: [
      Img660Coastal,
      Img660Sandstorm,
      Img660Sage,
      Img660Stormwood,
      Img660Bronze,
    ],
  },
];

/** Tailwind `gap-4` between flex items */
const CAROUSEL_GAP_PX = 16;

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
    setEdgeSpacerPx(
      Math.max(0, W / 2 - L / 2 - CAROUSEL_GAP_PX)
    );
  }, []);

  const scrollSlideIntoCenter = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const scroller = scrollRef.current;
      const slide = slideRefs.current[index];
      if (!scroller || !slide) return;

      const scrollerRect = scroller.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();
      const delta =
        slideRect.left +
        slideRect.width / 2 -
        (scrollerRect.left + scrollerRect.width / 2);
      scroller.scrollBy({ left: delta, behavior });
    },
    []
  );

  const runAfterLayout = useCallback((fn: () => void) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(fn);
    });
  }, []);

  useLayoutEffect(() => {
    updateEdgeSpacers();
  }, [updateEdgeSpacers]);

  useLayoutEffect(() => {
    scrollSlideIntoCenter(activeSlideRef.current, 'auto');
  }, [edgeSpacerPx, scrollSlideIntoCenter]);

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

    const vis = MODEL_SLIDES.map(() => 0);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = slides.indexOf(entry.target as HTMLDivElement);
          if (idx < 0) continue;
          vis[idx] = entry.intersectionRatio;
        }
        let bestIdx = 0;
        let bestRatio = vis[0] ?? 0;
        for (let i = 1; i < vis.length; i++) {
          if ((vis[i] ?? 0) > bestRatio) {
            bestRatio = vis[i] ?? 0;
            bestIdx = i;
          }
        }
        if (bestRatio > 0.05) setActiveSlide(bestIdx);
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
      runAfterLayout(() => scrollSlideIntoCenter(i, 'smooth'));
    },
    [scrollSlideIntoCenter, runAfterLayout]
  );

  const scrollCarousel = useCallback(
    (dir: -1 | 1) => {
      setActiveSlide((prev) => {
        const next = Math.max(
          0,
          Math.min(MODEL_SLIDES.length - 1, prev + dir)
        );
        runAfterLayout(() => scrollSlideIntoCenter(next, 'smooth'));
        return next;
      });
    },
    [scrollSlideIntoCenter, runAfterLayout]
  );

  return (
    <section className="w-full px-4 pt-[120px] sm:px-6 lg:px-8 2xl:px-[100px]">
      <div className="mx-auto max-w-7xl 2xl:max-w-none">
        <h1 className="roof-section-heading mb-8 text-center text-gray-900 sm:mb-10 lg:mb-12">
          Designed for your space.{' '}
          <span className="text-gray-500">Finished for your style.</span>
        </h1>

        <div className="relative rounded-2xl bg-[#F5F7FA] px-4 py-8 sm:px-6 sm:py-10">
          <div
            ref={scrollRef}
            className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div
              aria-hidden
              className="shrink-0"
              style={{
                width: edgeSpacerPx,
                scrollSnapAlign: 'none',
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
                  onClick={() => goToSlide(slideIndex)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      goToSlide(slideIndex);
                    }
                  }}
                  aria-label={`Select ${model.title}`}
                  aria-current={isActive ? 'true' : undefined}
                  className="min-w-[min(100%,520px)] shrink-0 snap-center cursor-pointer sm:min-w-[min(90%,560px)] lg:min-w-[min(85%,600px)] xl:min-w-[min(75%,640px)]"
                >
                  <div className="px-4 py-8 sm:px-8">
                    <p className="text-center text-lg font-medium text-gray-900">
                      {model.title}
                    </p>
                    <p className="mb-4 text-center text-sm text-gray-500">
                      {model.subtitle}
                    </p>

                    <div className="mx-auto flex max-w-[720px] justify-center">
                      <Image
                        src={img}
                        alt={`${model.title} — ${FINISH_SWATCHES[fIdx]?.name ?? 'render'}`}
                        className="h-auto w-full max-w-[520px] object-contain"
                        priority={slideIndex === 0}
                        onLoadingComplete={
                          slideIndex === 0 ? updateEdgeSpacers : undefined
                        }
                      />
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-700">
                      {model.specs}
                    </p>
                  </div>
                </div>
              );
            })}
            <div
              aria-hidden
              className="shrink-0"
              style={{
                width: edgeSpacerPx,
                scrollSnapAlign: 'none',
              }}
            />
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {FINISH_SWATCHES.map((opt, idx) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() =>
                    setFinishBySlide((prev) => {
                      const next = [...prev];
                      next[activeSlide] = idx;
                      return next;
                    })
                  }
                  aria-label={`${MODEL_SLIDES[activeSlide]?.title ?? 'Model'}: ${opt.name}`}
                  className={`h-7 w-7 rounded-full border transition sm:h-8 sm:w-8 ${
                    activeFinish === idx
                      ? 'border-gray-900'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: opt.color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoofComponent;
