'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface AirbnbStyleHeroProps {
  pgName: string;
  location: string;
  tagline: string;
  price: string;
  rating?: number;
  reviews?: number;
  images: string[];
  onLeadCaptureClick?: () => void;
}

export function AirbnbStyleHero({
  pgName,
  location,
  tagline,
  price,
  rating = 4.8,
  reviews = 150,
  images,
  onLeadCaptureClick,
  leadData,
}: AirbnbStyleHeroProps & { leadData?: any }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const displayImages = images && images.length > 0
    ? images
    : [
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
      ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const greetingName = leadData?.name && leadData.name !== 'Unnamed Prospect' ? leadData.name : 'there';

  return (
    <>
      {/* Full Screen Gallery Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
            >
              <X size={28} />
            </button>
            <span className="text-white font-medium">
              {currentImageIndex + 1} / {displayImages.length}
            </span>
          </div>
          <div className="flex-1 relative flex items-center justify-center">
            <img
              src={displayImages[currentImageIndex]}
              alt="Full view"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white p-3 rounded-full shadow-md cursor-pointer border-none"
            >
              <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white p-3 rounded-full shadow-md cursor-pointer border-none"
            >
              <ChevronRight size={24} className="text-gray-900" />
            </button>
          </div>
        </div>
      )}

      {/* Main Hero Gallery Section */}
      <section className="space-y-6 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-navy-deep dark:text-white tracking-tight">
              Hello {greetingName}, welcome to {pgName}
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant dark:text-outline-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-stayflow-teal">location_on</span>
              {location}
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              Available
            </span>
            <span className="px-4 py-1.5 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              Premium Tier
            </span>
          </div>
        </div>

        {/* Airbnb style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[320px] sm:h-[450px] md:h-[550px] lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
          {/* Main image */}
          <div 
            className="md:col-span-3 md:row-span-2 relative overflow-hidden group cursor-pointer"
            onClick={() => {
              setShowAllPhotos(true);
            }}
          >
            <img 
              className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-105" 
              src={displayImages[currentImageIndex]} 
              alt={currentImageIndex === 0 ? 'Common Area' : currentImageIndex === 1 ? 'Corridor' : 'Play Area'}
            />
            {/* Mobile Carousel Navigation Arrows */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center pointer-events-auto hover:bg-white dark:hover:bg-slate-800 shadow border-none cursor-pointer"
                aria-label="Previous Image"
              >
                <ChevronLeft size={16} className="text-gray-900 dark:text-white" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center pointer-events-auto hover:bg-white dark:hover:bg-slate-800 shadow border-none cursor-pointer"
                aria-label="Next Image"
              >
                <ChevronRight size={16} className="text-gray-900 dark:text-white" />
              </button>
            </div>
            {/* Category tag overlay */}
            <div className="absolute bottom-6 left-6 flex gap-2">
              <span className="bg-black/75 backdrop-blur-md text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow">
                {currentImageIndex === 0 ? 'Common Area' : currentImageIndex === 1 ? 'Corridor' : currentImageIndex === 2 ? 'Play Area' : `Image ${currentImageIndex + 1}`}
              </span>
            </div>
            {/* Dot Indicator Overlay for Mobile */}
            <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider">
              {currentImageIndex + 1} / {displayImages.length}
            </div>
          </div>

          {/* Side Image 1 */}
          <div 
            className="hidden md:block relative overflow-hidden group cursor-pointer"
            onClick={() => {
              setCurrentImageIndex(1 % displayImages.length);
              setShowAllPhotos(true);
            }}
          >
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={displayImages[1] || displayImages[0]} 
              alt="Corridor"
            />
            <div className="absolute bottom-4 left-4">
              <span className="bg-black/75 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow">
                Corridor
              </span>
            </div>
          </div>

          {/* Side Image 2 */}
          <div 
            className="hidden md:block relative overflow-hidden group cursor-pointer"
            onClick={() => {
              setCurrentImageIndex(2 % displayImages.length);
              setShowAllPhotos(true);
            }}
          >
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={displayImages[2] || displayImages[0]} 
              alt="Play Area"
            />
            <div className="absolute bottom-4 left-4">
              <span className="bg-black/75 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow">
                Play Area
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Property Description */}
        <div className="max-w-4xl border-t border-border-subtle dark:border-outline-variant pt-8 mt-4 space-y-6">
          <div className="pb-6 border-b border-border-subtle dark:border-outline-variant">
            <h2 className="text-xl md:text-2xl font-bold text-navy-deep dark:text-white mb-2">
              Premium paying guest accommodation managed directly by stayfloww
            </h2>
            <p className="text-base text-on-surface-variant dark:text-outline-variant leading-relaxed">
              {tagline || 'Experience custom designed living spaces for working professionals and students.'}
            </p>
          </div>

          {/* What this place offers */}
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border-subtle dark:border-outline-variant">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl text-stayflow-teal">bed</span>
              <div>
                <p className="font-bold text-navy-deep dark:text-white">Premium Single Rooms</p>
                <p className="text-xs text-on-surface-variant dark:text-outline-variant">Well designed layouts with work desks</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl text-stayflow-teal">wifi</span>
              <div>
                <p className="font-bold text-navy-deep dark:text-white">High Speed WiFi</p>
                <p className="text-xs text-on-surface-variant dark:text-outline-variant">1 Gbps connection for remote working</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl text-stayflow-teal">verified_user</span>
              <div>
                <p className="font-bold text-navy-deep dark:text-white">24/7 Gate Security</p>
                <p className="text-xs text-on-surface-variant dark:text-outline-variant">Smart CCTV & security verified access</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl text-stayflow-teal">restaurant</span>
              <div>
                <p className="font-bold text-navy-deep dark:text-white">Chef Cooked Meals</p>
                <p className="text-xs text-on-surface-variant dark:text-outline-variant">Breakfast, Lunch and Dinner daily</p>
              </div>
            </div>
          </div>

          {/* About this place */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-navy-deep dark:text-white">About Sunrise Living</h3>
            <p className="text-on-surface-variant dark:text-outline-variant leading-relaxed text-sm md:text-base">
              Located in the heart of Prestige Tech Park area, Sunrise Living offers custom-built spaces designed to foster comfort, collaboration, and focus. Redefining the standard of traditional PG accommodations, we provide zero-maintenance premium suites, interactive check-ins, fully-loaded amenities, and direct platform management for absolute peace of mind.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

