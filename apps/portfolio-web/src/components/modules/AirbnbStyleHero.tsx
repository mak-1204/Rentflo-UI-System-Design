'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Grid3x3, X, Share2, Heart } from 'lucide-react';

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
}: AirbnbStyleHeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const displayImages = images.length > 0
    ? images
    : [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551632786-7b1c4a1eb2cb?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
      ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  return (
    <>
      {/* Full Screen Gallery Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
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
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full"
            >
              <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full"
            >
              <ChevronRight size={24} className="text-gray-900" />
            </button>
          </div>
        </div>
      )}

      {/* Main Hero Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Title with Share/Save */}
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-3xl">
            {pgName}
          </h1>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors">
              <Share2 size={20} />
              <span className="hidden md:inline">Share</span>
            </button>
            <button className="flex items-center gap-2 text-gray-700 hover:text-teal-600 font-semibold transition-colors">
              <Heart size={20} />
              <span className="hidden md:inline">Save</span>
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-8 rounded-xl overflow-hidden">
          {/* Main Large Image - Left Side (60%) */}
          <div
            className="md:col-span-3 relative h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => setShowAllPhotos(true)}
          >
            <img
              src={displayImages[currentImageIndex]}
              alt={pgName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              {currentImageIndex + 1} / {displayImages.length}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <ChevronLeft size={20} className="text-gray-900" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <ChevronRight size={20} className="text-gray-900" />
            </button>
          </div>

          {/* Right Side Image Grid (40%) */}
          <div className="md:col-span-2 grid grid-cols-2 gap-2">
            {displayImages.slice(1, 5).map((img, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index + 1);
                  setShowAllPhotos(false);
                }}
                className="relative h-32 md:h-[188px] bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
              >
                <img
                  src={img}
                  alt={`Gallery ${index + 2}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {index === 3 && displayImages.length > 5 && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAllPhotos(true);
                    }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Grid3x3 size={24} className="text-white" />
                      <span className="text-white font-semibold text-sm">
                        Show all
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Section: Info Pane without Booking Panel */}
        <div className="max-w-4xl border-t border-gray-100 pt-8">
          {/* Property Details */}
          <div>
            {/* Property Type and Info */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Premium Paying Guest Accommodation
              </h2>
              <p className="text-lg text-gray-650 mb-4">{tagline}</p>
              <div className="text-sm text-gray-705 space-y-1">
                <p>📍 {location}</p>
                <p>🏠 Multiple rooms • Fully furnished</p>
                <p>👥 35+ beds • 500+ satisfied residents</p>
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                What this place offers
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🛏️</span>
                  <div>
                    <p className="font-semibold text-gray-900">Spacious Rooms</p>
                    <p className="text-sm text-gray-600">Well-designed & modern</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📶</span>
                  <div>
                    <p className="font-semibold text-gray-900">Gigabit WiFi</p>
                    <p className="text-sm text-gray-600">150+ Mbps guaranteed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <p className="font-semibold text-gray-900">24/7 Security</p>
                    <p className="text-sm text-gray-600">CCTV & trained staff</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🍽️</span>
                  <div>
                    <p className="font-semibold text-gray-900">Healthy Meals</p>
                    <p className="text-sm text-gray-600">Fresh daily prepared</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                About this place
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Located in the heart of a vibrant neighborhood, our PG provides premium accommodation for young professionals and students. We offer a blend of comfort, security, and community with well-maintained facilities and a supportive atmosphere. Each room is carefully designed with modern amenities and comes with flexible lease terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
