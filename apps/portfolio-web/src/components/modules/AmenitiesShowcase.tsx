'use client';

import { Wifi, Shield, Droplet, Zap, Utensils, Tv, Dumbbell, Wind, Lightbulb, Lock, Users, Navigation } from 'lucide-react';

interface AmenitiesShowcaseProps {
  amenities?: string[];
}

const AMENITY_ICONS: Record<string, any> = {
  'Gigabit WiFi': Wifi,
  'CCTV Security': Shield,
  'RO Drinking Water': Droplet,
  'Power Backup': Zap,
  'Healthy Meals': Utensils,
  'Smart TV': Tv,
  'Gym': Dumbbell,
  'AC': Wind,
  'Premium Lighting': Lightbulb,
  'Secure Lockers': Lock,
  'Common Area': Users,
  'Prime Location': Navigation,
};

export function AmenitiesShowcase({
  amenities = [
    'Gigabit WiFi',
    'CCTV Security',
    'RO Drinking Water',
    'Power Backup',
    'Healthy Meals',
    'Smart TV',
    'Gym',
    'AC',
    'Premium Lighting',
    'Secure Lockers',
    'Common Area',
    'Prime Location',
  ],
}: AmenitiesShowcaseProps) {
  return (
    <div className="w-full bg-white py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            What This Place Offers
          </h2>
          <p className="text-lg text-gray-600">
            Premium amenities and facilities to make your stay comfortable
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {amenities.map((amenity, index) => {
            const IconComponent = AMENITY_ICONS[amenity] || Navigation;
            return (
              <div
                key={index}
                className="group p-6 rounded-xl border-2 border-gray-100 hover:border-blue-500 transition-all hover:shadow-lg cursor-pointer hover:bg-blue-50"
              >
                <div className="mb-4 p-3 bg-blue-100 rounded-lg w-fit group-hover:bg-blue-200 transition-colors">
                  <IconComponent size={28} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                  {amenity}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Additional Info Box */}
        <div className="mt-12 p-6 md:p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">More About Our Facilities</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🏠 Living Spaces</h4>
              <p className="text-gray-600 text-sm">
                Spacious common areas with modern furniture, gaming zone, and recreational facilities for all residents.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🍽️ Food & Dining</h4>
              <p className="text-gray-600 text-sm">
                Hygienic home-cooked meals prepared daily, multiple menu options, and special dietary accommodations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🔒 Security & Safety</h4>
              <p className="text-gray-600 text-sm">
                24/7 CCTV surveillance, trained staff, secure entry system, and regular safety drills.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">👥 Community</h4>
              <p className="text-gray-600 text-sm">
                Regular events, festivals celebrations, sports activities, and networking opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
