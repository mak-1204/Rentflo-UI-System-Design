'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface RoomType {
  id: string;
  name: string;
  occupancy: 'Single' | 'Double' | '3 Sharing';
  price: string;
  image: string;
  title: string;
  description: string;
  vacancy: number;
}

interface PreferredSharingSpacesProps {
  rooms?: RoomType[];
}

export function PreferredSharingSpaces({
  rooms = [
    {
      id: '1',
      name: 'Premium Studio Single Room',
      occupancy: 'Single',
      price: '₹12,500',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
      title: 'Premium Studio Single Room',
      description: 'Fully furnished premium layout style',
      vacancy: 1,
    },
    {
      id: '2',
      name: 'Double Room',
      occupancy: 'Double',
      price: '₹18,500',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
      title: 'Luxury Double Room',
      description: 'Spacious room with premium amenities',
      vacancy: 2,
    },
    {
      id: '3',
      name: 'Triple Sharing Room',
      occupancy: '3 Sharing',
      price: '₹8,500',
      image: 'https://images.unsplash.com/photo-1551632786-7b1c4a1eb2cb?w=600&h=400&fit=crop',
      title: 'Triple Sharing Room',
      description: 'Budget-friendly with great amenities',
      vacancy: 0,
    },
  ],
}: PreferredSharingSpacesProps) {
  const [selectedOccupancy, setSelectedOccupancy] = useState<'Single' | 'Double' | '3 Sharing' | 'All'>('All');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredRooms =
    selectedOccupancy === 'All'
      ? rooms
      : rooms.filter((room) => room.occupancy === selectedOccupancy);

  const currentRoom = filteredRooms[currentImageIndex] || rooms[0];
  const vacancyCount = rooms.reduce((sum, room) => sum + room.vacancy, 0);

  return (
    <div className="w-full bg-white py-12 md:py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Preferred Sharing Spaces
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Explore room galleries and video walkthroughs by occupancy preferences
            </p>
          </div>
          {vacancyCount > 0 && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-full px-4 py-2 w-fit">
              <span className="text-xs md:text-sm font-semibold text-yellow-800">
                ✨ {vacancyCount} Vacancies Left
              </span>
            </div>
          )}
        </div>

        {/* Occupancy Filter Buttons */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {['All', 'Single', 'Double', '3 Sharing'].map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedOccupancy(type as any);
                setCurrentImageIndex(0);
              }}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                selectedOccupancy === type
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Room Display */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Gallery */}
          <div className="md:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="relative w-full h-80 md:h-96 bg-gray-200 rounded-2xl overflow-hidden group">
              <img
                src={currentRoom.image}
                alt={currentRoom.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Video Tour Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <button className="bg-teal-500 hover:bg-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg">
                  <Play size={28} fill="white" />
                </button>
              </div>

              {/* Gallery Badge */}
              <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                📷 View Gallery (1)
              </div>

              {/* Room Title Badge */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-3 rounded-lg">
                <p className="text-lg font-bold">✨ {currentRoom.title}</p>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-3">
              {filteredRooms.map((room, index) => (
                <div
                  key={room.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-teal-500 shadow-lg'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Room Details */}
          <div className="bg-gray-50 rounded-2xl p-6 h-fit border border-gray-100">
            {/* Badge */}
            <div className="inline-block bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
              PRIVATE SUITE
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {currentRoom.occupancy} Room
            </h3>
            <p className="text-gray-600 text-sm mb-6">{currentRoom.description}</p>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Monthly Price:</p>
              <p className="text-3xl font-bold text-teal-600">{currentRoom.price}</p>
              <p className="text-xs text-gray-600 mt-2">1 Month Rent</p>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">Active Vacancies:</p>
                <p className="text-lg font-bold text-gray-900">
                  {currentRoom.vacancy > 0 ? (
                    <span className="text-teal-600">{currentRoom.vacancy} open beds</span>
                  ) : (
                    <span className="text-red-600">Fully Occupied</span>
                  )}
                </p>
              </div>
            </div>

            {/* Inclusions */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase">INCLUSIONS</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>3 Meals Daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Hi-Speed WiFi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Housekeeping</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Laundromat Access</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-all">
              SCHEDULE VISIT FOR THIS ROOM →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
