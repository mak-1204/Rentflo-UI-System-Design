import { useState, useEffect } from 'react'; import { Card } from '@rentflo/ui';
import { Button } from '@rentflo/ui';
import { Input } from '@rentflo/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@rentflo/ui';
import { Check, Plus, Trash2, MapPin, X, HelpCircle, Download, Move } from 'lucide-react'; import { Badge } from '@rentflo/ui';

interface RoomRectangle {
  id: string;
  x: number; // grid x
  y: number; // grid y
  w: number; // width in cells
  h: number; // height in cells
  type: string; // "Single room" | "Double room" | "Triple room" | "Bathroom" | "Common bath" | "Kitchen" | "Dining area" | "Common room" | "Corridor" | "Staircase" | "Garden" | "Parking" | "Access road" | "Terrace"
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
}

const getDefaultBedPositions = (bedsCount: number) => {
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
  }
  return [];
};

const PALETTE = [
  // ROOMS
  { name: 'Single room', category: 'ROOMS', color: '#1D9E75', text: '#FFFFFF', initials: 'SR' },
  { name: 'Double room', category: 'ROOMS', color: '#0F6E56', text: '#FFFFFF', initials: 'DR' },
  { name: 'Triple room', category: 'ROOMS', color: '#111827', text: '#FFFFFF', initials: 'TR' },
  { name: 'Bathroom', category: 'ROOMS', color: '#0C447C', text: '#FFFFFF', initials: 'WR' },
  { name: 'Common bath', category: 'ROOMS', color: '#534AB7', text: '#FFFFFF', initials: 'CB' },
  // COMMON AREAS
  { name: 'Kitchen', category: 'COMMON', color: '#EF9F27', text: '#FFFFFF', initials: 'KT' },
  { name: 'Dining area', category: 'COMMON', color: '#854F0B', text: '#FFFFFF', initials: 'DA' },
  { name: 'Common room', category: 'COMMON', color: '#993C1D', text: '#FFFFFF', initials: 'CR' },
  { name: 'Corridor', category: 'COMMON', color: '#6B7280', text: '#FFFFFF', initials: 'CO' },
  { name: 'Staircase', category: 'COMMON', color: '#9CA3AF', text: '#FFFFFF', initials: 'SC' },
  // OUTDOOR
  { name: 'Garden', category: 'OUTDOOR', color: '#3B6D11', text: '#FFFFFF', initials: 'GD' },
  { name: 'Parking', category: 'OUTDOOR', color: '#374151', text: '#FFFFFF', initials: 'PK' },
  { name: 'Access road', category: 'OUTDOOR', color: '#111827', text: '#FFFFFF', initials: 'RD' },
  { name: 'Terrace', category: 'OUTDOOR', color: '#0F6E56', text: '#FFFFFF', initials: 'TC' },
];

export function OwnerWebsiteBuilder() {
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
          color: '#1D9E75',
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
          color: '#0F6E56',
          bedStatuses: ['Vacant', 'Occupied']
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
          color: '#0C447C',
          bedStatuses: []
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

  // Load custom state from localStorage on init with validation check
  useEffect(() => {
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
        if (parsed.floors) setFloors(parsed.floors);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Central auto-save Effect to ensure zero stale closures
  useEffect(() => {
    localStorage.setItem('rentflo_builder_state', JSON.stringify({
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
    }));
    window.dispatchEvent(new Event('rentflo_website_update'));
  }, [pgName, tagline, amenities, categoryMedia, roomsData, canvasCols, canvasRows, mapCoords, address, floors]);

  // Compatibility saveState helper
  const saveState = (updatedState?: any) => {
    // Kept for code compatibility, auto-save runs via useEffect
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
        const room = (roomsData[activeFloor] || []).find(r => r.id === draggedBed.roomId);
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
        
        const room = (roomsData[activeFloor] || []).find(r => r.id === draggedLabel.roomId);
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

    const w = toolName.includes('Single') ? 4 : toolName.includes('Double') ? 5 : toolName.includes('Triple') ? 6 : 4;
    const h = toolName.includes('Single') ? 3 : toolName.includes('Double') ? 4 : toolName.includes('Triple') ? 4 : 3;

    // Calculate grid coordinate, centered on cursor and snapped to cells
    const gridX = Math.max(0, Math.min(canvasCols - w, Math.round((dropX - (w * gridSize) / 2) / gridSize)));
    const gridY = Math.max(0, Math.min(canvasRows - h, Math.round((dropY - (h * gridSize) / 2) / gridSize)));

    const newId = `room-${Date.now()}`;
    const bedsCount = (toolName.includes('Bathroom') || toolName.includes('Common bath') || toolName.includes('Kitchen') || toolName.includes('Dining') || toolName.includes('Corridor') || toolName.includes('Staircase') || toolName.includes('Garden') || toolName.includes('Parking') || toolName.includes('Access road') || toolName.includes('Terrace')) ? 0 : (toolName.includes('Single') ? 1 : toolName.includes('Double') ? 2 : toolName.includes('Triple') ? 3 : 0);
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
    const w = toolName.includes('Single') ? 4 : toolName.includes('Double') ? 5 : toolName.includes('Triple') ? 6 : 4;
    const h = toolName.includes('Single') ? 3 : toolName.includes('Double') ? 4 : toolName.includes('Triple') ? 4 : 3;

    const bedsCount = (toolName.includes('Bathroom') || toolName.includes('Common bath') || toolName.includes('Kitchen') || toolName.includes('Dining') || toolName.includes('Corridor') || toolName.includes('Staircase') || toolName.includes('Garden') || toolName.includes('Parking') || toolName.includes('Access road') || toolName.includes('Terrace')) ? 0 : (toolName.includes('Single') ? 1 : toolName.includes('Double') ? 2 : toolName.includes('Triple') ? 3 : 0);
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

    const hasDoor = selectedRoom.doors.includes(wall);
    const hasWindow = selectedRoom.windows.includes(wall);

    let nextDoors = [...selectedRoom.doors];
    let nextWindows = [...selectedRoom.windows];

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

    const currentList = [...room[field]];
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
                className="text-[7.5px] font-bold text-white uppercase tracking-widest mt-[18%] truncate px-0.5 py-1 pointer-events-none select-none flex items-center justify-center leading-none text-center h-full w-full"
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
              <span className="text-[8px] font-bold text-white uppercase tracking-wider ml-[18%] truncate px-0.5 pointer-events-none select-none">
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

  return (
    <div className="h-full overflow-hidden flex flex-col md:flex-row w-full bg-[#F8F9FA] text-left">
      
      {/* Editor Panel Left */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        
        {publishStatus && (
          <div className="fixed bottom-6 left-6 bg-[#111827] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold z-50 animate-bounce">
            <Check className="w-4 h-4 text-[#1D9E75]" /> {publishStatus}
          </div>
        )}

        <div className="flex items-center justify-between text-slate-900">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Custom PG Website Builder</h1>
            <p className="text-slate-500 mt-1">Design customizable architectural floor blueprints and map coordinates</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer h-9 px-4 text-xs font-semibold rounded-lg shadow-sm transition-all" onClick={() => saveState({})}>Save Draft</Button>
            <Button style={{ background: '#1D9E75', color: '#FFFFFF' }} onClick={() => {
              setPublishStatus('Website Published Successfully!');
              setTimeout(() => setPublishStatus(null), 3000);
            }}>
              Publish Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="floor_plan">
          <TabsList className="bg-white border border-slate-200 rounded-lg p-1 text-slate-500 flex flex-wrap gap-1 shadow-sm">
            <TabsTrigger value="cover" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3.5 py-1.5 text-xs font-semibold rounded-md data-[state=active]:bg-[#1D9E75]! data-[state=active]:text-white! transition-all">General</TabsTrigger>
            <TabsTrigger value="floor_plan" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3.5 py-1.5 text-xs font-semibold rounded-md data-[state=active]:bg-[#1D9E75]! data-[state=active]:text-white! transition-all">Architect Blueprint Plan</TabsTrigger>
            <TabsTrigger value="location" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3.5 py-1.5 text-xs font-semibold rounded-md data-[state=active]:bg-[#1D9E75]! data-[state=active]:text-white! transition-all">Office Location</TabsTrigger>
            <TabsTrigger value="amenities" className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3.5 py-1.5 text-xs font-semibold rounded-md data-[state=active]:bg-[#1D9E75]! data-[state=active]:text-white! transition-all">Amenities</TabsTrigger>
          </TabsList>

          {/* TAB 1: COVER INFO */}
          <TabsContent value="cover" className="space-y-4 mt-4">
            <Card className="p-6 space-y-4 bg-white border border-slate-200 text-slate-800 text-left shadow-sm">
              <h3 className="text-sm font-semibold text-slate-850 uppercase tracking-wider">General Branding</h3>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">PG Name</label>
                <Input value={pgName} className="bg-white border-slate-200 text-slate-900 focus:ring-[#1D9E75]" onChange={(e) => { setPgName(e.target.value); saveState({ pgName: e.target.value }); }} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Branding Tagline</label>
                <Input value={tagline} className="bg-white border-slate-200 text-slate-900 focus:ring-[#1D9E75]" onChange={(e) => { setTagline(e.target.value); saveState({ tagline: e.target.value }); }} />
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: INTERACTIVE BLUEPRINT GRID BUILDER */}
          <TabsContent value="floor_plan" className="space-y-4 mt-4">
            
            {/* Top floor tabs selector */}
            <div className="flex gap-1.5 border-b border-slate-200 pb-2">
              {floors.map(fl => (
                <button
                  key={fl}
                  onClick={() => { setActiveFloor(fl); setActiveRoomId(null); }}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md border transition-all ${activeFloor === fl ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'}`}
                >
                  {fl}
                </button>
              ))}
              <button 
                onClick={addFloor}
                className="px-4 py-1.5 text-xs font-semibold rounded-md border border-dashed border-teal-600 text-[#1D9E75] bg-white flex items-center gap-1 hover:bg-slate-50 shadow-sm"
              >
                + Add floor
              </button>
            </div>

            {/* Grid Controls Panel */}
            <Card className="p-4 bg-white text-slate-800 flex flex-wrap gap-4 items-center justify-between border border-slate-200 shadow-sm">
              <div className="flex gap-4 items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold">GRID:</span>
                  {[
                    { label: 'Standard (40px)', val: 40 },
                    { label: 'Fine (20px)', val: 20 },
                    { label: 'Large (60px)', val: 60 }
                  ].map(g => (
                    <button
                      key={g.val}
                      onClick={() => setGridSize(g.val)}
                      className={`px-2.5 py-1.5 rounded transition-all border ${gridSize === g.val ? 'bg-[#1D9E75] border-[#1D9E75] text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">SCALE:</span>
                  <Badge className="bg-[#E1F5EE] text-[#085041] hover:bg-[#E1F5EE] border border-teal-200/50 shadow-none">1 cell = 1m</Badge>
                </div>
              </div>

              {/* Canvas Resize Controls */}
              <div className="flex gap-2 text-xs items-center">
                <span className="text-slate-500 font-semibold">CANVAS:</span>
                <Button size="sm" variant="outline" className="text-slate-700 border-slate-200 bg-white hover:bg-slate-50" onClick={() => { setCanvasCols(Math.max(4, canvasCols - 1)); saveState({ canvasCols: canvasCols - 1 }); }}>- Width</Button>
                <Button size="sm" variant="outline" className="text-slate-700 border-slate-200 bg-white hover:bg-slate-50" onClick={() => { setCanvasCols(canvasCols + 1); saveState({ canvasCols: canvasCols + 1 }); }}>+ Width</Button>
                <Button size="sm" variant="outline" className="text-slate-700 border-slate-200 bg-white hover:bg-slate-50" onClick={() => { setCanvasRows(Math.max(4, canvasRows - 1)); saveState({ canvasRows: canvasRows - 1 }); }}>- Height</Button>
                <Button size="sm" variant="outline" className="text-slate-700 border-slate-200 bg-white hover:bg-slate-50" onClick={() => { setCanvasRows(canvasRows + 1); saveState({ canvasRows: canvasRows + 1 }); }}>+ Height</Button>
                <div className="border-l border-slate-200 pl-2 flex gap-1">
                  <Button size="sm" variant="destructive" className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200" onClick={clearFloor}>Clear floor</Button>
                </div>
              </div>
            </Card>

            {/* Vector Layout Canvas */}
            <div className="flex flex-col lg:flex-row gap-4 h-[550px] overflow-hidden">
              
              {/* Palette Column Left */}
              <div className="w-full lg:w-56 bg-white border border-slate-200 p-4 rounded-xl overflow-y-auto space-y-4 text-left shadow-sm">
                
                {/* Rooms selection */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Drag Rooms to Blueprint</p>
                  <div className="space-y-1.5">
                    {PALETTE.filter(p => p.category === 'ROOMS').map(p => (
                      <button
                        key={p.name}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', p.name)}
                        onClick={() => handleAddRoom(p.name)}
                        className="w-full p-2.5 rounded flex items-center justify-between text-xs transition-all border text-slate-700 bg-white hover:bg-slate-50 cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
                          <span className="font-semibold">{p.name}</span>
                        </div>
                        <span className="text-[9px] text-[#1D9E75] font-bold">+ ADD</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Common Areas */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Common Areas</p>
                  <div className="space-y-1.5">
                    {PALETTE.filter(p => p.category === 'COMMON').map(p => (
                      <button
                        key={p.name}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', p.name)}
                        onClick={() => handleAddRoom(p.name)}
                        className="w-full p-2.5 rounded flex items-center justify-between text-xs transition-all border text-slate-700 bg-white hover:bg-slate-50 cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
                          <span className="font-semibold">{p.name}</span>
                        </div>
                        <span className="text-[9px] text-[#1D9E75] font-bold">+ ADD</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Outdoor */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Outdoor</p>
                  <div className="space-y-1.5">
                    {PALETTE.filter(p => p.category === 'OUTDOOR').map(p => (
                      <button
                        key={p.name}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', p.name)}
                        onClick={() => handleAddRoom(p.name)}
                        className="w-full p-2.5 rounded flex items-center justify-between text-xs transition-all border text-slate-700 bg-white hover:bg-slate-50 cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
                          <span className="font-semibold">{p.name}</span>
                        </div>
                        <span className="text-[9px] text-[#1D9E75] font-bold">+ ADD</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Drawing Canvas Area (Center) */}
              <div 
                className="flex-1 bg-slate-50 rounded-xl overflow-auto border border-slate-200 p-6 flex items-start justify-start relative shadow-inner select-none"
                onClick={() => setActiveRoomId(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleCanvasDrop}
              >
                {/* SVG/Grid Drawing Board */}
                <div 
                  className="relative border border-slate-200 bg-white shadow-md rounded overflow-visible"
                  style={{
                    width: `${canvasCols * gridSize}px`, 
                    height: `${canvasRows * gridSize}px`,
                    backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
                    backgroundSize: `${gridSize}px ${gridSize}px`
                  }}
                >
                  {/* Render Room Rectangles */}
                  {activeRooms.map(room => {
                    const isSelected = activeRoomId === room.id;
                    const left = room.x * gridSize;
                    const top = room.y * gridSize;
                    const width = room.w * gridSize;
                    const height = room.h * gridSize;

                    return (
                      <div
                        key={room.id}
                        onMouseDown={(e) => handleDragStart(room.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute rounded flex flex-col items-center justify-center border-[3px] cursor-grab active:cursor-grabbing select-none"
                        style={{
                          left: `${left}px`,
                          top: `${top}px`,
                          width: `${width}px`,
                          height: `${height}px`,
                          backgroundColor: room.color,
                          borderColor: isSelected ? '#EF9F27' : '#111827',
                          boxShadow: isSelected ? '0 0 12px rgba(239, 159, 39, 0.6)' : 'none',
                          zIndex: isSelected ? 30 : 10
                        }}
                      >
                        {/* Room label/number inside room */}
                        {(() => {
                           const labelX = room.labelPos?.x !== undefined ? room.labelPos.x : 50;
                           const labelY = room.labelPos?.y !== undefined ? room.labelPos.y : 50;
                           const isNarrow = room.w < room.h;
                           
                           return (
                             <div 
                               onMouseDown={(e) => handleLabelDragStart(room.id, e)}
                               onClick={(e) => e.stopPropagation()}
                               className="absolute text-xs font-bold font-sans z-10 text-white bg-slate-900/60 px-1.5 py-0.5 rounded shadow cursor-move select-none flex items-center justify-center pointer-events-auto"
                               style={{
                                 left: `${labelX}%`,
                                 top: `${labelY}%`,
                                 transform: `translate(-50%, -50%) ${isNarrow ? 'rotate(180deg)' : ''}`,
                                 writingMode: isNarrow ? 'vertical-rl' : 'horizontal-tb',
                               }}
                               title="Room Label - Drag to move"
                             >
                               {room.customName}
                             </div>
                           );
                        })()}

                        {/* Realistic Beds Layout */}
                        {renderBeds(room)}

                        {/* Red swing doors */}
                        {renderDoors(room.doors)}

                        {/* Red windows */}
                        {renderWindows(room.windows)}

                        {/* Multi-axis Resize handles */}
                        {isSelected && (
                          <>
                            {/* Right edge resize handle */}
                            <div 
                              className="absolute -right-2 top-2 bottom-2 w-4 cursor-e-resize group/right z-35"
                              onMouseDown={(e) => handleResizeStart(room.id, 'right', e)}
                            >
                              <div className="absolute right-[6px] top-0 bottom-0 w-1.5 bg-amber-500 opacity-0 group-hover/right:opacity-100 rounded transition-opacity shadow-sm" />
                            </div>
                            {/* Bottom edge resize handle */}
                            <div 
                              className="absolute -bottom-2 left-2 right-2 h-4 cursor-s-resize group/bottom z-35"
                              onMouseDown={(e) => handleResizeStart(room.id, 'bottom', e)}
                            >
                              <div className="absolute bottom-[6px] left-0 right-0 h-1.5 bg-amber-500 opacity-0 group-hover/bottom:opacity-100 rounded transition-opacity shadow-sm" />
                            </div>
                            {/* Bottom-right corner resize handle */}
                            <div 
                              className="absolute bottom-0 right-0 w-6 h-6 translate-x-1/2 translate-y-1/2 cursor-se-resize bg-amber-500 hover:bg-amber-600 border-2 border-white rounded-full flex items-center justify-center z-50 shadow-lg"
                              style={{ width: '24px', height: '24px' }}
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

              {/* Properties Panel (Right) */}
              <div className="w-full lg:w-64 bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between text-left text-slate-800 shadow-sm">
                <div className="space-y-4 overflow-y-auto max-h-[420px] pr-1">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span>Blueprint Inspector</span>
                    {selectedRoom && <span className="text-xs font-mono text-slate-400">[{selectedRoom.w}x{selectedRoom.h}m]</span>}
                  </h3>

                  {selectedRoom ? (
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">Block Category</label>
                        <Badge variant="secondary" style={{ background: selectedRoom.color, color: '#FFF' }} className="border-none font-semibold">
                          {selectedRoom.type}
                        </Badge>
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold mb-1">Room Label / Number</label>
                        <Input 
                          value={selectedRoom.customName} 
                          onChange={(e) => updateRoomProperty('customName', e.target.value)} 
                          className="h-8 text-xs bg-white border-slate-200 text-slate-900 focus:ring-[#1D9E75]"
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
                          className="w-full h-8 text-xs bg-white border border-slate-200 rounded px-2 text-slate-900 focus:ring-[#1D9E75]"
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
                              value={selectedRoom.sharingType || (selectedRoom.beds === 1 ? '1 Sharing' : selectedRoom.beds === 2 ? '2 Sharing' : selectedRoom.beds === 3 ? '3 Sharing' : '1 Sharing')}
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
                              className="w-full h-8 text-xs bg-white border border-slate-200 rounded px-2 text-slate-900 focus:ring-[#1D9E75]"
                            >
                              <option value="1 Sharing">1 Sharing (Single)</option>
                              <option value="2 Sharing">2 Sharing (Double)</option>
                              <option value="3 Sharing">3 Sharing (Triple)</option>
                              <option value="4 Sharing">4 Sharing (Quad)</option>
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
                                className="pl-6 h-8 text-xs bg-white border-slate-200 text-slate-900 focus:ring-[#1D9E75]"
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
                                      className="accent-[#1D9E75] w-3 h-3 cursor-pointer"
                                    />
                                    <span>{amenity}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Beds (Realistic Mattresses)</label>
                            <input 
                              type="range" 
                              min="0" 
                              max="4" 
                              value={selectedRoom.beds} 
                              onChange={(e) => {
                                const count = parseInt(e.target.value);
                                const nextPositions = getDefaultBedPositions(count);
                                const currentStatuses = selectedRoom.bedStatuses || [];
                                let nextStatuses = [...currentStatuses];
                                if (nextStatuses.length < count) {
                                  const pad = Array(count - nextStatuses.length).fill('Vacant');
                                  nextStatuses = [...nextStatuses, ...pad];
                                } else if (nextStatuses.length > count) {
                                  nextStatuses = nextStatuses.slice(0, count);
                                }

                                const allVacant = nextStatuses.every(s => s === 'Vacant');
                                const allOccupied = nextStatuses.every(s => s === 'Occupied');
                                const overallVacancy = allVacant ? 'Vacant' : allOccupied ? 'Occupied' : '1/2 Filled';
                                
                                updateRoomProperties({
                                  beds: count,
                                  bedStatuses: nextStatuses,
                                  bedPositions: nextPositions,
                                  vacancy: overallVacancy,
                                  sharingType: count > 0 ? `${count} Sharing` : 'Common / Non-residential'
                                });
                              }}
                              className="w-full accent-[#1D9E75]"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500">
                              <span>0 Beds</span>
                              <span>{selectedRoom.beds} Active</span>
                              <span>4 Beds</span>
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
                              className={`absolute -top-1.5 left-2 right-2 h-3 rounded hover:bg-[#1D9E75]/30 cursor-pointer flex items-center justify-center transition-all z-10 ${
                                selectedRoom.doors.includes('top') ? 'bg-rose-500 border border-rose-600' :
                                selectedRoom.windows.includes('top') ? 'bg-amber-500 border border-amber-600' : 'bg-slate-200 hover:bg-slate-300'
                              }`}
                              title="Top Wall"
                            >
                              <span className="text-[8px] font-bold text-white leading-none scale-75">
                                {selectedRoom.doors.includes('top') ? 'D' : selectedRoom.windows.includes('top') ? 'W' : ''}
                              </span>
                            </button>

                            {/* Bottom Wall Button */}
                            <button 
                              onClick={() => handleWallClick('bottom')}
                              className={`absolute -bottom-1.5 left-2 right-2 h-3 rounded hover:bg-[#1D9E75]/30 cursor-pointer flex items-center justify-center transition-all z-10 ${
                                selectedRoom.doors.includes('bottom') ? 'bg-rose-500 border border-rose-600' :
                                selectedRoom.windows.includes('bottom') ? 'bg-amber-500 border border-amber-600' : 'bg-slate-200 hover:bg-slate-300'
                              }`}
                              title="Bottom Wall"
                            >
                              <span className="text-[8px] font-bold text-white leading-none scale-75">
                                {selectedRoom.doors.includes('bottom') ? 'D' : selectedRoom.windows.includes('bottom') ? 'W' : ''}
                              </span>
                            </button>

                            {/* Left Wall Button */}
                            <button 
                              onClick={() => handleWallClick('left')}
                              className={`absolute top-2 bottom-2 -left-1.5 w-3 rounded hover:bg-[#1D9E75]/30 cursor-pointer flex items-center justify-center transition-all z-10 ${
                                selectedRoom.doors.includes('left') ? 'bg-rose-500 border border-rose-600' :
                                selectedRoom.windows.includes('left') ? 'bg-amber-500 border border-amber-600' : 'bg-slate-200 hover:bg-slate-300'
                              }`}
                              title="Left Wall"
                            >
                              <span className="text-[8px] font-bold text-white leading-none scale-75">
                                {selectedRoom.doors.includes('left') ? 'D' : selectedRoom.windows.includes('left') ? 'W' : ''}
                              </span>
                            </button>

                            {/* Right Wall Button */}
                            <button 
                              onClick={() => handleWallClick('right')}
                              className={`absolute top-2 bottom-2 -right-1.5 w-3 rounded hover:bg-[#1D9E75]/30 cursor-pointer flex items-center justify-center transition-all z-10 ${
                                selectedRoom.doors.includes('right') ? 'bg-rose-500 border border-rose-600' :
                                selectedRoom.windows.includes('right') ? 'bg-amber-500 border border-amber-600' : 'bg-slate-200 hover:bg-slate-300'
                              }`}
                              title="Right Wall"
                            >
                              <span className="text-[8px] font-bold text-white leading-none scale-75">
                                {selectedRoom.doors.includes('right') ? 'D' : selectedRoom.windows.includes('right') ? 'W' : ''}
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

          {/* TAB 3: LIVE MAP LOCATOR */}
          <TabsContent value="location" className="space-y-4 mt-4">
            <Card className="p-6 space-y-4 bg-white border border-slate-200 text-slate-800 text-left shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Office Map Location</h3>
                <p className="text-xs text-slate-500 mt-1">Click anywhere on the map to drop the PG coordinate pin. Sunrise PG location will update instantly.</p>
              </div>

              <div 
                className="relative h-64 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden cursor-crosshair flex items-center justify-center"
                onClick={handleMapClick}
              >
                <svg className="absolute inset-0 w-full h-full text-slate-200" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#e2e8f0" strokeWidth="24" />
                  <line x1="200" y1="0" x2="200" y2="400" stroke="#e2e8f0" strokeWidth="24" />
                </svg>

                <div 
                  className="absolute pointer-events-none flex flex-col items-center -mt-8"
                  style={{
                    left: `${((mapCoords.lng - 77.6200) / 0.0150) * 100}%`,
                    top: `${(1 - (mapCoords.lat - 12.9300) / 0.0100) * 100}%`,
                  }}
                >
                  <MapPin className="w-8 h-8 text-rose-600 fill-current animate-bounce" />
                  <Badge style={{ background: '#993C1D', color: '#FFFFFF' }} className="text-[9px] -mt-1 shadow-md border-none">
                    Sunset Office Pin
                  </Badge>
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1 shadow-md">
                  <p><strong>Configured Address:</strong> {address}</p>
                  <p className="text-[10px] text-slate-500">Lat: {mapCoords.lat} · Lng: {mapCoords.lng} (Click map to change)</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 4: AMENITIES */}
          <TabsContent value="amenities" className="space-y-4 mt-4">
            <Card className="p-6 space-y-4 bg-white border border-slate-200 text-slate-800 text-left shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Toggle Live Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(amenities).map(amName => (
                  <div 
                    key={amName}
                    onClick={() => toggleAmenity(amName)}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${amenities[amName] ? 'border-[#1D9E75] bg-teal-50/30' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                  >
                    <span className="text-xs font-semibold text-slate-700">{amName}</span>
                    <input type="checkbox" checked={amenities[amName]} onChange={() => {}} className="accent-[#1D9E75] cursor-pointer" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Live Preview Panel Right */}
      <div className="w-full md:w-[420px] border-t md:border-t-0 md:border-l border-slate-200 bg-white flex flex-col text-slate-650">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <p className="text-xs font-bold text-center text-slate-800 uppercase tracking-wider">Live Explorer Preview</p>
          <p className="text-[10px] text-center text-slate-400 mt-0.5">Real-time mobile portfolio synchronisation</p>
        </div>
        
        <div className="flex-1 p-6 bg-slate-50/50 flex items-center justify-center overflow-y-auto">
          {/* Virtual Mobile phone shell */}
          <div className="w-[310px] h-[550px] rounded-[2rem] shadow-2xl border-[8px] border-slate-900 bg-[#0D0D0D] overflow-y-auto scrollbar-none flex flex-col text-neutral-300 text-xs text-left">
            {/* Virtual Hero */}
            <div className="relative h-40 bg-neutral-850 flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{pgName}</h4>
                <p className="text-[10px] text-neutral-400 block mt-0.5 truncate">{tagline}</p>
              </div>
            </div>

            {/* Virtual Location Map preview */}
            <div className="p-3 space-y-2 border-b border-neutral-900">
              <p className="text-[10px] font-bold text-[#EF9F27] uppercase tracking-wider">Locate Office Map</p>
              <div className="h-20 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                <MapPin className="w-6 h-6 text-rose-500 animate-bounce" />
                <span className="text-[8px] absolute bottom-1 right-2 text-slate-500">Lat: {mapCoords.lat}</span>
              </div>
            </div>

            {/* Virtual Floor Plan blueprint preview */}
            <div className="p-3 space-y-2">
              <p className="text-[10px] font-bold text-[#EF9F27] uppercase tracking-wider">Blueprint Layout ({activeFloor})</p>
              
              <div 
                className="relative bg-neutral-950 p-2 rounded-lg border border-neutral-900" 
                style={{ height: '140px', width: '100%' }}
              >
                {activeRooms.map(room => {
                  const scale = 14; // mobile preview scale factor
                  return (
                    <div
                      key={room.id}
                      className="absolute rounded border border-neutral-750 flex flex-col items-center justify-center overflow-hidden"
                      style={{
                        left: `${room.x * scale}px`,
                        top: `${room.y * scale}px`,
                        width: `${room.w * scale}px`,
                        height: `${room.h * scale}px`,
                        backgroundColor: room.color,
                      }}
                    >
                      <span className="text-[6px] font-bold font-sans text-white bg-slate-950/70 px-1 py-0.5 rounded leading-none">{room.customName}</span>
                      {room.beds > 0 && (
                        <div className="absolute inset-0 pointer-events-none">
                          {(() => {
                            const bedsCount = room.beds;
                            const vacancy = room.vacancy;
                            const bedStatuses = room.bedStatuses || Array(bedsCount).fill(vacancy === 'Vacant' ? 'Vacant' : 'Occupied');
                            const positions = room.bedPositions && room.bedPositions.length === bedsCount
                              ? room.bedPositions
                              : getDefaultBedPositions(bedsCount);
                            
                            return positions.map((pos, idx) => {
                              const vacant = bedStatuses[idx] === 'Vacant';
                              const isRotated = pos.rotated;
                              const bedW = isRotated ? (pos.h || 26) : (pos.w || 70);
                              const bedH = isRotated ? (pos.w || 70) : (pos.h || 26);
                              return (
                                <div
                                  key={idx}
                                  className={`absolute rounded-[1px] ${vacant ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                  style={{
                                    left: `${pos.x}%`,
                                    top: `${pos.y}%`,
                                    width: `${bedW}%`,
                                    height: `${bedH}%`,
                                    opacity: 0.8
                                  }}
                                />
                              );
                            });
                          })()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
