import { useState, useEffect } from 'react'; import { useRouter } from 'next/navigation'; import { Star, MapPin, Wifi, Shield, Coffee, Compass, Check, ArrowRight, PhoneCall, CalendarCheck, X } from 'lucide-react'; import { Button } from '@stayflo/ui';
import { Card } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';

interface RoomRectangle {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  customName: string;
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

export function PortfolioHero() {
  const router = useRouter();
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Custom states that synchronize with builder
  const [pgName, setPgName] = useState('Sunrise PG');
  const [tagline, setTagline] = useState('Your home away from home in Koramangala');
  const [address, setAddress] = useState('No. 14, 5th Cross, Koramangala 4th Block, Bengaluru, 560034');
  const [mapCoords, setMapCoords] = useState({ lat: 12.9345, lng: 77.6269 });
  const [videoUrl, setVideoUrl] = useState('https://www.w3schools.com/html/mov_bbb.mp4');
  const [heroImages, setHeroImages] = useState<string[]>([]);

  // Stats variables
  const [statsBeds, setStatsBeds] = useState('500+');
  const [statsReviews, setStatsReviews] = useState('150+');
  const [statsProperties, setStatsProperties] = useState('2+');
  const [statsCities, setStatsCities] = useState('3+');
  const [testimonials, setTestimonials] = useState<any[]>([
    { name: 'Vijay Nair', duration: 'Staying since 8 months', comment: 'Absolutely clean PG with prompt support. The food tastes just like home. Management is helpful and Razorpay bills are transparent.' },
    { name: 'Rohit K.', duration: 'Staying since 1 year', comment: 'Very clean common areas, the WiFi speed is constant at 150Mbps, food menu is varied and fresh.' }
  ]);

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
  
  const [categoryMedia, setCategoryMedia] = useState<Record<string, string[]>>({
    '1 Sharing': [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    ],
    '2 Sharing': [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    ],
    'Play Room': [
      'https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=800&q=80',
    ],
  });

  // Photo Tag Overlays
  const [photoTags, setPhotoTags] = useState<Record<string, string>>({
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80': 'Premium Studio Single Room',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80': 'Boutique Twin Sharing Room',
    'https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=800&q=80': 'Vibrant Social Lounge & Workspace'
  });

  // Commute Proximity & Optimizer
  const [commuteWalkTime, setCommuteWalkTime] = useState('5 mins');
  const [commuteBikeTime, setCommuteBikeTime] = useState('2 mins');
  const [commuteTransitTime, setCommuteTransitTime] = useState('300m away');
  const [commuteDestination, setCommuteDestination] = useState('Manyata Tech Park');

  // Food Menu Tabular Editor
  const [foodMenu, setFoodMenu] = useState<Record<string, { breakfast: string; lunch: string; dinner: string }>>({
    Mon: { breakfast: 'Poha, Sev, Chutney', lunch: 'Rice, Dal, Cabbage Sabzi', dinner: 'Chapati, Aloo Jeera, Salad' },
    Tue: { breakfast: 'Uttapam, Sambar', lunch: 'Jeera Rice, Chole Masala', dinner: 'Chapati, Bhindi Fry, Curd' },
    Wed: { breakfast: 'Idli, Vada, Sambar', lunch: 'Rice, Dal Fry, Potato Roast, Papad', dinner: 'Chapati, Paneer Butter Masala, Salad' },
    Thu: { breakfast: 'Bread Omelette / Jam', lunch: 'Veg Biryani, Raita', dinner: 'Chapati, Egg Curry / Dal Tadka' },
    Fri: { breakfast: 'Dosa, Tomato Chutney', lunch: 'Rice, Sambhar, Beetroot Poriyal', dinner: 'Chapati, Mixed Veg Korma, Salad' },
    Sat: { breakfast: 'Poori, Aloo Masala', lunch: 'Lemon Rice, Curd Rice', dinner: 'Chapati, Kadai Paneer, Salad' },
    Sun: { breakfast: 'Special Masala Dosa', lunch: 'Chicken Biryani / Veg Pulao', dinner: 'Chapati, Dal Makhani, Custard' },
  });

  // House Rules
  const [houseRules, setHouseRules] = useState<string[]>([
    'No smoking inside rooms',
    'Friends allowed until 8 PM, No overnight stay',
    'Noise curfew after 11 PM',
    'Main gate closes at 11 PM',
    '1-month advance notice required before vacating'
  ]);

  // Deposit and Rent Inclusions
  const [depositAmount, setDepositAmount] = useState('₹10,000 (1 Month Rent)');
  const [rentInclusions, setRentInclusions] = useState('Includes 3 Meals, Wi-Fi, Housekeeping');

  // Dynamic floor layouts state
  const [floors, setFloors] = useState(['Ground floor', '1st floor', '2nd floor']);
  const [activeFloor, setActiveFloor] = useState('Ground floor');
  const [canvasCols, setCanvasCols] = useState(16);
  const [canvasRows, setCanvasRows] = useState(12);

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
          color: '#1D9E75'
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
          color: '#0F6E56'
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
          color: '#EF9F27'
        }
      ],
      '1st floor': [],
      '2nd floor': []
    };
  });

  const [occupancyFilter, setOccupancyFilter] = useState('All');
  const [selectedCellCoords, setSelectedCellCoords] = useState<string | null>(null);

  // Lead popup states
  const [showLeadPopup, setShowLeadPopup] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('stayflo_lead_submitted');
    }
    return true;
  });
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    type: 'Single',
  });

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('stayflo_lead_submitted', 'true');
    }
    try {
      await fetch('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pgId: 'prop-1',
          name: leadForm.name,
          phone: leadForm.phone,
          preferredSharing: leadForm.type === 'Single' ? 1 : leadForm.type === 'Double' ? 2 : leadForm.type === 'Quad' ? 4 : 3,
          source: 'portfolio-web'
        })
      });
    } catch (err) {
      console.error(err);
    }
    setShowLeadPopup(false);
  };

  // Load state from localStorage on load & list for updates
  const loadState = () => {
    const saved = localStorage.getItem('stayflo_builder_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.pgName) setPgName(parsed.pgName);
        if (parsed.tagline) setTagline(parsed.tagline);
        if (parsed.amenities) setAmenities(parsed.amenities);
        if (parsed.categoryMedia) setCategoryMedia(parsed.categoryMedia);
        if (parsed.videoUrl) setVideoUrl(parsed.videoUrl);
        if (parsed.roomsData) setRoomsData(parsed.roomsData);
        if (parsed.canvasCols) setCanvasCols(parsed.canvasCols);
        if (parsed.canvasRows) setCanvasRows(parsed.canvasRows);
        if (parsed.mapCoords) setMapCoords(parsed.mapCoords);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.testimonials) setTestimonials(parsed.testimonials);
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
        if (parsed.floors) {
          setFloors(parsed.floors);
          if (!parsed.floors.includes(activeFloor)) {
            setActiveFloor(parsed.floors[0] || 'Ground floor');
          }
        }
      } catch (e) {
        console.error('Error loading portfolio state', e);
      }
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadState();
    window.addEventListener('stayflo_website_update', loadState);
    return () => window.removeEventListener('stayflo_website_update', loadState);
  }, [activeFloor]);

  const [selectedDay, setSelectedDay] = useState('Wed');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [visitDate, setVisitDate] = useState('Today');
  const [visitTime, setVisitTime] = useState('4 PM');
  const [showConfirmVisit, setShowConfirmVisit] = useState(false);
  const [showCallback, setShowCallback] = useState(false);
  const [prefSharing, setPrefSharing] = useState<1 | 2 | 3 | 4>(1);

  const [customAlert, setCustomAlert] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });
  const [lightbox, setLightbox] = useState<{ show: boolean; currentIndex: number; mediaList: { url: string; type: 'photo' | 'video'; tag?: string }[] }>({ show: false, currentIndex: 0, mediaList: [] });

  const [addressSearch, setAddressSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedOfficeAddress, setSelectedOfficeAddress] = useState('');
  const [showPGMap, setShowPGMap] = useState(false);

  const mockSuggestions = [
    { bold: 'Periya', normal: 'medu, Choolai, Chennai, Tamil Nadu, India' },
    { bold: 'Periya', normal: 'palayam, Tamil Nadu, India' },
    { bold: 'Periya', normal: 'met, Chennai, Tamil Nadu, India' },
    { bold: 'Periya', normal: 'r Thidal, EVK Sampath Salai, Periyar Thidal, Vepery, Chennai, Tamil Nadu, India' },
    { bold: 'Periya', normal: 'r Nagar, Perambur, Chennai, Tamil Nadu, India' }
  ];

  const [dynamicSuggestions, setDynamicSuggestions] = useState(mockSuggestions);

  useEffect(() => {
    if (!addressSearch) {
      setDynamicSuggestions(mockSuggestions);
      return;
    }
    if (addressSearch.toLowerCase() === 'periya') {
      setDynamicSuggestions(mockSuggestions);
      return;
    }
    if (addressSearch.length < 3) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch)}&limit=5`
        );
        const data = await response.json();
        if (data && Array.isArray(data)) {
          const formatted = data.map((item: any) => {
            const displayName = item.display_name;
            const commaIndex = displayName.indexOf(',');
            let bold = displayName;
            let normal = '';
            if (commaIndex !== -1) {
              bold = displayName.substring(0, commaIndex);
              normal = displayName.substring(commaIndex);
            }
            return { bold, normal };
          });
          setDynamicSuggestions(formatted);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [addressSearch]);

  useEffect(() => {
    if (showLeadPopup || lightbox.show || customAlert.show) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [showLeadPopup, lightbox.show, customAlert.show]);

  const openLightbox = (initialType: 'photo' | 'video') => {
    const photos = categoryMedia[`${prefSharing} Sharing`] || 
                   (prefSharing === 1 ? ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80'] :
                    prefSharing === 2 ? ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'] :
                    ['https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=800&q=80']);
    
    const mediaList: { url: string; type: 'photo' | 'video'; tag?: string }[] = [];
    photos.forEach(p => {
      mediaList.push({ url: p, type: 'photo', tag: photoTags[p] || `${prefSharing} Sharing Room` });
    });
    if (videoUrl) {
      mediaList.push({ url: videoUrl, type: 'video', tag: 'Virtual Tour Walkthrough' });
    }

    let initialIndex = 0;
    if (initialType === 'video' && videoUrl) {
      initialIndex = mediaList.findIndex(m => m.type === 'video');
      if (initialIndex === -1) initialIndex = 0;
    }

    setLightbox({
      show: true,
      currentIndex: initialIndex,
      mediaList
    });
  };

  const handleNextMedia = () => {
    setLightbox(prev => {
      if (prev.mediaList.length <= 1) return prev;
      return {
        ...prev,
        currentIndex: (prev.currentIndex + 1) % prev.mediaList.length
      };
    });
  };

  const getCategoryVacancies = (bedsCount: number) => {
    let count = 0;
    Object.values(roomsData).forEach(rooms => {
      if (Array.isArray(rooms)) {
        rooms.forEach(r => {
          if (r.beds === bedsCount) {
            if (r.bedStatuses) {
              count += r.bedStatuses.filter(s => s === 'Vacant').length;
            } else {
              if (r.vacancy === 'Vacant') count += r.beds;
              else if (r.vacancy === '1/2 Filled') count += 1;
            }
          }
        });
      }
    });
    return count;
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const menu: Record<string, { breakfast: string, lunch: string, dinner: string }> = {
    Mon: { breakfast: 'Poha, Sev, Chutney', lunch: 'Rice, Dal, Cabbage Sabzi', dinner: 'Chapati, Aloo Jeera, Salad' },
    Tue: { breakfast: 'Uttapam, Sambar', lunch: 'Jeera Rice, Chole Masala', dinner: 'Chapati, Bhindi Fry, Curd' },
    Wed: { breakfast: 'Idli, Vada, Sambar', lunch: 'Rice, Dal Fry, Potato Roast, Papad', dinner: 'Chapati, Paneer Butter Masala, Salad' },
    Thu: { breakfast: 'Bread Omelette / Jam', lunch: 'Veg Biryani, Raita', dinner: 'Chapati, Egg Curry / Dal Tadka' },
    Fri: { breakfast: 'Dosa, Tomato Chutney', lunch: 'Rice, Sambhar, Beetroot Poriyal', dinner: 'Chapati, Mixed Veg Korma, Salad' },
    Sat: { breakfast: 'Poori, Aloo Masala', lunch: 'Lemon Rice, Curd Rice', dinner: 'Chapati, Kadai Paneer, Salad' },
    Sun: { breakfast: 'Special Masala Dosa', lunch: 'Chicken Biryani / Veg Pulao', dinner: 'Chapati, Dal Makhani, Custard' },
  };

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine responsive cell size based on window width
  const mobileCellSize = Math.max(12, Math.min(32, Math.floor((Math.min(windowWidth - 48, 600)) / canvasCols)));

  // Determine filter match
  const matchesOccupancyFilter = (room: RoomRectangle) => {
    if (occupancyFilter === 'All') return true;
    if (occupancyFilter === 'Single') return room.type === 'Single room';
    if (occupancyFilter === 'Double') return room.type === 'Double room';
    if (occupancyFilter === 'Triple') return room.type === 'Triple room';
    if (occupancyFilter === 'Common') return room.type !== 'Single room' && room.type !== 'Double room' && room.type !== 'Triple room';
    return true;
  };

  const activeRooms = roomsData[activeFloor] || [];
  const selectedRoomDetails = selectedCellCoords ? activeRooms.find(r => r.id === selectedCellCoords) : null;

  // Render realistic Beds matching user's request (mattress with pillows and vacancy display)
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
      return `absolute border-[2px] rounded flex items-center justify-center shadow z-15 transition-all text-white ${
        isVacant 
          ? 'bg-[#1D9E75] border-[#085041]' 
          : 'bg-[#993C1D] border-[#791F1F]'
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
          title={`Bed ${i + 1} (${vacant ? 'Vacant' : 'Occupied'})`}
        >
          {isRotated ? (
            <>
              <div className="absolute top-1 left-1 right-1 h-[18%] bg-white border-b border-slate-700/20 rounded-[1px]" />
              <span 
                className="text-[6.5px] font-bold text-white uppercase tracking-widest mt-[18%] truncate px-0.5 py-1 pointer-events-none select-none flex items-center justify-center leading-none text-center h-full w-full"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)'
                }}
              >
                {vacant ? 'Vacant' : 'Occupied'}
              </span>
            </>
          ) : (
            <>
              <div className="absolute left-1 top-1 bottom-1 w-[18%] bg-white border-r border-slate-700/20 rounded-[1px]" />
              <span className="text-[7.5px] font-bold text-white uppercase tracking-wider ml-[18%] truncate px-0.5 pointer-events-none select-none">
                {vacant ? 'Vacant' : 'Occupied'}
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

  // Extract all photos from custom heroImages or categoryMedia for the Hero Carousel
  const allPhotos: { url: string; category: string }[] = heroImages.length > 0
    ? heroImages.map(url => ({ url, category: 'Hero' }))
    : (() => {
        const list: { url: string; category: string }[] = [];
        Object.keys(categoryMedia).forEach(cat => {
          if (Array.isArray(categoryMedia[cat])) {
            categoryMedia[cat].forEach(url => {
              list.push({ url, category: cat });
            });
          }
        });
        return list;
      })();

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (allPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % allPhotos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [allPhotos.length]);

  const getMinPrice = () => {
    let minPrice = Infinity;
    Object.values(roomsData).forEach(rooms => {
      if (Array.isArray(rooms)) {
        rooms.forEach(r => {
          if (r.pricePerBed && r.pricePerBed < minPrice) {
            minPrice = r.pricePerBed;
          }
        });
      }
    });
    return minPrice === Infinity ? 6500 : minPrice;
  };

  const getUniqueRoomTypes = () => {
    const typesMap: Record<string, { price: number; amenities: string[]; typeName: string; beds: number; photo?: string }> = {};
    Object.keys(roomsData).forEach(floorKey => {
      const rooms = roomsData[floorKey];
      if (Array.isArray(rooms)) {
        rooms.forEach(r => {
          const bedsCount = r.beds;
          if (bedsCount > 0) {
            const typeKey = r.sharingType || `${bedsCount} Sharing`;
            const roomPhoto = categoryMedia[`${bedsCount} Sharing`]?.[0] || categoryMedia['1 Sharing']?.[0] || 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80';
            if (!typesMap[typeKey] || (r.pricePerBed && r.pricePerBed < typesMap[typeKey].price)) {
              typesMap[typeKey] = {
                price: r.pricePerBed || 8500,
                amenities: r.roomAmenities || ['Wi-Fi', 'Wardrobe', 'Attached Washroom'],
                typeName: r.type,
                beds: bedsCount,
                photo: roomPhoto
              };
            }
          }
        });
      }
    });
    return Object.keys(typesMap).map(key => ({
      key,
      ...typesMap[key]
    }));
  };

  const dynamicRoomTypes = getUniqueRoomTypes();
  const pricingCards = dynamicRoomTypes.length > 0 ? dynamicRoomTypes : [
    { key: '1 Sharing', price: 8500, amenities: ['AC', 'Attached Washroom', 'Wi-Fi', 'Wardrobe'], typeName: 'Single room', beds: 1, photo: categoryMedia['1 Sharing']?.[0] },
    { key: '2 Sharing', price: 6500, amenities: ['Attached Washroom', 'Wi-Fi', 'Wardrobe'], typeName: 'Double room', beds: 2, photo: categoryMedia['2 Sharing']?.[0] }
  ];

  return (
    <div 
      className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 font-sans pb-28 relative text-left transition-colors duration-200"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      {/* SECTION 1: STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3.5 flex justify-between items-center">
          <span className="font-extrabold text-slate-800 dark:text-white tracking-tight text-xl flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <span className="w-8 h-8 rounded-lg bg-[#14b8a6] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-teal-500/20">R</span>
            {pgName}
          </span>
          <div className="flex gap-3 items-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-300 font-semibold md:flex items-center gap-1 hidden bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 px-2 py-1 rounded">
              Powered by <span className="text-[#14b8a6] flex items-center gap-0.5 font-bold"><span className="w-3.5 h-3.5 rounded bg-[#14b8a6] text-white flex items-center justify-center text-[9px] font-black shadow-sm">R</span> Stayflo.</span>
            </span>
            <span className="text-[10px] text-[#047857] dark:text-emerald-400 font-bold md:flex items-center gap-1 hidden bg-[#d1fae5] dark:bg-emerald-950/50 px-2.5 py-1 rounded border border-[#10b981]/20 dark:border-emerald-500/20">
              <Star className="w-3.5 h-3.5 fill-[#10b981] dark:fill-emerald-400 text-[#10b981] dark:text-emerald-400" /> 4.8 Resident Rated
            </span>
            <div className="flex gap-1.5 items-center">
              <button 
                onClick={toggleTheme}
                className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
                title="Toggle Theme"
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                )}
              </button>
              <a href="tel:9876543210" className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm" title="Call PG Owner">
                <PhoneCall className="w-4 h-4 text-[#14b8a6]" />
              </a>
              <a href="#cta-section" onClick={(e) => { e.preventDefault(); scrollToSection('cta-section'); }}>
                <Button style={{ background: '#10b981', color: '#FFFFFF' }} className="h-9 px-4 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-[#059669] transition-all">
                  Schedule Visit
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>      {/* SECTION 2: THE HERO SECTION */}
      <div className="relative h-[480px] w-full flex items-center justify-start overflow-hidden bg-hero-gradient transition-colors duration-200">
        {allPhotos.length > 0 ? (
          <div className="absolute inset-0 w-full h-full">
            {allPhotos.map((slide, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${activeSlide === idx ? (theme === 'light' ? 'opacity-30' : 'opacity-50') : 'opacity-0'}`}
              >
                <img 
                  src={slide.url} 
                  alt={slide.category} 
                  className="w-full h-full object-cover"
                />
                {photoTags[slide.url] && (
                  <div className="absolute top-4 left-4 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded shadow-lg border border-white/10 z-20">
                    ✨ {photoTags[slide.url]}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80" 
            alt="Sunrise PG Room" 
            className="absolute inset-0 w-full h-full object-cover brightness-75 dark:brightness-50 opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-50/85 via-teal-50/50 to-transparent dark:from-slate-950 dark:via-slate-950/70 dark:to-transparent transition-colors duration-200" />
        
        {/* Carousel indicators */}
        {allPhotos.length > 1 && (
          <div className="absolute bottom-4 right-6 z-20 flex gap-1">
            {allPhotos.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${activeSlide === i ? 'bg-[#14b8a6] w-4' : 'bg-white/40'}`} 
              />
            ))}
          </div>
        )}
 
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 space-y-5 w-full">
          <Badge className="bg-[#14b8a6] text-white py-1 px-3.5 text-[10px] font-extrabold uppercase tracking-wider rounded border-none shadow-sm">PREMIUM CO-LIVING</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {pgName}
          </h1>
          <p className="text-sm md:text-lg text-slate-700 dark:text-slate-200 max-w-lg italic font-medium">"{tagline}"</p>
 
          
          <div className="flex items-center gap-3 flex-wrap pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/10 dark:bg-white/10 backdrop-blur-md border border-slate-900/10 dark:border-white/15 text-xs text-slate-800 dark:text-white font-medium">
              <MapPin className="w-4 h-4 text-[#14b8a6]" /> Koramangala 4th Block, Bengaluru
            </span>
 
            <a href="#map-commute-section" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#d1fae5] dark:bg-emerald-950/30 border border-[#10b981]/20 dark:border-emerald-500/20 text-xs text-[#047857] dark:text-emerald-400 font-bold hover:bg-[#10b981]/15 transition-all">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span>{commuteWalkTime} away from your office ({commuteDestination})</span>
            </a>
          </div>
        </div>
      </div>      {/* SECTION 2.5: STATS BAR BELOW HERO */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 py-6 shadow-sm transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center md:border-r border-slate-100 dark:border-white/5 last:border-0 py-2">
              <p className="text-3xl font-black text-[#14b8a6]">{statsBeds}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold mt-1">Premium Beds</p>
            </div>
            <div className="text-center md:border-r border-slate-100 dark:border-white/5 last:border-0 py-2">
              <p className="text-3xl font-black text-[#14b8a6]">{statsReviews}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold mt-1">Resident Reviews</p>
            </div>
            <div className="text-center md:border-r border-slate-100 dark:border-white/5 last:border-0 py-2">
              <p className="text-3xl font-black text-[#14b8a6]">{statsProperties}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold mt-1">PG Properties</p>
            </div>
            <div className="text-center py-2">
              <p className="text-3xl font-black text-[#14b8a6]">{statsCities}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold mt-1">Cities Available</p>
            </div>
          </div>
        </div>
      </div>
 
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-16">
 
        {/* SECTION: PREFERRED SHARING SPACE SHOWCASE */}
        <section className="space-y-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm text-left transition-colors duration-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Preferred Sharing Spaces
                </h2>
                {(() => {
                  const vac = getCategoryVacancies(prefSharing);
                  let bgClass = '';
                  let textClass = '';
                  let borderClass = '';
                  let indicatorColor = '';
                  
                  if (vac === 0) {
                    bgClass = 'bg-rose-50 dark:bg-rose-950/20';
                    textClass = 'text-rose-700 dark:text-rose-400';
                    borderClass = 'border-rose-200 dark:border-rose-800/30';
                    indicatorColor = 'bg-rose-500';
                  } else if (vac <= 2) {
                    bgClass = 'bg-amber-50 dark:bg-amber-950/20';
                    textClass = 'text-amber-700 dark:text-amber-400';
                    borderClass = 'border-amber-200 dark:border-amber-800/30';
                    indicatorColor = 'bg-amber-500';
                  } else {
                    bgClass = 'bg-emerald-50 dark:bg-emerald-950/20';
                    textClass = 'text-emerald-700 dark:text-emerald-400';
                    borderClass = 'border-emerald-200 dark:border-emerald-800/30';
                    indicatorColor = 'bg-emerald-500';
                  }
 
                  return (
                    <Badge className={`${bgClass} ${textClass} ${borderClass} border font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm transition-all duration-300`}>
                      <span className={`w-2 h-2 rounded-full ${indicatorColor} animate-pulse`} />
                      {vac} Vacancies Left
                    </Badge>
                  );
                })()}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explore room galleries and video walkthroughs by occupancy preferences</p>
            </div>
            
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-white/5">
              {([1, 2, 3, 4] as const).map(num => (
                <button
                  key={num}
                  onClick={() => setPrefSharing(num)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    prefSharing === num 
                      ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {num === 1 ? 'Single' : num === 2 ? 'Double' : num === 3 ? '3 Sharing' : '4 Sharing'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: media showcase column (8 cols) */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              {/* Media viewer panel displaying both Gallery and Video Tour */}
              <div className={`grid grid-cols-1 ${videoUrl ? 'md:grid-cols-2' : ''} gap-4 w-full`}>
                {/* Photo Gallery Card */}
                {(() => {
                  const photos = categoryMedia[`${prefSharing} Sharing`] || 
                                 (prefSharing === 1 ? ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'] :
                                  prefSharing === 2 ? ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'] :
                                  prefSharing === 4 ? ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80'] :
                                  ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80']);
                  return (
                    <div 
                      className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden relative flex items-center justify-center min-h-[300px] max-h-[360px] cursor-pointer group shadow-sm hover:shadow-md hover:border-primary-500/40 dark:hover:border-primary-400/40 transition-all duration-300"
                      onClick={() => openLightbox('photo')}
                    >
                      <img 
                        src={photos[0]} 
                        alt={`${prefSharing} sharing room`}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      {photoTags[photos[0]] && (
                        <div className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                          ✨ {photoTags[photos[0]]}
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-sm border border-slate-200/50 dark:border-white/10 flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
                        <span>📷</span>
                        <span>View Gallery ({photos.length})</span>
                      </div>
                    </div>
                  );
                })()}
 
                {/* Video Tour Card */}
                {videoUrl && (
                  <div 
                    className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden relative flex items-center justify-center min-h-[300px] max-h-[360px] cursor-pointer group shadow-sm hover:shadow-md hover:border-primary-500/40 dark:hover:border-primary-400/40 transition-all duration-300"
                    onClick={() => openLightbox('video')}
                  >
                    <video 
                      src={videoUrl} 
                      className="w-full h-full object-cover bg-black pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-white z-10">
                      <div className="w-14 h-14 rounded-full bg-[#14b8a6]/90 group-hover:bg-[#14b8a6] text-white flex items-center justify-center text-lg shadow-lg transform group-hover:scale-110 transition-all duration-300">
                        ▶
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">Play Video Tour</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
 
            {/* Right: details, pricing and booking quick card (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-[#f8fafc] dark:bg-slate-800/50 transition-colors">
              <div className="space-y-4">
                <Badge className="bg-[#14b8a6] text-white border-none py-1 px-3 text-[9px] font-bold uppercase tracking-wider rounded">
                  {prefSharing === 1 ? 'Private Suite' : prefSharing === 2 ? 'Double Comfort' : prefSharing === 3 ? 'Triple Shared' : 'Quad Shared'}
                </Badge>
                
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
                    {prefSharing === 1 ? 'Single Room' : prefSharing === 2 ? 'Double Sharing' : prefSharing === 3 ? 'Triple Sharing' : 'Quad Sharing (4 Sharing)'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Fully furnished premium layout style</p>
                </div>
 
                <div className="space-y-2 border-t border-b border-slate-200/60 dark:border-white/10 py-3 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Monthly Price:</span>
                    <span className="text-lg font-black text-[#14b8a6]">
                       ₹{prefSharing === 1 ? '8,500' : prefSharing === 2 ? '6,500' : prefSharing === 3 ? '5,500' : '4,500'}/mo
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Security Deposit:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-350">1 Month Rent</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Active Vacancies:</span>
                    <span className="font-extrabold text-[#047857] dark:text-emerald-450 bg-[#d1fae5] dark:bg-emerald-950/30 px-2 py-0.5 rounded text-[10px]">
                      {getCategoryVacancies(prefSharing)} open beds
                    </span>
                  </div>
                </div>
 
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Inclusions</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {['3 Meals Daily', 'Hi-Speed WiFi', 'Housekeeping', 'Laundromat Access'].map((inc, i) => (
                      <span key={i} className="text-[10.5px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-350 px-2 py-1 rounded-lg">
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
 
              <a href="#cta-section" onClick={(e) => { e.preventDefault(); scrollToSection('cta-section'); }} className="w-full mt-6 block">
                <Button 
                  className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-bold uppercase tracking-wider text-xs h-11 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer border-none"
                >
                  Schedule Visit for this room →
                </Button>
              </a>
            </div>
          </div>
        </section>
             {/* SECTION: INTERACTIVE FLOOR PLAN & ROOM SELECTION */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Interactive Blueprint & Floor Plans
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tap room boxes to inspect real-time bed vacancies, ventilation and orientation</p>
            </div>
            
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 text-xs font-bold text-orange-600 dark:text-orange-400 animate-pulse">
              🔥 Urgency Alert: Only 2 beds remaining on {activeFloor}!
            </span>
          </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Blueprint rendering container */}
            <div className="lg:col-span-2 p-5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 space-y-4 shadow-sm flex flex-col justify-between transition-colors duration-200">
              <div className="flex flex-col gap-4 text-left border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Select Floor</span>
                  <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1">
                    {floors.map(fl => (
                      <button
                        key={fl}
                        onClick={() => { setActiveFloor(fl); setSelectedCellCoords(null); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap transition-all shadow-sm cursor-pointer ${
                          activeFloor === fl 
                            ? 'bg-[#14b8a6] text-white border-[#14b8a6]' 
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-355 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        🏢 {fl}
                      </button>
                    ))}
                  </div>
                </div>
 
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Filter Sharing Options</span>
                  <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1">
                    {['All', 'Single', 'Double', 'Triple', 'Common'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setOccupancyFilter(opt); setSelectedCellCoords(null); }}
                        className={`px-2.5 py-1 text-[10px] rounded-full border whitespace-nowrap transition-all font-bold cursor-pointer ${
                          occupancyFilter === opt 
                            ? 'bg-[#10b981] text-white border-[#10b981] shadow-sm' 
                            : 'bg-slate-105 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {opt === 'All' ? 'All Layouts' : opt === 'Common' ? 'Common Areas' : `${opt} Sharing`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
 
              {/* Visual blueprint drawing board */}
              <div className="p-4 bg-slate-55 dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-white/5 overflow-auto flex justify-center scrollbar-none flex-grow mt-4">
                <div 
                  className="relative border border-slate-300 dark:border-white/10 bg-[#f8fafc] dark:bg-slate-950 select-none rounded shadow-inner"
                  style={{
                    width: `${canvasCols * mobileCellSize}px`, 
                    height: `${canvasRows * mobileCellSize}px`,
                    backgroundImage: theme === 'light'
                      ? `linear-gradient(to right, #e2e8f0 0.5px, transparent 0.5px), linear-gradient(to bottom, #e2e8f0 0.5px, transparent 0.5px)`
                      : `linear-gradient(to right, rgba(255,255,255,0.05) 0.5px, transparent 0.5px), linear-gradient(to bottom, rgba(255,255,255,0.05) 0.5px, transparent 0.5px)`,
                    backgroundSize: `${mobileCellSize}px ${mobileCellSize}px`
                  }}
                >
                  {activeRooms.map(room => {
                    const isSelected = selectedCellCoords === room.id;
                    const matches = matchesOccupancyFilter(room);
                    const left = room.x * mobileCellSize;
                    const top = room.y * mobileCellSize;
                    const width = room.w * mobileCellSize;
                    const height = room.h * mobileCellSize;
                    const isTextLabel = room.type === 'Text label';
 
                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedCellCoords(isSelected ? null : room.id)}
                        className={`absolute rounded flex flex-col items-center justify-center cursor-pointer select-none`}
                        style={{
                          left: `${left}px`,
                          top: `${top}px`,
                          width: `${width}px`,
                          height: `${height}px`,
                          backgroundColor: room.color,
                          borderColor: isSelected ? '#14b8a6' : (isTextLabel ? 'transparent' : '#475569'),
                          borderWidth: isTextLabel ? (isSelected ? '2px' : '0px') : (isSelected ? '3px' : '2px'),
                          borderStyle: isTextLabel && isSelected ? 'dashed' : 'solid',
                          opacity: matches ? 1.0 : 0.22,
                          boxShadow: isSelected ? '0 0 10px rgba(20, 184, 166, 0.4)' : 'none',
                          zIndex: isSelected ? 30 : 10
                        }}
                      >
                        {/* Vacancy tag overlay */}
                        {!isTextLabel && (room.type.includes('room') || room.type.includes('Room')) && room.beds > 0 && (
                          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white rounded-[3px] text-[6.5px] px-1 py-0.2 leading-none font-bold uppercase whitespace-nowrap z-20 pointer-events-none scale-90">
                            {room.vacancy === '1/2 Filled' ? '1 Bed Open' : room.vacancy}
                          </div>
                        )}

                        {/* Room label/number */}
                        <div className={`text-[9.5px] font-extrabold pointer-events-none z-10 ${isTextLabel ? 'text-slate-800 font-medium' : 'text-slate-800'}`}>
                          {room.customName}
                        </div>

                        {/* Access Road symbol */}
                        {room.type === 'Access road' && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1">
                            {room.w >= room.h ? (
                              <div className="w-full border-t-[2px] border-dashed border-white opacity-70" />
                            ) : (
                              <div className="h-full border-l-[2px] border-dashed border-white opacity-70" />
                            )}
                          </div>
                        )}

                        {/* Staircase symbol */}
                        {room.type === 'Staircase' && (
                          <div className="absolute inset-0 flex flex-col justify-around pointer-events-none p-1 opacity-60">
                            <div className="flex flex-col h-full w-full justify-between border-x border-slate-700/40">
                              {[...Array(6)].map((_, i) => (
                                <div key={i} className="border-t border-slate-700/40 w-full h-0" />
                              ))}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-4 h-4 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Kitchen symbol */}
                        {room.type === 'Kitchen' && (
                          <div className="absolute inset-0 pointer-events-none p-1 flex items-center justify-around opacity-55">
                            <div className="border border-amber-900/60 rounded p-0.5 flex gap-0.5 bg-amber-50/20 scale-75">
                              <div className="w-3 h-3 rounded-full border border-amber-955 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full border border-dashed border-amber-955" />
                              </div>
                              <div className="w-3 h-3 rounded-full border border-amber-955 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full border border-dashed border-amber-955" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Dining Area symbol */}
                        {room.type === 'Dining area' && (
                          <div className="absolute inset-0 pointer-events-none p-1 flex items-center justify-center opacity-50 gap-1.5 scale-75">
                            <div className="relative border border-amber-900/60 w-8 h-4 rounded flex items-center justify-center bg-amber-50/10">
                              <div className="absolute -top-0.5 left-1 w-1 h-1 rounded-full border border-amber-955 bg-amber-100" />
                              <div className="absolute -top-0.5 right-1 w-1 h-1 rounded-full border border-amber-955 bg-amber-100" />
                              <div className="absolute -bottom-0.5 left-1 w-1 h-1 rounded-full border border-amber-955 bg-amber-100" />
                              <div className="absolute -bottom-0.5 right-1 w-1 h-1 rounded-full border border-amber-955 bg-amber-100" />
                            </div>
                          </div>
                        )}

                        {/* Other Building hatch pattern */}
                        {room.type === 'Other building' && (
                          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden" style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 0, transparent 8px)',
                            backgroundSize: '12px 12px'
                          }} />
                        )}

                        {/* Empty Land grass graphic */}
                        {room.type === 'Empty land' && (
                          <div className="absolute inset-0 pointer-events-none p-1 opacity-55 overflow-hidden flex flex-wrap gap-1 justify-around items-center">
                            {[...Array(2)].map((_, i) => (
                              <svg key={i} className="w-3 h-3 text-emerald-800/60" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2a1 1 0 0 1 1 1v7.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V3a1 1 0 0 1 1-1z" />
                              </svg>
                            ))}
                          </div>
                        )}

                        {/* Realistic Beds inside */}
                        {renderBeds(room)}

                        {/* Doors on walls */}
                        {renderDoors(room.doors)}

                        {/* Windows on walls */}
                        {renderWindows(room.windows)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sub-blueprint detail inspector (Right Column) */}
            <div className="lg:col-span-1 flex flex-col h-full">
              {selectedRoomDetails ? (
                <Card className="p-6 border border-[#14b8a6] dark:border-teal-500 bg-teal-50/25 dark:bg-teal-950/20 text-slate-800 dark:text-white rounded-xl space-y-4 shadow-md text-left transition-all h-full flex flex-col justify-between min-h-[300px]">
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-center border-b border-[#14b8a6]/20 pb-2">
                      <div>
                        <p className="text-[10px] font-bold text-[#14b8a6] uppercase tracking-wider">Room Inspector</p>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Room {selectedRoomDetails.customName}</h3>
                      </div>
                      <button onClick={() => setSelectedCellCoords(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
 
                    <div className="space-y-3.5 text-xs flex-grow py-4">
                      <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">Layout Type:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{selectedRoomDetails.type}</span>
                      </div>
 
                      <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">Beds Config:</span>
                        <span className="font-bold text-[#047857] bg-[#d1fae5] dark:bg-emerald-950/30 px-2 py-0.5 rounded text-[10px]">
                          🛏️ {selectedRoomDetails.beds} Sharing
                        </span>
                      </div>
 
                      <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">Ventilation & View:</span>
                        <span className="font-bold text-teal-700 dark:text-teal-400">
                          🛣️ Road Facing (Good ventilation)
                        </span>
                      </div>
 
                      <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">Real-time Vacancy:</span>
                        <Badge className="bg-[#10b981] text-white border-none text-[9px] font-bold">
                          {selectedRoomDetails.vacancy === 'Vacant' ? '🟢 1+ Beds Available' : selectedRoomDetails.vacancy === '1/2 Filled' ? '🟢 1 Bed Left' : '🔴 Full'}
                        </Badge>
                      </div>
                    </div>
 
                    {selectedRoomDetails.beds > 0 && (
                      <div className="pt-2">
                        <a href="#cta-section" onClick={(e) => { e.preventDefault(); setSelectedCellCoords(null); scrollToSection('cta-section'); }} className="w-full">
                          <Button className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-bold uppercase tracking-wider text-[10px] h-10 rounded-lg shadow-sm border-none active:scale-98 transition-all cursor-pointer">
                            Reserve Room {selectedRoomDetails.customName} →
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <Card className="p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-xl space-y-4 shadow-sm text-center h-full flex flex-col justify-center items-center min-h-[300px] py-12 transition-colors duration-200">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-[#14b8a6]">
                    <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Select a Room Block</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Click on any room block in the blueprint to inspect real-time bed-wise vacancies, prices, amenities, and window orientation details.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* SECTION: PROPERTY AMENITIES & FACILITIES */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4 text-left transition-colors duration-200">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-white/5 pb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Property Amenities & Facilities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.keys(amenities).filter(k => amenities[k]).map((amName, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3.5 rounded-xl border border-slate-100 dark:border-white/5 bg-[#f8fafc] dark:bg-slate-800/40 shadow-sm transition-colors">
                <span className="text-[#10b981] font-bold">✓</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{amName}</span>
              </div>
            ))}
          </div>
        </section>
 
        {/* SECTION: LOCATION & COMMUTE OPTIMIZER */}
        <section id="map-commute-section" className="space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Location & Commute Optimizer
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Check proximity to your office and transit networks</p>
          </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-1 flex flex-col justify-between gap-4">
              <Card className="p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex items-center gap-4 rounded-xl shadow-sm transition-colors duration-200">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center text-xl shadow-inner text-[#14b8a6]">🚶</div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Walk Proximity</p>
                  <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">{commuteWalkTime}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">away from your office ({commuteDestination})</p>
                </div>
              </Card>
 
              <Card className="p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex items-center gap-4 rounded-xl shadow-sm transition-colors duration-200">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-xl shadow-inner text-orange-500 dark:text-orange-400">🏍️</div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Bike / Auto Commute</p>
                  <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">{commuteBikeTime}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Quick door-to-office transit</p>
                </div>
              </Card>
 
              <Card className="p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex items-center gap-4 rounded-xl shadow-sm transition-colors duration-200">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-xl shadow-inner text-blue-500 dark:text-blue-400">🚇</div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Nearest Transit</p>
                  <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">{commuteTransitTime}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Metro or major bus stop link</p>
                </div>
              </Card>
            </div>
 
            <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm h-72 md:h-auto min-h-[300px] overflow-hidden relative transition-colors duration-200">
              <iframe
                title="Google Map location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=15&output=embed`}
              />
            </div>
          </div>
        </section>



        {/* SECTION: SOCIAL PROOF & HOUSE RULES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          <section className="space-y-6 flex flex-col justify-between">
            <div className="text-left">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Resident Social Proof
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Read what active co-living residents say about our facilities</p>
            </div>
            
            {testimonials.length > 0 ? (
              <div className="space-y-4 flex-1 mt-4">
                {testimonials.map((rev, i) => (
                  <Card key={i} className="p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 rounded-xl space-y-3 shadow-sm text-left transition-colors duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{rev.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{rev.duration}</p>
                      </div>
                      <span className="text-[9px] font-bold text-[#047857] dark:text-emerald-400 bg-[#d1fae5] dark:bg-emerald-950/30 px-2.5 py-0.5 rounded border border-[#10b981]/20 dark:border-emerald-500/20">
                        Verified Resident
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed italic">"{rev.comment}"</p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-6">No testimonials published yet.</p>
            )}
          </section>
 
          <section className="space-y-6">
            <div className="text-left">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Co-living House Rules
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Simple policies to ensure safety and comfort for all co-living members</p>
            </div>
            <div className="grid grid-cols-1 gap-3 pt-4">
              {houseRules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-200 text-left transition-colors duration-200">
                  <div className="w-5 h-5 rounded-full bg-[#ecfdf5] dark:bg-emerald-950/30 border border-[#d1fae5] dark:border-emerald-900/30 flex items-center justify-center text-[#10b981] flex-shrink-0">✓</div>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
          {/* Video Tour walkthrough if url defined */}
        {videoUrl && (
          <section className="space-y-6 pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Virtual Property Tour</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Take a quick walkthrough tour of the co-living spaces</p>
            </div>
            <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-3.5 shadow-md flex flex-col items-center transition-colors duration-200">
              <video src={videoUrl} controls className="w-full rounded-xl bg-black shadow-inner" style={{ maxHeight: '380px' }} />
            </div>
          </section>
        )}
 
        {/* SECTION: PHYSICAL VISIT / CALL CTA SECTION */}
        <section id="cta-section" className="p-8 md:p-12 rounded-2xl flex flex-col items-center text-center space-y-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-md relative overflow-hidden max-w-4xl mx-auto transition-colors duration-200">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#14b8a6]/10 rounded-full translate-x-12 -translate-y-12" />
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Book Your Physical Tour
          </h2>
          <p className="text-sm text-slate-555 dark:text-slate-400 max-w-md">Schedule a physical visit or request a call from our co-living operations manager immediately.</p>
          <span className="px-3.5 py-1 rounded bg-[#d1fae5] dark:bg-emerald-950/30 text-[#047857] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-[#10b981]/20 dark:border-emerald-500/20 shadow-sm">
            Only 2 room vacancies remaining this week
          </span>
 
          <div className="w-full max-w-md space-y-4 pt-2">
            {!showConfirmVisit && !showCallback ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setShowConfirmVisit(true)} 
                  className="flex-1 h-11 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 rounded-lg shadow-sm border-none transition-all active:scale-98 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" /> Schedule Visit
                </Button>
                <Button 
                  onClick={() => setShowCallback(true)} 
                  className="flex-1 h-11 bg-slate-200 dark:bg-slate-800 hover:bg-slate-350 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-white/10 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 rounded-lg shadow-sm transition-all active:scale-98 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#14b8a6]" /> REQUEST CALLBACK
                </Button>
              </div>
            ) : showConfirmVisit ? (
              <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-xl space-y-4 text-left border border-slate-200 dark:border-white/10 shadow-inner transition-colors">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Select Visit Slot</p>
                <div className="flex gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
                  {['Today', 'Tomorrow', 'Day After'].map(d => (
                    <button
                      key={d}
                      onClick={() => setVisitDate(d)}
                      className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all border text-xs font-bold cursor-pointer ${
                        visitDate === d 
                          ? 'bg-primary-500 text-white border-primary-500 shadow' 
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {['10 AM', '12 PM', '4 PM', '6 PM'].map(t => (
                    <button
                      key={t}
                      onClick={() => setVisitTime(t)}
                      className={`py-2 rounded-lg transition-all border font-bold text-center text-xs cursor-pointer ${
                        visitTime === t 
                          ? 'bg-primary-500 text-white border-primary-500 shadow' 
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <Button 
                  className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white mt-2 font-bold uppercase tracking-wider text-xs h-10 rounded-lg shadow border-none transition-all active:scale-98 cursor-pointer"
                  onClick={() => {
                    setCustomAlert({ show: true, title: 'Visit Tour Scheduled', message: `Physical visit tour scheduled for ${visitDate} at ${visitTime}!` });
                    setShowConfirmVisit(false);
                  }}
                >
                  Confirm Visit Tour
                </Button>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-xl space-y-3 text-left border border-slate-200 dark:border-white/10 shadow-inner transition-colors">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Manager will call you back shortly</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">We will initiate a callback request to the verification phone number entered during portal gate entrance login.</p>
                <Button 
                  className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-bold uppercase tracking-wider text-xs h-10 rounded-lg shadow border-none transition-all active:scale-98 cursor-pointer"
                  onClick={() => {
                    setCustomAlert({ show: true, title: 'Callback Requested', message: 'Callback request registered! Expect a call within 15 minutes.' });
                    setShowCallback(false);
                  }}
                >
                  Confirm Callback Request
                </Button>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* SECTION 8 CONTINUED: STICKY FOOTER ACTION CLOSE FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-30 shadow-lg transition-colors duration-200">
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center px-6">
          <div>
            <p className="text-xl font-black text-[#14b8a6]">₹{getMinPrice()}<span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/mo starting</span></p>
            <p className="text-[9.5px] text-[#14b8a6] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
              {activeRooms.filter(r => r.beds > 0 && r.vacancy !== 'Occupied').length} Rooms Vacant on Floor
            </p>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold md:flex items-center gap-0.5 hidden mt-0.5">
              Powered by <span className="text-[#14b8a6] flex items-center gap-0.5 font-bold"><span className="w-3 h-3 rounded bg-[#14b8a6] text-white flex items-center justify-center text-[7.5px] font-black">S</span> Stayflo.</span>
            </span>
          </div>
          <div className="flex gap-2">
            <a href="tel:9876543210" className="md:inline-flex hidden items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-350 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer">
              <PhoneCall className="w-3.5 h-3.5 text-[#14b8a6]" /> Call PG Owner
              <Button style={{ background: '#10b981', color: '#FFFFFF' }} className="font-bold uppercase tracking-wider text-xs px-6 hover:opacity-90 h-10 rounded-lg shadow-md shadow-emerald-500/20 active:scale-98 transition-all">
                Book Visit
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* COHESIVE LEAD CAPTURE POPUP MODAL (LIGHT/DARK THEMED) */}
      {showLeadPopup && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div 
            className="relative max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl p-5 md:p-6 text-left space-y-3.5 max-h-[92vh] overflow-y-auto overscroll-contain transition-colors duration-200"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-extrabold text-slate-800 dark:text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Unlock Co-living Explore
                </h2>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 px-1.5 py-0.5 rounded transition-colors duration-200">
                  by <span className="text-[#14b8a6] flex items-center gap-0.5 font-bold"><span className="w-3 h-3 rounded bg-[#14b8a6] text-white flex items-center justify-center text-[7px] font-black">S</span> Stayflo.</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Enter your details to view rooms blueprint and vacancies at {pgName}
              </p>
            </div>
 
            {/* Form */}
            <form onSubmit={handleLeadSubmit} className="space-y-3 text-left">
              {/* Name */}
              <div>
                <label className="text-[9px] font-extrabold uppercase tracking-wider block mb-1 text-slate-400 dark:text-slate-500">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Akshay Kumar"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#14b8a6] bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white font-semibold transition-colors duration-200"
                />
              </div>
 
              {/* Phone */}
              <div>
                <label className="text-[9px] font-extrabold uppercase tracking-wider block mb-1 text-slate-400 dark:text-slate-500">
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 font-bold transition-colors">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-r-lg border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#14b8a6] bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white font-semibold transition-colors duration-200"
                  />
                </div>
              </div>
 
              {/* Look for sharing */}
              <div>
                <label className="text-[9px] font-extrabold uppercase tracking-wider block mb-1 text-slate-400 dark:text-slate-500">
                  Looking for Sharing?
                </label>
                <select
                  value={leadForm.type}
                  onChange={(e) => setLeadForm({ ...leadForm, type: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#14b8a6] bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white font-semibold cursor-pointer transition-colors duration-200"
                >
                  <option value="Single">Single Occupancy</option>
                  <option value="Double">Double Sharing</option>
                  <option value="Triple">Triple Sharing</option>
                  <option value="Quad">Quad Sharing (4 Sharing)</option>
                </select>
              </div>
 
              {/* Autocomplete Office Search */}
              <div className="relative pt-2">
                <div className="relative border-2 border-[#14b8a6] rounded-xl bg-white dark:bg-slate-900 px-3 py-2 transition-colors duration-200">
                  <span className="absolute -top-2 left-3 bg-white dark:bg-slate-900 px-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    Your Office Location
                  </span>
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      required
                      placeholder="Type office address..."
                      value={addressSearch}
                      onChange={(e) => {
                        setAddressSearch(e.target.value);
                        setShowSuggestions(e.target.value.length > 0);
                      }}
                      className="w-full bg-transparent focus:outline-none text-xs text-slate-800 dark:text-white font-semibold pr-6"
                    />
                    <span className="absolute right-3 text-slate-400 dark:text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                  </div>
                </div>
                
                {showSuggestions && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-xl z-50 overflow-hidden text-slate-800 dark:text-white transition-colors duration-200">
                    <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900 text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                      <span>SUGGESTIONS</span>
                      <button type="button" onClick={() => setShowSuggestions(false)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350">✕</button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                      {dynamicSuggestions.map((item, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => {
                            setAddressSearch(item.bold + item.normal);
                            setShowSuggestions(false);
                            setSelectedOfficeAddress(item.bold + item.normal);
                          }}
                          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/60 px-4 py-2.5 text-left transition-colors"
                        >
                          <strong className="text-slate-800 dark:text-white font-bold">{item.bold}</strong>
                          <span className="text-slate-500 dark:text-slate-400 font-normal">{item.normal}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-start text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                      <span>powered by Google</span>
                    </div>
                  </div>
                )}
              </div>
 
              {/* Option to look the PG location in maps */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowPGMap(!showPGMap)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-teal-50 dark:bg-teal-950/20 hover:bg-teal-100/80 dark:hover:bg-teal-900/30 border border-teal-200/50 dark:border-teal-800/30 rounded-xl text-xs font-bold text-[#14b8a6] dark:text-teal-400 transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {showPGMap ? 'Close PG Map View' : 'View PG Locations in Google Maps'}
                </button>
                
                {showPGMap && (
                  <div className="mt-2 h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner transition-all">
                    <iframe
                      title="Google Map PG location"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=15&output=embed`}
                    />
                  </div>
                )}
              </div>
 
              <Button 
                type="submit" 
                className="w-full h-10 mt-3 text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-98 transition-all rounded-lg shadow-md border-none shadow-teal-500/10 cursor-pointer text-white" 
                style={{ background: '#14b8a6' }}
              >
                Explore properties now →
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION ALERT MODAL (LIGHT/DARK THEMED) */}
      {customAlert.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl text-center space-y-4 transition-colors duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-[#10b981] dark:text-emerald-450 flex items-center justify-center text-2xl mx-auto border border-emerald-100 dark:border-emerald-900/20">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{customAlert.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{customAlert.message}</p>
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <Button 
                style={{ background: '#10b981', color: '#FFFFFF' }} 
                className="w-full font-bold uppercase tracking-wider text-xs h-10 rounded-lg border-none active:scale-98 transition-all hover:opacity-90 cursor-pointer"
                onClick={() => setCustomAlert({ show: false, title: '', message: '' })}
              >
                Awesome
              </Button>
              <div className="flex items-center justify-center gap-1 text-[8.5px] text-slate-400 dark:text-slate-500 font-bold">
                <span>Verified securely by</span>
                <span className="text-[#14b8a6] flex items-center gap-0.5 font-bold"><span className="w-3 h-3 rounded bg-[#14b8a6] text-white flex items-center justify-center text-[7px] font-black">S</span> Stayflo.</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* INTERACTIVE MEDIA LIGHTBOX POPUP MODAL */}
      {lightbox.show && lightbox.mediaList.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm p-4 text-white">
          <div className="relative w-full max-w-4xl flex flex-col items-center justify-center space-y-4">
            {/* Top Close Button & Info */}
            <div className="w-full flex justify-between items-center text-xs">
              <span className="font-semibold bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                Media {lightbox.currentIndex + 1} of {lightbox.mediaList.length}
              </span>
              <button 
                onClick={() => setLightbox({ show: false, currentIndex: 0, mediaList: [] })}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Media Content Area */}
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
              {lightbox.mediaList[lightbox.currentIndex].type === 'photo' ? (
                <img 
                  src={lightbox.mediaList[lightbox.currentIndex].url} 
                  alt="Gallery Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video 
                  src={lightbox.mediaList[lightbox.currentIndex].url} 
                  controls 
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Bottom Caption & Navigation Control */}
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3 pt-2">
              <p className="text-sm font-semibold tracking-wide italic text-slate-300">
                ✨ {lightbox.mediaList[lightbox.currentIndex].tag || 'Preview Media'}
              </p>
              
              <div className="flex items-center gap-2">
                <Button 
                  style={{ background: '#14b8a6', color: '#FFFFFF' }} 
                  className="px-6 font-bold uppercase tracking-wider text-xs h-10 rounded-xl"
                  onClick={handleNextMedia}
                >
                  Next →
                </Button>
              </div>
            </div>

            {/* Powered by Stayflo branding overlay */}
            <div className="text-[9.5px] text-slate-500 font-semibold flex items-center justify-center gap-0.5">
              Powered by <span className="text-[#14b8a6] flex items-center gap-0.5 font-bold"><span className="w-3 h-3 rounded bg-[#14b8a6] text-white flex items-center justify-center text-[7px] font-black">S</span> Stayflo.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
