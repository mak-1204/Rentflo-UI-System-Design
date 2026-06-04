import { useState } from 'react'; import { useNavigate } from 'react-router'; import { MobileFrame } from '@stayflo/ui';
import { ChevronLeft } from 'lucide-react'; import { Button } from '@stayflo/ui';
import { Input } from '@stayflo/ui';
import { Progress } from '@stayflo/ui';

export function OwnerSetupStep1() {
  const navigate = useNavigate();
  const [pgName, setPgName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  
  return (
    <MobileFrame>
      <div className="h-full flex flex-col px-6 pt-12 pb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ChevronLeft className="w-6 h-6" style={{ color: '#111827' }} />
        </button>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium" style={{ color: '#1D9E75' }}>Step 1 of 3</span>
            <span className="text-sm" style={{ color: '#9CA3AF' }}>33%</span>
          </div>
          <Progress value={33} className="h-1.5" />
        </div>
        
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#111827' }}>
            Tell us about your PG
          </h1>
          <p style={{ color: '#6B7280' }}>
            Basic information to get started
          </p>
        </div>
        
        <div className="flex-1 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
              PG Name
            </label>
            <Input 
              placeholder="e.g., Sunrise PG"
              value={pgName}
              onChange={(e) => setPgName(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
              Full Address
            </label>
            <Input 
              placeholder="Building, Street, Area"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
              City
            </label>
            <Input 
              placeholder="e.g., Bengaluru"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-12 text-base"
            />
          </div>
        </div>
        
        <Button 
          className="w-full h-12 text-base mt-6"
          style={{ background: '#1D9E75' }}
          onClick={() => navigate('/owner-mobile/setup-step-2')}
        >
          Continue
        </Button>
      </div>
    </MobileFrame>
  );
}
