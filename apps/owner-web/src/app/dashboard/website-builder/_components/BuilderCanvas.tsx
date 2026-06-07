'use client';

import React, { useState, useEffect, useRef, Component, ReactNode, useTransition } from 'react'; 
import { Card } from '@stayflo/ui';
import { Button } from '@stayflo/ui';
import { Input } from '@stayflo/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@stayflo/ui';
import { Check, Plus, Trash2, MapPin, X, HelpCircle, Download, Move, Edit, Loader2 } from 'lucide-react'; 
import { Badge } from '@stayflo/ui';
import { saveWebsiteData } from '../actions';

interface RoomRectangle {
  id: string;
  x: number; // grid x
  y: number; // grid y
  w: number; // width in cells
  h: number; // height in cells
  type: string; // "Single room" | "Double room" | "Triple room" | "Bathroom" | "Common bath" | "Kitchen" | "Dining area" | "Common room" | "Corridor" | "Staircase" | "Garden" | "Parking" | "Access road" | "Terrace" | "Other building" | "Empty land" | "Text label"
  customName: string; // e.g. "102"
  beds: number;
  doors: ('left' | 'right' | 'top' | 'bottom')[];
  windows: ('left' | 'right' | 'top' | 'bottom')[];
  vacancy: 'Vacant' | 'Occupied' | '1/2 Filled';
  color: string;
  bedStatuses?: ('Vacant' | 'Occupied')[];
  sharingType?: string;
  pricePerBed?: number;
  roomAmenities?: string[];
  bedPositions?: { x: number; y: number; w?: number; h?: number; rotated?: boolean }[];
  labelPos?: { x: number; y: number };
  windowFacing?: 'Road side' | 'Building side' | 'Ground side' | 'None';
}

const getDefaultBedPositions = (bedsCount: number): { x: number; y: number; w?: number; h?: number; rotated?: boolean }[] => {
  if (bedsCount === 1) {
    return [{ x: 15, y: 35, w: 70, h: 30 }];
  } else if (bedsCount === 2) {
    return [
      { x: 15, y: 12, w: 70, h: 26 },
      { x: 15, y: 62, w: 70, h: 26 }
    ];
  } else if (bedsCount === 3) {
    return [
      { x: 6, y: 10, w: 44, h: 26 },
      { x: 50, y: 10, w: 44, h: 26 },
      { x: 25, y: 62, w: 50, h: 26 }
    ];
  } else if (bedsCount === 4) {
    return [
      { x: 6, y: 10, w: 44, h: 26 },
      { x: 50, y: 10, w: 44, h: 26 },
      { x: 6, y: 62, w: 44, h: 26 },
      { x: 50, y: 62, w: 44, h: 26 }
    ];
  }
  return [];
};

// ── Unified colour constants (matches inspo photo) ──────────────────────────
const ROOM_COLOR   = '#1aab8b';   // all residential rooms — teal
const COMMON_COLOR = '#EF9F27';   // kitchen, dining, common room — amber
const DARK_COLOR   = '#374151';   // parking, access road, other building — dark navy
const GARDEN_COLOR = '#3d7a2e';   // garden, empty land — green
const GREY_COLOR   = '#8b949e';   // corridor, staircase — grey
const DOOR_COLOR   = '#ef4444';   // door wall marker — red
const WINDOW_COLOR = '#f59e0b';   // window wall marker — amber

const PALETTE = [
  // ROOMS — all use the same teal
  { name: 'Single room',   category: 'ROOMS',   color: ROOM_COLOR,   text: '#FFFFFF', initials: 'SR' },
  { name: 'Double room',   category: 'ROOMS',   color: ROOM_COLOR,   text: '#FFFFFF', initials: 'DR' },
  { name: 'Triple room',   category: 'ROOMS',   color: ROOM_COLOR,   text: '#FFFFFF', initials: 'TR' },
  { name: '4 sharing room',category: 'ROOMS',   color: ROOM_COLOR,   text: '#FFFFFF', initials: 'FR' },
  // COMMON AREAS
  { name: 'Kitchen',       category: 'COMMON',  color: COMMON_COLOR, text: '#FFFFFF', initials: 'KT' },
  { name: 'Dining area',   category: 'COMMON',  color: COMMON_COLOR, text: '#FFFFFF', initials: 'DA' },
  { name: 'Common room',   category: 'COMMON',  color: COMMON_COLOR, text: '#FFFFFF', initials: 'CR' },
  { name: 'Corridor',      category: 'COMMON',  color: GREY_COLOR,   text: '#FFFFFF', initials: 'CO' },
  { name: 'Staircase',     category: 'COMMON',  color: GREY_COLOR,   text: '#FFFFFF', initials: 'SC' },
  // OUTDOOR
  { name: 'Garden',        category: 'OUTDOOR', color: GARDEN_COLOR, text: '#FFFFFF', initials: 'GD' },
  { name: 'Parking',       category: 'OUTDOOR', color: DARK_COLOR,   text: '#FFFFFF', initials: 'PK' },
  { name: 'Access road',   category: 'OUTDOOR', color: DARK_COLOR,   text: '#FFFFFF', initials: 'RD' },
  { name: 'Terrace',       category: 'OUTDOOR', color: GARDEN_COLOR, text: '#FFFFFF', initials: 'TC' },
  { name: 'Other building',category: 'OUTDOOR', color: DARK_COLOR,   text: '#FFFFFF', initials: 'OB' },
  { name: 'Empty land',    category: 'OUTDOOR', color: GARDEN_COLOR, text: '#FFFFFF', initials: 'EL' },
  { name: 'Text label',    category: 'OUTDOOR', color: 'transparent',text: '#1E293B', initials: 'TX' },
];

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-6 bg-red-50 border border-red-200 rounded-xl text-red-800 text-left space-y-4">
          <h2 className="text-lg font-bold">Something went wrong in the Website Builder:</h2>
          <pre className="p-3 bg-red-100/50 rounded font-mono text-xs overflow-x-auto whitespace-pre-wrap">
            {this.state.error?.toString()}
          </pre>
          {this.state.error?.stack && (
            <pre className="p-3 bg-red-100/50 rounded font-mono text-[10px] overflow-x-auto whitespace-pre-wrap">
              {this.state.error.stack}
            </pre>
          )}
          <div className="pt-2">
            <button 
              onClick={() => {
                localStorage.removeItem('stayflo_builder_state');
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm text-xs transition-all cursor-pointer"
            >
              Clear Storage & Reset App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function BuilderCanvas({ initialData }: { initialData: any }) {
  return (
    <ErrorBoundary>
      <BuilderCanvasComponent initialData={initialData} />
    </ErrorBoundary>
  );
}

function BuilderCanvasComponent({ initialData }: { initialData: any }) {
  const [isPending, startTransition] = useTransition();
  const [pgName, setPgName] = useState('Sunrise PG');
  const [tagline, setTagline] = useState('Your home away from home in Koramangala');
  
  // Location Map Coords
  const [mapCoords, setMapCoords] = useState({ lat: 12.9345, lng: 77.6269 });
  const [address, setAddress] = useState('No. 14, 5th Cross, Koramangala 4th Block, Bengaluru, 560034');

  // Amenities checklist
  const [amenities, setAmenities] = useState<Record<string, boolean>>({
    'Gigabit WiFi': true,
    'CCTV Security': true,
    'RO Drinking Water': true,
    'Power Backup': true,
    'AC Rooms': true,
    'Laundry Service': false,
    'Parking Space': true,
    'Gym / Play Room': true
  });

  // Room category photos
  const [categoryMedia, setCategoryMedia] = useState<Record<string, string[]>>({
    '1 Sharing': [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80',
    ],
    '2 Sharing': [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=300&q=80',
    ],
    'Play Room': [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=300&q=80',
    ],
  });

  // Video walkthrough state and uploader temporary fields
  const [videoUrl, setVideoUrl] = useState('https://www.w3schools.com/html/mov_bbb.mp4');
  const [newPhotoUrls, setNewPhotoUrls] = useState<Record<string, string>>({});
  const [newCategoryName, setNewCategoryName] = useState('');

  // Photo Tag Overlays
  const [photoTags, setPhotoTags] = useState<Record<string, string>>({
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80': 'Spacious Common Area',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=300&q=80': 'Modern 2 Sharing Room',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=300&q=80': 'Equipped Gym & Play Area'
  });

  // Commute Proximity & Optimizer
  const [commuteWalkTime, setCommuteWalkTime] = useState('5 mins');
  const [commuteBikeTime, setCommuteBikeTime] = useState('2 mins');
  const [commuteTransitTime, setCommuteTransitTime] = useState('300m away');
  const [commuteDestination, setCommuteDestination] = useState('Manyata Tech Park');

  // Food Menu Tabular Editor
  const [selectedFoodDay, setSelectedFoodDay] = useState('Mon');
  const [foodMenu, setFoodMenu] = useState<Record<string, { breakfast: string; lunch: string; dinner: string }>>({
    Mon: { breakfast: 'Poha, Sev, Chutney', lunch: 'Rice, Dal, Cabbage Sabzi', dinner: 'Chapati, Aloo Jeera, Salad' },
    Tue: { breakfast: 'Uttapam, Sambar', lunch: 'Jeera Rice, Chole Masala', dinner: 'Chapati, Bhindi Fry, Curd' },
    Wed: { breakfast: 'Idli, Vada, Sambar', lunch: 'Rice, Dal Fry, Potato Roast, Papad', dinner: 'Chapati, Paneer Butter Masala, Salad' },
    Thu: { breakfast: 'Bread Omelette / Jam', lunch: 'Veg Biryani, Raita', dinner: 'Chapati, Egg Curry / Dal Tadka' },
    Fri: { breakfast: 'Dosa, Tomato Chutney', lunch: 'Rice, Sambhar, Beetroot Poriyal', dinner: 'Chapati, Mixed Veg Korma, Salad' },
    Sat: { breakfast: 'Poori, Aloo Masala', lunch: 'Lemon Rice, Curd Rice', dinner: 'Chapati, Kadai Paneer, Salad' },
    Sun: { breakfast: 'Special Masala Dosa', lunch: 'Chicken Biryani / Veg Pulao', dinner: 'Chapati, Dal Makhani, Custard' },
  });

  // House Rules Editor
  const [houseRules, setHouseRules] = useState<string[]>([
    'No smoking inside rooms',
    'Friends allowed until 8 PM, No overnight stay',
    'Noise curfew after 11 PM',
    'Main gate closes at 11 PM',
    '1-month advance notice required before vacating'
  ]);
  const [newRuleText, setNewRuleText] = useState('');

  // Deposit and Rent Inclusions
  const [depositAmount, setDepositAmount] = useState('₹10,000 (1 Month Rent)');
  const [rentInclusions, setRentInclusions] = useState('Includes 3 Meals, Wi-Fi, Housekeeping');

  // Stats variables
  const [statsBeds, setStatsBeds] = useState('500+');
  const [statsReviews, setStatsReviews] = useState('150+');
  const [statsProperties, setStatsProperties] = useState('2+');
  const [statsCities, setStatsCities] = useState('3+');

  // Custom amenity input
  const [newAmenity, setNewAmenity] = useState('');

  // Hero Background Slider Images
  const [heroImages, setHeroImages] = useState<string[]>(() => [
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [newHeroImageUrl, setNewHeroImageUrl] = useState('');

  // Testimonials state and inputs
  const [testimonials, setTestimonials] = useState<any[]>([
    { name: 'Vijay Nair', duration: 'Staying since 8 months', comment: 'Absolutely clean PG with prompt support. The food tastes just like home. Management is helpful and Razorpay bills are transparent.' },
    { name: 'Rohit K.', duration: 'Staying since 1 year', comment: 'Very clean common areas, the WiFi speed is constant at 150Mbps, food menu is varied and fresh.' }
  ]);
  const [newTestimonialName, setNewTestimonialName] = useState('');
  const [newTestimonialDuration, setNewTestimonialDuration] = useState('');
  const [newTestimonialComment, setNewTestimonialComment] = useState('');

  // Floor Selection
  const [activeFloor, setActiveFloor] = useState('Ground floor');
  const [floors, setFloors] = useState(['Ground floor', '1st floor', '2nd floor']);
  
  // Grid Canvas Sizing & Spacing
  const [gridSize, setGridSize] = useState(40); // 40px | 20px | 60px
  const [canvasCols, setCanvasCols] = useState(16);
  const [canvasRows, setCanvasRows] = useState(12);

  // Active Selected Placement Tool
  const [activeTool, setActiveTool] = useState<string>('Single room');

  // Multi-floor rooms state
  const [roomsData, setRoomsData] = useState<Record<string, RoomRectangle[]>>(() => {
    return {
      'Ground floor': [
        {
          id: 'room-1',
          x: 1,
          y: 2,
          w: 4,
          h: 4,
          type: 'Single room',
          customName: '101',
          beds: 1,
          doors: ['left'],
          windows: ['top'],
          vacancy: 'Vacant',
          color: '#14b8a6',
          bedStatuses: ['Vacant']
        },
        {
          id: 'room-2',
          x: 6,
          y: 2,
          w: 5,
          h: 5,
          type: 'Double room',
          customName: '102',
          beds: 2,
          doors: ['left'],
          windows: ['right'],
          vacancy: '1/2 Filled',
          color: '#0f766e',
          bedStatuses: ['Vacant', 'Occupied']
        },
        {
          id: 'room-4',
          x: 6,
          y: 8,
          w: 6,
          h: 3,
          type: 'Kitchen',
          customName: 'Kitchen Area',
          beds: 0,
          doors: ['left'],
          windows: ['bottom'],
          vacancy: 'Vacant',
          color: '#EF9F27',
          bedStatuses: []
        }
      ],
      '1st floor': [],
      '2nd floor': []
    };
  });

  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ clientX: number, clientY: number, startX: number, startY: number } | null>(null);
  const [resizeStart, setResizeStart] = useState<{ clientX: number, clientY: number, startW: number, startH: number, direction: 'right' | 'bottom' | 'both' } | null>(null);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);
  const [draggedBed, setDraggedBed] = useState<{
    roomId: string;
    bedIndex: number;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
  } | null>(null);
  const [draggedLabel, setDraggedLabel] = useState<{
    roomId: string;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  const [copiedRoom, setCopiedRoom] = useState<{ room: RoomRectangle; sourceFloor: string } | null>(null);

  const lastSavedRef = useRef<string | null>(null);
  const roomsDataRef = useRef(roomsData);

  useEffect(() => {
    roomsDataRef.current = roomsData;
  }, [roomsData]);

  // Load custom state from DB on init with validation check
  const loadState = () => {
    if (initialData && Object.keys(initialData).length > 0) {
      const parsed = initialData;
      try {
        if (parsed.pgName) setPgName(parsed.pgName);
        if (parsed.tagline) setTagline(parsed.tagline);
        if (parsed.amenities) setAmenities(parsed.amenities);
        if (parsed.categoryMedia) setCategoryMedia(parsed.categoryMedia);
        if (parsed.videoUrl) setVideoUrl(parsed.videoUrl);
        if (parsed.testimonials) setTestimonials(parsed.testimonials);
        if (parsed.roomsData) {
          const normalized: Record<string, RoomRectangle[]> = {};
          Object.keys(parsed.roomsData).forEach(floorKey => {
            const list = parsed.roomsData[floorKey];
            if (Array.isArray(list)) {
              normalized[floorKey] = list.map((r: any) => ({
                ...r,
                doors: r.doors || [],
                windows: r.windows || [],
                bedPositions: r.bedPositions || (r.beds > 0 ? getDefaultBedPositions(r.beds) : []),
                bedStatuses: r.bedStatuses || (r.beds > 0 ? Array(r.beds).fill('Vacant') : []),
                roomAmenities: r.roomAmenities || [],
                labelPos: r.labelPos || { x: 50, y: 50 }
              }));
            } else {
              normalized[floorKey] = [];
            }
          });
          setRoomsData(normalized);
        }
        if (parsed.canvasCols) setCanvasCols(parsed.canvasCols);
        if (parsed.canvasRows) setCanvasRows(parsed.canvasRows);
        if (parsed.mapCoords) setMapCoords(parsed.mapCoords);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.floors) setFloors(parsed.floors);
        if (parsed.photoTags) setPhotoTags(parsed.photoTags);
        if (parsed.commuteWalkTime) setCommuteWalkTime(parsed.commuteWalkTime);
        if (parsed.commuteBikeTime) setCommuteBikeTime(parsed.commuteBikeTime);
        if (parsed.commuteTransitTime) setCommuteTransitTime(parsed.commuteTransitTime);
        if (parsed.commuteDestination) setCommuteDestination(parsed.commuteDestination);
        if (parsed.foodMenu) setFoodMenu(parsed.foodMenu);
        if (parsed.houseRules) setHouseRules(parsed.houseRules);
        if (parsed.depositAmount) setDepositAmount(parsed.depositAmount);
        if (parsed.rentInclusions) setRentInclusions(parsed.rentInclusions);
        if (parsed.statsBeds) setStatsBeds(parsed.statsBeds);
        if (parsed.statsReviews) setStatsReviews(parsed.statsReviews);
        if (parsed.statsProperties) setStatsProperties(parsed.statsProperties);
        if (parsed.statsCities) setStatsCities(parsed.statsCities);
        if (parsed.heroImages) setHeroImages(parsed.heroImages);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadState();
  }, [initialData]);

  // Central auto-save Effect to ensure zero stale closures (debounced to avoid main thread blockage during room dragging)
  useEffect(() => {
    const handler = setTimeout(() => {
      const stateObj = {
        pgName,
        tagline,
        amenities,
        categoryMedia,
        roomsData,
        canvasCols,
        canvasRows,
        mapCoords,
        address,
        floors,
        videoUrl,
        testimonials,
        photoTags,
        commuteWalkTime,
        commuteBikeTime,
        commuteTransitTime,
        commuteDestination,
        foodMenu,
        houseRules,
        depositAmount,
        rentInclusions,
        statsBeds,
        statsReviews,
        statsProperties,
        statsCities,
        heroImages,
      };
      
      const serialized = JSON.stringify(stateObj);
      if (lastSavedRef.current !== serialized) {
        lastSavedRef.current = serialized;
        // Auto-save to localStorage as a draft
        localStorage.setItem('stayflo_builder_state', serialized);
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(handler);
  }, [
    pgName,
    tagline,
    amenities,
    categoryMedia,
    roomsData,
    canvasCols,
    canvasRows,
    mapCoords,
    address,
    floors,
    videoUrl,
    testimonials,
    photoTags,
    commuteWalkTime,
    commuteBikeTime,
    commuteTransitTime,
    commuteDestination,
    foodMenu,
    houseRules,
    depositAmount,
    rentInclusions,
    statsBeds,
    statsReviews,
    statsProperties,
    statsCities,
    heroImages,
  ]);

  // Publish helper
  const publishToDatabase = async () => {
    const stateObj = {
      pgName, tagline, amenities, categoryMedia, roomsData,
      canvasCols, canvasRows, mapCoords, address, floors,
      videoUrl, testimonials, photoTags, commuteWalkTime,
      commuteBikeTime, commuteTransitTime, commuteDestination,
      foodMenu, houseRules, depositAmount, rentInclusions,
      statsBeds, statsReviews, statsProperties, statsCities, heroImages,
    };
    
    setPublishStatus('Publishing...');
    try {
      await saveWebsiteData(stateObj);
      setPublishStatus('Website Published Successfully!');
    } catch (e) {
      setPublishStatus('Failed to publish');
    }
    
    setTimeout(() => setPublishStatus(null), 3000);
  };

  // Compatibility saveState helper
  const saveState = (updatedState?: any) => {
    // Draft saves happen via useEffect
  };

  // Mouse move and up handlers on document level to resize and drag rooms smoothly
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragStart && activeRoomId) {
        const deltaX = e.clientX - dragStart.clientX;
        const deltaY = e.clientY - dragStart.clientY;
        const deltaXGrid = Math.round(deltaX / gridSize);
        const deltaYGrid = Math.round(deltaY / gridSize);
        
        setRoomsData(prev => {
          const list = prev[activeFloor] || [];
          const updated = list.map(r => {
            if (r.id === activeRoomId) {
              const newX = Math.max(0, Math.min(canvasCols - r.w, dragStart.startX + deltaXGrid));
              const newY = Math.max(0, Math.min(canvasRows - r.h, dragStart.startY + deltaYGrid));
              return { ...r, x: newX, y: newY };
            }
            return r;
          });
          return { ...prev, [activeFloor]: updated };
        });
      }

      if (resizeStart && activeRoomId) {
        const deltaX = e.clientX - resizeStart.clientX;
        const deltaY = e.clientY - resizeStart.clientY;
        const deltaXGrid = Math.round(deltaX / gridSize);
        const deltaYGrid = Math.round(deltaY / gridSize);

        setRoomsData(prev => {
          const list = prev[activeFloor] || [];
          const updated = list.map(r => {
            if (r.id === activeRoomId) {
              let newW = r.w;
              let newH = r.h;
              if (resizeStart.direction === 'right' || resizeStart.direction === 'both') {
                newW = Math.max(2, Math.min(canvasCols - r.x, resizeStart.startW + deltaXGrid));
              }
              if (resizeStart.direction === 'bottom' || resizeStart.direction === 'both') {
                newH = Math.max(2, Math.min(canvasRows - r.y, resizeStart.startH + deltaYGrid));
              }
              return { ...r, w: newW, h: newH };
            }
            return r;
          });
          return { ...prev, [activeFloor]: updated };
        });
      }

      if (draggedBed) {
        const deltaX = e.clientX - draggedBed.startX;
        const deltaY = e.clientY - draggedBed.startY;
        
        // Find the room on canvas to get its pixel size
        const room = (roomsDataRef.current[activeFloor] || []).find(r => r.id === draggedBed.roomId);
        if (room) {
          const roomWidthPx = room.w * gridSize;
          const roomHeightPx = room.h * gridSize;
          
          // Convert pixel delta to percentage delta
          const deltaXPercent = (deltaX / roomWidthPx) * 100;
          const deltaYPercent = (deltaY / roomHeightPx) * 100;
          
          const positions = room.bedPositions && room.bedPositions.length === room.beds
            ? room.bedPositions
            : getDefaultBedPositions(room.beds);
            
          const bedPos = positions[draggedBed.bedIndex];
          if (bedPos) {
            const isRotated = bedPos.rotated;
            const bedW = isRotated ? (bedPos.h || 26) : (bedPos.w || 70);
            const bedH = isRotated ? (bedPos.w || 70) : (bedPos.h || 26);
            
            // Constrain positions within room bounds [0, 100 - bedSize]
            const newLeft = Math.max(0, Math.min(100 - bedW, draggedBed.startLeft + deltaXPercent));
            const newTop = Math.max(0, Math.min(100 - bedH, draggedBed.startTop + deltaYPercent));
            
            setRoomsData(prev => {
              const list = prev[activeFloor] || [];
              const updated = list.map(r => {
                if (r.id === draggedBed.roomId) {
                  const nextPositions = r.bedPositions && r.bedPositions.length === r.beds
                    ? [...r.bedPositions]
                    : getDefaultBedPositions(r.beds);
                    
                  nextPositions[draggedBed.bedIndex] = {
                    ...nextPositions[draggedBed.bedIndex],
                    x: Math.round(newLeft),
                    y: Math.round(newTop)
                  };
                  
                  return { ...r, bedPositions: nextPositions };
                }
                return r;
              });
              return { ...prev, [activeFloor]: updated };
            });
          }
        }
      }

      if (draggedLabel) {
        const deltaX = e.clientX - draggedLabel.startX;
        const deltaY = e.clientY - draggedLabel.startY;
        
        const room = (roomsDataRef.current[activeFloor] || []).find(r => r.id === draggedLabel.roomId);
        if (room) {
          const roomWidthPx = room.w * gridSize;
          const roomHeightPx = room.h * gridSize;
          
          const deltaXPercent = (deltaX / roomWidthPx) * 100;
          const deltaYPercent = (deltaY / roomHeightPx) * 100;
          
          const newLeft = Math.max(5, Math.min(95, draggedLabel.startLeft + deltaXPercent));
          const newTop = Math.max(5, Math.min(95, draggedLabel.startTop + deltaYPercent));
          
          setRoomsData(prev => {
            const list = prev[activeFloor] || [];
            const updated = list.map(r => {
              if (r.id === draggedLabel.roomId) {
                return {
                  ...r,
                  labelPos: {
                    x: Math.round(newLeft),
                    y: Math.round(newTop)
                  }
                };
              }
              return r;
            });
            return { ...prev, [activeFloor]: updated };
          });
        }
      }
    };

    const handleMouseUp = () => {
      setDragStart(null);
      setResizeStart(null);
      setDraggedBed(null);
      setDraggedLabel(null);
    };

    if (dragStart || resizeStart || draggedBed || draggedLabel) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragStart, resizeStart, draggedBed, draggedLabel, activeRoomId, activeFloor, gridSize, canvasCols, canvasRows]);

  // Keyboard Shortcuts for Room Copy, Paste, and Delete (Ctrl+C, Ctrl+V, Delete, Backspace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bypassed if user is focused inside input elements (such as room name editor, or price input)
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'select' || tagName === 'textarea' || activeEl.getAttribute('contenteditable') === 'true') {
          return;
        }
      }

      // Compute selectedRoom locally inside the effect to avoid temporal dead zone
      const currentRooms = (roomsData as Record<string, RoomRectangle[]>)[activeFloor] || [];
      const currentSelectedRoom = activeRoomId ? currentRooms.find(r => r.id === activeRoomId) : undefined;

      // Copy (Ctrl+C / Cmd+C)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        if (activeRoomId && currentSelectedRoom) {
          e.preventDefault();
          setCopiedRoom({
            room: currentSelectedRoom,
            sourceFloor: activeFloor
          });
        }
      }

      // Paste (Ctrl+V / Cmd+V)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        if (copiedRoom) {
          e.preventDefault();
          
          const roomToPaste = copiedRoom.room;
          const sameFloor = copiedRoom.sourceFloor === activeFloor;
          
          const offset = sameFloor ? 1 : 0;
          const newX = Math.max(0, Math.min(canvasCols - roomToPaste.w, roomToPaste.x + offset));
          const newY = Math.max(0, Math.min(canvasRows - roomToPaste.h, roomToPaste.y + offset));
          
          const newId = `room-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const pasted: RoomRectangle = {
            ...roomToPaste,
            id: newId,
            x: newX,
            y: newY,
            bedPositions: roomToPaste.bedPositions ? roomToPaste.bedPositions.map(bp => ({ ...bp })) : undefined,
            labelPos: roomToPaste.labelPos ? { ...roomToPaste.labelPos } : undefined,
            doors: [...(roomToPaste.doors || [])],
            windows: [...(roomToPaste.windows || [])],
            bedStatuses: roomToPaste.bedStatuses ? [...roomToPaste.bedStatuses] : undefined,
            roomAmenities: roomToPaste.roomAmenities ? [...roomToPaste.roomAmenities] : undefined
          };

          setRoomsData(prev => {
            const list = prev[activeFloor] || [];
            return { ...prev, [activeFloor]: [...list, pasted] };
          });
          setActiveRoomId(newId);
        }
      }

      // Delete (Delete / Backspace)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (activeRoomId) {
          e.preventDefault();
          setRoomsData(prev => {
            const list = prev[activeFloor] || [];
            const updated = list.filter(r => r.id !== activeRoomId);
            return { ...prev, [activeFloor]: updated };
          });
          setActiveRoomId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeRoomId, roomsData, copiedRoom, activeFloor, canvasCols, canvasRows]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lat = +(12.9300 + (1 - y / rect.height) * 0.0100).toFixed(4);
    const lng = +(77.6200 + (x / rect.width) * 0.0150).toFixed(4);
    setMapCoords({ lat, lng });
  };

  const toggleAmenity = (name: string) => {
    setAmenities(prev => ({ ...prev, [name]: !prev[name] }));
  };

  // Canvas Drop Handler for visual feature spawning
  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const toolName = e.dataTransfer.getData('text/plain');
    const pItem = PALETTE.find(p => p.name === toolName);
    if (!pItem) return;

    const board = e.currentTarget.querySelector('.grid-board');
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;

    const w = toolName.includes('Single') ? 4 : toolName.includes('Double') ? 5 : toolName.includes('Triple') ? 6 : toolName.includes('4 sharing') ? 6 : 4;
    const h = toolName.includes('Single') ? 3 : toolName.includes('Double') ? 4 : toolName.includes('Triple') ? 4 : toolName.includes('4 sharing') ? 5 : 3;

    // Calculate grid coordinate, centered on cursor and snapped to cells
    const gridX = Math.max(0, Math.min(canvasCols - w, Math.round((dropX - (w * gridSize) / 2) / gridSize)));
    const gridY = Math.max(0, Math.min(canvasRows - h, Math.round((dropY - (h * gridSize) / 2) / gridSize)));

    const newId = `room-${Date.now()}`;
    const bedsCount = (toolName.includes('Bathroom') || toolName.includes('Common bath') || toolName.includes('Kitchen') || toolName.includes('Dining') || toolName.includes('Corridor') || toolName.includes('Staircase') || toolName.includes('Garden') || toolName.includes('Parking') || toolName.includes('Access road') || toolName.includes('Terrace')) ? 0 : (toolName.includes('Single') ? 1 : toolName.includes('Double') ? 2 : toolName.includes('Triple') ? 3 : toolName.includes('4 sharing') ? 4 : 0);
    const newRoom: RoomRectangle = {
      id: newId,
      x: gridX,
      y: gridY,
      w,
      h,
      type: pItem.name,
      customName: toolName.includes('room') ? `${Math.floor(101 + Math.random() * 99)}` : pItem.name,
      beds: bedsCount,
      doors: (toolName.includes('room') || toolName.includes('Room') || toolName.includes('bath') || toolName.includes('Bathroom') || toolName.includes('Common bath')) ? ['left'] : [],
      windows: (toolName.includes('room') || toolName.includes('Room') || toolName.includes('bath') || toolName.includes('Bathroom') || toolName.includes('Common bath')) ? ['right'] : [],
      vacancy: 'Vacant',
      color: pItem.color,
      sharingType: bedsCount > 0 ? `${bedsCount} Sharing` : 'Common / Non-residential',
      pricePerBed: bedsCount > 0 ? 8500 : 0,
      roomAmenities: bedsCount > 0 ? ['Wi-Fi'] : [],
      bedPositions: getDefaultBedPositions(bedsCount)
    };

    newRoom.bedStatuses = Array(newRoom.beds).fill('Vacant');

    setRoomsData(prev => {
      const list = prev[activeFloor] || [];
      return { ...prev, [activeFloor]: [...list, newRoom] };
    });
    setActiveRoomId(newId);
  };

  // Add a new Room Rectangle from sidebar placement click (fallback / keyboard)
  const handleAddRoom = (toolName: string) => {
    const pItem = PALETTE.find(p => p.name === toolName);
    if (!pItem) return;

    const newId = `room-${Date.now()}`;
    const w = toolName.includes('Single') ? 4 : toolName.includes('Double') ? 5 : toolName.includes('Triple') ? 6 : toolName.includes('4 sharing') ? 6 : 4;
    const h = toolName.includes('Single') ? 3 : toolName.includes('Double') ? 4 : toolName.includes('Triple') ? 4 : toolName.includes('4 sharing') ? 5 : 3;

    const bedsCount = (toolName.includes('Bathroom') || toolName.includes('Common bath') || toolName.includes('Kitchen') || toolName.includes('Dining') || toolName.includes('Corridor') || toolName.includes('Staircase') || toolName.includes('Garden') || toolName.includes('Parking') || toolName.includes('Access road') || toolName.includes('Terrace')) ? 0 : (toolName.includes('Single') ? 1 : toolName.includes('Double') ? 2 : toolName.includes('Triple') ? 3 : toolName.includes('4 sharing') ? 4 : 0);
    const newRoom: RoomRectangle = {
      id: newId,
      x: 3,
      y: 3,
      w,
      h,
      type: pItem.name,
      customName: toolName.includes('room') ? `${Math.floor(101 + Math.random() * 99)}` : pItem.name,
      beds: bedsCount,
      doors: (toolName.includes('room') || toolName.includes('Room') || toolName.includes('bath') || toolName.includes('Bathroom') || toolName.includes('Common bath')) ? ['left'] : [],
      windows: (toolName.includes('room') || toolName.includes('Room') || toolName.includes('bath') || toolName.includes('Bathroom') || toolName.includes('Common bath')) ? ['right'] : [],
      vacancy: 'Vacant',
      color: pItem.color,
      sharingType: bedsCount > 0 ? `${bedsCount} Sharing` : 'Common / Non-residential',
      pricePerBed: bedsCount > 0 ? 8500 : 0,
      roomAmenities: bedsCount > 0 ? ['Wi-Fi'] : [],
      bedPositions: getDefaultBedPositions(bedsCount)
    };

    newRoom.bedStatuses = Array(newRoom.beds).fill('Vacant');

    setRoomsData(prev => {
      const list = prev[activeFloor] || [];
      return { ...prev, [activeFloor]: [...list, newRoom] };
    });
    setActiveRoomId(newId);
  };

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const targetRoom = (roomsData[activeFloor] || []).find(r => r.id === id);
    if (!targetRoom) return;

    setActiveRoomId(id);
    setDragStart({
      clientX: e.clientX,
      clientY: e.clientY,
      startX: targetRoom.x,
      startY: targetRoom.y
    });
  };

  const handleResizeStart = (id: string, direction: 'right' | 'bottom' | 'both', e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const targetRoom = (roomsData[activeFloor] || []).find(r => r.id === id);
    if (!targetRoom) return;

    setActiveRoomId(id);
    setResizeStart({
      clientX: e.clientX,
      clientY: e.clientY,
      startW: targetRoom.w,
      startH: targetRoom.h,
      direction
    });
  };

  const updateRoomProperty = (field: keyof RoomRectangle, value: any) => {
    if (!activeRoomId) return;
    setRoomsData(prev => {
      const list = prev[activeFloor] || [];
      const updated = list.map(r => {
        if (r.id === activeRoomId) {
          return { ...r, [field]: value };
        }
        return r;
      });
      return { ...prev, [activeFloor]: updated };
    });
  };

  const updateRoomProperties = (updates: Partial<RoomRectangle>) => {
    if (!activeRoomId) return;
    setRoomsData(prev => {
      const list = prev[activeFloor] || [];
      const updated = list.map(r => {
        if (r.id === activeRoomId) {
          return { ...r, ...updates };
        }
        return r;
      });
      return { ...prev, [activeFloor]: updated };
    });
  };

  const handleBedDragStart = (roomId: string, bedIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const room = (roomsData[activeFloor] || []).find(r => r.id === roomId);
    if (!room) return;

    const positions = room.bedPositions && room.bedPositions.length === room.beds
      ? room.bedPositions
      : getDefaultBedPositions(room.beds);

    const pos = positions[bedIndex];
    if (!pos) return;

    setActiveRoomId(roomId);
    setDraggedBed({
      roomId,
      bedIndex,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: pos.x,
      startTop: pos.y
    });
  };

  const handleLabelDragStart = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const room = (roomsData[activeFloor] || []).find(r => r.id === roomId);
    if (!room) return;

    const currentPos = room.labelPos || { x: 50, y: 50 };

    setActiveRoomId(roomId);
    setDraggedLabel({
      roomId,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: currentPos.x,
      startTop: currentPos.y
    });
  };

  // Cycle toggle fixture (None ➔ Door ➔ Window)
  const handleWallClick = (wall: 'left' | 'right' | 'top' | 'bottom') => {
    if (!activeRoomId || !selectedRoom) return;

    const doorsList = selectedRoom.doors || [];
    const windowsList = selectedRoom.windows || [];

    const hasDoor = doorsList.includes(wall);
    const hasWindow = windowsList.includes(wall);

    let nextDoors = [...doorsList];
    let nextWindows = [...windowsList];

    if (!hasDoor && !hasWindow) {
      // Add door
      nextDoors.push(wall);
    } else if (hasDoor) {
      // Change to window
      nextDoors = nextDoors.filter(w => w !== wall);
      nextWindows.push(wall);
    } else {
      // Remove window
      nextWindows = nextWindows.filter(w => w !== wall);
    }

    updateRoomProperty('doors', nextDoors);
    updateRoomProperty('windows', nextWindows);
  };

  const toggleWallFixture = (field: 'doors' | 'windows', wall: 'left' | 'right' | 'top' | 'bottom') => {
    if (!activeRoomId) return;
    const room = (roomsData[activeFloor] || []).find(r => r.id === activeRoomId);
    if (!room) return;

    const currentList = [...(room[field] || [])];
    const idx = currentList.indexOf(wall);
    if (idx >= 0) {
      currentList.splice(idx, 1);
    } else {
      currentList.push(wall);
    }

    updateRoomProperty(field, currentList);
  };

  const deleteSelectedRoom = () => {
    if (!activeRoomId) return;
    setRoomsData(prev => {
      const list = prev[activeFloor] || [];
      const updated = list.filter(r => r.id !== activeRoomId);
      return { ...prev, [activeFloor]: updated };
    });
    setActiveRoomId(null);
  };

  const clearFloor = () => {
    setRoomsData(prev => ({ ...prev, [activeFloor]: [] }));
    setActiveRoomId(null);
  };

  const addFloor = () => {
    const floorName = prompt('Enter floor name (e.g. 3rd floor):');
    if (!floorName) return;
    const nextFloors = [...floors, floorName];
    setFloors(nextFloors);
    setRoomsData(prev => ({ ...prev, [floorName]: [] }));
    setActiveFloor(floorName);
  };

  const renameFloor = (oldName: string) => {
    const newName = prompt('Enter new floor name:', oldName);
    if (!newName || newName === oldName) return;
    if (floors.includes(newName)) {
      alert('A floor with this name already exists.');
      return;
    }
    setFloors(prev => prev.map(f => f === oldName ? newName : f));
    setRoomsData(prev => {
      const copy = { ...prev };
      copy[newName] = copy[oldName] || [];
      delete copy[oldName];
      return copy;
    });
    if (activeFloor === oldName) {
      setActiveFloor(newName);
    }
  };

  const deleteFloor = (floorName: string) => {
    if (floors.length <= 1) {
      alert('You must keep at least one floor.');
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to delete "${floorName}"? This will delete all room blocks on this floor.`);
    if (!confirmDelete) return;

    const nextFloors = floors.filter(f => f !== floorName);
    setFloors(nextFloors);
    setRoomsData(prev => {
      const copy = { ...prev };
      delete copy[floorName];
      return copy;
    });
    if (activeFloor === floorName) {
      setActiveFloor(nextFloors[0]);
    }
    setActiveRoomId(null);
  };

  const handleCopyFloorLayout = (sourceFloor: string) => {
    const sourceRooms = roomsData[sourceFloor] || [];
    if (sourceRooms.length === 0) {
      alert(`The source floor (${sourceFloor}) has no room blocks to copy.`);
      return;
    }
    
    const currentRooms = roomsData[activeFloor] || [];
    if (currentRooms.length > 0) {
      const proceed = window.confirm(`Copying the layout from "${sourceFloor}" will overwrite all ${currentRooms.length} room blocks on "${activeFloor}". Do you want to proceed?`);
      if (!proceed) return;
    }

    // Deep clone blocks, giving them new unique IDs
    const clonedRooms = sourceRooms.map((room, idx) => ({
      ...room,
      id: `room-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
      bedPositions: room.bedPositions ? room.bedPositions.map(bp => ({ ...bp })) : undefined,
      labelPos: room.labelPos ? { ...room.labelPos } : undefined,
      doors: [...room.doors],
      windows: [...room.windows],
      bedStatuses: room.bedStatuses ? [...room.bedStatuses] : undefined,
      roomAmenities: room.roomAmenities ? [...room.roomAmenities] : undefined
    }));

    setRoomsData(prev => ({
      ...prev,
      [activeFloor]: clonedRooms
    }));
    setActiveRoomId(null);
  };

  const activeRooms = roomsData[activeFloor] || [];
  const selectedRoom = activeRooms.find(r => r.id === activeRoomId);

  // Helper to draw realistic Beds matching user's request (mattress with pillows and vacancy display)
  const renderBeds = (room: RoomRectangle) => {
    const isRoomType = room.type.includes('room') || room.type.includes('Room');
    if (!isRoomType || room.beds <= 0) return null;

    const bedsCount = room.beds;
    const vacancy = room.vacancy;
    const bedStatuses = room.bedStatuses || Array(bedsCount).fill(vacancy === 'Vacant' ? 'Vacant' : 'Occupied');
    const positions = room.bedPositions && room.bedPositions.length === bedsCount
      ? room.bedPositions
      : getDefaultBedPositions(bedsCount);
    
    const beds = [];
    const getBedStyle = (isVacant: boolean) => {
      return `absolute border-[2px] rounded flex items-center justify-center shadow z-15 transition-all cursor-move select-none ${
        isVacant 
          ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white' 
          : 'bg-rose-500 hover:bg-rose-600 border-rose-700 text-white'
      }`;
    };

    const isBedVacant = (idx: number) => {
      return bedStatuses[idx] === 'Vacant';
    };

    for (let i = 0; i < bedsCount; i++) {
      const pos = positions[i];
      if (!pos) continue;
      const vacant = isBedVacant(i);
      const isRotated = pos.rotated;
      const bedW = isRotated ? (pos.h || 26) : (pos.w || 70);
      const bedH = isRotated ? (pos.w || 70) : (pos.h || 26);
      
      beds.push(
        <div 
          key={`bed-${i}`} 
          className={getBedStyle(vacant)} 
          style={{ 
            left: `${pos.x}%`, 
            top: `${pos.y}%`, 
            width: `${bedW}%`, 
            height: `${bedH}%` 
          }}
          onMouseDown={(e) => handleBedDragStart(room.id, i, e)}
          title={`Bed ${i + 1} (${vacant ? 'Vacant' : 'Occupied'}) - Drag to move`}
        >
          {isRotated ? (
            <>
              <div className="absolute top-1 left-1 right-1 h-[18%] bg-white border-b border-slate-700/20 rounded-[1px]" />
              <span 
                className="text-[7px] font-bold text-white uppercase tracking-wider mt-[18%] truncate px-0.5 py-1 pointer-events-none select-none flex items-center justify-center leading-none text-center h-full w-full"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)'
                }}
              >
                {vacant ? 'Vac' : 'Occ'}
              </span>
            </>
          ) : (
            <>
              <div className="absolute left-1 top-1 bottom-1 w-[18%] bg-white border-r border-slate-700/20 rounded-[1px]" />
              <span className="text-[7.5px] font-bold text-white uppercase tracking-wider ml-[18%] truncate px-0.5 pointer-events-none select-none">
                {vacant ? 'Vac' : 'Occ'}
              </span>
            </>
          )}
        </div>
      );
    }
    return beds;
  };

  // Helper to draw realistic swing Door symbols in red
  const renderDoors = (doors: ('left' | 'right' | 'top' | 'bottom')[]) => {
    if (!doors || !Array.isArray(doors)) return null;
    return doors.map(wall => {
      if (wall === 'left') {
        return (
          <svg key={wall} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[2px] w-6 h-6 text-rose-500 overflow-visible pointer-events-none z-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M 0,20 L 16,20" />
            <path d="M 0,4 A 16,16 0 0,1 16,20" strokeDasharray="3,3" />
          </svg>
        );
      }
      if (wall === 'right') {
        return (
          <svg key={wall} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] w-6 h-6 text-rose-500 overflow-visible pointer-events-none z-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M 24,20 L 8,20" />
            <path d="M 24,4 A 16,16 0 0,0 8,20" strokeDasharray="3,3" />
          </svg>
        );
      }
      if (wall === 'top') {
        return (
          <svg key={wall} className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[2px] w-6 h-6 text-rose-500 overflow-visible pointer-events-none z-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M 4,0 L 4,16" />
            <path d="M 20,0 A 16,16 0 0,1 4,16" strokeDasharray="3,3" />
          </svg>
        );
      }
      return (
        <svg key={wall} className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[2px] w-6 h-6 text-rose-500 overflow-visible pointer-events-none z-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M 4,24 L 4,8" />
          <path d="M 20,24 A 16,16 0 0,0 4,8" strokeDasharray="3,3" />
        </svg>
      );
    });
  };

  // Helper to draw realistic Window frames in red double-lines (ladder-grill)
  const renderWindows = (windows: ('left' | 'right' | 'top' | 'bottom')[]) => {
    if (!windows || !Array.isArray(windows)) return null;
    return windows.map(wall => {
      if (wall === 'left') {
        return (
          <svg key={wall} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[6px] w-2 h-8 text-rose-500 overflow-visible pointer-events-none z-20" viewBox="0 0 8 32" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="8" y1="0" x2="8" y2="32" />
            <line x1="0" y1="0" x2="0" y2="32" />
            <line x1="0" y1="6" x2="8" y2="6" />
            <line x1="0" y1="14" x2="8" y2="14" />
            <line x1="0" y1="22" x2="8" y2="22" />
          </svg>
        );
      }
      if (wall === 'right') {
        return (
          <svg key={wall} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[6px] w-2 h-8 text-rose-500 overflow-visible pointer-events-none z-20" viewBox="0 0 8 32" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="0" y1="0" x2="0" y2="32" />
            <line x1="8" y1="0" x2="8" y2="32" />
            <line x1="0" y1="6" x2="8" y2="6" />
            <line x1="0" y1="14" x2="8" y2="14" />
            <line x1="0" y1="22" x2="8" y2="22" />
          </svg>
        );
      }
      if (wall === 'top') {
        return (
          <svg key={wall} className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[6px] w-8 h-2 text-rose-500 overflow-visible pointer-events-none z-20" viewBox="0 0 32 8" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="0" y1="8" x2="32" y2="8" />
            <line x1="0" y1="0" x2="32" y2="0" />
            <line x1="6" y1="0" x2="6" y2="8" />
            <line x1="14" y1="0" x2="14" y2="8" />
            <line x1="22" y1="0" x2="22" y2="8" />
          </svg>
        );
      }
      // bottom
      return (
        <svg key={wall} className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[6px] w-8 h-2 text-rose-500 overflow-visible pointer-events-none z-20" viewBox="0 0 32 8" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="0" y1="0" x2="32" y2="0" />
          <line x1="0" y1="8" x2="32" y2="8" />
          <line x1="6" y1="0" x2="6" y2="8" />
          <line x1="14" y1="0" x2="14" y2="8" />
          <line x1="22" y1="0" x2="22" y2="8" />
        </svg>
      );
    });
  };

  return (
    <div className="h-full overflow-hidden w-full bg-transparent text-left">
      
      {/* Editor Panel Left */}
      <div className="h-full overflow-y-auto p-8 space-y-8">
        
        {publishStatus && (
          <div className="fixed bottom-6 left-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold z-50 border border-slate-800 animate-bounce">
            <Check className="w-4 h-4 text-[#14b8a6]" /> {publishStatus}
          </div>
        )}

        <div className="flex items-center justify-between text-slate-900">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading animate-fade-in" style={{ fontFamily: 'var(--font-heading)' }}>Custom PG Website Builder</h1>
            <p className="text-slate-500 text-sm mt-1">Design customizable architectural floor blueprints and map coordinates</p>
          </div>
          <div className="flex gap-2.5">
            <Button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer h-10 px-4 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all" onClick={() => saveState({})}>Save Draft</Button>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white font-bold h-10 px-5 text-xs uppercase tracking-wider rounded-xl border-none shadow-sm transition-all duration-200" onClick={publishToDatabase}>
              Publish Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="floor_plan" className="w-full">
          <TabsList className="bg-white border border-[#E5E7EB] rounded-xl p-1 text-slate-500 flex flex-wrap gap-1 shadow-sm">
            <TabsTrigger value="cover" className="text-slate-650 hover:text-slate-900 hover:bg-slate-50/50 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg data-[state=active]:bg-[#14b8a6]! data-[state=active]:text-white! transition-all">General</TabsTrigger>
            <TabsTrigger value="floor_plan" className="text-slate-650 hover:text-slate-900 hover:bg-slate-50/50 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg data-[state=active]:bg-[#14b8a6]! data-[state=active]:text-white! transition-all">Architect Blueprint Plan</TabsTrigger>
            <TabsTrigger value="amenities" className="text-slate-650 hover:text-slate-900 hover:bg-slate-50/50 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg data-[state=active]:bg-[#14b8a6]! data-[state=active]:text-white! transition-all">Amenities</TabsTrigger>
            <TabsTrigger value="food" className="text-slate-650 hover:text-slate-900 hover:bg-slate-50/50 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg data-[state=active]:bg-[#14b8a6]! data-[state=active]:text-white! transition-all">Food Menu</TabsTrigger>
            <TabsTrigger value="rules" className="text-slate-650 hover:text-slate-900 hover:bg-slate-50/50 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg data-[state=active]:bg-[#14b8a6]! data-[state=active]:text-white! transition-all">House Rules</TabsTrigger>
            <TabsTrigger value="media" className="text-slate-650 hover:text-slate-900 hover:bg-slate-50/50 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg data-[state=active]:bg-[#14b8a6]! data-[state=active]:text-white! transition-all">Photos & Videos</TabsTrigger>
          </TabsList>

          {/* TAB 1: COVER INFO */}
          <TabsContent value="cover" className="space-y-6 mt-6">
            <Card className="p-8 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl space-y-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading" style={{ fontFamily: 'var(--font-heading)' }}>General Branding</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">PG Name</label>
                  <Input 
                    value={pgName} 
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                    onChange={(e) => { setPgName(e.target.value); }} 
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Branding Tagline</label>
                  <Input 
                    value={tagline} 
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                    onChange={(e) => { setTagline(e.target.value); }} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="group">
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Refundable Deposit Details</label>
                  <Input 
                    value={depositAmount} 
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                    onChange={(e) => { setDepositAmount(e.target.value); }} 
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Rent Inclusions Description</label>
                  <Input 
                    value={rentInclusions} 
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                    onChange={(e) => { setRentInclusions(e.target.value); }} 
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mt-4 space-y-5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading" style={{ fontFamily: 'var(--font-heading)' }}>Location & Proximity Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Display Address</label>
                    <Input 
                      value={address} 
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                      onChange={(e) => { setAddress(e.target.value); }} 
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Commute Destination Office</label>
                    <Input 
                      value={commuteDestination} 
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                      onChange={(e) => { setCommuteDestination(e.target.value); }} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Walk Time (e.g. 5 mins)</label>
                    <Input 
                      value={commuteWalkTime} 
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                      onChange={(e) => { setCommuteWalkTime(e.target.value); }} 
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Bike Time (e.g. 2 mins)</label>
                    <Input 
                      value={commuteBikeTime} 
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                      onChange={(e) => { setCommuteBikeTime(e.target.value); }} 
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Transit distance (e.g. 300m away)</label>
                    <Input 
                      value={commuteTransitTime} 
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                      onChange={(e) => { setCommuteTransitTime(e.target.value); }} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Map Latitude</label>
                    <Input 
                      type="number" 
                      step="0.0001" 
                      value={mapCoords.lat} 
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                      onChange={(e) => { setMapCoords(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0 })); }} 
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Map Longitude</label>
                    <Input 
                      type="number" 
                      step="0.0001" 
                      value={mapCoords.lng} 
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                      onChange={(e) => { setMapCoords(prev => ({ ...prev, lng: parseFloat(e.target.value) || 0 })); }} 
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mt-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-heading" style={{ fontFamily: 'var(--font-heading)' }}>Portfolio Website Stats Bar</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Premium Beds</label>
                    <Input 
                      value={statsBeds} 
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                      onChange={(e) => { setStatsBeds(e.target.value); }} 
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Resident Reviews</label>
                    <Input 
                      value={statsReviews} 
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                      onChange={(e) => { setStatsReviews(e.target.value); }} 
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">PG Properties</label>
                    <Input 
                      value={statsProperties} 
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                      onChange={(e) => { setStatsProperties(e.target.value); }} 
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Cities Available</label>
                    <Input 
                      value={statsCities} 
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                      onChange={(e) => { setStatsCities(e.target.value); }} 
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Resident Testimonials Card */}
            <Card className="p-8 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading" style={{ fontFamily: 'var(--font-heading)' }}>Resident Testimonials</h3>
                <p className="text-xs text-slate-450 mt-1 font-medium">Manage the reviews displayed on the portfolio website.</p>
              </div>

              {/* Add Testimonial Form */}
              <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200/80 space-y-4">
                <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Add New Testimonial</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Resident Name</label>
                    <Input 
                      value={newTestimonialName} 
                      onChange={(e) => setNewTestimonialName(e.target.value)} 
                      placeholder="e.g. Vijay Nair" 
                      className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-10 px-3 rounded-xl transition-all"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Duration / Subtitle</label>
                    <Input 
                      value={newTestimonialDuration} 
                      onChange={(e) => setNewTestimonialDuration(e.target.value)} 
                      placeholder="e.g. Staying since 8 months" 
                      className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-550/20 focus:outline-none text-xs text-slate-800 font-semibold h-10 px-3 rounded-xl transition-all"
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Comment / Review</label>
                  <textarea 
                    value={newTestimonialComment} 
                    onChange={(e) => setNewTestimonialComment(e.target.value)} 
                    placeholder="Enter review comment..." 
                    className="w-full p-4 bg-white border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-550/20 focus:outline-none text-xs text-slate-850 font-semibold rounded-xl transition-all min-h-[80px] resize-none leading-relaxed"
                  />
                </div>
                <Button 
                  onClick={() => {
                    if (!newTestimonialName.trim() || !newTestimonialComment.trim()) return;
                    setTestimonials(prev => [
                      ...prev,
                      {
                        name: newTestimonialName.trim(),
                        duration: newTestimonialDuration.trim() || 'Resident',
                        comment: newTestimonialComment.trim()
                      }
                    ]);
                    setNewTestimonialName('');
                    setNewTestimonialDuration('');
                    setNewTestimonialComment('');
                  }}
                  className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold uppercase tracking-widest h-10 px-5 rounded-xl border-none cursor-pointer shadow-md transition-all duration-200"
                >
                  Add Testimonial
                </Button>
              </div>

              {/* List of current testimonials */}
              <div className="space-y-3 mt-4">
                {testimonials.map((t, idx) => (
                  <div key={idx} className="p-4 border border-slate-200/80 rounded-2xl bg-white flex justify-between items-start gap-4 hover:shadow-md transition-all">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800 font-heading">{t.name} <span className="text-[10px] text-slate-400 font-semibold">({t.duration})</span></p>
                      <p className="text-xs text-slate-505 italic leading-relaxed">"{t.comment}"</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 h-8 text-[10px] px-3 font-semibold rounded-xl"
                      onClick={() => {
                        setTestimonials(prev => prev.filter((_, i) => i !== idx));
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: INTERACTIVE BLUEPRINT GRID BUILDER */}
          <TabsContent value="floor_plan" className="space-y-4 mt-4">
            
            {/* Top floor tabs selector */}
            <div className="flex gap-1.5 border-b border-slate-200 pb-2 flex-wrap animate-fade-in">
              {floors.map(fl => {
                const isActive = activeFloor === fl;
                return (
                  <div
                    key={fl}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${isActive ? 'bg-[#14b8a6] text-white border-[#14b8a6]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'}`}
                  >
                    <button
                      onClick={() => { setActiveFloor(fl); setActiveRoomId(null); }}
                      className="cursor-pointer font-bold"
                    >
                      {fl}
                    </button>
                    {isActive && (
                      <div className="flex items-center gap-1 ml-1 border-l border-white/30 pl-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); renameFloor(fl); }}
                          title="Rename Floor"
                          className="hover:text-teal-100 transition-colors p-0.5"
                        >
                          <Edit size={12} className="stroke-[2.5]" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteFloor(fl); }}
                          title="Delete Floor"
                          className="hover:text-rose-200 text-rose-100 transition-colors p-0.5"
                        >
                          <Trash2 size={12} className="stroke-[2.5]" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              <button 
                onClick={addFloor}
                className="px-4 py-1.5 text-xs font-semibold rounded-md border border-dashed border-teal-600 text-[#14b8a6] bg-white flex items-center gap-1 hover:bg-slate-50 shadow-sm"
              >
                + Add floor
              </button>
              {floors.length > 1 && (
                <select
                  value=""
                  onChange={(e) => {
                    const sourceFloor = e.target.value;
                    if (!sourceFloor) return;
                    handleCopyFloorLayout(sourceFloor);
                    e.target.value = "";
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm cursor-pointer outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6]"
                >
                  <option value="" disabled>Copy layout from...</option>
                  {floors.filter(f => f !== activeFloor).map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Floor Layout Controls */}
            <Card className="p-4 bg-white text-slate-800 flex flex-wrap gap-4 items-center justify-between border border-[#E5E7EB] rounded-2xl shadow-sm">
              <div className="flex gap-3 items-center text-xs flex-wrap">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">GRID SIZE:</span>
                {[{ label: 'Fine (20px)', val: 20 }, { label: 'Standard (40px)', val: 40 }, { label: 'Large (60px)', val: 60 }].map(g => (
                  <button key={g.val} onClick={() => setGridSize(g.val)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${gridSize === g.val ? 'bg-[#14b8a6] border-[#14b8a6] text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {g.label}
                  </button>
                ))}
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider ml-2">CANVAS:</span>
                <button onClick={() => setCanvasCols(Math.max(8, canvasCols - 2))} className="px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-50">− W</button>
                <button onClick={() => setCanvasCols(canvasCols + 2)} className="px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-50">+ W</button>
                <button onClick={() => setCanvasRows(Math.max(6, canvasRows - 2))} className="px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-50">− H</button>
                <button onClick={() => setCanvasRows(canvasRows + 2)} className="px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-50">+ H</button>
              </div>
              <Button size="sm" variant="destructive" className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-bold uppercase tracking-wider h-8 rounded-lg shadow-sm" onClick={clearFloor}>Clear floor</Button>
            </Card>

            {/* Vector Layout Canvas */}
            <div className="flex flex-col lg:flex-row gap-6 lg:h-[620px] lg:overflow-hidden h-auto overflow-visible">
              
              {/* Palette Column Left — Rooms only */}
              <div className="w-full lg:w-56 bg-white border border-[#E5E7EB] p-6 rounded-2xl overflow-y-auto space-y-5 text-left shadow-sm">
                
                {/* Room Types */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Add Room</p>
                  <div className="space-y-1.5">
                    {PALETTE.filter(p => p.category === 'ROOMS').map(p => (
                      <button
                        key={p.name}
                        onClick={() => handleAddRoom(p.name)}
                        className="w-full p-2.5 rounded flex items-center justify-between text-xs transition-all border text-slate-700 bg-white hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
                          <span className="font-semibold">{p.name}</span>
                        </div>
                        <span className="text-[9px] text-[#14b8a6] font-bold">+ ADD</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Context / Environment Blocks */}
                <div className="mt-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Surroundings</p>
                  <p className="text-[9px] text-slate-400 mb-2 leading-tight">Place context blocks beside rooms so leads understand window-facing direction.</p>
                  <div className="space-y-1.5">
                    {PALETTE.filter(p => ['Access road', 'Other building', 'Garden', 'Parking', 'Corridor', 'Staircase'].includes(p.name)).map(p => (
                      <button
                        key={p.name}
                        onClick={() => handleAddRoom(p.name)}
                        className="w-full p-2.5 rounded flex items-center justify-between text-xs transition-all border text-slate-700 bg-white hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm border border-slate-300" style={{ background: p.color }} />
                          <span className="font-semibold">{p.name}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold">+ ADD</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tip */}
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-[10px] text-teal-700 leading-relaxed">
                  <strong>Tip:</strong> Place an "Access road" block next to a room, then set that room's window wall to "Window" — leads will see it faces the road.
                </div>

              </div>

              {/* Drawing Canvas Area (Center) — Full Grid Canvas with Room + Context Blocks */}
              <div className="flex-1 flex flex-col gap-3 min-w-0">
                {/* Grid canvas */}
                <div
                  className="flex-1 bg-slate-50 rounded-xl overflow-auto border border-slate-200 p-4 flex items-start justify-start relative shadow-inner select-none"
                  onClick={() => setActiveRoomId(null)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleCanvasDrop}
                >
                  {/* Legend strip */}
                  <div className="absolute top-2 right-3 flex gap-2 z-20 pointer-events-none">
                    <span className="text-[9px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-500 font-semibold shadow-sm">Drag to move · Handles to resize · Click to select</span>
                  </div>

                  {/* SVG/Grid Drawing Board */}
                  <div
                    className="grid-board relative border border-slate-300 bg-white shadow-md rounded overflow-visible"
                    style={{
                      width: `${canvasCols * gridSize}px`,
                      height: `${canvasRows * gridSize}px`,
                      backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
                      backgroundSize: `${gridSize}px ${gridSize}px`
                    }}
                  >
                    {activeRooms.map(room => {
                      const isSelected = activeRoomId === room.id;
                      const left = room.x * gridSize;
                      const top = room.y * gridSize;
                      const width = room.w * gridSize;
                      const height = room.h * gridSize;
                      const isRoom = room.type.toLowerCase().includes('room');
                      const isRoad = room.type === 'Access road';
                      const isBuilding = room.type === 'Other building';
                      const isGarden = room.type === 'Garden';
                      const isParking = room.type === 'Parking';
                      const isCorridor = room.type === 'Corridor';
                      const isStaircase = room.type === 'Staircase';
                      const isTextLabel = room.type === 'Text label';

                      // Compute window-facing from what block is adjacent on the window side
                      let inferredFacing: string | null = null;
                      if (isRoom && room.windows && room.windows.length > 0) {
                        const windowSide = room.windows[0];
                        // Find any block adjacent on that side
                        const neighbor = activeRooms.find(other => {
                          if (other.id === room.id) return false;
                          if (windowSide === 'right') return other.x === room.x + room.w && other.y < room.y + room.h && other.y + other.h > room.y;
                          if (windowSide === 'left') return other.x + other.w === room.x && other.y < room.y + room.h && other.y + other.h > room.y;
                          if (windowSide === 'top') return other.y + other.h === room.y && other.x < room.x + room.w && other.x + other.w > room.x;
                          if (windowSide === 'bottom') return other.y === room.y + room.h && other.x < room.x + room.w && other.x + other.w > room.x;
                          return false;
                        });
                        if (neighbor) {
                          if (neighbor.type === 'Access road') inferredFacing = 'Road side';
                          else if (neighbor.type === 'Other building') inferredFacing = 'Building side';
                          else if (neighbor.type === 'Garden' || neighbor.type === 'Parking' || neighbor.type === 'Empty land') inferredFacing = 'Ground side';
                        }
                      }

                      return (
                        <div
                          key={room.id}
                          onMouseDown={(e) => handleDragStart(room.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className={`absolute rounded-xl select-none ${isTextLabel ? '' : 'border-2'} cursor-grab active:cursor-grabbing overflow-hidden`}
                          style={{
                            left: `${left}px`,
                            top: `${top}px`,
                            width: `${width}px`,
                            height: `${height}px`,
                            backgroundColor: room.color,
                            borderColor: isSelected ? '#EF9F27' : (isTextLabel ? 'transparent' : '#1e293b'),
                            borderWidth: isTextLabel ? (isSelected ? '2px' : '0px') : (isSelected ? '3px' : '2px'),
                            borderStyle: isTextLabel && isSelected ? 'dashed' : 'solid',
                            boxShadow: isSelected ? '0 0 14px rgba(239,159,39,0.65)' : '0 2px 8px rgba(0,0,0,0.18)',
                            zIndex: isSelected ? 30 : 10
                          }}
                        >
                          {/* ── ROOM BLOCK: card-style interior ── */}
                          {isRoom ? (
                            <div className="absolute inset-0 flex flex-col p-2 pointer-events-none select-none">
                              {/* Top row: room name + facing icon */}
                              <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
                                <span className="text-[9px] font-black text-white tracking-widest uppercase leading-none drop-shadow">
                                  ROOM {room.customName}
                                </span>
                                {inferredFacing && (
                                  <span className="text-[9px] leading-none drop-shadow">
                                    {inferredFacing === 'Road side' ? '🚗' : inferredFacing === 'Building side' ? '🏢' : '🌳'}
                                  </span>
                                )}
                              </div>

                              {/* Bed cards — centered in remaining space */}
                              {room.beds > 0 && (() => {
                                const bedsCount = room.beds;
                                const bedStatuses = room.bedStatuses || Array(bedsCount).fill('Vacant');
                                // Scale bed card size to fit room block
                                const availW = width - 16;
                                const availH = height - 36;
                                const gapPx = 4;
                                const maxBedW = Math.min(36, Math.floor((availW - gapPx * (bedsCount - 1)) / bedsCount));
                                const bedW = Math.max(14, maxBedW);
                                const bedH = Math.min(52, Math.max(20, availH));
                                const totalBedsW = bedW * bedsCount + gapPx * (bedsCount - 1);
                                const show = bedW >= 14 && bedH >= 18;

                                return show ? (
                                  <div
                                    className="flex-1 flex items-center justify-center"
                                    style={{ gap: `${gapPx}px` }}
                                  >
                                    {Array(bedsCount).fill(0).map((_, bIdx) => {
                                      const isOccupied = bedStatuses[bIdx] === 'Occupied';
                                      return (
                                        <div
                                          key={bIdx}
                                          style={{ width: bedW, height: bedH, flexShrink: 0 }}
                                          className={`rounded-lg flex items-center justify-center pointer-events-none ${
                                            isOccupied
                                              ? 'bg-[#0f1c2e] shadow-md'
                                              : 'border-2 border-dashed border-teal-300 bg-white/10'
                                          }`}
                                        >
                                          {isOccupied ? (
                                            <svg
                                              style={{ width: Math.max(8, bedW * 0.45), height: Math.max(8, bedW * 0.45) }}
                                              viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                                            >
                                              <circle cx="12" cy="7" r="4"/>
                                              <path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                                            </svg>
                                          ) : (
                                            <svg
                                              style={{ width: Math.max(8, bedW * 0.4), height: Math.max(8, bedW * 0.4) }}
                                              viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2.5"
                                            >
                                              <path strokeLinecap="round" d="M12 5v14M5 12h14"/>
                                            </svg>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  // Too small — just show a compact label
                                  <div className="flex-1 flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-white/70">{bedsCount}B</span>
                                  </div>
                                );
                              })()}
                            </div>
                          ) : (
                            /* ── NON-ROOM block: simple label ── */
                            <>
                              <div
                                className={`absolute text-[10px] font-bold z-10 rounded px-1 py-0.5 select-none pointer-events-none flex items-center justify-center ${
                                  isTextLabel ? 'text-slate-800 bg-transparent' : 'text-white bg-slate-900/50 shadow'
                                }`}
                                style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
                              >
                                {room.customName}
                              </div>

                              {/* Road stripe */}
                              {isRoad && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1 overflow-hidden">
                                  {room.w >= room.h
                                    ? <div className="w-full border-t-[3px] border-dashed border-white/70" />
                                    : <div className="h-full border-l-[3px] border-dashed border-white/70" />}
                                  <span className="absolute text-[8px] font-black text-white/80 uppercase tracking-widest top-1 left-1">ROAD</span>
                                </div>
                              )}
                              {isBuilding && (
                                <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden rounded" style={{
                                  backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 2px,transparent 0,transparent 8px)',
                                  backgroundSize: '10px 10px'
                                }} />
                              )}
                              {isGarden && (
                                <div className="absolute inset-0 pointer-events-none p-1 overflow-hidden flex flex-wrap gap-1.5 items-center justify-center opacity-60">
                                  {[...Array(6)].map((_, i) => (
                                    <svg key={i} className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 2a1 1 0 0 1 1 1v7.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V3a1 1 0 0 1 1-1z" />
                                    </svg>
                                  ))}
                                </div>
                              )}
                              {isParking && (
                                <span className="absolute inset-0 flex items-center justify-center text-white/50 text-3xl font-black pointer-events-none select-none">P</span>
                              )}
                              {isStaircase && (
                                <div className="absolute inset-0 flex flex-col justify-around pointer-events-none p-1 opacity-40">
                                  {[...Array(5)].map((_, i) => <div key={i} className="border-t border-white w-full" />)}
                                </div>
                              )}
                              {isCorridor && (
                                <div className="absolute inset-0 flex items-center pointer-events-none px-2">
                                  <div className="w-full border-t-2 border-dashed border-white/50" />
                                </div>
                              )}
                            </>
                          )}

                          {/* ── Door markers: thick solid bar on the wall, flush inside edge ── */}
                          {isRoom && (room.doors || []).map(side => (
                            <div key={`door-${side}`} className="absolute pointer-events-none z-20" style={{
                              backgroundColor: DOOR_COLOR,
                              borderRadius: 3,
                              ...(side === 'top'    ? { top: 0,    left: '18%', width: '32%', height: 9 } : {}),
                              ...(side === 'bottom' ? { bottom: 0, left: '18%', width: '32%', height: 9 } : {}),
                              ...(side === 'left'   ? { left: 0,   top: '18%',  width: 9, height: '32%' } : {}),
                              ...(side === 'right'  ? { right: 0,  top: '18%',  width: 9, height: '32%' } : {}),
                            }} />
                          ))}

                          {/* ── Window markers: short amber bar with inner slot, centered on wall ── */}
                          {isRoom && (room.windows || []).map(side => (
                            <div key={`win-${side}`} className="absolute pointer-events-none z-20" style={{
                              backgroundColor: WINDOW_COLOR,
                              borderRadius: 3,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              ...(side === 'top'    ? { top: 0,    left: '58%', width: '22%', height: 7 } : {}),
                              ...(side === 'bottom' ? { bottom: 0, left: '58%', width: '22%', height: 7 } : {}),
                              ...(side === 'left'   ? { left: 0,   top: '58%',  width: 7, height: '22%' } : {}),
                              ...(side === 'right'  ? { right: 0,  top: '58%',  width: 7, height: '22%' } : {}),
                            }}>
                              {/* Inner white slot — simulates glazing gap */}
                              <div style={{
                                borderRadius: 1,
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                ...(side === 'top' || side === 'bottom'
                                  ? { width: '55%', height: '45%' }
                                  : { width: '45%', height: '55%' }),
                              }} />
                            </div>
                          ))}

                          {/* Resize handles */}
                          {isSelected && (
                            <>
                              <div className="absolute -right-2 top-2 bottom-2 w-4 cursor-e-resize z-35" onMouseDown={(e) => handleResizeStart(room.id, 'right', e)}>
                                <div className="absolute right-[6px] top-0 bottom-0 w-1.5 bg-amber-500 rounded shadow-sm" />
                              </div>
                              <div className="absolute -bottom-2 left-2 right-2 h-4 cursor-s-resize z-35" onMouseDown={(e) => handleResizeStart(room.id, 'bottom', e)}>
                                <div className="absolute bottom-[6px] left-0 right-0 h-1.5 bg-amber-500 rounded shadow-sm" />
                              </div>
                              <div
                                className="absolute bottom-0 right-0 w-5 h-5 translate-x-1/2 translate-y-1/2 cursor-se-resize bg-amber-500 hover:bg-amber-600 border-2 border-white rounded-full flex items-center justify-center z-50 shadow-lg"
                                onMouseDown={(e) => handleResizeStart(room.id, 'both', e)}
                              >
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Properties Panel (Right) */}
              <div className="w-full lg:w-64 bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between text-left text-slate-800 shadow-sm">
                <div className="space-y-4 overflow-y-auto max-h-[420px] pr-1">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span>Room Inspector</span>
                    {selectedRoom && (
                      <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                        {selectedRoom.beds} bed{selectedRoom.beds !== 1 ? 's' : ''}
                      </span>
                    )}
                  </h3>

                  {selectedRoom ? (
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">Room Type</label>
                        <Badge variant="secondary" style={{ background: selectedRoom.color, color: '#FFF' }} className="border-none font-semibold">
                          {selectedRoom.type}
                        </Badge>
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold mb-1">Room Label / Number</label>
                        <Input 
                          value={selectedRoom.customName} 
                          onChange={(e) => updateRoomProperty('customName', e.target.value)} 
                          className="h-8 text-xs bg-white border-slate-200 text-slate-900 focus:ring-[#14b8a6]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold mb-1">Vacancy Status</label>
                        <select
                          value={selectedRoom.vacancy}
                          onChange={(e) => {
                            const val = e.target.value as 'Vacant' | 'Occupied' | '1/2 Filled';
                            updateRoomProperty('vacancy', val);
                            
                            // Synchronize bedStatuses to match
                            if (selectedRoom.beds > 0) {
                              let nextStatuses = [...(selectedRoom.bedStatuses || Array(selectedRoom.beds).fill('Vacant'))];
                              if (val === 'Vacant') {
                                nextStatuses = Array(selectedRoom.beds).fill('Vacant');
                              } else if (val === 'Occupied') {
                                nextStatuses = Array(selectedRoom.beds).fill('Occupied');
                              } else if (val === '1/2 Filled') {
                                nextStatuses = Array(selectedRoom.beds).fill('Vacant');
                                if (nextStatuses.length > 0) {
                                  nextStatuses[nextStatuses.length - 1] = 'Occupied';
                                }
                              }
                              updateRoomProperty('bedStatuses', nextStatuses);
                            }
                          }}
                          className="w-full h-8 text-xs bg-white border border-slate-200 rounded px-2 text-slate-900 focus:ring-[#14b8a6]"
                        >
                          <option value="Vacant">Vacant</option>
                          <option value="Occupied">Occupied</option>
                          <option value="1/2 Filled">1/2 Filled</option>
                        </select>
                      </div>

                      {/* Only show beds controls and custom features for actual rooms */}
                      {(selectedRoom.type.includes('room') || selectedRoom.type.includes('Room')) && (
                        <>
                          {/* Sharing Type Dropdown */}
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Sharing Type</label>
                            <select
                              value={selectedRoom.sharingType || (selectedRoom.beds === 1 ? '1 Sharing' : selectedRoom.beds === 2 ? '2 Sharing' : selectedRoom.beds === 3 ? '3 Sharing' : selectedRoom.beds === 4 ? '4 Sharing' : '1 Sharing')}
                              onChange={(e) => {
                                const val = e.target.value;
                                const bedsCount = val.includes('1') ? 1 : val.includes('2') ? 2 : val.includes('3') ? 3 : val.includes('4') ? 4 : selectedRoom.beds;
                                const nextPositions = getDefaultBedPositions(bedsCount);
                                const nextStatuses = Array(bedsCount).fill('Vacant');
                                updateRoomProperties({
                                  sharingType: val,
                                  beds: bedsCount,
                                  bedStatuses: nextStatuses,
                                  bedPositions: nextPositions,
                                  vacancy: 'Vacant'
                                });
                              }}
                              className="w-full h-8 text-xs bg-white border border-slate-200 rounded px-2 text-slate-900 focus:ring-[#14b8a6]"
                            >
                              <option value="1 Sharing">1 Sharing (Single)</option>
                              <option value="2 Sharing">2 Sharing (Double)</option>
                              <option value="3 Sharing">3 Sharing (Triple)</option>
                              <option value="4 Sharing">4 Sharing (Quad)</option>
                            </select>
                          </div>

                          {/* Window Facing Direction */}
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Window Facing</label>
                            <select
                              value={selectedRoom.windowFacing || 'Road side'}
                              onChange={(e) => updateRoomProperty('windowFacing', e.target.value)}
                              className="w-full h-8 text-xs bg-white border border-slate-200 rounded px-2 text-slate-900 focus:ring-[#14b8a6]"
                            >
                              <option value="Road side">Road side (🚗)</option>
                              <option value="Building side">Building side (🏢)</option>
                              <option value="Ground side">Ground side (🌳)</option>
                              <option value="None">None</option>
                            </select>
                          </div>

                          {/* Price Per Bed */}
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Price per Bed (Monthly Rent)</label>
                            <div className="relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                <span className="text-slate-500 text-[10px]">₹</span>
                              </div>
                              <Input
                                type="number"
                                value={selectedRoom.pricePerBed !== undefined ? selectedRoom.pricePerBed : 8500}
                                onChange={(e) => updateRoomProperty('pricePerBed', parseFloat(e.target.value) || 0)}
                                className="pl-6 h-8 text-xs bg-white border-slate-200 text-slate-900 focus:ring-[#14b8a6]"
                                placeholder="e.g. 8500"
                              />
                            </div>
                          </div>

                          {/* Room-specific Amenities */}
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Room Amenities</label>
                            <div className="grid grid-cols-2 gap-1.5 mt-1 bg-slate-50 p-2 rounded border border-slate-150">
                              {['AC', 'Attached Washroom', 'Wi-Fi', 'TV', 'Geyser', 'Balcony', 'Wardrobe'].map(amenity => {
                                const hasAmenity = (selectedRoom.roomAmenities || []).includes(amenity);
                                return (
                                  <label key={amenity} className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-700">
                                    <input
                                      type="checkbox"
                                      checked={hasAmenity}
                                      onChange={() => {
                                        const currentAmenities = selectedRoom.roomAmenities || [];
                                        const nextAmenities = currentAmenities.includes(amenity)
                                          ? currentAmenities.filter(a => a !== amenity)
                                          : [...currentAmenities, amenity];
                                        updateRoomProperty('roomAmenities', nextAmenities);
                                      }}
                                      className="accent-[#14b8a6] w-3 h-3 cursor-pointer"
                                    />
                                    <span>{amenity}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {selectedRoom.beds > 0 && (
                            <div className="space-y-2 border-t border-slate-100 pt-3">
                              <label className="block text-slate-655 font-bold text-xs">Bed-Wise Vacancy</label>
                              <div className="space-y-1.5">
                                {Array(selectedRoom.beds).fill(0).map((_, idx) => {
                                  const bedStatuses = selectedRoom.bedStatuses || Array(selectedRoom.beds).fill('Vacant');
                                  const isVacant = bedStatuses[idx] === 'Vacant';
                                  return (
                                    <div key={idx} className="flex flex-col gap-1.5 p-2 bg-slate-50 rounded border border-slate-150">
                                      <div className="flex items-center justify-between">
                                        <span className="font-semibold text-slate-700">Bed {idx + 1}</span>
                                        <button
                                          onClick={() => {
                                            const nextPositions = selectedRoom.bedPositions && selectedRoom.bedPositions.length === selectedRoom.beds
                                              ? [...selectedRoom.bedPositions]
                                              : getDefaultBedPositions(selectedRoom.beds);
                                            
                                            nextPositions[idx] = {
                                              ...nextPositions[idx],
                                              rotated: !nextPositions[idx].rotated
                                            };
                                            
                                            updateRoomProperty('bedPositions', nextPositions);
                                          }}
                                          className="px-2 py-0.5 text-[9px] font-bold rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-1 shadow-sm"
                                          title="Rotate Mattress"
                                        >
                                          <svg className="w-2.5 h-2.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                                          </svg>
                                          Rotate
                                        </button>
                                      </div>
                                      <div className="flex gap-1 justify-between w-full">
                                        <button
                                          onClick={() => {
                                            const nextStatuses = [...bedStatuses];
                                            nextStatuses[idx] = 'Vacant';
                                            
                                            const allVacant = nextStatuses.every(s => s === 'Vacant');
                                            const allOccupied = nextStatuses.every(s => s === 'Occupied');
                                            const overallVacancy = allVacant ? 'Vacant' : allOccupied ? 'Occupied' : '1/2 Filled';
                                            
                                            updateRoomProperties({
                                              bedStatuses: nextStatuses,
                                              vacancy: overallVacancy
                                            });
                                          }}
                                          className={`flex-1 py-1 text-[9px] font-bold rounded-md transition-all border ${
                                            isVacant 
                                              ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm' 
                                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                                          }`}
                                        >
                                          Vacant
                                        </button>
                                        <button
                                          onClick={() => {
                                            const nextStatuses = [...bedStatuses];
                                            nextStatuses[idx] = 'Occupied';
                                            
                                            const allVacant = nextStatuses.every(s => s === 'Vacant');
                                            const allOccupied = nextStatuses.every(s => s === 'Occupied');
                                            const overallVacancy = allVacant ? 'Vacant' : allOccupied ? 'Occupied' : '1/2 Filled';
                                            
                                            updateRoomProperties({
                                              bedStatuses: nextStatuses,
                                              vacancy: overallVacancy
                                            });
                                          }}
                                          className={`flex-1 py-1 text-[9px] font-bold rounded-md transition-all border ${
                                            !isVacant 
                                              ? 'bg-rose-500 border-rose-600 text-white shadow-sm' 
                                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                                          }`}
                                        >
                                          Occupied
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Visual Wall Fixtures Controller */}
                      <div className="space-y-2 border-t border-slate-100 pt-3">
                        <label className="block text-slate-655 font-bold text-xs">Visual Wall Fixtures</label>
                        <p className="text-[10px] text-slate-450 leading-tight">Click on any wall to cycle: None ➔ Door ➔ Window</p>
                        
                        <div className="flex justify-center py-4 bg-slate-50 rounded-lg border border-slate-150">
                          <div className="relative w-[110px] h-[110px] bg-white border-2 border-slate-300 rounded">
                            <div className="absolute inset-4 bg-slate-50 border border-slate-150 rounded flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase select-none">
                              Room
                            </div>

                            {/* Top Wall Button */}
                            <button 
                              onClick={() => handleWallClick('top')}
                              className={`absolute -top-1.5 left-2 right-2 h-3 rounded hover:bg-[#14b8a6]/30 cursor-pointer flex items-center justify-center transition-all z-10 ${
                                (selectedRoom.doors || []).includes('top') ? 'bg-rose-500 border border-rose-600' :
                                (selectedRoom.windows || []).includes('top') ? 'bg-amber-500 border border-amber-600' : 'bg-slate-200 hover:bg-slate-300'
                              }`}
                              title="Top Wall"
                            >
                              <span className="text-[8px] font-bold text-white leading-none scale-75">
                                {(selectedRoom.doors || []).includes('top') ? 'D' : (selectedRoom.windows || []).includes('top') ? 'W' : ''}
                              </span>
                            </button>

                            {/* Bottom Wall Button */}
                            <button 
                              onClick={() => handleWallClick('bottom')}
                              className={`absolute -bottom-1.5 left-2 right-2 h-3 rounded hover:bg-[#14b8a6]/30 cursor-pointer flex items-center justify-center transition-all z-10 ${
                                (selectedRoom.doors || []).includes('bottom') ? 'bg-rose-500 border border-rose-600' :
                                (selectedRoom.windows || []).includes('bottom') ? 'bg-amber-500 border border-amber-600' : 'bg-slate-200 hover:bg-slate-300'
                              }`}
                              title="Bottom Wall"
                            >
                              <span className="text-[8px] font-bold text-white leading-none scale-75">
                                {(selectedRoom.doors || []).includes('bottom') ? 'D' : (selectedRoom.windows || []).includes('bottom') ? 'W' : ''}
                              </span>
                            </button>

                            {/* Left Wall Button */}
                            <button 
                              onClick={() => handleWallClick('left')}
                              className={`absolute top-2 bottom-2 -left-1.5 w-3 rounded hover:bg-[#14b8a6]/30 cursor-pointer flex items-center justify-center transition-all z-10 ${
                                (selectedRoom.doors || []).includes('left') ? 'bg-rose-500 border border-rose-600' :
                                (selectedRoom.windows || []).includes('left') ? 'bg-amber-500 border border-amber-600' : 'bg-slate-200 hover:bg-slate-300'
                              }`}
                              title="Left Wall"
                            >
                              <span className="text-[8px] font-bold text-white leading-none scale-75">
                                {(selectedRoom.doors || []).includes('left') ? 'D' : (selectedRoom.windows || []).includes('left') ? 'W' : ''}
                              </span>
                            </button>

                            {/* Right Wall Button */}
                            <button 
                              onClick={() => handleWallClick('right')}
                              className={`absolute top-2 bottom-2 -right-1.5 w-3 rounded hover:bg-[#14b8a6]/30 cursor-pointer flex items-center justify-center transition-all z-10 ${
                                (selectedRoom.doors || []).includes('right') ? 'bg-rose-500 border border-rose-600' :
                                (selectedRoom.windows || []).includes('right') ? 'bg-amber-500 border border-amber-600' : 'bg-slate-200 hover:bg-slate-300'
                              }`}
                              title="Right Wall"
                            >
                              <span className="text-[8px] font-bold text-white leading-none scale-75">
                                {(selectedRoom.doors || []).includes('right') ? 'D' : (selectedRoom.windows || []).includes('right') ? 'W' : ''}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Visual Legend */}
                        <div className="flex gap-4 justify-center text-[9px] text-slate-500">
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500 border border-rose-600 inline-block" /> Door (D)</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500 border border-amber-600 inline-block" /> Window (W)</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button 
                          onClick={deleteSelectedRoom}
                          className="w-full h-8 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-250"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Room
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Select any room on the canvas. Drag to reposition, use the orange handles to resize, and manage doors, windows, and beds.
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
                  <p>Snapping: <strong>Snaps to cells</strong></p>
                  <p>Rooms Count: {activeRooms.length}</p>
                </div>
              </div>

            </div>
          </TabsContent>

          {/* TAB 4: AMENITIES */}
          <TabsContent value="amenities" className="space-y-6 mt-6">
            <Card className="p-8 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl space-y-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading" style={{ fontFamily: 'var(--font-heading)' }}>Toggle Live Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(amenities).map(amName => (
                  <div 
                    key={amName}
                    onClick={() => toggleAmenity(amName)}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      amenities[amName] 
                        ? 'border-[#14b8a6] bg-teal-50/40 text-teal-900 shadow-sm' 
                        : 'border-slate-200 bg-white hover:bg-slate-50/50 text-slate-705'
                    }`}
                  >
                    <span className="text-xs font-bold font-heading">{amName}</span>
                    <input type="checkbox" checked={amenities[amName]} onChange={() => {}} className="accent-[#14b8a6] cursor-pointer h-4 w-4" />
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-100 pt-6 mt-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading" style={{ fontFamily: 'var(--font-heading)' }}>Add Custom Amenity</h4>
                <div className="flex gap-3 max-w-md group">
                  <Input 
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="e.g. Swimming Pool, Squash Court..." 
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
                  />
                  <Button
                    onClick={() => {
                      if (!newAmenity.trim()) return;
                      setAmenities(prev => ({
                        ...prev,
                        [newAmenity.trim()]: true
                      }));
                      setNewAmenity('');
                    }}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold uppercase tracking-widest text-xs h-11 px-5 rounded-xl border-none shadow-md transition-all duration-200"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 5: WEEKLY FOOD MENU */}
          <TabsContent value="food" className="space-y-6 mt-6">
            <Card className="p-8 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading" style={{ fontFamily: 'var(--font-heading)' }}>Weekly Food Menu Editor</h3>
                <p className="text-xs text-slate-450 mt-1 font-medium">Configure what meals are served to residents each day of the week.</p>
              </div>

              {/* Day selector tabs inside editor */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedFoodDay(day)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                      selectedFoodDay === day 
                        ? 'bg-[#14b8a6] text-white border-[#14b8a6] shadow-md' 
                        : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="space-y-5 bg-[#f8fafc] p-6 rounded-2xl border border-slate-200/80">
                <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Editing Meals for {selectedFoodDay}</p>
                
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Breakfast (8:00 AM - 9:00 AM)</label>
                    <Input 
                      value={foodMenu[selectedFoodDay]?.breakfast || ''} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setFoodMenu(prev => ({
                          ...prev,
                          [selectedFoodDay]: { ...prev[selectedFoodDay], breakfast: val }
                        }));
                      }}
                      className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
                      placeholder="e.g. Idli, Vada, Chutney"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Lunch (12:00 PM - 1:00 PM)</label>
                    <Input 
                      value={foodMenu[selectedFoodDay]?.lunch || ''} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setFoodMenu(prev => ({
                          ...prev,
                          [selectedFoodDay]: { ...prev[selectedFoodDay], lunch: val }
                        }));
                      }}
                      className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
                      placeholder="e.g. Rice, Sambar, Veg Curry, Curd"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Dinner (7:00 PM - 8:00 PM)</label>
                    <Input 
                      value={foodMenu[selectedFoodDay]?.dinner || ''} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setFoodMenu(prev => ({
                          ...prev,
                          [selectedFoodDay]: { ...prev[selectedFoodDay], dinner: val }
                        }));
                      }}
                      className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
                      placeholder="e.g. Chapati, Paneer Masala, Rice, Dal"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-xl text-teal-900 space-y-1">
                <p className="text-xs font-bold font-heading">💡 StayFlo Food Tech Feature</p>
                <p className="text-[10px] leading-relaxed text-teal-600 font-medium">Tenants can skip/confirm meals before the 6 PM cutoff. Skipping meals awards them cashback or keeps their rent pricing affordable!</p>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 6: HOUSE RULES */}
          <TabsContent value="rules" className="space-y-6 mt-6">
            <Card className="p-8 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading" style={{ fontFamily: 'var(--font-heading)' }}>House Rules Manager</h3>
                <p className="text-xs text-slate-455 mt-1 font-medium">Specify curfew, visitor rules, and other policies displayed on the portfolio website.</p>
              </div>

              {/* Add rule form */}
              <div className="flex gap-3 group">
                <Input 
                  value={newRuleText}
                  onChange={(e) => setNewRuleText(e.target.value)}
                  placeholder="Add a new rule (e.g. Main gate closes at 11:30 PM)"
                  className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
                />
                <Button
                  onClick={() => {
                    if (!newRuleText.trim()) return;
                    setHouseRules(prev => [...prev, newRuleText.trim()]);
                    setNewRuleText('');
                  }}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold uppercase tracking-widest text-xs h-11 px-5 rounded-xl border-none shadow-md transition-all duration-200"
                >
                  Add
                </Button>
              </div>

              {/* Rules list */}
              <div className="space-y-3 mt-4">
                {houseRules.map((rule, idx) => (
                  <div key={idx} className="p-4 border border-slate-200/80 rounded-2xl bg-[#f8fafc] flex justify-between items-center text-xs shadow-inner">
                    <span className="text-slate-700 font-semibold">{rule}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 h-8 text-[10px] px-3 font-semibold rounded-xl"
                      onClick={() => {
                        setHouseRules(prev => prev.filter((_, i) => i !== idx));
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* TAB 7: PHOTOS & VIDEOS GALLERY */}
          <TabsContent value="media" className="space-y-6 mt-6">
            <Card className="p-8 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading" style={{ fontFamily: 'var(--font-heading)' }}>Walkthrough Video</h3>
                <p className="text-xs text-slate-455 mt-1 font-medium">Add a video link to give potential tenants a virtual tour of your property.</p>
                <div className="mt-4 space-y-4">
                  <div className="group">
                    <Input 
                      value={videoUrl} 
                      onChange={(e) => setVideoUrl(e.target.value)} 
                      placeholder="Enter Walkthrough Video URL (mp4 or Youtube link)" 
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
                    />
                  </div>
                  {videoUrl && (
                    <div className="mt-2 p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl flex flex-col items-center justify-center shadow-inner">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Video Preview</p>
                      <video src={videoUrl} controls className="w-full max-w-md h-52 rounded-xl bg-black shadow-lg" onError={(e) => console.log('Video preview not available')} />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading" style={{ fontFamily: 'var(--font-heading)' }}>Hero Background Slider Images</h3>
                <p className="text-xs text-slate-455 mt-1 font-medium">Manage the high-resolution slider images displayed at the very top of your portfolio website.</p>
                
                {/* Add Hero Image URL */}
                <div className="mt-4 flex gap-3 max-w-xl group">
                  <Input 
                    value={newHeroImageUrl} 
                    onChange={(e) => setNewHeroImageUrl(e.target.value)} 
                    placeholder="Paste high-res Hero Image URL (e.g. Unsplash link)" 
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
                  />
                  <Button 
                    onClick={() => {
                      const url = newHeroImageUrl.trim();
                      if (!url) return;
                      setHeroImages(prev => [...prev, url]);
                      setNewHeroImageUrl('');
                    }}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold uppercase tracking-widest text-xs h-11 px-5 rounded-xl border-none shadow-md transition-all duration-200"
                  >
                    Add
                  </Button>
                </div>

                {/* Hero Images Grid */}
                {heroImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-4">
                    {heroImages.map((imgUrl, index) => (
                      <div key={index} className="flex flex-col border border-slate-200 bg-[#f8fafc] rounded-2xl p-2 shadow-sm space-y-2 group relative">
                        <div className="relative rounded-xl overflow-hidden h-20 bg-slate-100">
                          <img src={imgUrl} alt={`Hero slider ${index}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          <button 
                            onClick={() => {
                              setHeroImages(prev => prev.filter((_, idx) => idx !== index));
                            }}
                            className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow"
                            title="Delete Hero Image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[9px] text-slate-400 font-extrabold text-center uppercase tracking-wide">Slide #{index + 1}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-405 italic mt-3 font-semibold">No custom Hero images. Falling back to category gallery photos.</p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading" style={{ fontFamily: 'var(--font-heading)' }}>PG Photo Gallery</h3>
                <p className="text-xs text-slate-455 mt-1 font-medium">Organize photos by categories (e.g. 1 Sharing, 2 Sharing, Dining Room) to show on the portfolio website.</p>

                {/* Add Category Form */}
                <div className="mt-4 flex gap-3 max-w-md group">
                  <Input 
                    value={newCategoryName} 
                    onChange={(e) => setNewCategoryName(e.target.value)} 
                    placeholder="New category name (e.g. Dining Hall)" 
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
                  />
                  <Button 
                    onClick={() => {
                      if (!newCategoryName.trim()) return;
                      const cat = newCategoryName.trim();
                      if (categoryMedia[cat]) {
                        alert('Category already exists!');
                        return;
                      }
                      setCategoryMedia(prev => ({ ...prev, [cat]: [] }));
                      setNewCategoryName('');
                    }}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold uppercase tracking-widest text-xs h-11 px-5 rounded-xl border-none shadow-md transition-all duration-200"
                  >
                    Add
                  </Button>
                </div>

                {/* Categories and Photos list */}
                <div className="mt-6 space-y-6">
                  {Object.keys(categoryMedia).map(catName => (
                    <Card key={catName} className="p-6 border border-slate-200 bg-[#f8fafc] rounded-2xl space-y-5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold text-teal-700 bg-teal-55 border border-teal-150 px-3 py-1 rounded-full uppercase tracking-wider">
                          {catName}
                        </span>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 h-8 text-[10px] font-bold uppercase tracking-wider px-3 rounded-xl shadow-sm"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the "${catName}" category and all its photos?`)) {
                              setCategoryMedia(prev => {
                                const next = { ...prev };
                                delete next[catName];
                                return next;
                              });
                            }
                          }}
                        >
                          Delete Category
                        </Button>
                      </div>

                      {/* Add Image URL for this category */}
                      <div className="flex gap-3 items-center group">
                        <Input 
                          value={newPhotoUrls[catName] || ''} 
                          onChange={(e) => setNewPhotoUrls(prev => ({ ...prev, [catName]: e.target.value }))}
                          placeholder="Paste photo URL" 
                          className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-855 font-semibold h-10 px-4 rounded-xl transition-all shadow-inner"
                        />
                        <Button 
                          onClick={() => {
                            const url = (newPhotoUrls[catName] || '').trim();
                            if (!url) return;
                            setCategoryMedia(prev => ({
                              ...prev,
                              [catName]: [...(prev[catName] || []), url]
                            }));
                            setNewPhotoUrls(prev => ({ ...prev, [catName]: '' }));
                          }}
                          className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 h-10 text-xs font-bold uppercase tracking-wider px-4 rounded-xl shadow-sm"
                        >
                          Add
                        </Button>
                      </div>

                      {/* Images Grid */}
                      {categoryMedia[catName]?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-2">
                          {categoryMedia[catName].map((photoUrl, index) => (
                            <div key={index} className="flex flex-col border border-slate-200 bg-white rounded-2xl p-2 shadow-sm space-y-2 group relative">
                              <div className="relative rounded-xl overflow-hidden h-16 bg-slate-100">
                                <img src={photoUrl} alt={`${catName} - ${index}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <button 
                                  onClick={() => {
                                    setCategoryMedia(prev => ({
                                      ...prev,
                                      [catName]: (prev[catName] || []).filter((_, idx) => idx !== index)
                                    }));
                                  }}
                                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow"
                                  title="Delete Photo"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <Input
                                value={photoTags[photoUrl] || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPhotoTags(prev => ({ ...prev, [photoUrl]: val }));
                                }}
                                placeholder="Tag (e.g. Equipped Gym)"
                                className="h-7 text-[9px] bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 focus:outline-none px-2 rounded-lg text-slate-800 font-semibold"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">No photos added yet in this category. Add a photo URL above.</p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
