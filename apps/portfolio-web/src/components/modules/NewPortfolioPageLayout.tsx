'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from './Header';
import { LeadCaptureModal } from './LeadCaptureModal';
import { AirbnbStyleHero } from './AirbnbStyleHero';
import { PreferredSharingSpaces } from './PreferredSharingSpaces';
import { InteractiveFloorPlans } from './InteractiveFloorPlans';
import { LocationCommute } from './LocationCommute';
import { WeeklyFoodMenu } from './WeeklyFoodMenu';
import { GuestFavourite } from './GuestFavourite';
import { PriceAvailabilityBanner } from './PriceAvailabilityBanner';
import { AmenitiesShowcase } from './AmenitiesShowcase';
import { CTASection } from './CTASection';
import { FeaturesAndFAQ } from './FeaturesAndFAQ';
import { Footer } from './Footer';
import { BookingModal } from './BookingModal';
import { Check, BadgeCheck } from 'lucide-react';
import logoImg from '../../../logo.png';

interface PortfolioPageProps {
  pgName?: string;
  location?: string;
  tagline?: string;
  price?: string;
  images?: string[];
  layoutData?: any;
  leadData?: any;
}

export function NewPortfolioPageLayout({
  pgName = 'Sunrise PG',
  location = 'No. 14, 5th Cross, Koramangala 4th Block, Bengaluru, 560034',
  tagline = 'Your home away from home in Koramangala',
  price = '₹15,000',
  images = [],
  layoutData,
  leadData,
}: PortfolioPageProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDefaultDate, setBookingDefaultDate] = useState<'today' | 'tomorrow' | ''>('');
  const [isMounted, setIsMounted] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Check storage on mount to support hard-gating returning users
  useEffect(() => {
    setIsMounted(true);
    const leadSubmitted = localStorage.getItem('stayflo_lead_submitted');
    
    if (leadSubmitted === 'true') {
      setIsUnlocked(true);
      setShowLeadModal(false);
    } else {
      setIsUnlocked(false);
      setShowLeadModal(true);
    }
  }, []);

  const handleLeadModalClose = () => {
    setIsUnlocked(true);
    setShowLeadModal(false);
  };

  const handleGetStartedClick = () => {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReserveClick = () => {
    setShowLeadModal(true);
  };

  // SSR hydration safety loader
  if (!isMounted) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Gated View: Render ONLY the Lead modal on solid dark background
  if (!isUnlocked) {
    return (
      <LeadCaptureModal 
        isHardGate={true} 
        onClose={handleLeadModalClose} 
      />
    );
  }

  return (
    <>
      {/* Lead Capture Modal (Overlay when unlocked) */}
      {showLeadModal && (
        <LeadCaptureModal 
          isHardGate={false} 
          onClose={() => setShowLeadModal(false)} 
        />
      )}

      {/* Header */}
      <Header 
        pgName={pgName}
        onCallClick={() => window.open('tel:9876543210', '_self')}
        onBookClick={() => {
          setBookingDefaultDate('');
          setShowBookingModal(true);
        }}
      />

      {/* Main Content */}
      <main className="pt-24 pb-32 bg-surface dark:bg-navy-deep transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            
            {/* Left Content Area (Columns 1-8) */}
            <div className="lg:col-span-8 space-y-16">
              {/* Hero Section */}
              <section id="hero">
                <AirbnbStyleHero
                  pgName={pgName}
                  tagline={tagline}
                  location={location}
                  price={price}
                  images={images}
                  onLeadCaptureClick={handleReserveClick}
                  leadData={leadData}
                />
              </section>

              {/* Commute Optimizer */}
              <section id="commute">
                <LocationCommute />
              </section>

              {/* Preferred Sharing Spaces / Living Options */}
              <section id="rooms">
                <PreferredSharingSpaces leadData={leadData} />
              </section>

              {/* Interactive Floor Plans */}
              <section id="floorplans">
                <InteractiveFloorPlans layoutData={layoutData} />
              </section>

              {/* Weekly Food Menu */}
              <section id="food">
                <WeeklyFoodMenu />
              </section>

              {/* Amenities */}
              <section id="amenities">
                <AmenitiesShowcase />
              </section>

              {/* Guest Favourite Rating */}
              <section id="rating">
                <GuestFavourite rating={4.78} reviews={18} />
              </section>

              {/* Features & FAQ */}
              <section id="faq">
                <FeaturesAndFAQ />
              </section>
            </div>

            {/* Right Sticky Sidebar (Columns 9-12) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-8 text-left">
              {/* Booking Sidebar Box */}
              <div className="bg-white dark:bg-navy-deep rounded-3xl p-8 border border-border-subtle dark:border-outline-variant shadow-xl transition-colors duration-200">
                <div className="space-y-8">
                  <div>
                    <p className="text-xs text-stayflow-teal font-bold uppercase tracking-widest mb-2">Starting from</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-navy-deep dark:text-white">₹12,500</span>
                      <span className="text-on-surface-variant dark:text-outline-variant font-bold text-sm">/mo</span>
                    </div>
                  </div>
                  
                  <hr className="border-border-subtle dark:border-outline-variant/30" />
                  
                  <div className="space-y-5">
                    <h3 className="text-lg font-bold text-navy-deep dark:text-white">Schedule a Visit</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => {
                          setBookingDefaultDate('today');
                          setShowBookingModal(true);
                        }}
                        className="py-3.5 px-4 rounded-xl border border-border-subtle dark:border-outline-variant hover:bg-stayflow-teal hover:text-white hover:border-stayflow-teal dark:hover:bg-stayflow-teal dark:hover:text-white text-navy-deep dark:text-white font-bold transition-all shadow-sm cursor-pointer bg-transparent"
                      >
                        Today
                      </button>
                      <button 
                        onClick={() => {
                          setBookingDefaultDate('tomorrow');
                          setShowBookingModal(true);
                        }}
                        className="py-3.5 px-4 rounded-xl border border-border-subtle dark:border-outline-variant hover:bg-stayflow-teal hover:text-white hover:border-stayflow-teal dark:hover:bg-stayflow-teal dark:hover:text-white text-navy-deep dark:text-white font-bold transition-all shadow-sm cursor-pointer bg-transparent"
                      >
                        Tomorrow
                      </button>
                    </div>
                    <button 
                      onClick={() => {
                        setBookingDefaultDate('');
                        setShowBookingModal(true);
                      }}
                      className="w-full bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md text-sm cursor-pointer border-none"
                    >
                      <span className="material-symbols-outlined">calendar_month</span>
                      Book a Physical Tour
                    </button>
                    <button 
                      onClick={() => {
                        setBookingDefaultDate('');
                        setShowBookingModal(true);
                      }}
                      className="w-full border-2 border-stayflow-teal text-stayflow-teal py-4 rounded-xl font-bold hover:bg-stayflow-teal/5 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer bg-transparent"
                    >
                      <span className="material-symbols-outlined">phone_callback</span>
                      Request Callback
                    </button>
                  </div>
                  
                  <div className="bg-surface-container-low dark:bg-navy-deep/40 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-xl">⚡️</span>
                    <p className="text-xs text-navy-deep dark:text-white font-semibold">
                      Popular: 14 people booked a tour in last 24h
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badge Card */}
              <div className="bg-stayflow-teal text-white rounded-3xl p-8 flex items-center gap-6 shadow-lg relative overflow-visible">
                <div className="bg-white/20 p-3 rounded-2xl flex items-center justify-center w-16 h-16 shrink-0 relative">
                  <img 
                    src={logoImg.src} 
                    alt="stayfloww" 
                    className="w-full h-auto object-contain brightness-0 invert" 
                  />
                  {/* Verified Check Badge Overlay */}
                  <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-stayflow-teal shadow-md flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-lg mb-1 flex items-center gap-1.5">
                    <span>stayfloww Verified</span>
                    <BadgeCheck className="w-5 h-5 text-emerald-350 fill-white/10" />
                  </p>
                  <p className="text-xs opacity-90 leading-snug">Managed directly by the platform for 100% security.</p>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button - Mobile Only */}
      <a
        href="https://wa.me/919876543210"
        className="fixed bottom-6 right-6 w-14 h-14 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-30 md:hidden"
        aria-label="Contact on WhatsApp"
        title="Chat on WhatsApp"
      >
        <span className="text-2xl">💬</span>
      </a>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        pgName={pgName}
        defaultDate={bookingDefaultDate}
      />
    </>
  );
}
