'use client';

import { useState } from 'react';

interface RoomType {
  id: string;
  name: string;
  occupancy: 'Single' | 'Double' | '3-Sharing' | '4-Sharing';
  price: string;
  image: string;
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
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-kk5AoO3jJR2R4qSkyYI9Xli7LRSw0x23_IjHMHtjqwE8nxWTuI9kpU-CTSaeduOVmx2xL7mKbJ7o8Zx4kzUhyMrRjjGqVW68q5ktrnTsLzo9cGuDilZjaDA0J6maQzCLf0HbP1zv5GgLYZAIYFUfjW9X-u7V4DvgIphtIhJrgqBPlCk_SRHLNoZAmTZicYNk7Ax_BJC0S1k661lnzzE-OFJqgKj28glmYjWB_PwQYuKr-SM-rZQkdtuA9spxemYInhoLqO-yZg',
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
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1551632786-7b1c4a1eb2cb?w=600&h=400&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
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

  const currentRoom = rooms.find((r) => r.occupancy === selectedOccupancy) || rooms[0];

  return (
    <div className="w-full bg-white dark:bg-navy-deep/20 py-12 md:py-16 border-b border-border-subtle dark:border-outline-variant transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 text-left space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-deep dark:text-white">
            Living Options
          </h2>
          <span className="text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-wider bg-surface-container dark:bg-navy-deep px-4.5 py-2 rounded-full">
            All prices include utilities &amp; food
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {(['Single', 'Double', '3-Sharing', '4-Sharing'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedOccupancy(type)}
              className={`px-8 py-3.5 rounded-full font-bold text-sm border transition-all cursor-pointer shadow-sm ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-navy-deep p-8 rounded-3xl border border-border-subtle dark:border-outline-variant shadow-sm transition-colors duration-200">
          {/* Room Image */}
          <div className="rounded-2xl overflow-hidden h-64 md:h-80 shadow-inner relative group">
            <img 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              src={currentRoom.image} 
              alt={currentRoom.name}
            />
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
    </div>
  );
}

