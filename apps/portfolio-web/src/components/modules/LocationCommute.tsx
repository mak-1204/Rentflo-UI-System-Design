'use client';

import { useState, useEffect } from 'react';

interface LocationCommuteProps {
  location?: string;
  walkTime?: string;
  bikeTime?: string;
  transitTime?: string;
  transitType?: string;
}

export function LocationCommute({
  location = 'Prestige Tech Park, Sector 45, Bengaluru',
  walkTime = '8 mins',
  bikeTime = '3 mins',
  transitTime = '1.2 KM',
  transitType = '8 Mins',
}: LocationCommuteProps) {
  const [mapCoords, setMapCoords] = useState({ lat: 12.9345, lng: 77.6269 });
  const [commuteWalkTime, setCommuteWalkTime] = useState(walkTime);
  const [commuteBikeTime, setCommuteBikeTime] = useState(bikeTime);
  const [commuteTransitTime, setCommuteTransitTime] = useState(transitTime);
  const [commuteDestination, setCommuteDestination] = useState('Prestige Tech Park');

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
    <section className="bg-surface-container-low dark:bg-navy-deep/40 rounded-3xl p-8 sm:p-12 border border-border-subtle dark:border-outline-variant shadow-sm transition-colors duration-200">
      <div className="flex flex-col lg:flex-row gap-12 items-center text-left">
        {/* Left: Input & Details */}
        <div className="flex-1 space-y-6 w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-stayflow-teal/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-stayflow-teal">directions_car</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-deep dark:text-white">
              Commute Optimizer
            </h2>
          </div>
          <p className="text-base text-on-surface-variant dark:text-outline-variant">
            Check how far we are from your workspace.
          </p>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-on-surface-variant dark:text-outline-variant mb-3 block uppercase tracking-widest">
                Your Office Location
              </label>
              <div className="relative">
                <input 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline dark:border-outline-variant focus:border-stayflow-teal focus:ring-1 focus:ring-stayflow-teal bg-surface-container-lowest dark:bg-navy-deep/80 outline-none transition-all text-base dark:text-white shadow-sm" 
                  placeholder="e.g. Google Signature Towers" 
                  type="text"
                  value={commuteDestination}
                  onChange={(e) => setCommuteDestination(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant">search</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-navy-deep p-6 rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm transition-colors">
                <p className="text-[10px] text-on-surface-variant dark:text-outline-variant uppercase font-bold tracking-wider mb-1">Estimated Distance</p>
                <p className="text-2xl font-black text-stayflow-teal">{commuteTransitTime}</p>
              </div>
              <div className="bg-white dark:bg-navy-deep p-6 rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm transition-colors">
                <p className="text-[10px] text-on-surface-variant dark:text-outline-variant uppercase font-bold tracking-wider mb-1">Travel Time</p>
                <p className="text-2xl font-black text-navy-deep dark:text-white">{commuteBikeTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Map Schematic Image / Embed */}
        <div className="w-full lg:w-[450px] h-80 rounded-2xl overflow-hidden border border-border-subtle dark:border-outline-variant shadow-md relative">
          <iframe
            title="Google Map Location Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=15&output=embed`}
            className="w-full h-full object-cover dark:opacity-85"
          />
        </div>
      </div>
    </section>
  );
}

