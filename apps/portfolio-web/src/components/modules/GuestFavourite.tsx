'use client';

import React from 'react';

interface GuestFavouriteProps {
  rating?: number;
  reviews?: number;
}

export function GuestFavourite({
  rating = 4.78,
  reviews = 18,
}: GuestFavouriteProps) {
  return (
    <div className="w-full bg-slate-50/50 dark:bg-navy-deep/20 py-16 md:py-20 border-b border-border-subtle dark:border-outline-variant transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Rating Emblem Display */}
        <div className="text-center mb-10 flex flex-col items-center">
          
          {/* Laurel Wreaths surrounding Rating */}
          <div className="flex justify-center items-center gap-3 sm:gap-6 mb-4">
            
            {/* Left Golden Laurel */}
            <svg className="w-12 h-20 md:w-20 md:h-28 transform scale-x-[-1] drop-shadow-sm" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE885" />
                  <stop offset="40%" stopColor="#F5B800" />
                  <stop offset="70%" stopColor="#E09E00" />
                  <stop offset="100%" stopColor="#B37D00" />
                </linearGradient>
              </defs>
              <path d="M30 70 C15 55 12 30 25 10" stroke="url(#gold-grad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M25 10 C20 4 17 12 24 15 C26 13 26 11 25 10 Z" fill="url(#gold-grad)" />
              <path d="M22 20 C13 17 10 24 17 27 C20 25 22 22 22 20 Z" fill="url(#gold-grad)" />
              <path d="M20 32 C10 30 6 38 14 40 C17 38 19 34 20 32 Z" fill="url(#gold-grad)" />
              <path d="M19 45 C8 44 4 52 12 54 C15 52 17 48 19 45 Z" fill="url(#gold-grad)" />
              <path d="M20 58 C9 58 5 66 13 67 C16 65 18 61 20 58 Z" fill="url(#gold-grad)" />
              <path d="M24 16 C30 12 34 19 28 22 C26 20 25 17 24 16 Z" fill="url(#gold-grad)" />
              <path d="M22 27 C29 24 33 31 27 34 C25 32 24 29 22 27 Z" fill="url(#gold-grad)" />
              <path d="M20 39 C28 37 31 44 25 47 C23 45 21 42 20 39 Z" fill="url(#gold-grad)" />
              <path d="M20 51 C28 50 30 57 24 59 C22 57 21 53 20 51 Z" fill="url(#gold-grad)" />
            </svg>

            {/* Huge Rating Number */}
            <div className="flex flex-col items-center">
              <span className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-none select-none">
                {rating}
              </span>
            </div>

            {/* Right Golden Laurel */}
            <svg className="w-12 h-20 md:w-20 md:h-28 drop-shadow-sm" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 70 C15 55 12 30 25 10" stroke="url(#gold-grad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M25 10 C20 4 17 12 24 15 C26 13 26 11 25 10 Z" fill="url(#gold-grad)" />
              <path d="M22 20 C13 17 10 24 17 27 C20 25 22 22 22 20 Z" fill="url(#gold-grad)" />
              <path d="M20 32 C10 30 6 38 14 40 C17 38 19 34 20 32 Z" fill="url(#gold-grad)" />
              <path d="M19 45 C8 44 4 52 12 54 C15 52 17 48 19 45 Z" fill="url(#gold-grad)" />
              <path d="M20 58 C9 58 5 66 13 67 C16 65 18 61 20 58 Z" fill="url(#gold-grad)" />
              <path d="M24 16 C30 12 34 19 28 22 C26 20 25 17 24 16 Z" fill="url(#gold-grad)" />
              <path d="M22 27 C29 24 33 31 27 34 C25 32 24 29 22 27 Z" fill="url(#gold-grad)" />
              <path d="M20 39 C28 37 31 44 25 47 C23 45 21 42 20 39 Z" fill="url(#gold-grad)" />
              <path d="M20 51 C28 50 30 57 24 59 C22 57 21 53 20 51 Z" fill="url(#gold-grad)" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
            Guest favourite
          </h2>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 mb-2 max-w-xl mx-auto leading-relaxed">
            This home is in the <strong className="font-bold text-slate-800 dark:text-white">top 10%</strong> of eligible listings based on ratings, reviews and reliability
          </p>

          <a href="#reviews" className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 text-xs font-bold underline transition-colors">
            How reviews work
          </a>
        </div>

        {/* Detailed Ratings Row / Columns (Scrollable on small screens, Grid on large) */}
        <div className="w-full mt-14 overflow-x-auto hide-scrollbar border-t border-slate-200 dark:border-white/10 pt-8">
          <div className="flex min-w-[980px] lg:min-w-0 lg:grid lg:grid-cols-7 text-left">
            
            {/* Column 1: Overall rating */}
            <div className="flex-1 pr-6 flex flex-col justify-between h-[110px]">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Overall rating</span>
                <div className="flex flex-col gap-[3px] w-[110px]">
                  {/* 5 Star bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 w-2">5</span>
                    <div className="h-[4px] flex-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 dark:bg-white rounded-full w-[90%]" />
                    </div>
                  </div>
                  {/* 4 Star bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 w-2">4</span>
                    <div className="h-[4px] flex-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 dark:bg-white rounded-full w-[8%]" />
                    </div>
                  </div>
                  {/* 3 Star bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 w-2">3</span>
                    <div className="h-[4px] flex-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 dark:bg-white rounded-full w-[1.5%]" />
                    </div>
                  </div>
                  {/* 2 Star bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 w-2">2</span>
                    <div className="h-[4px] flex-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 dark:bg-white rounded-full w-[0.5%]" />
                    </div>
                  </div>
                  {/* 1 Star bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 w-2">1</span>
                    <div className="h-[4px] flex-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 dark:bg-white rounded-full w-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator Line */}
            <div className="w-[1px] bg-slate-200 dark:bg-white/10 self-stretch my-1 mx-4 lg:hidden" />

            {/* Column 2: Cleanliness */}
            <div className="flex-1 px-6 lg:border-l lg:border-slate-200 lg:dark:border-white/10 flex flex-col justify-between h-[110px]">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Cleanliness</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">4.9</span>
              </div>
              <svg className="w-6 h-6 text-slate-800 dark:text-white opacity-85" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3M3 12h18M3 12a9 9 0 009 9c1.782 0 3.473-.52 4.9-1.417" />
              </svg>
            </div>

            {/* Separator Line */}
            <div className="w-[1px] bg-slate-200 dark:bg-white/10 self-stretch my-1 mx-4 lg:hidden" />

            {/* Column 3: Accuracy */}
            <div className="flex-1 px-6 lg:border-l lg:border-slate-200 lg:dark:border-white/10 flex flex-col justify-between h-[110px]">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Accuracy</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">4.8</span>
              </div>
              <svg className="w-6 h-6 text-slate-800 dark:text-white opacity-85" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Separator Line */}
            <div className="w-[1px] bg-slate-200 dark:bg-white/10 self-stretch my-1 mx-4 lg:hidden" />

            {/* Column 4: Check-in */}
            <div className="flex-1 px-6 lg:border-l lg:border-slate-200 lg:dark:border-white/10 flex flex-col justify-between h-[110px]">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Check-in</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">4.9</span>
              </div>
              <svg className="w-6 h-6 text-slate-800 dark:text-white opacity-85" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-2 2a2 2 0 002-2m0 0a2 2 0 012 2m0 0a2 2 0 01-2 2m0-2H3m18 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Separator Line */}
            <div className="w-[1px] bg-slate-200 dark:bg-white/10 self-stretch my-1 mx-4 lg:hidden" />

            {/* Column 5: Communication */}
            <div className="flex-1 px-6 lg:border-l lg:border-slate-200 lg:dark:border-white/10 flex flex-col justify-between h-[110px]">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Communication</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">4.9</span>
              </div>
              <svg className="w-6 h-6 text-slate-800 dark:text-white opacity-85" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>

            {/* Separator Line */}
            <div className="w-[1px] bg-slate-200 dark:bg-white/10 self-stretch my-1 mx-4 lg:hidden" />

            {/* Column 6: Location */}
            <div className="flex-1 px-6 lg:border-l lg:border-slate-200 lg:dark:border-white/10 flex flex-col justify-between h-[110px]">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Location</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">4.7</span>
              </div>
              <svg className="w-6 h-6 text-slate-800 dark:text-white opacity-85" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>

            {/* Separator Line */}
            <div className="w-[1px] bg-slate-200 dark:bg-white/10 self-stretch my-1 mx-4 lg:hidden" />

            {/* Column 7: Value */}
            <div className="flex-1 pl-6 lg:border-l lg:border-slate-200 lg:dark:border-white/10 flex flex-col justify-between h-[110px]">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Value</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">4.8</span>
              </div>
              <svg className="w-6 h-6 text-slate-800 dark:text-white opacity-85" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
