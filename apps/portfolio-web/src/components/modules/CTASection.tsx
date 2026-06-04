'use client';

import { Calendar, Phone } from 'lucide-react';

interface CTASectionProps {
  onScheduleVisitClick?: () => void;
  onRequestCallbackClick?: () => void;
}

export function CTASection({
  onScheduleVisitClick,
  onRequestCallbackClick,
}: CTASectionProps) {
  const handleScheduleClick = () => {
    if (onScheduleVisitClick) {
      onScheduleVisitClick();
    } else {
      const el = document.getElementById('floorplans');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCallbackClick = () => {
    if (onRequestCallbackClick) {
      onRequestCallbackClick();
    } else {
      window.location.href = 'tel:9876543210';
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950/20 py-12 md:py-16 border-t border-gray-150 dark:border-white/5 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-xl space-y-6 md:space-y-8 relative overflow-hidden transition-colors">
          {/* Subtle background graphics */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-600/5 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Book Your Physical Tour
            </h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Schedule a physical visit or request a call from our co-living operations manager immediately.
            </p>
          </div>

          {/* Vacancy Urgency Badge */}
          <div className="inline-block bg-[#d1fae5] dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-wider text-[11px] px-5 py-2.5 rounded-lg select-none">
            ONLY 2 ROOM VACANCIES REMAINING THIS WEEK
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 max-w-lg mx-auto">
            {/* SCHEDULE VISIT Button */}
            <button
              onClick={handleScheduleClick}
              className="w-full sm:w-1/2 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-none uppercase text-xs tracking-wider"
            >
              <Calendar size={16} />
              Schedule Visit
            </button>

            {/* REQUEST CALLBACK Button */}
            <button
              onClick={handleCallbackClick}
              className="w-full sm:w-1/2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-250 border border-slate-350 dark:border-slate-700 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider shadow-sm"
            >
              <Phone size={16} />
              Request Callback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
