'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import PanoramaImage from '@/content/images/panorama.jpg';

const panoramaUrl =
  typeof PanoramaImage === 'string' ? PanoramaImage : PanoramaImage.src;

const PanoramaViewer = dynamic<{ imageUrl: string }>(
  () => import('@/app/components/3d-element/PanoramaViewer'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-lg text-white">Loading 360° view…</p>
      </div>
    ),
  }
);

const ThreeDElement = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <>
      <section className="w-full px-4 pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] sm:px-6 lg:px-8 2xl:px-[100px]">
        <div className="mx-auto max-w-7xl 2xl:max-w-none">
          <div className="relative flex min-h-[280px] w-full flex-col items-center justify-between overflow-hidden rounded-[20px] p-8 sm:min-h-[360px] sm:p-12 md:min-h-[420px] lg:min-h-[500px] lg:p-16">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${panoramaUrl})` }}
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-black/35"
              aria-hidden
            />
            <div />

            <h2 className="relative z-10 text-center text-[40px] font-light tracking-tight text-white drop-shadow-sm sm:text-[52px] md:text-[62px] lg:text-[72px]">
              Peek inside.
            </h2>

            <button
              type="button"
              onClick={handleOpenModal}
              className="relative z-10 flex items-center gap-3 rounded-full bg-[#ff6b4a] px-6 py-3 text-white shadow-lg transition-colors hover:bg-[#ff5a39] sm:px-8 sm:py-4"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 sm:h-6 sm:w-6"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span className="text-sm font-medium sm:text-base">
                Tour Backyard in 3D
              </span>
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 animate-[panoramaFadeIn_0.5s_ease-out] bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="360 degree backyard panorama"
        >
          <button
            type="button"
            onClick={handleCloseModal}
            className="group absolute right-4 top-4 z-60 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:right-6 sm:top-6"
            aria-label="Close panorama"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 transition-transform group-hover:rotate-90"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="h-full w-full">
            <PanoramaViewer imageUrl={panoramaUrl} />
          </div>

          <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 px-4 text-center text-sm text-white/70 sm:text-base">
            <p>Drag to look around • Press ESC to close</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ThreeDElement;
