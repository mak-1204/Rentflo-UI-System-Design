'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Image as ImageIcon } from 'lucide-react';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  title: string;
}

interface RoomType {
  id: string;
  name: string;
  occupancy: 'Single' | 'Double' | '3-Sharing' | '4-Sharing';
  price: string;
  image: string;
  media: MediaItem[];
  title: string;
  description: string;
  inclusions: string[];
  vacancy: number;
}

interface PreferredSharingSpacesProps {
  rooms?: RoomType[];
  leadData?: any;
}

export function PreferredSharingSpaces({
  rooms = [
    {
      id: '1',
      name: 'Premium Single Room',
      occupancy: 'Single',
      price: '₹24,000',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80', title: 'Premium Single Bedroom Suite' },
        { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-bright-bedroom-in-a-modern-apartment-41778-large.mp4', title: 'Single Suite Video Tour' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80', title: 'Private Workstation Space' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', title: 'Attached Balcony View' }
      ],
      title: 'Premium Single Room',
      description: 'Fully furnished spacious studio room optimized for personal privacy and quiet focus.',
      inclusions: ['Attached Balcony', 'Private Workstation', 'Smart LED TV'],
      vacancy: 1,
    },
    {
      id: '2',
      name: 'Premium Double Room',
      occupancy: 'Double',
      price: '₹18,500',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', title: 'Luxury Double Sharing Room' },
        { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-41777-large.mp4', title: 'Double Suite Layout Tour' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80', title: 'Independent Lockers & Desks' }
      ],
      title: 'Luxury Double Room',
      description: 'Shared room layout with independent double workstations and personal storage wardrobes.',
      inclusions: ['Double Workstations', 'Shared Balcony', 'Independent Lockers'],
      vacancy: 2,
    },
    {
      id: '3',
      name: 'Premium Triple Sharing Room',
      occupancy: '3-Sharing',
      price: '₹12,500',
      image: 'https://images.unsplash.com/photo-1551632786-7b1c4a1eb2cb?auto=format&fit=crop&w=800&q=80',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1551632786-7b1c4a1eb2cb?auto=format&fit=crop&w=1200&q=80', title: 'Triple Sharing Living Space' },
        { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-living-room-of-a-modern-apartment-41779-large.mp4', title: 'Triple Suite Tour' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80', title: 'Study Corner' }
      ],
      title: 'Triple Sharing Room',
      description: 'Comfortable layout combining high affordably with functional personal study desks.',
      inclusions: ['Personal Reading Lights', 'In-room Dining Table', 'Gigabit WiFi Access'],
      vacancy: 0,
    },
    {
      id: '4',
      name: 'Premium Quad Sharing Room',
      occupancy: '4-Sharing',
      price: '₹8,500',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80', title: 'Quad Sharing Suite' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', title: 'Shared Bathroom' }
      ],
      title: 'Quad Sharing Room',
      description: 'Highly cost-effective shared space with complete utility integrations and active community lounge.',
      inclusions: ['Personal Wardrobes', 'Shared Bathroom', 'Housekeeping Included'],
      vacancy: 2,
    },
  ],
  leadData,
}: PreferredSharingSpacesProps) {
  const defaultOccupancy = leadData?.sharing_type === 'single' ? 'Single' 
    : leadData?.sharing_type === 'double' ? 'Double' 
    : leadData?.sharing_type === 'triple' ? '3-Sharing' 
    : 'Single';
  const [selectedOccupancy, setSelectedOccupancy] = useState<'Single' | 'Double' | '3-Sharing' | '4-Sharing'>(defaultOccupancy as any);

  // Lightbox modal states
  const [activeMediaRoom, setActiveMediaRoom] = useState<RoomType | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);

  const currentRoom = rooms.find((r) => r.occupancy === selectedOccupancy) || rooms[0];

  const nextMedia = () => {
    if (!activeMediaRoom) return;
    setActiveMediaIndex((prev) => (prev + 1) % activeMediaRoom.media.length);
  };

  const prevMedia = () => {
    if (!activeMediaRoom) return;
    setActiveMediaIndex((prev) =>
      prev === 0 ? activeMediaRoom.media.length - 1 : prev - 1
    );
  };

  return (
    <div className="w-full bg-white dark:bg-navy-deep/20 py-12 md:py-16 border-b border-border-subtle dark:border-outline-variant transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 text-left space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-deep dark:text-white">
              Living Options
            </h2>
            {/* Powered by stayfloww */}
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-navy-deep/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border-subtle dark:border-outline-variant shadow-sm w-fit">
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-extrabold">POWERED BY</span>
              <div className="flex items-center gap-0.5 text-[#14b8a6] font-bold text-[10px]">
                <span className="w-3.5 h-3.5 rounded bg-[#14b8a6] text-white flex items-center justify-center text-[9px] font-black">s</span>
                <span>stayfloww</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-wider bg-surface-container dark:bg-navy-deep px-4.5 py-2 rounded-full">
            All prices include utilities &amp; food
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2.5 sm:gap-4">
          {(['Single', 'Double', '3-Sharing', '4-Sharing'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedOccupancy(type)}
              className={`flex-1 sm:flex-initial text-center px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm border transition-all cursor-pointer shadow-sm whitespace-nowrap ${
                selectedOccupancy === type
                  ? 'bg-stayflow-teal border-stayflow-teal text-white shadow-md'
                  : 'bg-white dark:bg-navy-deep border-outline dark:border-outline-variant text-on-surface-variant dark:text-outline-variant hover:border-stayflow-teal dark:hover:border-stayflow-teal'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Room Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center bg-white dark:bg-navy-deep p-4 sm:p-8 rounded-3xl border border-border-subtle dark:border-outline-variant shadow-sm transition-colors duration-200">
          {/* Room Image */}
          <div 
            className="rounded-2xl overflow-hidden h-64 md:h-80 shadow-inner relative group cursor-pointer"
            onClick={() => {
              setActiveMediaRoom(currentRoom);
              setActiveMediaIndex(0);
            }}
          >
            <img 
              className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105" 
              src={currentRoom.image} 
              alt={currentRoom.name}
            />
            {/* Gallery Indicator Badge */}
            <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md text-white font-bold text-[10px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md uppercase tracking-wider group-hover:bg-stayflow-teal/90 transition-colors">
              <span className="material-symbols-outlined text-sm">photo_library</span>
              <span>View Gallery ({currentRoom.media.length})</span>
            </div>

            {currentRoom.vacancy > 0 ? (
              <span className="absolute top-4 left-4 bg-emerald-500 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                {currentRoom.vacancy} Vacancy Left
              </span>
            ) : (
              <span className="absolute top-4 left-4 bg-red-650 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md bg-red-500">
                Full
              </span>
            )}
          </div>

          {/* Room details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs text-stayflow-teal uppercase font-bold tracking-widest">
                {currentRoom.name}
              </p>
              <h3 className="text-3xl font-black text-navy-deep dark:text-white">
                {currentRoom.price}
                <span className="text-base font-normal text-on-surface-variant dark:text-outline-variant">/mo</span>
              </h3>
              <p className="text-sm text-on-surface-variant dark:text-outline-variant leading-relaxed">
                {currentRoom.description}
              </p>
            </div>

            {/* Inclusions checklist */}
            <ul className="space-y-3 pt-2">
              {currentRoom.inclusions.map((inclusion, idx) => (
                <li key={idx} className="flex items-center gap-3 text-base text-navy-deep dark:text-white">
                  <span className="material-symbols-outlined text-stayflow-teal">check_circle</span>
                  <span>{inclusion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Lightbox / Slide Overlay for Rooms */}
      {activeMediaRoom && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex flex-col justify-between p-4 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between text-white p-2">
            <div className="flex items-center gap-2">
              {activeMediaRoom.media[activeMediaIndex].type === 'video' ? (
                <span className="material-symbols-outlined text-stayflow-teal">videocam</span>
              ) : (
                <ImageIcon className="w-5 h-5 text-stayflow-teal" />
              )}
              <h4 className="font-bold text-sm md:text-base">
                {activeMediaRoom.media[activeMediaIndex].title} ({activeMediaRoom.name})
              </h4>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs md:text-sm font-semibold opacity-75">
                {activeMediaIndex + 1} / {activeMediaRoom.media.length}
              </span>
              <button
                onClick={() => setActiveMediaRoom(null)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer border-none bg-transparent"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Media Player Area */}
          <div className="flex-1 relative flex items-center justify-center p-2">
            {activeMediaRoom.media[activeMediaIndex].type === 'video' ? (
              <video
                key={activeMediaRoom.media[activeMediaIndex].url}
                src={activeMediaRoom.media[activeMediaIndex].url}
                className="max-h-[75vh] max-w-full rounded-xl shadow-2xl object-contain"
                controls
                autoPlay
                loop
                playsInline
              />
            ) : (
              <img
                src={activeMediaRoom.media[activeMediaIndex].url}
                alt={activeMediaRoom.media[activeMediaIndex].title}
                className="max-h-[75vh] max-w-full rounded-xl shadow-2xl object-contain animate-in fade-in duration-300"
              />
            )}

            {/* Left and Right navigation buttons */}
            {activeMediaRoom.media.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white hover:text-stayflow-teal p-3.5 rounded-full shadow-lg cursor-pointer border-none transition-all"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={nextMedia}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white hover:text-stayflow-teal p-3.5 rounded-full shadow-lg cursor-pointer border-none transition-all"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>

          {/* Bottom thumbnails strip */}
          <div className="flex justify-center gap-2 py-4 overflow-x-auto max-w-[90vw] mx-auto">
            {activeMediaRoom.media.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMediaIndex(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 transition-all relative border-2 ${
                  activeMediaIndex === idx ? 'border-stayflow-teal scale-105' : 'border-transparent opacity-50 hover:opacity-85'
                }`}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                    <Play className="w-4 h-4 fill-white text-white" />
                  </div>
                ) : (
                  <img src={item.url} className="w-full h-full object-cover" alt="thumbnail" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
