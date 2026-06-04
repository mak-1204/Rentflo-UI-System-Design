'use client';

import { Phone, Star } from 'lucide-react';

interface HeaderProps {
  pgName?: string;
  rating?: number;
  onGetStartedClick?: () => void;
  onScheduleVisitClick?: () => void;
  onCallClick?: () => void;
}

export function Header({
  pgName = 'Sunrise PG',
  rating = 4.8,
  onGetStartedClick,
  onScheduleVisitClick,
  onCallClick,
}: HeaderProps) {
  const handleCallClick = () => {
    if (onCallClick) {
      onCallClick();
    } else {
      window.location.href = 'tel:9876543210';
    }
  };

  const handleScheduleClick = onScheduleVisitClick || onGetStartedClick;

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white shadow-sm z-40 border-b border-gray-100 h-16 md:h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex items-center justify-between">
          {/* Left: Logo & PG Name + Badges */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-[#14b8a6] rounded-full flex items-center justify-center text-white font-black text-sm select-none">
                R
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-900 select-none">
                {pgName}
              </span>
            </div>

            {/* Badges - Hidden on mobile, visible on tablet/desktop */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Powered by Stayflo */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-[10px] text-slate-500 font-semibold select-none">
                <span>Powered by</span>
                <span className="text-[#14b8a6] flex items-center gap-0.5 font-bold">
                  <span className="w-3.5 h-3.5 rounded bg-[#14b8a6] text-white flex items-center justify-center text-[8px] font-black">
                    R
                  </span>
                  Stayflo.
                </span>
              </div>

              {/* Resident Rated */}
              <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-[10px] text-emerald-700 font-bold select-none">
                <Star size={12} className="fill-emerald-500 text-emerald-550" />
                <span>{rating.toFixed(1)} Resident Rated</span>
              </div>
            </div>
          </div>

          {/* Right: Conversion Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Phone Call Icon Button */}
            <button
              onClick={handleCallClick}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-teal-600 text-teal-600 flex items-center justify-center hover:bg-teal-50 transition-all cursor-pointer shadow-sm"
              title="Call PG Owner"
              aria-label="Call PG Owner"
            >
              <Phone size={16} className="md:w-[18px] md:h-[18px]" />
            </button>

            {/* SCHEDULE VISIT CTA Button */}
            <button
              onClick={handleScheduleClick}
              className="px-3.5 py-2 md:px-5 md:py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-[10px] md:text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
            >
              Schedule Visit
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

