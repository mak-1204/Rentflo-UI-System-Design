import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Image as ImageIcon, PlayCircle } from 'lucide-react';
import logoImg from '../../../logo.png';
import Image from 'next/image';

function HydratedVideo({ src, className }: { src: string, className?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  if (!isPlaying) {
    return (
      <div 
        className={`relative flex items-center justify-center bg-slate-900 cursor-pointer group ${className}`}
        onClick={() => setIsPlaying(true)}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
        <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-xl group-hover:scale-110 transition-transform z-20" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <video
      autoPlay
      controls
      src={src}
      className={className}
    />
  );
}

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  title: string;
  label?: string;
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
        { type: 'image', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80', title: 'Premium Single Bedroom Suite', label: 'BED' },
        { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-bright-bedroom-in-a-modern-apartment-41778-large.mp4', title: 'Single Suite Video Tour', label: 'VIDEO' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80', title: 'Private Workstation Space', label: 'DESK' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', title: 'Attached Balcony View', label: 'BALCONY' }
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
        { type: 'image', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', title: 'Luxury Double Sharing Room', label: 'BED' },
        { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-41777-large.mp4', title: 'Double Suite Layout Tour', label: 'VIDEO' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80', title: 'Independent Lockers & Desks', label: 'DESK' }
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
        { type: 'image', url: 'https://images.unsplash.com/photo-1551632786-7b1c4a1eb2cb?auto=format&fit=crop&w=1200&q=80', title: 'Triple Sharing Living Space', label: 'BED' },
        { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-living-room-of-a-modern-apartment-41779-large.mp4', title: 'Triple Suite Tour', label: 'VIDEO' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80', title: 'Study Corner', label: 'DESK' }
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
        { type: 'image', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80', title: 'Quad Sharing Suite', label: 'BED' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', title: 'Shared Bathroom', label: 'BATH' }
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

  // Inline slider states for the card
  const [activeCardMediaIndex, setActiveCardMediaIndex] = useState<number>(0);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  // Lightbox modal states
  const [activeMediaRoom, setActiveMediaRoom] = useState<RoomType | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);

  // Reset active index when selected occupancy (room type) changes
  useEffect(() => {
    setActiveCardMediaIndex(0);
  }, [selectedOccupancy]);

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
            <div className="flex items-center gap-1 opacity-70">
              <span className="text-[10px] font-bold text-slate-400 normal-case tracking-widest">by</span>
              <img src={logoImg.src} alt="stayfloww" className="h-3.5 w-auto object-contain dark:brightness-0 dark:invert" />
            </div>
          </div>
          <span className="text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-wider bg-surface-container dark:bg-navy-deep px-4.5 py-2 rounded-full">
            All prices include food (utilities extra)
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
          {/* Room Media Showcase */}
          <div className="rounded-2xl overflow-hidden h-80 md:h-[400px] shadow-inner relative group bg-slate-900">
            {/* Active Media Preview (Image or Video) */}
            <div 
              className="w-full h-full cursor-pointer relative"
              onClick={() => {
                setActiveMediaRoom(currentRoom);
                setActiveMediaIndex(activeCardMediaIndex);
              }}
            >
              {currentRoom.media[activeCardMediaIndex].type === 'video' ? (
                <HydratedVideo
                  key={currentRoom.media[activeCardMediaIndex].url}
                  src={currentRoom.media[activeCardMediaIndex].url}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image 
                  key={currentRoom.media[activeCardMediaIndex].url}
                  src={currentRoom.media[activeCardMediaIndex].url} 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt={currentRoom.media[activeCardMediaIndex].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
              {/* Dark Gradient Overlay at bottom for thumbnail legibility */}
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Vacancy Badge (Top Left) */}
            {currentRoom.vacancy > 0 ? (
              <span className="absolute top-4 left-4 bg-emerald-500 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md z-20">
                {currentRoom.vacancy} Vacancy Left
              </span>
            ) : (
              <span className="absolute top-4 left-4 bg-red-500 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md z-20">
                Full
              </span>
            )}

            {/* Zoom / Fullscreen overlay button (Top Right) */}
            <button
              onClick={() => {
                setActiveMediaRoom(currentRoom);
                setActiveMediaIndex(activeCardMediaIndex);
              }}
              className="absolute top-4 right-4 bg-black/60 hover:bg-stayflow-teal backdrop-blur-md text-white p-2 rounded-xl transition-all cursor-pointer border-none shadow-md z-20 flex items-center justify-center"
              title="Expand View"
            >
              <span className="material-symbols-outlined text-base">fullscreen</span>
            </button>

            {/* Left and Right Nav Arrows on Hover */}
            {currentRoom.media.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCardMediaIndex((prev) => 
                      prev === 0 ? currentRoom.media.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-stayflow-teal text-white p-1.5 rounded-full cursor-pointer border-none opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center shadow-md"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCardMediaIndex((prev) => 
                      (prev + 1) % currentRoom.media.length
                    );
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-stayflow-teal text-white p-1.5 rounded-full cursor-pointer border-none opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center shadow-md"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Bottom Thumbnails Scroll Tray */}
            <div className="absolute bottom-4 inset-x-0 px-3 flex items-center justify-between z-20">
              {/* Scroll Left Button */}
              {currentRoom.media.length > 3 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (thumbnailScrollRef.current) {
                      thumbnailScrollRef.current.scrollBy({ left: -100, behavior: 'smooth' });
                    }
                  }}
                  className="bg-black/70 hover:bg-stayflow-teal text-white p-2 rounded-full cursor-pointer border-none flex items-center justify-center shrink-0 z-30 shadow-lg"
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              <div 
                ref={thumbnailScrollRef}
                className="flex items-center gap-4 overflow-x-auto hide-scrollbar scroll-smooth w-full px-2 py-2 justify-center"
              >
                {currentRoom.media.map((item, idx) => {
                  const isActive = activeCardMediaIndex === idx;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCardMediaIndex(idx);
                        }}
                        className={`w-16 h-10 sm:w-24 sm:h-15 rounded-xl overflow-hidden border-2 sm:border-[2.5px] transition-all relative cursor-pointer ${
                          isActive 
                            ? 'border-stayflow-teal scale-105 shadow-xl' 
                            : 'border-white/40 opacity-75 hover:opacity-100 hover:border-white'
                        }`}
                      >
                        {item.type === 'video' ? (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white relative">
                            <Play className="w-4 h-4 fill-white text-white" />
                          </div>
                        ) : (
                          <Image src={item.url} className="w-full h-full object-cover" alt="thumbnail" fill sizes="64px" />
                        )}
                      </button>
                      <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest transition-colors ${
                        isActive ? 'text-stayflow-teal' : 'text-white/80'
                      }`}>
                        {item.label || (item.type === 'video' ? 'VIDEO' : `IMAGE ${idx + 1}`)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Scroll Right Button */}
              {currentRoom.media.length > 3 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (thumbnailScrollRef.current) {
                      thumbnailScrollRef.current.scrollBy({ left: 100, behavior: 'smooth' });
                    }
                  }}
                  className="bg-black/70 hover:bg-stayflow-teal text-white p-2 rounded-full cursor-pointer border-none flex items-center justify-center shrink-0 z-30 shadow-lg"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
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
              <HydratedVideo
                key={activeMediaRoom.media[activeMediaIndex].url}
                src={activeMediaRoom.media[activeMediaIndex].url}
                className="max-h-[75vh] max-w-full rounded-xl shadow-2xl object-contain w-full h-full bg-black"
              />
            ) : (
              <div className="relative w-full h-full max-h-[75vh]">
                <Image
                  key={activeMediaRoom.media[activeMediaIndex].url}
                  src={activeMediaRoom.media[activeMediaIndex].url}
                  className="rounded-xl shadow-2xl object-contain"
                  alt="Full view"
                  fill
                  sizes="100vw"
                />
              </div>
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
