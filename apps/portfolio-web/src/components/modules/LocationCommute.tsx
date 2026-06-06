'use client';

import { useState, useEffect, useRef } from 'react';
import logoImg from '../../../logo.png';

interface LocationCommuteProps {
  location?: string;
  walkTime?: string;
  bikeTime?: string;
  transitTime?: string;
  transitType?: string;
}

export function LocationCommute({
  location = 'Sunrise PG, Bengaluru',
  walkTime = '-- mins',
  bikeTime = '-- mins',
  transitTime = '-- KM',
  transitType = '-- Mins',
}: LocationCommuteProps) {
  // Base location of the PG (e.g. Koramangala coords)
  const [mapCoords, setMapCoords] = useState({ lat: 12.9345, lng: 77.6269 });
  const [commuteWalkTime, setCommuteWalkTime] = useState(walkTime);
  const [commuteBikeTime, setCommuteBikeTime] = useState(bikeTime);
  const [commuteTransitTime, setCommuteTransitTime] = useState(transitType);
  const [commuteDistance, setCommuteDistance] = useState(transitTime);
  const [commuteDestination, setCommuteDestination] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<any>(null);

  const loadMapState = () => {
    const saved = localStorage.getItem('stayflo_builder_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.mapCoords) setMapCoords(parsed.mapCoords);
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

  const fetchMapSuggestions = async (searchText: string) => {
    if (!searchText.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(searchText)}&lat=${mapCoords.lat}&lon=${mapCoords.lng}&limit=5`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.features) {
        setSuggestions(data.features);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching Photon locations:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommuteDestination(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      fetchMapSuggestions(value);
    }, 450);
  };

  const handleSelectPlace = async (feature: any) => {
    const props = feature.properties;
    const name = props.name || '';
    const street = props.street ? `, ${props.street}` : '';
    const city = props.city ? `, ${props.city}` : '';
    const fullAddress = `${name}${street}${city}`;

    setCommuteDestination(fullAddress);
    setShowDropdown(false);
    setLoading(true);

    const [destLon, destLat] = feature.geometry.coordinates;

    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${mapCoords.lng},${mapCoords.lat};${destLon},${destLat}?overview=false`;
      const res = await fetch(osrmUrl);
      const routeData = await res.json();

      if (routeData.code === 'Ok' && routeData.routes.length > 0) {
        const primaryRoute = routeData.routes[0];
        const rawDistanceMeters = primaryRoute.distance;
        const rawDurationSeconds = primaryRoute.duration;

        const distanceKm = (rawDistanceMeters / 1000).toFixed(1);
        const baseDriveMinutes = Math.round(rawDurationSeconds / 60);

        setCommuteDistance(`${distanceKm} KM`);
        setCommuteBikeTime(`${Math.round(baseDriveMinutes * 0.85) || 1} mins`);
        setCommuteTransitTime(`${Math.round(baseDriveMinutes * 1.4)} mins`);
        setCommuteWalkTime(Number(distanceKm) > 6 ? 'Long walk' : `${Math.round(Number(distanceKm) * 12)} mins`);
      } else {
        console.warn('Could not calculate OSRM route.');
      }
    } catch (error) {
      console.error('OSRM route matrix query failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-surface-container-low dark:bg-navy-deep/40 rounded-3xl p-4 sm:p-8 md:p-12 border border-border-subtle dark:border-outline-variant shadow-sm transition-colors duration-200">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center text-left">
        {/* Left: Input & Details */}
        <div className="flex-1 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-stayflow-teal/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-stayflow-teal">directions_car</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy-deep dark:text-white">
                Commute Optimizer
              </h2>
            </div>
            <div className="flex items-center gap-1 opacity-70">
              <span className="text-[10px] font-bold text-slate-400 normal-case tracking-widest">by</span>
              <img src={logoImg.src} alt="stayfloww" className="h-3.5 w-auto object-contain dark:brightness-0 dark:invert" />
            </div>
          </div>
          <p className="text-base text-on-surface-variant dark:text-outline-variant">
            Check exactly how far we are from your workspace or college.
          </p>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-on-surface-variant dark:text-outline-variant mb-3 block uppercase tracking-widest">
                Your Destination Location
              </label>
              <div className="relative">
                <input 
                  ref={inputRef}
                  value={commuteDestination}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline dark:border-outline-variant focus:border-stayflow-teal focus:ring-1 focus:ring-stayflow-teal bg-surface-container-lowest dark:bg-navy-deep/80 outline-none transition-all text-base dark:text-white shadow-sm" 
                  placeholder="Enter your college, office or location..." 
                  type="text"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant">search</span>

                {showDropdown && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-navy-deep border border-outline dark:border-outline-variant rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto">
                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 border-b border-outline-variant bg-surface-container dark:bg-navy-deep uppercase tracking-wider flex justify-between">
                      <span>Suggestions</span>
                      <button type="button" onClick={() => setShowDropdown(false)} className="text-slate-400 hover:text-slate-650">✕</button>
                    </div>
                    <ul>
                      {suggestions.map((feature, index) => {
                        const p = feature.properties;
                        return (
                          <li
                            key={index}
                            onClick={() => handleSelectPlace(feature)}
                            className="px-5 py-3 hover:bg-stayflow-teal/10 dark:hover:bg-stayflow-teal/20 cursor-pointer text-sm text-slate-700 dark:text-slate-350 font-medium transition duration-150 border-b border-border-subtle dark:border-outline-variant last:border-0 overflow-hidden text-ellipsis whitespace-nowrap flex flex-col items-start gap-0.5"
                          >
                            <span className="font-bold text-slate-800 dark:text-white">{p.name}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {p.street ? `${p.street}, ` : ''}{p.city ? p.city : ''}{p.state ? `, ${p.state}` : ''}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="px-4 py-2 text-right text-[10px] font-semibold text-slate-400 bg-surface-container dark:bg-navy-deep/60 rounded-b-2xl">
                      Powered by Photon
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-navy-deep p-6 rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm transition-colors flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-on-surface-variant dark:text-outline-variant uppercase font-bold tracking-wider mb-1">
                    {loading ? 'Calculating...' : 'Distance from PG'}
                  </p>
                  <p className={`text-3xl font-black text-stayflow-teal ${loading ? 'animate-pulse' : ''}`}>
                    {commuteDistance}
                  </p>
                </div>
                <div className="w-10 h-10 bg-stayflow-teal/10 rounded-full flex items-center justify-center text-stayflow-teal">
                  <span className="material-symbols-outlined">map</span>
                </div>
              </div>

              <div className={`grid grid-cols-3 gap-2 sm:gap-4 ${loading ? 'opacity-50 animate-pulse' : ''}`}>
                {/* Walk */}
                <div className="bg-white dark:bg-navy-deep p-2.5 sm:p-4 rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm transition-colors text-center flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-base sm:text-lg">directions_walk</span>
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[9px] text-on-surface-variant dark:text-outline-variant uppercase font-bold tracking-wider">Walk</p>
                    <p className="text-xs sm:text-sm font-extrabold text-navy-deep dark:text-white mt-0.5">{commuteWalkTime}</p>
                  </div>
                </div>

                {/* Bike/Car */}
                <div className="bg-white dark:bg-navy-deep p-2.5 sm:p-4 rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm transition-colors text-center flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-base sm:text-lg">directions_bike</span>
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[9px] text-on-surface-variant dark:text-outline-variant uppercase font-bold tracking-wider">Bike / Car</p>
                    <p className="text-xs sm:text-sm font-extrabold text-navy-deep dark:text-white mt-0.5">{commuteBikeTime}</p>
                  </div>
                </div>

                {/* Public Transit */}
                <div className="bg-white dark:bg-navy-deep p-2.5 sm:p-4 rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm transition-colors text-center flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-base sm:text-lg">directions_bus</span>
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[9px] text-on-surface-variant dark:text-outline-variant uppercase font-bold tracking-wider">Transit</p>
                    <p className="text-xs sm:text-sm font-extrabold text-navy-deep dark:text-white mt-0.5">{commuteTransitTime}</p>
                  </div>
                </div>
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

