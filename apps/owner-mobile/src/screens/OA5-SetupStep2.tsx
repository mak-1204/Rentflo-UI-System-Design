import { useState } from 'react'; import { useNavigate } from 'react-router'; import { MobileFrame } from '@stayflo/ui';
import { ChevronLeft, Minus, Plus } from 'lucide-react'; import { Button } from '@stayflo/ui';
import { Input } from '@stayflo/ui';
import { Switch } from '@stayflo/ui';
import { Progress } from '@stayflo/ui';

export function OwnerSetupStep2() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(12);
  const [floors, setFloors] = useState(3);
  const [lateFee, setLateFee] = useState('200');
  const [gracePeriod, setGracePeriod] = useState('5');
  const [foodIncluded, setFoodIncluded] = useState(true);
  const [cutoffTime, setCutoffTime] = useState('21:00');
  
  return (
    <MobileFrame>
      <div className="h-full flex flex-col px-6 pt-12 pb-8 overflow-y-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ChevronLeft className="w-6 h-6" style={{ color: '#111827' }} />
        </button>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium" style={{ color: '#1D9E75' }}>Step 2 of 3</span>
            <span className="text-sm" style={{ color: '#9CA3AF' }}>66%</span>
          </div>
          <Progress value={66} className="h-1.5" />
        </div>
        
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#111827' }}>
            Rooms & configuration
          </h1>
          <p style={{ color: '#6B7280' }}>
            Setup your PG structure and policies
          </p>
        </div>
        
        <div className="space-y-6 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" style={{ color: '#111827' }}>Total Rooms</label>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setRooms(Math.max(1, rooms - 1))}
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{ borderColor: '#E5E7EB' }}
              >
                <Minus className="w-4 h-4" style={{ color: '#6B7280' }} />
              </button>
              <span className="w-12 text-center text-lg font-semibold" style={{ color: '#111827' }}>{rooms}</span>
              <button 
                onClick={() => setRooms(rooms + 1)}
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{ borderColor: '#1D9E75', background: '#E1F5EE' }}
              >
                <Plus className="w-4 h-4" style={{ color: '#1D9E75' }} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" style={{ color: '#111827' }}>Floors</label>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setFloors(Math.max(1, floors - 1))}
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{ borderColor: '#E5E7EB' }}
              >
                <Minus className="w-4 h-4" style={{ color: '#6B7280' }} />
              </button>
              <span className="w-12 text-center text-lg font-semibold" style={{ color: '#111827' }}>{floors}</span>
              <button 
                onClick={() => setFloors(floors + 1)}
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{ borderColor: '#1D9E75', background: '#E1F5EE' }}
              >
                <Plus className="w-4 h-4" style={{ color: '#1D9E75' }} />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
              Late Fee (₹)
            </label>
            <Input 
              type="number"
              placeholder="200"
              value={lateFee}
              onChange={(e) => setLateFee(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
              Grace Period (days)
            </label>
            <Input 
              type="number"
              placeholder="5"
              value={gracePeriod}
              onChange={(e) => setGracePeriod(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          
          <div className="pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="text-sm font-medium block" style={{ color: '#111827' }}>
                  Food Included
                </label>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                  Provide meals to tenants
                </p>
              </div>
              <Switch checked={foodIncluded} onCheckedChange={setFoodIncluded} />
            </div>
            
            {foodIncluded && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
                  Booking Cutoff Time
                </label>
                <Input 
                  type="time"
                  value={cutoffTime}
                  onChange={(e) => setCutoffTime(e.target.value)}
                  className="h-12 text-base"
                />
                <p className="text-xs mt-1.5" style={{ color: '#9CA3AF' }}>
                  Tenants can book meals until this time for the next day
                </p>
              </div>
            )}
          </div>
        </div>
        
        <Button 
          className="w-full h-12 text-base mt-auto"
          style={{ background: '#1D9E75' }}
          onClick={() => navigate('/owner-mobile/setup-step-3')}
        >
          Continue
        </Button>
      </div>
    </MobileFrame>
  );
}
