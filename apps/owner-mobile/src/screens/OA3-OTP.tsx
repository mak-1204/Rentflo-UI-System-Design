import { useState } from 'react'; import { useNavigate } from 'react-router'; import { MobileFrame } from '@rentflo/ui';
import { ChevronLeft } from 'lucide-react'; import { Button } from '@rentflo/ui';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@rentflo/ui';

export function OwnerOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  
  return (
    <MobileFrame>
      <div className="h-full flex flex-col px-6 pt-12 pb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 -ml-2"
        >
          <ChevronLeft className="w-6 h-6" style={{ color: '#111827' }} />
        </button>
        
        <div className="mb-12">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#111827' }}>
            Enter the 6-digit code
          </h1>
          <p style={{ color: '#6B7280' }}>
            Sent to +91 98765 43210
          </p>
        </div>
        
        <div className="flex-1">
          <div className="mb-8">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-3">
                <InputOTPSlot index={0} className="w-12 h-14 text-xl border-2" />
                <InputOTPSlot index={1} className="w-12 h-14 text-xl border-2" />
                <InputOTPSlot index={2} className="w-12 h-14 text-xl border-2" />
                <InputOTPSlot index={3} className="w-12 h-14 text-xl border-2" />
                <InputOTPSlot index={4} className="w-12 h-14 text-xl border-2" />
                <InputOTPSlot index={5} className="w-12 h-14 text-xl border-2" />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <div className="text-center mb-6">
            {timer > 0 ? (
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Resend code in {timer}s
              </p>
            ) : (
              <button className="text-sm font-medium hover:underline" style={{ color: '#1D9E75' }}>
                Resend OTP
              </button>
            )}
          </div>
          
          <Button 
            className="w-full h-12 text-base"
            style={{ background: '#1D9E75' }}
            onClick={() => navigate('/owner-mobile/app')}
            disabled={otp.length < 6}
          >
            Verify & Continue
          </Button>
        </div>
      </div>
    </MobileFrame>
  );
}
