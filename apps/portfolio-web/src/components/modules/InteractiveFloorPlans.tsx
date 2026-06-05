'use client';

import { useState, useEffect } from 'react';
import { X, Compass } from 'lucide-react';

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

export function InteractiveFloorPlans({ layoutData }: { layoutData?: any }) {
  const [isDark, setIsDark] = useState(false);
  const [floors, setFloors] = useState<string[]>(['Ground floor', '1st floor', '2nd floor']);
  const [activeFloor, setActiveFloor] = useState<string>('Ground floor');
  const [canvasCols, setCanvasCols] = useState(16);
  const [canvasRows, setCanvasRows] = useState(12);
  const [occupancyFilter, setOccupancyFilter] = useState('All');
  const [selectedCellCoords, setSelectedCellCoords] = useState<string | null>(null);

  // Default rooms data if localStorage is empty
  const [roomsData, setRoomsData] = useState<Record<string, RoomRectangle[]>>({
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
  });

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Sync dark theme mutations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Load state from DB layoutData on load
  const loadState = () => {
    if (layoutData && Object.keys(layoutData).length > 0) {
      try {
        const parsed = layoutData;
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
              }));
            } else {
              normalized[floorKey] = [];
            }
          });
          setRoomsData(normalized);
        }
        if (parsed.canvasCols) setCanvasCols(parsed.canvasCols);
        if (parsed.canvasRows) setCanvasRows(parsed.canvasRows);
        if (parsed.floors) {
          setFloors(parsed.floors);
          if (!parsed.floors.includes(activeFloor)) {
            setActiveFloor(parsed.floors[0] || 'Ground floor');
          }
        }
      } catch (e) {
        console.error('Error loading blueprint state', e);
      }
    }
  };

  useEffect(() => {
    loadState();
  }, [layoutData]);

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

  // Render realistic Beds matching user's request
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
      return `absolute border-[2.5px] rounded flex items-center justify-center shadow z-15 transition-all text-white ${
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

  const getUrgentCount = () => {
    let count = 0;
    activeRooms.forEach(r => {
      if (r.beds > 0 && r.vacancy !== 'Occupied') {
        count++;
      }
    });
    return count;
  };

  const urgentCount = getUrgentCount();

  return (
    <div className="w-full bg-gray-50 dark:bg-slate-900/40 py-12 md:py-16 border-b border-gray-100 dark:border-white/5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Interactive Blueprint & Floor Plans
          </h2>
          {/* Powered by stayfloww */}
          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-navy-deep/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border-subtle dark:border-outline-variant shadow-sm w-fit self-start sm:self-auto">
            <span className="text-[8px] uppercase tracking-widest text-slate-500 font-extrabold">POWERED BY</span>
            <div className="flex items-center gap-0.5 text-[#14b8a6] font-bold text-[10px]">
              <span className="w-3.5 h-3.5 rounded bg-[#14b8a6] text-white flex items-center justify-center text-[9px] font-black">s</span>
              <span>stayfloww</span>
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-slate-400 mb-8">
          Tap room boxes to inspect real-time bed vacancies, ventilation and orientation
        </p>

        {/* Urgency Alert */}
        {urgentCount > 0 && (
          <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 rounded-lg flex items-center gap-3">
            <span className="text-orange-600 dark:text-orange-400 font-bold">⚠️ Urgency Alert:</span>
            <span className="text-orange-700 dark:text-orange-355 font-semibold">
              Only {urgentCount} vacancy options remaining on {activeFloor}!
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Left: Floor Selector & Interactive Blueprint Grid */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-white/10 flex flex-col justify-between shadow-sm transition-colors">
            
            <div className="flex flex-col gap-4 text-left border-b border-slate-100 dark:border-white/5 pb-4">
              {/* Floor Selector Buttons */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">SELECT FLOOR</h3>
                <div className="flex gap-2.5 flex-wrap">
                  {floors.map((floor) => (
                    <button
                      key={floor}
                      onClick={() => {
                        setActiveFloor(floor);
                        setSelectedCellCoords(null);
                      }}
                      className={`px-5 py-2 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                        activeFloor === floor
                          ? 'bg-stayflow-teal text-white border-stayflow-teal shadow'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      🏢 {floor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Sharing Options */}
              <div className="flex flex-col gap-2 pt-2">
                <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">FILTER SHARING OPTIONS</h3>
                <div className="flex gap-2 flex-wrap">
                  {['All', 'Single', 'Double', 'Triple', 'Common'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setOccupancyFilter(opt);
                        setSelectedCellCoords(null);
                      }}
                      className={`px-3 py-1.5 rounded-full font-bold text-[10px] border transition-all cursor-pointer ${
                        occupancyFilter === opt
                          ? 'bg-stayflow-teal text-white border-stayflow-teal shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {opt === 'All' ? 'All Layouts' : opt === 'Common' ? 'Common Areas' : `${opt} Sharing`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Floor Plan Grid Area */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-white/5 overflow-auto flex justify-center scrollbar-none flex-grow mt-6">
              <div 
                className="relative border border-slate-300 dark:border-white/10 bg-[#f8fafc] dark:bg-slate-950 select-none rounded shadow-inner"
                style={{
                  width: `${canvasCols * mobileCellSize}px`, 
                  height: `${canvasRows * mobileCellSize}px`,
                  backgroundImage: isDark
                    ? `linear-gradient(to right, rgba(255,255,255,0.05) 0.5px, transparent 0.5px), linear-gradient(to bottom, rgba(255,255,255,0.05) 0.5px, transparent 0.5px)`
                    : `linear-gradient(to right, #e2e8f0 0.5px, transparent 0.5px), linear-gradient(to bottom, #e2e8f0 0.5px, transparent 0.5px)`,
                  backgroundSize: `${mobileCellSize}px ${mobileCellSize}px`
                }}
              >
                {activeRooms.map((room) => {
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
                            <div className="w-3 h-3 rounded-full border border-amber-550 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full border border-dashed border-amber-550" />
                            </div>
                            <div className="w-3 h-3 rounded-full border border-amber-550 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full border border-dashed border-amber-550" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Dining Area symbol */}
                      {room.type === 'Dining area' && (
                        <div className="absolute inset-0 pointer-events-none p-1 flex items-center justify-center opacity-50 gap-1.5 scale-75">
                          <div className="relative border border-amber-900/60 w-8 h-4 rounded flex items-center justify-center bg-amber-50/10">
                            <div className="absolute -top-0.5 left-1 w-1 h-1 rounded-full border border-amber-550 bg-amber-100" />
                            <div className="absolute -top-0.5 right-1 w-1 h-1 rounded-full border border-amber-550 bg-amber-100" />
                            <div className="absolute -bottom-0.5 left-1 w-1 h-1 rounded-full border border-amber-550 bg-amber-100" />
                            <div className="absolute -bottom-0.5 right-1 w-1 h-1 rounded-full border border-amber-550 bg-amber-100" />
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

          {/* Right Column: Room Details Inspector Card */}
          <div className="lg:col-span-1 flex flex-col h-full">
            {selectedRoomDetails ? (
              <div className="p-6 border border-stayflow-teal bg-stayflow-teal/5 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl space-y-4 shadow-md text-left transition-all h-full flex flex-col justify-between min-h-[360px] animate-in fade-in slide-in-from-right-5 duration-200">
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-center border-b border-stayflow-teal/20 dark:border-white/5 pb-2">
                    <div>
                      <p className="text-[10px] font-bold text-stayflow-teal uppercase tracking-wider">Room Inspector</p>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Room {selectedRoomDetails.customName}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedCellCoords(null)} 
                      className="p-1 hover:bg-slate-150 dark:hover:bg-slate-800 rounded text-gray-500 dark:text-gray-400 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3.5 text-xs flex-grow py-4 text-left">
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
                      <span className="font-bold text-stayflow-teal-dark dark:text-stayflow-teal">
                        🛣️ Road Facing (Good ventilation)
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">Real-time Vacancy:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded text-[10.5px]">
                        {selectedRoomDetails.vacancy === 'Vacant' ? '🟢 1+ Beds Available' : selectedRoomDetails.vacancy === '1/2 Filled' ? '🟢 1 Bed Left' : '🔴 Full'}
                      </span>
                    </div>
                  </div>

                  {selectedRoomDetails.beds > 0 && (
                    <div className="pt-2">
                      <a href="#contact" className="w-full">
                        <button className="w-full bg-stayflow-teal hover:bg-stayflow-teal-dark text-white font-bold uppercase tracking-wider text-xs py-3 rounded-lg shadow border-none active:scale-98 transition-all cursor-pointer">
                          Reserve Room {selectedRoomDetails.customName} →
                        </button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-450 rounded-xl space-y-4 shadow-sm text-center h-full flex flex-col justify-center items-center min-h-[360px] py-12 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-stayflow-teal">
                  <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white">Select a Room Block</h3>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
                    Click on any room block in the blueprint to inspect real-time bed-wise vacancies, prices, amenities, and window orientation details.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
