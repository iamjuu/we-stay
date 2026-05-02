'use client';

import React from 'react';

const BuilderNetwork = () => {
  return (
    <section className="w-full px-4 bg-[#0C1B2A] sm:px-6 lg:px-8 2xl:px-[100px]">
        <div className="mx-auto max-w-7xl 2xl:max-w-none">

        {/* Title */}
        <h2 className="text-center text-white text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 tracking-tight">
          Join the WeStay{' '}
          <span className="text-[#93928E]">Builder Network</span>
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-3">

            {/* Who We Want */}
            <div className="bg-[#162032] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col gap-2 relative">
              <button className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <h3 className="text-white font-bold text-base sm:text-lg">Who We Want</h3>
              <p className="text-white/50 text-xs sm:text-sm text-center leading-relaxed">
                Licensed builders | Reliable teams<br />
                Quality-first operators
              </p>
            </div>

            {/* Why Join */}
            <div className="bg-[#162032] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col gap-2 relative flex-1">
              <button className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all">
                <span className="text-white/50 font-bold text-sm">?</span>
              </button>
              <h3 className="text-white font-bold text-base sm:text-lg">Why Join</h3>
              <p className="text-white/50 text-xs sm:text-sm text-center leading-relaxed">
                Qualified leads | Better projects<br />
                Less sales friction | Operational support<br />
                Growth pipeline
              </p>
              <button className="mt-3 self-center bg-[#E8603C] hover:bg-[#d4522f] active:scale-95 text-white text-xs font-semibold px-6 py-2 rounded-full transition-all duration-200">
                Apply Now
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-3">

            {/* Image */}
            <div className="rounded-2xl overflow-hidden w-full h-[200px] sm:h-[240px] md:h-[260px] lg:h-[280px]">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                alt="Modern house"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Process */}
            <div className="bg-[#162032] border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h4 className="text-white font-bold text-base sm:text-lg">Process</h4>
                <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/60">
                <span className="text-white/90 whitespace-nowrap">Apply</span>
                <div className="flex-1 border-t border-white/30" />
                <span className="whitespace-nowrap">Review</span>
                <div className="flex-1 border-t border-white/30" />
                <span className="whitespace-nowrap">Approved Network</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default BuilderNetwork;