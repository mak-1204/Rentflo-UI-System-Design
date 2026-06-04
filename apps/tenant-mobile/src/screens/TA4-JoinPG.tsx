import { useState } from 'react'; import { useNavigate } from 'react-router'; import { ChevronLeft } from 'lucide-react'; import { Button } from '@stayflo/ui';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@stayflo/ui';

export function TenantJoinPG() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-6 text-left">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border shadow-sm relative">
        <button onClick={() => navigate(-1)} className="mb-4 p-1 hover:bg-slate-105 rounded absolute top-4 left-4">
          <ChevronLeft className="w-6 h-6" style={{ color: '#111827' }} />
        </button>
        
        <div className="mb-8 mt-6 text-center">
          <h1 className="text-2xl font-bold mb-1.5" style={{ color: '#111827' }}>
            Join your PG
          </h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Enter the 6-character code from your PG owner
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-center w-full">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup className="gap-2 justify-center w-full">
                <InputOTPSlot index={0} className="flex-1 h-14 text-xl border-2 font-bold uppercase" style={{ borderColor: code.length >= 1 ? '#1D9E75' : '#E5E7EB' }} />
                <InputOTPSlot index={1} className="flex-1 h-14 text-xl border-2 font-bold uppercase" style={{ borderColor: code.length >= 2 ? '#1D9E75' : '#E5E7EB' }} />
                <InputOTPSlot index={2} className="flex-1 h-14 text-xl border-2 font-bold uppercase" style={{ borderColor: code.length >= 3 ? '#1D9E75' : '#E5E7EB' }} />
                <InputOTPSlot index={3} className="flex-1 h-14 text-xl border-2 font-bold uppercase" style={{ borderColor: code.length >= 4 ? '#1D9E75' : '#E5E7EB' }} />
                <InputOTPSlot index={4} className="flex-1 h-14 text-xl border-2 font-bold uppercase" style={{ borderColor: code.length >= 5 ? '#1D9E75' : '#E5E7EB' }} />
                <InputOTPSlot index={5} className="flex-1 h-14 text-xl border-2 font-bold uppercase" style={{ borderColor: code.length >= 6 ? '#1D9E75' : '#E5E7EB' }} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <div className="rounded-xl p-4" style={{ background: '#E6F1FB' }}>
            <p className="text-xs leading-relaxed" style={{ color: '#0C447C' }}>
              💡 Get this code from your PG owner or manager. They can find it in their Stayflo Owner Web Dashboard.
            </p>
          </div>
          
          <Button 
            className="w-full h-11 text-sm font-semibold uppercase tracking-wider"
            style={{ background: '#1D9E75', color: '#FFFFFF' }}
            onClick={() => navigate('/tenant-mobile/app')}
            disabled={code.length < 6}
          >
            Join PG
          </Button>
        </div>
      </div>
    </div>
  );
}
