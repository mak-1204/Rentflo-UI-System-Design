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
  const [isMounted, setIsMounted] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Check storage on mount to support hard-gating returning users
  useEffect(() => {
    setIsMounted(true);
    const modalShown = sessionStorage.getItem('leadModalShown');
    const leadSubmitted = localStorage.getItem('stayflo_lead_submitted');
    
    if (modalShown === 'true' || leadSubmitted === 'true') {
      setIsUnlocked(true);
      setShowLeadModal(false);
    } else {
      setIsUnlocked(false);
      setShowLeadModal(true);
    }
  }, []);

  const handleLeadModalClose = () => {
    setShowLeadModal(false);
    setIsUnlocked(true);
    sessionStorage.setItem('leadModalShown', 'true');
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
        onScheduleVisitClick={() => setShowLeadModal(true)}
        onCallClick={() => window.open('tel:9876543210', '_self')}
      />

      {/* Main Content */}
      <main className="pt-20 pb-32 bg-white">
        {/* Hero Section with Airbnb-style layout */}
        <section id="hero" className="bg-white border-b border-gray-100">
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

        {/* Preferred Sharing Spaces */}
        <section id="rooms">
          <PreferredSharingSpaces leadData={leadData} />
        </section>

        {/* Interactive Floor Plans */}
        <section id="floorplans">
          <InteractiveFloorPlans layoutData={layoutData} />
        </section>

        {/* Location & Commute */}
        <section id="location">
          <LocationCommute />
        </section>

        {/* Weekly Food Menu */}
        <section id="food">
          <WeeklyFoodMenu />
        </section>

        {/* Guest Favourite Rating */}
        <section id="rating">
          <GuestFavourite rating={4.78} reviews={18} />
        </section>

        {/* Amenities */}
        <section className="bg-gray-50">
          <AmenitiesShowcase />
        </section>

        {/* Features & FAQ */}
        <section className="bg-gray-50">
          <FeaturesAndFAQ />
        </section>

        {/* CTA Section */}
        <section id="contact" ref={ctaRef}>
          <CTASection 
            onScheduleVisitClick={() => setShowLeadModal(true)}
            onRequestCallbackClick={() => setShowLeadModal(true)}
          />
        </section>
      </main>

      {/* Stagnant Price & Availability Banner */}
      <PriceAvailabilityBanner startingPrice="₹6,500" vacantRooms={2} />

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
    </>
  );
}
