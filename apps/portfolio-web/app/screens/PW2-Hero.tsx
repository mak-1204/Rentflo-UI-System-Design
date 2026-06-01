import { useState, useEffect } from 'react'; import { useNavigate } from 'react-router'; import { Star, MapPin, Wifi, Shield, Coffee, Compass, Check, ArrowRight, PhoneCall, CalendarCheck, X } from 'lucide-react'; import { Button } from '@rentflo/ui';
import { Card } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';

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
}

export function PortfolioHero() {
  const navigate = useNavigate();
  
  // Custom states that synchronize with builder
  const [pgName, setPgName] = useState('Sunrise PG');
  const [tagline, setTagline] = useState('Your home away from home in Koramangala');
  const [address, setAddress] = useState('No. 14, 5th Cross, Koramangala 4th Block, Bengaluru, 560034');
  const [mapCoords, setMapCoords] = useState({ lat: 12.9345, lng: 77.6269 });

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
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80',
    ],
    '2 Sharing': [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=300&q=80',
    ],
    'Play Room': [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=300&q=80',
    ],
  });

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
          id: 'room-3',
          x: 1,
          y: 7,
          w: 4,
          h: 4,
          type: 'Bathroom',
          customName: 'CB-1',
          beds: 0,
          doors: ['top'],
          windows: [],
          vacancy: 'Vacant',
          color: '#0C447C'
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

  // Load state from localStorage on load & list for updates
  const loadState = () => {
    const saved = localStorage.getItem('rentflo_builder_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.pgName) setPgName(parsed.pgName);
        if (parsed.tagline) setTagline(parsed.tagline);
        if (parsed.amenities) setAmenities(parsed.amenities);
        if (parsed.categoryMedia) setCategoryMedia(parsed.categoryMedia);
        if (parsed.roomsData) setRoomsData(parsed.roomsData);
        if (parsed.canvasCols) setCanvasCols(parsed.canvasCols);
        if (parsed.canvasRows) setCanvasRows(parsed.canvasRows);
        if (parsed.mapCoords) setMapCoords(parsed.mapCoords);
        if (parsed.address) setAddress(parsed.address);
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

  useEffect(() => {
    loadState();
    window.addEventListener('rentflo_website_update', loadState);
    return () => window.removeEventListener('rentflo_website_update', loadState);
  }, [activeFloor]);

  const [selectedDay, setSelectedDay] = useState('Wed');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [visitDate, setVisitDate] = useState('Today');
  const [visitTime, setVisitTime] = useState('4 PM');
  const [showConfirmVisit, setShowConfirmVisit] = useState(false);
  const [showCallback, setShowCallback] = useState(false);

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

  // Determine responsive cell size
  const mobileCellSize = Math.max(16, Math.min(32, Math.floor(480 / canvasCols)));

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
    
    const beds = [];
    const getBedStyle = (isVacant: boolean) => {
      return `absolute bg-slate-400 border-[3.5px] border-slate-700 rounded-md flex items-center justify-center shadow z-15 transition-all`;
    };

    const isBedVacant = (idx: number) => {
      return bedStatuses[idx] === 'Vacant';
    };

    if (bedsCount === 1) {
      const vacant = isBedVacant(0);
      beds.push(
        <div key="bed-1" className={getBedStyle(vacant)} style={{ top: '35%', left: '15%', width: '70%', height: '30%' }}>
          <div className="absolute left-1.5 top-1 bottom-1 w-[18%] bg-white border-r border-slate-700 rounded-sm" />
          <span className="text-[9px] font-bold text-white uppercase tracking-wider ml-[18%] truncate px-1">
            {vacant ? 'Vacant' : ''}
          </span>
        </div>
      );
    } else if (bedsCount === 2) {
      const vacant1 = isBedVacant(0);
      const vacant2 = isBedVacant(1);
      beds.push(
        <div key="bed-1" className={getBedStyle(vacant1)} style={{ top: '8px', left: '15%', width: '70%', height: '26%' }}>
          <div className="absolute left-1.5 top-1 bottom-1 w-[18%] bg-white border-r border-slate-700 rounded-sm" />
          <span className="text-[9px] font-bold text-white uppercase tracking-wider ml-[18%] truncate px-1">
            {vacant1 ? 'Vacant' : ''}
          </span>
        </div>
      );
      beds.push(
        <div key="bed-2" className={getBedStyle(vacant2)} style={{ bottom: '8px', left: '15%', width: '70%', height: '26%' }}>
          <div className="absolute left-1.5 top-1 bottom-1 w-[18%] bg-white border-r border-slate-700 rounded-sm" />
          <span className="text-[9px] font-bold text-white uppercase tracking-wider ml-[18%] truncate px-1">
            {vacant2 ? 'Vacant' : ''}
          </span>
        </div>
      );
    } else {
      const vacant1 = isBedVacant(0);
      const vacant2 = isBedVacant(1);
      const vacant3 = isBedVacant(2);
      beds.push(
        <div key="bed-1" className={getBedStyle(vacant1)} style={{ top: '8px', left: '6px', width: '44%', height: '26%' }}>
          <div className="absolute left-1 top-1 bottom-1 w-[18%] bg-white border-r border-slate-700 rounded-sm" />
          <span className="text-[8px] font-bold text-white uppercase tracking-wider ml-[18%] truncate px-0.5">
            {vacant1 ? 'Vac' : ''}
          </span>
        </div>
      );
      beds.push(
        <div key="bed-2" className={getBedStyle(vacant2)} style={{ top: '8px', right: '6px', width: '44%', height: '26%' }}>
          <div className="absolute left-1 top-1 bottom-1 w-[18%] bg-white border-r border-slate-700 rounded-sm" />
          <span className="text-[8px] font-bold text-white uppercase tracking-wider ml-[18%] truncate px-0.5">
            {vacant2 ? 'Vac' : ''}
          </span>
        </div>
      );
      beds.push(
        <div key="bed-3" className={getBedStyle(vacant3)} style={{ bottom: '8px', left: '25%', width: '50%', height: '26%' }}>
          <div className="absolute left-1.5 top-1 bottom-1 w-[18%] bg-white border-r border-slate-700 rounded-sm" />
          <span className="text-[9px] font-bold text-white uppercase tracking-wider ml-[18%] truncate px-1">
            {vacant3 ? 'Vacant' : ''}
          </span>
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

  return (
    <div 
      className="min-h-screen bg-[#0D0D0D] text-[#F5F5F0] font-sans pb-24 relative text-left"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-neutral-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="font-bold text-white tracking-wider text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {pgName}
          </span>
          <div className="flex gap-4 items-center">
            <span className="text-xs text-amber-500 font-semibold md:flex items-center gap-1 hidden bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-current" /> 4.8 Rating
            </span>
            <a href="#cta-section">
              <Button style={{ background: '#1D9E75', color: '#FFFFFF' }} className="h-9 px-4 text-xs font-semibold">
                Schedule Visit
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <div className="relative h-[480px] w-full flex items-center justify-start overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80" 
          alt="Sunrise PG Room" 
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/70 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 space-y-4 w-full">
          <Badge className="bg-[#1D9E75] text-white py-1 px-3">Sunrise Premium Rooms</Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {pgName}
          </h1>
          <p className="text-sm md:text-lg text-neutral-300 max-w-lg italic font-medium">"{tagline}"</p>
          
          <div className="flex items-center gap-3 flex-wrap pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs" style={{ color: '#F5F5F0' }}>
              <MapPin className="w-4 h-4 text-[#1D9E75]" /> Koramangala 4th Block, Bengaluru
            </span>
            <span className="text-xs text-amber-500 font-semibold flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-current" /> 4.8 (24 active residents)
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 space-y-16">
        
        {/* PW3: PHOTO GALLERY */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold border-b border-neutral-900 pb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Explore PG Galleries
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(categoryMedia).map(catName => (
              <Card key={catName} className="p-4 border border-neutral-900 bg-[#121212] space-y-3">
                <Badge style={{ background: '#1A1A1A', color: '#F5F5F0' }} className="border border-neutral-800 uppercase tracking-wider text-[9px] px-2 py-0.5">
                  {catName}
                </Badge>
                <div className="relative h-48 rounded-lg overflow-hidden bg-neutral-950">
                  <img src={categoryMedia[catName]?.[0]} alt={catName} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* PW4: ROOM TYPES & PRICING */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold border-b border-neutral-900 pb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Pricing & Occupancies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { type: '1 Sharing / Single Occupancy', price: '₹8,500', spec: 'Private Bed · AC · Attached Bath · 180 sqft', desc: 'Perfect for working professionals seeking absolute privacy.' },
              { type: '2 Sharing / Double Sharing', price: '₹6,500', spec: 'Twin Beds · Non-AC · Shared Bath · 220 sqft', desc: 'Spacious roommate sharing with individual storage and study tables.' }
            ].map((room, idx) => (
              <Card 
                key={idx} 
                className={`p-6 border transition-all cursor-pointer hover:border-[#1D9E75] flex flex-col justify-between ${selectedRoom === room.type ? 'border-[#1D9E75] bg-[#121212]' : 'border-neutral-900 bg-[#161616]'}`}
                onClick={() => setSelectedRoom(room.type)}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-lg">{room.type}</h3>
                      <p className="text-xs text-neutral-400 mt-1">{room.spec}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1D9E75]">{room.price}<span className="text-xs text-neutral-450 font-normal">/mo</span></p>
                      <span className="inline-block mt-1 text-[9px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        2 keys left
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{room.desc}</p>
                </div>
                <Button 
                  variant={selectedRoom === room.type ? 'default' : 'outline'} 
                  className="w-full mt-6 font-bold uppercase tracking-wider text-xs h-10" 
                  style={{
                    background: selectedRoom === room.type ? '#1D9E75' : 'transparent',
                    borderColor: '#1D9E75',
                    color: selectedRoom === room.type ? '#FFFFFF' : '#1D9E75'
                  }}
                >
                  {selectedRoom === room.type ? 'Active Selection' : 'Check Availability'}
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* PW5: AMENITIES & ARCHITECTURAL FLOOR PLAN */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold border-b border-neutral-900 pb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Amenities & Floor Blueprints
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Amenities List */}
            <div className="space-y-4 lg:col-span-1">
              <h3 className="text-base font-semibold text-white">Amenities Offered</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                {Object.keys(amenities).filter(k => amenities[k]).map((amName, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-800 bg-[#121212]">
                    <span className="text-[#1D9E75] font-bold">✓</span>
                    <span className="text-xs font-semibold text-neutral-300 truncate">{amName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Architectural blueprint rendering */}
            <div className="lg:col-span-2 p-5 rounded-xl border border-neutral-900 bg-[#121212] space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Architectural Floor Layout</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Click room boxes to inspect layout specs and vacancies</p>
                </div>
                
                <div className="flex gap-1 overflow-x-auto scrollbar-none">
                  {floors.map(fl => (
                    <button
                      key={fl}
                      onClick={() => { setActiveFloor(fl); setSelectedCellCoords(null); }}
                      className={`px-2.5 py-1 rounded text-[10px] font-semibold border whitespace-nowrap transition-all ${activeFloor === fl ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'bg-neutral-950 text-neutral-400 border-neutral-850'}`}
                    >
                      {fl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occupancy Filter Chips */}
              <div className="flex gap-1 overflow-x-auto pb-1 border-t pt-3 border-neutral-850 scrollbar-none">
                {['All', 'Single', 'Double', 'Triple', 'Common'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setOccupancyFilter(opt); setSelectedCellCoords(null); }}
                    className={`px-3 py-1 text-[9px] rounded-full border whitespace-nowrap transition-all ${occupancyFilter === opt ? 'bg-orange-500 text-white border-orange-500 font-bold' : 'bg-neutral-950 text-neutral-400 border-neutral-850'}`}
                  >
                    {opt === 'All' ? 'All Layouts' : opt === 'Common' ? 'Common Areas' : `${opt} Sharing`}
                  </button>
                ))}
              </div>

              {/* Blueprint Grid Vector Layout */}
              <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-900 overflow-auto flex justify-center scrollbar-none">
                <div 
                  className="relative border border-neutral-800 bg-[#0d0f12] select-none rounded"
                  style={{
                    width: `${canvasCols * mobileCellSize}px`, 
                    height: `${canvasRows * mobileCellSize}px`,
                    backgroundImage: `linear-gradient(to right, #1f2937 0.5px, transparent 0.5px), linear-gradient(to bottom, #1f2937 0.5px, transparent 0.5px)`,
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

                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedCellCoords(isSelected ? null : room.id)}
                        className="absolute rounded bg-white flex flex-col items-center justify-center cursor-pointer select-none"
                        style={{
                          left: `${left}px`,
                          top: `${top}px`,
                          width: `${width}px`,
                          height: `${height}px`,
                          borderColor: isSelected ? '#EF9F27' : '#374151',
                          borderWidth: '4px',
                          opacity: matches ? 1.0 : 0.22,
                          boxShadow: isSelected ? '0 0 10px rgba(239, 159, 39, 0.5)' : 'none',
                          zIndex: isSelected ? 30 : 10
                        }}
                      >
                        {/* Vacancy status badge pill (matching user's second ss) */}
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-slate-650 text-white rounded-[3px] text-[7px] px-1.5 py-0.5 leading-none font-bold uppercase whitespace-nowrap shadow-sm z-20 border border-slate-700">
                          {room.vacancy}
                        </div>

                        {/* Room label/number */}
                        <div className="text-[10px] font-bold text-slate-800 pointer-events-none z-10">
                          {room.customName}
                        </div>

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

              {/* Sub-blueprint detail inspector */}
              {selectedRoomDetails && (
                <div className="bg-[#0C447C] p-5 rounded-xl border border-cyan-400/30 space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      Room Inspector: Room {selectedRoomDetails.customName} ({selectedRoomDetails.type})
                    </p>
                    <button onClick={() => setSelectedCellCoords(null)} className="p-1 hover:bg-white/10 rounded">
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-cyan-100">
                    <div className="bg-black/30 p-3 rounded border border-white/5 space-y-1">
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Occupancy</p>
                      <p className="font-bold text-white text-sm">{selectedRoomDetails.type}</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded border border-white/5 space-y-1">
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Vacancy Status</p>
                      <Badge className="bg-emerald-500 text-white font-bold text-[10px] border-none shadow-none">{selectedRoomDetails.vacancy}</Badge>
                    </div>
                    <div className="bg-black/30 p-3 rounded border border-white/5 space-y-1">
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Beds Count</p>
                      <p className="font-bold text-white text-sm">🛏️ {selectedRoomDetails.beds} Mattresses</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded border border-white/5 space-y-1">
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Fixtures</p>
                      <p className="font-semibold text-white">🚪 {selectedRoomDetails.doors.length} Doors · 🪟 {selectedRoomDetails.windows.length} Windows</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* PW6: WEEKLY FOOD MENU */}
        <section className="space-y-6 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold border-b border-neutral-900 pb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Included Food Menu
          </h2>

          <div className="flex gap-2 overflow-x-auto pb-1 justify-center scrollbar-none">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border"
                style={{
                  background: selectedDay === day ? '#1D9E75' : '#1A1A1A',
                  color: selectedDay === day ? '#FFFFFF' : '#9CA3AF',
                  borderColor: selectedDay === day ? '#1D9E75' : '#1A1A1A'
                }}
              >
                {day}
              </button>
            ))}
          </div>

          <Card className="p-6 border border-neutral-800 space-y-4 max-w-md mx-auto" style={{ background: '#141414' }}>
            <div className="text-left">
              <p className="text-xs font-semibold text-[#EF9F27] uppercase tracking-wider">Breakfast · 8:00–9:00 AM</p>
              <p className="text-sm font-medium text-white mt-1">{menu[selectedDay].breakfast}</p>
            </div>
            <div className="pt-3 border-t border-neutral-850 text-left">
              <p className="text-xs font-semibold text-[#EF9F27] uppercase tracking-wider">Lunch · 12:00–1:00 PM</p>
              <p className="text-sm font-medium text-white mt-1">{menu[selectedDay].lunch}</p>
            </div>
            <div className="pt-3 border-t border-neutral-850 text-left">
              <p className="text-xs font-semibold text-[#EF9F27] uppercase tracking-wider">Dinner · 7:00–8:00 PM</p>
              <p className="text-sm font-medium text-white mt-1">{menu[selectedDay].dinner}</p>
            </div>
          </Card>
        </section>

        {/* PW7: GEOLOCATION MAP */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold border-b border-neutral-900 pb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            PG Location Map
          </h2>
          
          <div className="h-64 bg-neutral-900 rounded-xl overflow-hidden relative border border-neutral-800 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full text-teal-900/10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="darkGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#262626" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#darkGrid)" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#1A1A1A" strokeWidth="20" />
              <line x1="180" y1="0" x2="180" y2="400" stroke="#1A1A1A" strokeWidth="20" />
            </svg>

            {/* Render dynamically dropped pin */}
            <div 
              className="absolute flex flex-col items-center -mt-8 transition-all"
              style={{
                left: `${((mapCoords.lng - 77.6200) / 0.0150) * 100}%`,
                top: `${(1 - (mapCoords.lat - 12.9300) / 0.0100) * 100}%`,
              }}
            >
              <MapPin className="w-8 h-8 text-[#1D9E75] fill-current animate-bounce" />
              <Badge style={{ background: '#1D9E75', color: '#FFFFFF' }} className="text-[8px] -mt-1 shadow-md">
                Office Location
              </Badge>
            </div>

            <div className="absolute bottom-3 left-3 right-3 bg-neutral-950/95 backdrop-blur-sm p-3 rounded-lg border border-neutral-800 text-[10px] text-neutral-400">
              <p className="font-semibold text-white">Office Coordinates: {mapCoords.lat}, {mapCoords.lng}</p>
              <p className="truncate mt-0.5">{address}</p>
            </div>
          </div>
        </section>

        {/* PW8: REVIEWS */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold border-b border-neutral-900 pb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Resident Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Vijay Nair', duration: 'Staying since 8 months', comment: 'Absolutely clean PG with prompt support. The food tastes just like home. Management is helpful and Razorpay bills are transparent.' },
              { name: 'Rohit K.', duration: 'Staying since 1 year', comment: 'Very clean common areas, the WiFi speed is constant at 150Mbps, food menu is varied and fresh.' }
            ].map((rev, i) => (
              <Card key={i} className="p-6 border border-neutral-800 space-y-3 bg-[#121212]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-white">{rev.name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{rev.duration}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-[#1D9E75] bg-[#1D9E75]/10 px-2 py-0.5 rounded border border-[#1D9E75]/20">
                    Verified Resident
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed italic">"{rev.comment}"</p>
              </Card>
            ))}
          </div>
        </section>

        {/* PW9: HOUSE RULES */}
        <section className="space-y-6 max-w-xl mx-auto">
          <h2 className="text-3xl font-semibold border-b border-neutral-900 pb-3 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            House Rules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-400">
            {['No smoking inside rooms', 'Guests allowed till 9 PM', 'Noise curfew after 11 PM', 'Main gate closes at 11 PM', 'Valid Govt ID required'].map(rule => (
              <div key={rule} className="flex items-center gap-2.5 p-3 rounded-lg border border-neutral-850 bg-[#121212]">
                <Check className="w-4 h-4 text-[#EF9F27] flex-shrink-0" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PW10: CTA BOOK VISIT FORM */}
        <section id="cta-section" className="p-8 md:p-12 rounded-2xl flex flex-col items-center text-center space-y-6 border border-[#1D9E75]/20 relative overflow-hidden max-w-4xl mx-auto" style={{ background: 'linear-gradient(135deg, #0F6E56 0%, #073D2F 100%)' }}>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Ready to book your stay?
          </h2>
          <span className="px-3.5 py-1 rounded bg-amber-500 text-neutral-900 text-xs font-bold uppercase tracking-wider">
            Only 2 rooms available for booking
          </span>

          <div className="w-full max-w-md space-y-4 pt-2">
            {!showConfirmVisit && !showCallback ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setShowConfirmVisit(true)} 
                  className="flex-1 h-11 bg-white hover:bg-neutral-100 text-neutral-950 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                >
                  <CalendarCheck className="w-4 h-4" /> Schedule Visit
                </Button>
                <Button 
                  onClick={() => setShowCallback(true)} 
                  variant="outline" 
                  className="flex-1 h-11 border-white text-white hover:bg-white/10 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" /> Request Callback
                </Button>
              </div>
            ) : showConfirmVisit ? (
              <div className="bg-black/40 p-5 rounded-xl space-y-4 text-left border border-white/10">
                <p className="text-sm font-semibold text-white">Select Visit Slot</p>
                <div className="flex gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
                  {['Today', 'Tomorrow', 'Day After'].map(d => (
                    <button
                      key={d}
                      onClick={() => setVisitDate(d)}
                      className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all border ${visitDate === d ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'bg-neutral-900 text-neutral-400 border-neutral-800'}`}
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
                      className={`py-2 rounded-lg transition-all border text-center ${visitTime === t ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'bg-neutral-900 text-neutral-400 border-neutral-800'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <Button 
                  className="w-full bg-[#1D9E75] text-white mt-2 font-bold uppercase tracking-wider text-xs h-10 hover:opacity-90"
                  onClick={() => {
                    alert(`Visit scheduled for ${visitDate} at ${visitTime}!`);
                    setShowConfirmVisit(false);
                  }}
                >
                  Confirm Visit
                </Button>
              </div>
            ) : (
              <div className="bg-black/40 p-5 rounded-xl space-y-3 text-left border border-white/10">
                <p className="text-sm font-semibold text-white">We'll call you back shortly</p>
                <p className="text-xs text-neutral-300 leading-relaxed">Requesting a callback to phone number entered during gate login.</p>
                <Button 
                  className="w-full bg-[#1D9E75] text-white font-bold uppercase tracking-wider text-xs h-10 hover:opacity-90 animate-pulse"
                  onClick={() => {
                    alert('Callback confirmed! Expect a call shortly.');
                    setShowCallback(false);
                  }}
                >
                  Confirm Callback
                </Button>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Sticky Bottom Bar CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-900 bg-[#0D0D0D]/95 backdrop-blur-md z-20">
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center px-6">
          <div>
            <p className="text-2xl font-bold text-white">₹8,500<span className="text-xs text-neutral-450 font-normal">/mo</span></p>
            <p className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider">Only 2 rooms left</p>
          </div>
          <a href="#cta-section">
            <Button style={{ background: '#1D9E75', color: '#FFFFFF' }} className="font-semibold px-6 hover:opacity-90 h-10">
              Book Visit
            </Button>
          </a>
        </div>
      </div>

    </div>
  );
}
