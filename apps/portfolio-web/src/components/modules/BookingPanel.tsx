'use client';

import { Star, MapPin, Users, Wifi, Shield, Droplet, Heart, Share2 } from 'lucide-react';
import { useState } from 'react';

interface BookingPanelProps {
  price: string;
  rating: number;
  reviews: number;
  onReserve?: () => void;
}

export function BookingPanel({
  price = '₹15,000',
  rating = 4.8,
  reviews = 150,
  onReserve,
}: BookingPanelProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [guests, setGuests] = useState(1);

  return (
    <div className="sticky top-24 bg-white rounded-xl border border-gray-200 shadow-lg p-6 md:p-8">
      {/* Price and Rating */}
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            {price}
            <span className="text-lg font-normal text-gray-600 ml-2">per month</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star size={18} className="fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-900">{rating}</span>
          <span className="text-gray-600 text-sm">({reviews})</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-6" />

      {/* Move-in Date */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Move-in Date
        </label>
        <input
          type="date"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
        />
      </div>

      {/* Guests */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Number of Guests
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
      </div>

      {/* Features */}
      <div className="mb-6 space-y-3 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <Wifi size={18} className="text-teal-600" />
          <span>Gigabit WiFi</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Shield size={18} className="text-teal-600" />
          <span>24/7 Security</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Droplet size={18} className="text-teal-600" />
          <span>RO Water</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-6" />

      {/* Reserve Button */}
      <button
        onClick={onReserve}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg mb-3"
      >
        Reserve Now
      </button>

      {/* Secondary Action */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all"
        >
          <Heart
            size={20}
            className={isLiked ? 'fill-teal-600 text-teal-600' : 'text-gray-600'}
          />
          <span className="text-sm font-medium text-gray-700">Save</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all">
          <Share2 size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Share</span>
        </button>
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-500 text-center mt-4">
        You won't be charged yet
      </p>
    </div>
  );
}
