import { useState } from 'react'; import { useNavigate } from 'react-router'; import { MobileFrame } from '@stayflo/ui';
import { StayfloLogo } from '@stayflo/ui';
import { Button } from '@stayflo/ui';
import { Input } from '@stayflo/ui';

export function OwnerPhoneLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  
  return (
    <MobileFrame>
      <div className="h-full flex flex-col px-6 pt-16 pb-8">
        <div className="mb-12">
          <StayfloLogo className="text-3xl mb-8" />
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#111827' }}>
            Welcome back
          </h1>
          <p style={{ color: '#6B7280' }}>
            Enter your phone number to continue
          </p>
        </div>
        
        <div className="flex-1">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="w-16 h-12 rounded-lg flex items-center justify-center border font-medium" style={{ borderColor: '#E5E7EB', background: '#F8F9FA' }}>
                +91
              </div>
              <Input 
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 h-12 text-base"
                maxLength={10}
              />
            </div>
          </div>
          
          <Button 
            className="w-full h-12 text-base"
            style={{ background: '#1D9E75' }}
            onClick={() => navigate('/owner-mobile/otp')}
          >
            Send OTP
          </Button>
          
          <div className="text-center mt-6">
            <button 
              onClick={() => navigate('/owner-mobile/setup-step-1')}
              className="text-sm hover:underline" 
              style={{ color: '#1D9E75' }}
            >
              First time? Set up your PG →
            </button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
