'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Share2, MapPin } from 'lucide-react';
import Image from 'next/image';

interface EnhancedHeroProps {
  pgName: string;
  tagline: string;
  location: string;
  images: string[];
  onImageClick?: () => void;
}

export function EnhancedHeroSection({
  pgName,
  tagline,
  location,
  images,
  onImageClick,
}: EnhancedHeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Use default images if none provided
  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551632786-7b1c4a1eb2cb?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=600&fit=crop',
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="w-full bg-white">
      {/* Main Hero Gallery */}
      <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] bg-gray-900 group">
        {/* Main Image */}
        <img
          src={displayImages[currentImageIndex]}
          alt={pgName}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
          onClick={onImageClick}
        />

        {/* Overlay Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentImageIndex + 1} / {displayImages.length}
        </div>

        {/* Navigation Buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next image"
            >
              <ChevronRight size={24} className="text-gray-900" />
            </button>
          </>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all backdrop-blur-sm"
            aria-label="Save to favorites"
          >
            <Heart
              size={20}
              className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}
            />
          </button>
          <button
            className="bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all backdrop-blur-sm"
            aria-label="Share"
          >
            <Share2 size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Thumbnail Gallery */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-4 flex gap-2 z-10">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? 'border-white scale-100'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={displayImages[index]}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hero Info Section */}
      <div className="px-4 md:px-8 py-6 md:py-8 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          {/* Property Name and Location */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{pgName}</h1>
            <div className="flex items-center text-lg text-gray-600 mb-3">
              <MapPin size={20} className="mr-2 text-blue-600" />
              {location}
            </div>
            <p className="text-lg text-gray-600 font-medium">{tagline}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">⭐</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Highly Rated</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">✓</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Verified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">🛡️</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Secure</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">🏆</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Best Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">👥</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">500+ Tenants</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">🌟</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Premium</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
