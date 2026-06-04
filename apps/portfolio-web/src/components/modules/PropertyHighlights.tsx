'use client';

import { Users, DoorOpen, Bed, MapPin, Smartphone, Zap } from 'lucide-react';

interface PropertyHighlightsProps {
  rooms?: number;
  beds?: number;
  location?: string;
  occupancy?: number;
  priceRange?: string;
}

export function PropertyHighlights({
  rooms = 12,
  beds = 35,
  location = 'Koramangala, Bangalore',
  occupancy = 85,
  priceRange = '₹12,000 - ₹25,000',
}: PropertyHighlightsProps) {
  return (
    <div className="w-full bg-gradient-to-b from-teal-50 to-white py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Why Choose Us?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Highlight 1: Prime Location */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100">
            <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin size={24} className="text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Prime Location</h3>
            <p className="text-gray-600 mb-3">{location}</p>
            <p className="text-sm text-blue-600 font-medium">5 mins to metro • Near cafes & restaurants</p>
          </div>

          {/* Highlight 2: Spacious Rooms */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Bed size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Spacious Rooms</h3>
            <p className="text-gray-600 mb-3">{beds} beds across {rooms} rooms</p>
            <p className="text-sm text-green-600 font-medium">Well-ventilated • Modern furnishing</p>
          </div>

          {/* Highlight 3: Modern Amenities */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Modern Amenities</h3>
            <p className="text-gray-600 mb-3">Gigabit WiFi • 24/7 Power Backup</p>
            <p className="text-sm text-purple-600 font-medium">Air-conditioned • Fully furnished</p>
          </div>

          {/* Highlight 4: High Occupancy */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users size={24} className="text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{occupancy}% Occupancy</h3>
            <p className="text-gray-600 mb-3">Trusted by 500+ tenants</p>
            <p className="text-sm text-orange-600 font-medium">5-star average rating • Zero vacancy usually</p>
          </div>

          {/* Highlight 5: Easy Access */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Smartphone size={24} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Booking</h3>
            <p className="text-gray-600 mb-3">Simple online registration process</p>
            <p className="text-sm text-red-600 font-medium">Virtual tours available • Quick response</p>
          </div>

          {/* Highlight 6: Transparent Pricing */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100">
            <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <DoorOpen size={24} className="text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent Pricing</h3>
            <p className="text-gray-600 mb-3">{priceRange} per month</p>
            <p className="text-sm text-teal-600 font-medium">No hidden charges • Flexible tenures</p>
          </div>
        </div>
      </div>
    </div>
  );
}
