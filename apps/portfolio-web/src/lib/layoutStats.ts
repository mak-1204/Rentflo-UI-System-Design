export interface RoomBlock {
  type: string;
  beds: number;
  bedStatuses?: ('Vacant' | 'Occupied')[];
  monthlyRent?: number;
  deposit?: number;
}

export interface RoomStat {
  totalRooms: number;
  totalBeds: number;
  availableBeds: number;
  pricing?: { monthlyRent: number; deposit: number };
}

export interface FloorStat {
  roomCount: number;
  totalBeds: number;
  availableBeds: number;
}

export interface LayoutStats {
  totalCapacity: number;
  totalAvailableBeds: number;
  floorWiseStats: Record<string, FloorStat>;
  roomTypeStats: Record<string, RoomStat>;
}

export function computeLayoutStats(layoutData: any): LayoutStats {
  const stats: LayoutStats = {
    totalCapacity: 0,
    totalAvailableBeds: 0,
    floorWiseStats: {},
    roomTypeStats: {},
  };

  if (!layoutData || !layoutData.roomsData) {
    return stats;
  }

  const floors = Object.keys(layoutData.roomsData);

  for (const floor of floors) {
    const rooms: RoomBlock[] = layoutData.roomsData[floor];
    
    stats.floorWiseStats[floor] = {
      roomCount: 0,
      totalBeds: 0,
      availableBeds: 0,
    };

    for (const room of rooms) {
      // 1. Skip non-residential blocks (kitchens, washrooms, stairs)
      if (!room.beds || room.beds <= 0) {
        continue;
      }

      // Calculate availability for this room
      let roomAvailableBeds = 0;
      if (room.bedStatuses && room.bedStatuses.length > 0) {
        roomAvailableBeds = room.bedStatuses.filter(status => status === 'Vacant').length;
      } else {
        // Fallback: if bedStatuses not defined but beds > 0, assume all vacant
        roomAvailableBeds = room.beds;
      }

      // 2. Global Aggregates
      stats.totalCapacity += room.beds;
      stats.totalAvailableBeds += roomAvailableBeds;

      // 3. Floor-Wise Aggregates
      stats.floorWiseStats[floor].roomCount += 1;
      stats.floorWiseStats[floor].totalBeds += room.beds;
      stats.floorWiseStats[floor].availableBeds += roomAvailableBeds;

      // 4. Room-Type Aggregates
      const typeKey = room.type;
      if (!stats.roomTypeStats[typeKey]) {
        stats.roomTypeStats[typeKey] = {
          totalRooms: 0,
          totalBeds: 0,
          availableBeds: 0,
        };
      }

      stats.roomTypeStats[typeKey].totalRooms += 1;
      stats.roomTypeStats[typeKey].totalBeds += room.beds;
      stats.roomTypeStats[typeKey].availableBeds += roomAvailableBeds;

      // Embed pricing if available on the room block (takes the lowest rent if multiple rooms of same type have different rents)
      if (room.monthlyRent) {
        const currentPricing = stats.roomTypeStats[typeKey].pricing;
        if (!currentPricing || room.monthlyRent < currentPricing.monthlyRent) {
          stats.roomTypeStats[typeKey].pricing = {
            monthlyRent: room.monthlyRent,
            deposit: room.deposit || 0,
          };
        }
      }
    }
  }

  return stats;
}
