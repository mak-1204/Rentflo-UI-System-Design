import { useState } from 'react'; import { useNavigate } from 'react-router'; import { StayfloLogo } from '@stayflo/ui';
import { Button } from '@stayflo/ui';
import { Input } from '@stayflo/ui';

export function TenantPhoneLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-6 text-left">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border shadow-sm">
        <div className="mb-8 text-center">
          <StayfloLogo className="text-3xl mb-4" />
          <h1 className="text-2xl font-bold mb-1.5" style={{ color: '#111827' }}>
            Resident Portal
          </h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Enter your mobile number to sign in to your PG
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="w-16 h-11 rounded-lg flex items-center justify-center border font-semibold text-slate-700 bg-slate-50" style={{ borderColor: '#E5E7EB' }}>
                +91
              </div>
              <Input 
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 h-11 text-sm"
                maxLength={10}
              />
            </div>
          </div>
          
          <Button 
            className="w-full h-11 text-sm font-semibold uppercase tracking-wider hover:opacity-95"
            style={{ background: '#1D9E75', color: '#FFFFFF' }}
            onClick={() => navigate('/tenant-mobile/otp')}
          >
            Send Verification Code
          </Button>
        </div>
      </div>
    </div>
  );
}
