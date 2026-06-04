import { useState } from 'react'; import { useNavigate } from 'react-router'; import { MobileFrame } from '@stayflo/ui';
import { ChevronLeft, Copy, CheckCircle2 } from 'lucide-react'; import { Button } from '@stayflo/ui';
import { Input } from '@stayflo/ui';
import { Progress } from '@stayflo/ui';

export function OwnerSetupStep3() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const pgCode = 'SUNPG';
  
  const handleCopy = () => {
    navigator.clipboard.writeText(pgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
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
            <span className="text-sm font-medium" style={{ color: '#1D9E75' }}>Step 3 of 3</span>
            <span className="text-sm" style={{ color: '#9CA3AF' }}>100%</span>
          </div>
          <Progress value={100} className="h-1.5" />
        </div>
        
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#111827' }}>
            Connect payments
          </h1>
          <p style={{ color: '#6B7280' }}>
            Link Razorpay to receive rent payments
          </p>
        </div>
        
        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>
              Razorpay API Key
            </label>
            <Input 
              placeholder="rzp_live_xxxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="h-12 text-base"
            />
            <p className="text-xs mt-1.5" style={{ color: '#9CA3AF' }}>
              Find this in your Razorpay dashboard under Settings → API Keys
            </p>
          </div>
          
          <div className="rounded-xl p-6" style={{ background: '#E1F5EE' }}>
            <p className="text-sm font-medium mb-2" style={{ color: '#085041' }}>
              Your unique PG code
            </p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold tracking-wide" style={{ color: '#1D9E75' }}>
                {pgCode}
              </span>
              <button 
                onClick={handleCopy}
                className="ml-auto p-2 rounded-lg"
                style={{ background: copied ? '#1D9E75' : '#FFFFFF' }}
              >
                {copied ? (
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                ) : (
                  <Copy className="w-5 h-5" style={{ color: '#1D9E75' }} />
                )}
              </button>
            </div>
            <p className="text-xs mt-3" style={{ color: '#085041' }}>
              Share this code with your tenants so they can join your PG on the Stayflo app
            </p>
          </div>
          
          <button className="text-sm hover:underline" style={{ color: '#6B7280' }}>
            Skip for now
          </button>
        </div>
        
        <Button 
          className="w-full h-12 text-base mt-6"
          style={{ background: '#1D9E75' }}
          onClick={() => navigate('/owner-mobile/app')}
        >
          Finish Setup
        </Button>
      </div>
    </MobileFrame>
  );
}
