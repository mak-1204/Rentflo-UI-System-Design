'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from './Header';
import { LeadCaptureModal } from './LeadCaptureModal';
import { EnhancedHeroSection } from './EnhancedHeroSection';
import { PropertyHighlights } from './PropertyHighlights';
import { AmenitiesShowcase } from './AmenitiesShowcase';
import { TestimonialsSection } from './TestimonialsSection';
import { CTASection } from './CTASection';
import { FeaturesAndFAQ } from './FeaturesAndFAQ';
import { Footer } from './Footer';

interface PortfolioPageProps {
  pgName?: string;
  location?: string;
  tagline?: string;
  images?: string[];
}

export function PortfolioPageLayout({
  pgName = 'Sunrise PG',
  location = 'No. 14, 5th Cross, Koramangala 4th Block, Bengaluru, 560034',
  tagline = 'Your home away from home in Koramangala',
  images = [],
}: PortfolioPageProps) {
  const [showLeadModal, setShowLeadModal] = useState(true);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Handle modal close for first-time users only
  const handleLeadModalClose = () => {
    setShowLeadModal(false);
    // Store in localStorage to not show again in this session
    sessionStorage.setItem('leadModalShown', 'true');
  };

  // Don't show modal if already shown this session
  useEffect(() => {
    const modalShown = sessionStorage.getItem('leadModalShown');
    if (modalShown) {
      setShowLeadModal(false);
    }
  }, []);

  const handleGetStartedClick = () => {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Lead Capture Modal */}
      {showLeadModal && <LeadCaptureModal onClose={handleLeadModalClose} pgName={pgName} />}

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-16 md:pt-20 bg-white">
        {/* Hero Section */}
        <section id="hero">
          <EnhancedHeroSection
            pgName={pgName}
            tagline={tagline}
            location={location}
            images={images}
          />
        </section>

        {/* Property Highlights */}
        <section id="features">
          <PropertyHighlights />
        </section>

        {/* Amenities */}
        <section className="bg-gray-50">
          <AmenitiesShowcase />
        </section>

        {/* Testimonials */}
        <section id="reviews">
          <TestimonialsSection />
        </section>

        {/* Features & FAQ */}
        <section className="bg-gray-50">
          <FeaturesAndFAQ />
        </section>

        {/* CTA Section */}
        <section id="contact" ref={ctaRef}>
          <CTASection />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919876543210"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-30 md:hidden"
        aria-label="Contact on WhatsApp"
      >
        <span className="text-2xl">💬</span>
      </a>
    </>
  );
}
