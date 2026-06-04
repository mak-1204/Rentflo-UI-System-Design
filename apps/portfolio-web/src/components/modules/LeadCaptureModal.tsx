'use client';

import { useState, useEffect } from 'react';
import { MapPin, User, Phone, Compass, X } from 'lucide-react';
import { Button } from '@stayflo/ui';

interface SuggestionItem {
  bold: string;
  normal: string;
}

export function LeadCaptureModal({ 
  onClose,
  isHardGate = false,
}: { 
  onClose?: () => void;
  isHardGate?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    type: 'Single',
  });
  const [addressSearch, setAddressSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedOfficeAddress, setSelectedOfficeAddress] = useState('');
  const [showPGMap, setShowPGMap] = useState(false);
  
  const pgName = 'Sunrise PG';
  const mapCoords = { lat: 12.9345, lng: 77.6269 };

  const mockSuggestions: SuggestionItem[] = [
    { bold: 'Periyar', normal: ' medu, Choolai, Chennai, Tamil Nadu, India' },
    { bold: 'Periyar', normal: 'palayam, Tamil Nadu, India' },
    { bold: 'Periyar', normal: ' met, Chennai, Tamil Nadu, India' },
    { bold: 'Periyar', normal: ' Nagar, Perambur, Chennai, Tamil Nadu, India' }
  ];

  const [dynamicSuggestions, setDynamicSuggestions] = useState<SuggestionItem[]>(mockSuggestions);

  useEffect(() => {
    if (!addressSearch) {
      setDynamicSuggestions(mockSuggestions);
      return;
    }
    if (addressSearch.length < 3) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch)}&limit=5`
        );
        const data = await response.json();
        if (data && Array.isArray(data)) {
          const formatted = data.map((item: any) => {
            const displayName = item.display_name;
            const commaIndex = displayName.indexOf(',');
            let bold = displayName;
            let normal = '';
            if (commaIndex !== -1) {
              bold = displayName.substring(0, commaIndex);
              normal = displayName.substring(commaIndex);
            }
            return { bold, normal };
          });
          setDynamicSuggestions(formatted);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [addressSearch]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('stayflo_lead_submitted', 'true');
    }
    
    try {
      await fetch('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pgId: 'prop-1',
          name: leadForm.name,
          phone: leadForm.phone,
          preferredSharing: leadForm.type === 'Single' ? 1 : leadForm.type === 'Double' ? 2 : leadForm.type === 'Quad' ? 4 : 3,
          source: 'portfolio-web',
          officeLocation: addressSearch
        })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={isHardGate 
        ? "fixed inset-0 bg-slate-950 z-50 flex items-center justify-center p-4 overflow-y-auto"
        : "fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      }
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Decorative glowing gradient elements - only for hard gate mode */}
      {isHardGate && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-550/10 rounded-full blur-[140px] pointer-events-none" />
        </>
      )}

      <div 
        className="relative max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl p-5 md:p-6 text-left space-y-3.5 max-h-[92vh] overflow-y-auto overscroll-contain transition-colors duration-200 z-10"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Close Button - Only visible in overlay mode */}
        {!isHardGate && (
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onClose?.();
            }}
            className="absolute top-4 right-4 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-300 transition-colors cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        )}
        
        {/* Header info */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Unlock Co-living Explore
            </h2>
            <span className="text-[10px] text-slate-450 dark:text-slate-550 font-bold flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 px-2.5 py-0.5 rounded-md transition-colors duration-200">
              by <span className="text-[#14b8a6] flex items-center gap-0.5 font-bold"><span className="w-3.5 h-3.5 rounded bg-[#14b8a6] text-white flex items-center justify-center text-[8.5px] font-black">S</span> Stayflo.</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Enter your details to view rooms blueprint and vacancies at {pgName}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
          {/* Name */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider block mb-1.5 text-slate-500 dark:text-slate-400">
              FULL NAME
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Akshay Kumar"
              value={leadForm.name}
              onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-[#f8fafc] dark:bg-slate-800 text-xs text-slate-800 dark:text-white font-semibold transition-colors duration-200 shadow-inner"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider block mb-1.5 text-slate-500 dark:text-slate-400">
              PHONE NUMBER
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 font-bold transition-colors shadow-inner">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="98765 43210"
                value={leadForm.phone}
                onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-r-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-[#f8fafc] dark:bg-slate-800 text-xs text-slate-800 dark:text-white font-semibold transition-colors duration-200 shadow-inner"
              />
            </div>
          </div>

          {/* Look for sharing */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider block mb-1.5 text-slate-500 dark:text-slate-400">
              LOOKING FOR SHARING?
            </label>
            <select
              value={leadForm.type}
              onChange={(e) => setLeadForm({ ...leadForm, type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-[#f8fafc] dark:bg-slate-800 text-xs text-slate-800 dark:text-white font-semibold cursor-pointer transition-colors duration-200 shadow-inner"
            >
              <option value="Single">Single Occupancy</option>
              <option value="Double">Double Sharing</option>
              <option value="Triple">Triple Sharing</option>
              <option value="Quad">Quad Sharing (4 Sharing)</option>
            </select>
          </div>

          {/* Autocomplete Office Search */}
          <div className="relative pt-2">
            <div className="relative border-2 border-blue-500 rounded-xl bg-white dark:bg-slate-900 px-4 py-2.5 transition-colors duration-200 shadow-sm">
              <span className="absolute -top-2 left-3 bg-white dark:bg-slate-900 px-1.5 text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-wide">
                Your Office Location
              </span>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  required
                  placeholder="Type office address..."
                  value={addressSearch}
                  onChange={(e) => {
                    setAddressSearch(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  className="w-full bg-transparent focus:outline-none text-xs text-slate-800 dark:text-white font-semibold pr-6"
                />
                <span className="absolute right-3 text-blue-500 dark:text-blue-450">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
            </div>
            
            {showSuggestions && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-xl z-50 overflow-hidden text-slate-800 dark:text-white transition-colors duration-200 rounded-xl">
                <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900 text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  <span>SUGGESTIONS</span>
                  <button type="button" onClick={() => setShowSuggestions(false)} className="text-slate-400 dark:text-slate-555 hover:text-slate-600 dark:hover:text-slate-350">✕</button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                  {dynamicSuggestions.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        setAddressSearch(item.bold + item.normal);
                        setShowSuggestions(false);
                        setSelectedOfficeAddress(item.bold + item.normal);
                      }}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/60 px-4 py-2.5 text-left transition-colors"
                    >
                      <strong className="text-slate-800 dark:text-white font-bold">{item.bold}</strong>
                      <span className="text-slate-550 dark:text-slate-400 font-normal">{item.normal}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-start text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                  <span>powered by OpenStreetMap</span>
                </div>
              </div>
            )}
          </div>

          {/* Option to look the PG location in maps */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowPGMap(!showPGMap)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#e6fbf7] hover:bg-[#d1f9f0] dark:bg-teal-950/20 dark:hover:bg-teal-900/30 border border-teal-200/50 dark:border-teal-800/30 rounded-xl text-xs font-bold text-[#14b8a6] dark:text-teal-400 transition-all cursor-pointer shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5" />
              {showPGMap ? 'Close PG Map View' : 'View PG Locations in Google Maps'}
            </button>
            
            {showPGMap && (
              <div className="mt-2.5 h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner transition-all">
                <iframe
                  title="Google Map PG location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=15&output=embed`}
                />
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-12 mt-4 text-xs font-bold uppercase tracking-wider hover:opacity-95 active:scale-98 transition-all rounded-xl shadow-md border-none shadow-teal-500/10 cursor-pointer text-white flex items-center justify-center" 
            style={{ background: '#14b8a6' }}
          >
            {isSubmitting ? 'Unlocking Explore...' : 'EXPLORE PROPERTIES NOW →'}
          </Button>
        </form>
      </div>
    </div>
  );
}
