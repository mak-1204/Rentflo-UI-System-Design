'use client';

interface PriceAvailabilityBannerProps {
  startingPrice?: string;
  vacantRooms?: number;
  totalRooms?: number;
}

export function PriceAvailabilityBanner({
  startingPrice = '₹6,500',
  vacantRooms = 2,
  totalRooms = 12,
}: PriceAvailabilityBannerProps) {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-t border-teal-200/60 py-4 fixed bottom-0 left-0 right-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Price Info */}
          <div>
            <p className="text-[10px] text-teal-600 font-extrabold uppercase tracking-wider mb-0.5">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl md:text-3xl font-black text-teal-600">{startingPrice}</span>
              <span className="text-xs text-gray-500">/mo</span>
            </div>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              {vacantRooms} ROOMS VACANT ON FLOOR
            </p>
          </div>

          {/* Right: CTAs */}
          <div className="flex gap-2">
            <a href="tel:9876543210" className="px-4 py-2.5 border border-teal-600 text-teal-600 font-bold rounded-lg hover:bg-teal-50 text-xs transition-all cursor-pointer inline-flex items-center justify-center">
              📞 Call PG Owner
            </a>
            <a href="#floorplans" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-all shadow-md cursor-pointer inline-flex items-center justify-center">
              🎯 BOOK VISIT
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
