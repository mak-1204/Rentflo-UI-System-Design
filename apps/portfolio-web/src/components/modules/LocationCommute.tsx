'use client';

import { useState, useEffect } from 'react';
import { MapPin, Bike, Train, User } from 'lucide-react';

interface LocationCommuteProps {
  location?: string;
  walkTime?: string;
  bikeTime?: string;
  transitTime?: string;
  transitType?: string;
}

export function LocationCommute({
  location = 'No. 14, 5th Cross, Koramangala 4th Block, Bengaluru, 560034',
  walkTime = '5 mins',
  bikeTime = '2 mins',
  transitTime = '300m away',
  transitType = 'Metro or major bus stop link',
}: LocationCommuteProps) {
  const [mapCoords, setMapCoords] = useState({ lat: 12.9345, lng: 77.6269 });
  const [commuteWalkTime, setCommuteWalkTime] = useState(walkTime);
  const [commuteBikeTime, setCommuteBikeTime] = useState(bikeTime);
  const [commuteTransitTime, setCommuteTransitTime] = useState(transitTime);
  const [commuteDestination, setCommuteDestination] = useState('Manyata Tech Park');

  const loadMapState = () => {
    const saved = localStorage.getItem('stayflo_builder_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.mapCoords) setMapCoords(parsed.mapCoords);
        if (parsed.commuteWalkTime) setCommuteWalkTime(parsed.commuteWalkTime);
        if (parsed.commuteBikeTime) setCommuteBikeTime(parsed.commuteBikeTime);
        if (parsed.commuteTransitTime) setCommuteTransitTime(parsed.commuteTransitTime);
        if (parsed.commuteDestination) setCommuteDestination(parsed.commuteDestination);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadMapState();
    if (typeof window !== 'undefined') {
      window.addEventListener('stayflo_website_update', loadMapState);
      return () => window.removeEventListener('stayflo_website_update', loadMapState);
    }
  }, []);

  return (
    <div className="w-full bg-white dark:bg-slate-900 py-12 md:py-16 border-b border-gray-100 dark:border-white/5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Location & Commute Optimizer
        </h2>
        <p className="text-lg text-gray-600 dark:text-slate-400 mb-8">
          Check proximity to your office and transit networks
        </p>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Left: Commute Info Cards */}
          <div className="md:col-span-2 space-y-4">
            {/* Walk Proximity */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 rounded-2xl p-6 border border-blue-200 dark:border-blue-900/30">
              <div className="flex items-start gap-4">
                <div className="bg-blue-200 dark:bg-blue-900/40 p-3 rounded-lg">
                  <User size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">WALK PROXIMITY</h3>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{commuteWalkTime}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">away from your office ({commuteDestination})</p>
                </div>
              </div>
            </div>

            {/* Bike/Auto Commute */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10 rounded-2xl p-6 border border-orange-200 dark:border-orange-900/30">
              <div className="flex items-start gap-4">
                <div className="bg-orange-200 dark:bg-orange-900/40 p-3 rounded-lg">
                  <Bike size={24} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xs font-extrabold text-orange-600 dark:text-orange-400 mb-1 uppercase tracking-wider">BIKE / AUTO COMMUTE</h3>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{commuteBikeTime}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">Quick door-to-office transit</p>
                </div>
              </div>
            </div>

            {/* Nearest Transit */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/10 rounded-2xl p-6 border border-purple-200 dark:border-purple-900/30">
              <div className="flex items-start gap-4">
                <div className="bg-purple-200 dark:bg-purple-900/40 p-3 rounded-lg">
                  <Train size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xs font-extrabold text-purple-600 dark:text-purple-400 mb-1 uppercase tracking-wider">NEAREST TRANSIT</h3>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{commuteTransitTime}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">{transitType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div className="md:col-span-3">
            <div className="w-full h-80 md:h-[450px] rounded-2xl overflow-hidden border border-gray-300 dark:border-white/10 relative shadow-md">
              <iframe
                title="Google Map location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=15&output=embed`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
