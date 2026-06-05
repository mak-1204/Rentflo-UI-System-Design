'use client';

import { Star } from 'lucide-react';

interface GuestFavouriteProps {
  rating?: number;
  reviews?: number;
  description?: string;
}

export function GuestFavourite({
  rating = 4.78,
  reviews = 18,
  description = 'One of the most loved homes on our platform, according to guests',
}: GuestFavouriteProps) {
  return (
    <div className="w-full bg-surface dark:bg-navy-deep py-12 md:py-16 border-b border-border-subtle dark:border-outline-variant transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 md:px-6">
        {/* Main Rating Display */}
        <div className="text-center mb-12">
          <div className="mb-6">
            {/* Decorative Elements */}
            <div className="flex justify-center gap-4 items-center mb-4">
              <div className="text-4xl">🏆</div>
              <div className="text-5xl md:text-7xl font-black text-navy-deep dark:text-white">{rating}</div>
              <div className="text-4xl">🏆</div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-navy-deep dark:text-white mb-3">
            Guest favourite
          </h2>
          <p className="text-lg text-on-surface-variant dark:text-outline-variant mb-6 max-w-2xl mx-auto">
            This home is a guest favourite based on ratings, reviews and reliability
          </p>

          <button className="text-stayflow-teal hover:text-stayflow-teal font-semibold underline transition-colors cursor-pointer bg-transparent border-none">
            Show full ratings
          </button>
        </div>

        {/* Review Card */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-navy-deep border-2 border-border-subtle dark:border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-stayflow-teal/80 to-stayflow-teal rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-inner">
              🏆
            </div>

            {/* Content */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-navy-deep dark:text-white">Guest favourite</h3>
                  <p className="text-sm text-on-surface-variant dark:text-outline-variant mt-1">{description}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 bg-surface-container-low dark:bg-navy-deep-variant px-3 py-1.5 rounded-full">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="font-bold text-navy-deep dark:text-white text-sm">{reviews}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-12 pt-12 border-t border-border-subtle dark:border-outline-variant">
          <div className="text-center">
            <p className="text-2xl sm:text-4xl font-black text-stayflow-teal mb-1 sm:mb-2">{reviews}+</p>
            <p className="text-xs sm:text-base text-on-surface-variant dark:text-outline-variant font-medium">Verified Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-4xl font-black text-stayflow-teal mb-1 sm:mb-2">500+</p>
            <p className="text-xs sm:text-base text-on-surface-variant dark:text-outline-variant font-medium">Happy Residents</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-4xl font-black text-stayflow-teal mb-1 sm:mb-2">98%</p>
            <p className="text-xs sm:text-base text-on-surface-variant dark:text-outline-variant font-medium">Renewal Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
