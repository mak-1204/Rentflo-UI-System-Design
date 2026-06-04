'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import logoImg from '../../../logo.png';

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
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    roomPreference: 'Single Occupancy',
    officeLocation: '',
  });

  // Address autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mockSuggestions: SuggestionItem[] = [
    { bold: 'Manyata Tech Park', normal: ', Outer Ring Road, Bangalore, Karnataka' },
    { bold: 'Koramangala', normal: ', Bangalore, Karnataka, India' },
    { bold: 'Whitefield', normal: ', Bangalore, Karnataka, India' },
    { bold: 'Electronic City', normal: ', Bangalore, Karnataka, India' },
  ];
  const [dynamicSuggestions, setDynamicSuggestions] = useState<SuggestionItem[]>(mockSuggestions);

  const TOTAL_STEPS = 4;
  const pgName = 'Sunrise PG';

  // Lock scroll when open
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Debounced address search via Nominatim
  useEffect(() => {
    if (!formData.officeLocation || formData.officeLocation.length < 3) {
      setDynamicSuggestions(mockSuggestions);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.officeLocation)}&limit=5`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setDynamicSuggestions(
            data.map((item: any) => {
              const name = item.display_name as string;
              const idx = name.indexOf(',');
              return idx !== -1
                ? { bold: name.slice(0, idx), normal: name.slice(idx) }
                : { bold: name, normal: '' };
            })
          );
        }
      } catch {/* ignore */}
    }, 450);
    return () => clearTimeout(delay);
  }, [formData.officeLocation]);

  const canProceed = () => {
    if (step === 1) return formData.name.trim().length > 0;
    if (step === 2) return formData.phone.trim().length >= 10;
    if (step === 3) return true; // room preference always has a default
    if (step === 4) return formData.officeLocation.trim().length > 0;
    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceed() && step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    }
  };

  const handleSubmit = async () => {
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
          name: formData.name,
          phone: formData.phone,
          preferredSharing:
            formData.roomPreference === 'Single Occupancy' ? 1
            : formData.roomPreference === 'Double Sharing' ? 2
            : 3,
          source: 'portfolio-web',
          officeLocation: formData.officeLocation,
        }),
      });
    } catch { /* ignore */ } finally {
      setIsSubmitting(false);
      onClose?.();
    }
  };

  const firstName = formData.name.split(' ')[0] || 'there';

  return (
    <div
      className={
        isHardGate
          ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-950'
          : 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
      }
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Ambient glows for hard-gate */}
      {isHardGate && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />
        </>
      )}

      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl min-h-[440px] flex flex-col justify-between z-10"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Top: progress */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <img src={logoImg.src} alt="logo" className="h-6 w-auto object-contain" />
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className={`h-1.5 w-8 rounded-full transition-all duration-500 ${
                  s <= step ? 'bg-teal-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-grow flex flex-col justify-center">

          {/* Step 1 – Name */}
          {step === 1 && (
            <div className="space-y-5" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
              <label className="text-2xl font-extrabold text-slate-800 tracking-tight block leading-snug">
                Hey there,{' '}
                <span className="text-teal-600">what do we call you?</span>
              </label>
              <p className="text-sm text-slate-400">We'll personalise your room search at {pgName}.</p>
              <input
                type="text"
                autoFocus
                placeholder="Type your full name…"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onKeyDown={handleKeyDown}
                className="w-full text-xl p-3 border-b-2 border-slate-200 focus:border-teal-500 outline-none transition-colors placeholder-slate-300 bg-transparent text-slate-800 font-semibold"
              />
            </div>
          )}

          {/* Step 2 – Phone */}
          {step === 2 && (
            <div className="space-y-5" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
              <label className="text-2xl font-extrabold text-slate-800 tracking-tight block leading-snug">
                Hey {firstName},{' '}
                <span className="text-teal-600">what's your phone number?</span>
              </label>
              <p className="text-sm text-slate-400">We'll send you room availability on WhatsApp.</p>
              <div className="flex gap-3 border-b-2 border-slate-200 focus-within:border-teal-500 transition-colors py-2 items-center">
                <span className="text-xl text-slate-400 font-semibold pl-1 select-none">+91</span>
                <input
                  type="tel"
                  autoFocus
                  maxLength={10}
                  placeholder="98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  onKeyDown={handleKeyDown}
                  className="w-full text-xl py-2 outline-none placeholder-slate-300 bg-transparent text-slate-800 font-semibold"
                />
              </div>
            </div>
          )}

          {/* Step 3 – Room Preference */}
          {step === 3 && (
            <div className="space-y-5" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
              <label className="text-2xl font-extrabold text-slate-800 tracking-tight block leading-snug">
                Hey {firstName},{' '}
                <span className="text-teal-600">what's your room preference?</span>
              </label>
              <div className="grid grid-cols-1 gap-3 pt-1">
                {['Single Occupancy', 'Double Sharing', 'Triple Sharing'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData({ ...formData, roomPreference: option })}
                    className={`w-full p-4 text-left text-base font-semibold rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                      formData.roomPreference === option
                        ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="mr-2">
                      {option === 'Single Occupancy' ? '🛏️' : option === 'Double Sharing' ? '🛏️🛏️' : '🛏️🛏️🛏️'}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 – Office Location */}
          {step === 4 && (
            <div className="space-y-5" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
              <label className="text-2xl font-extrabold text-slate-800 tracking-tight block leading-snug">
                Almost there {firstName},{' '}
                <span className="text-teal-600">where's your office?</span>
              </label>
              <p className="text-sm text-slate-400">We'll find the closest PG to your workplace.</p>

              <div className="relative">
                <div className="relative border-b-2 border-slate-200 focus-within:border-teal-500 transition-colors py-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Type office address…"
                    value={formData.officeLocation}
                    onChange={(e) => {
                      setFormData({ ...formData, officeLocation: e.target.value });
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    className="w-full text-lg py-1 outline-none placeholder-slate-300 bg-transparent text-slate-800 font-semibold"
                  />
                </div>

                {showSuggestions && dynamicSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                      <span>Suggestions</span>
                      <button type="button" onClick={() => setShowSuggestions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                    </div>
                    {dynamicSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, officeLocation: item.bold + item.normal });
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-teal-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
                      >
                        <strong className="text-slate-800 font-bold">{item.bold}</strong>
                        <span className="text-slate-500 font-normal">{item.normal}</span>
                      </button>
                    ))}
                    <div className="px-4 py-2 bg-slate-50 text-[9px] text-slate-400 font-medium">
                      Powered by OpenStreetMap
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400 italic">⚡ We'll show commute time from your office to the PG</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="text-slate-500 font-bold hover:text-slate-800 transition-colors px-4 py-2 cursor-pointer"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="bg-teal-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-teal-500/20 hover:bg-teal-600 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2 cursor-pointer"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="bg-teal-500 text-white font-extrabold px-7 py-3.5 rounded-xl shadow-lg shadow-teal-500/20 hover:bg-teal-600 disabled:opacity-40 disabled:pointer-events-none transition-all uppercase tracking-wider text-sm flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? 'Loading…' : 'Explore Properties ➔'}
            </button>
          )}
        </div>
      </div>

      {/* Keyframe animation injected globally */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}
