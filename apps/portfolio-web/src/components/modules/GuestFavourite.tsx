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
    <div className="w-full bg-white py-12 md:py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Main Rating Display */}
        <div className="text-center mb-12">
          <div className="mb-6">
            {/* Decorative Elements */}
            <div className="flex justify-center gap-4 items-center mb-4">
              <div className="text-4xl">🏆</div>
              <div className="text-5xl md:text-7xl font-black text-gray-900">{rating}</div>
              <div className="text-4xl">🏆</div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Guest favourite
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            This home is a guest favourite based on ratings, reviews and reliability
          </p>

          <button className="text-teal-600 hover:text-teal-700 font-semibold underline transition-colors">
            Show full ratings
          </button>
        </div>

        {/* Review Card */}
        <div className="max-w-2xl mx-auto bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              🏆
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">Guest favourite</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">{reviews}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200">
          <div className="text-center">
            <p className="text-4xl font-black text-teal-600 mb-2">{reviews}+</p>
            <p className="text-gray-600">Verified Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-teal-600 mb-2">500+</p>
            <p className="text-gray-600">Happy Residents</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-teal-600 mb-2">98%</p>
            <p className="text-gray-600">Renewal Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
