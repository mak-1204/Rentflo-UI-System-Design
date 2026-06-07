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
import { Check, BadgeCheck, Phone } from 'lucide-react';
import logoImg from '../../../logo.png';

interface PortfolioPageProps {
  pgName?: string;
  location?: string;
  tagline?: string;
  price?: string;
  images?: string[];
  layoutData?: any;
  leadData?: any;
  stats?: any;
}

interface BookingSidebarBoxProps {
  setBookingDefaultDate: (date: 'today' | 'tomorrow' | '') => void;
  setShowBookingModal: (show: boolean) => void;
  stats?: any;
}

function BookingSidebarBox({
  setBookingDefaultDate,
  setShowBookingModal,
  stats,
}: BookingSidebarBoxProps) {
  const minRent = stats?.roomTypeStats 
    ? Object.values(stats.roomTypeStats).reduce((min: number, r: any) => 
        (r.pricing?.monthlyRent && r.pricing.monthlyRent < min) ? r.pricing.monthlyRent : min
      , Infinity) 
    : 12500;
  
  const displayRent = minRent === Infinity ? 12500 : minRent;

  return (
    <div className="bg-white dark:bg-navy-deep rounded-3xl p-8 border border-border-subtle dark:border-outline-variant shadow-xl transition-colors duration-200">
      <div className="space-y-8">
        <div>
          <p className="text-xs text-stayflow-teal font-bold uppercase tracking-widest mb-2">Starting from</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-navy-deep dark:text-white">₹{displayRent.toLocaleString()}</span>
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
            Schedule a Visit
          </button>
          <button 
            onClick={() => {
              setBookingDefaultDate('');
              setShowBookingModal(true);
            }}
            className="w-full border-2 border-stayflow-teal text-stayflow-teal py-4 rounded-xl font-bold hover:bg-stayflow-teal/5 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer bg-transparent"
          >
            <span className="material-symbols-outlined">phone_callback</span>
            Call Now
          </button>
          <a 
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 py-4 rounded-xl font-bold hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer no-underline bg-transparent"
          >
            <span className="text-lg leading-none">💬</span>
            Chat via WhatsApp
          </a>
        </div>
        
        <div className="bg-surface-container-low dark:bg-navy-deep/40 rounded-xl p-4 flex items-center gap-3">
          <span className="text-xl">⚡️</span>
          <p className="text-xs text-navy-deep dark:text-white font-semibold">
            {stats?.totalAvailableBeds ? `${stats.totalAvailableBeds} Beds Currently Available!` : 'Popular: 14 people booked a tour in last 24h'}
          </p>
        </div>
      </div>
    </div>
  );
}

export function NewPortfolioPageLayout({
  pgName = 'Sunrise PG',
  location = 'No. 14, 5th Cross, Koramangala 4th Block, Bengaluru, 560034',
  tagline = 'Your home away from home in Koramangala',
  price = '₹15,000',
  images = [],
  layoutData,
  leadData,
  stats,
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

  // Generate dynamic rooms for PreferredSharingSpaces from layoutData
  let dynamicRooms = undefined;
  if (layoutData?.roomsData) {
    const roomMap: Record<string, any> = {};
    Object.values(layoutData.roomsData).forEach((floorRooms: any) => {
      if (Array.isArray(floorRooms)) {
        floorRooms.forEach(room => {
          if (room.beds > 0) {
            const name = room.type || 'Room';
            if (!roomMap[name]) {
              // Get category media if it matches the room type, otherwise empty
              const catMedia = layoutData.categoryMedia?.[name] || [];
              const media = catMedia.map((url: string, index: number) => ({
                type: 'image',
                url,
                title: `${name} View ${index + 1}`,
                label: 'PHOTO'
              }));
              
              roomMap[name] = {
                id: name,
                name: name,
                occupancy: room.beds === 1 ? 'Single' : room.beds === 2 ? 'Double' : `${room.beds}-Sharing`,
                price: '₹' + (room.beds === 1 ? '15,000' : room.beds === 2 ? '12,000' : '8,000'), // Fallback if no pricing provided
                image: catMedia[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
                media: media.length > 0 ? media : [
                  { type: 'image', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', title: `${name} View`, label: 'PHOTO' }
                ],
                title: name,
                description: `Comfortable ${name} layout.`,
                inclusions: room.roomAmenities || ['WiFi', 'Bed', 'Cupboard'],
                vacancy: room.bedStatuses ? room.bedStatuses.filter((s: string) => s === 'Vacant').length : 0,
              };
            } else {
              // Aggregate vacancy
              roomMap[name].vacancy += room.bedStatuses ? room.bedStatuses.filter((s: string) => s === 'Vacant').length : 0;
            }
          }
        });
      }
    });
    const parsedRooms = Object.values(roomMap);
    if (parsedRooms.length > 0) {
      dynamicRooms = parsedRooms;
    }
  }

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
        pgName={pgName}
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
          pgName={pgName}
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
          
          {/* Top section: Hero and Desktop Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-12 items-start mb-16">
            {/* Hero Section - Columns 1-8 on desktop */}
            <div className="lg:col-span-8">
              <section id="hero">
                <AirbnbStyleHero
                  pgName={pgName}
                  tagline={tagline}
                  location={location}
                  price={price}
                  images={layoutData?.categoryMedia?.['Common Area'] || layoutData?.categoryMedia?.['Common Areas'] || images}
                  videoUrl={layoutData?.videoUrl}
                  onLeadCaptureClick={handleReserveClick}
                  leadData={leadData}
                />
              </section>
            </div>

            {/* Right Sticky Sidebar - Columns 9-12 on desktop. Hidden on mobile. */}
            <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-28 space-y-8 text-left">
              <BookingSidebarBox
                setBookingDefaultDate={setBookingDefaultDate}
                setShowBookingModal={setShowBookingModal}
                stats={stats}
              />
            </aside>
          </div>

          {/* Lower sections: Full-width and centered on desktop */}
          <div className="space-y-16 w-full">
            {/* Commute Optimizer */}
            <section id="commute" className="w-full">
              <LocationCommute />
            </section>

            {/* Preferred Sharing Spaces / Living Options */}
            <section id="rooms" className="w-full">
              <PreferredSharingSpaces leadData={leadData} rooms={dynamicRooms} />
            </section>

            {/* Interactive Floor Plans */}
            <section id="floorplans" className="w-full">
              <InteractiveFloorPlans layoutData={layoutData} />
            </section>

            {/* Weekly Food Menu */}
            <section id="food" className="w-full">
              <WeeklyFoodMenu />
            </section>

            {/* Guest Favourite Rating */}
            <section id="rating" className="w-full">
              <GuestFavourite rating={4.78} reviews={18} />
            </section>

            {/* Features & FAQ */}
            <section id="faq" className="w-full">
              <FeaturesAndFAQ />
            </section>
          </div>

          {/* Mobile Booking Sidebar - Rendered at the bottom on mobile viewports */}
          <div className="block lg:hidden mt-16">
            <BookingSidebarBox
              setBookingDefaultDate={setBookingDefaultDate}
              setShowBookingModal={setShowBookingModal}
              stats={stats}
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer pgName={pgName} />

      {/* Floating CTA Button - Schedule a Visit (Unified for all screens) */}
      <button
        onClick={() => {
          setBookingDefaultDate('');
          setShowBookingModal(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-stayflow-teal hover:bg-stayflow-teal/90 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center z-45 border-none cursor-pointer"
        title="Schedule a Visit"
        aria-label="Schedule a Visit"
      >
        <Phone className="w-6 h-6 animate-pulse" />
      </button>

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
