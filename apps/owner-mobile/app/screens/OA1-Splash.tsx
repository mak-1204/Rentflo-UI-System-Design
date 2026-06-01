import { useEffect } from 'react'; import { useNavigate } from 'react-router'; import { MobileFrame } from '@rentflo/ui';
import { RentfloLogo } from '@rentflo/ui';
import { Progress } from '@rentflo/ui';

export function OwnerSplash() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/owner-mobile/login');
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <MobileFrame showStatusBar={false}>
      <div 
        className="h-full flex flex-col items-center justify-center px-8"
        style={{ background: '#1D9E75' }}
      >
        <div className="flex-1 flex flex-col items-center justify-center">
          <RentfloLogo variant="white" className="text-5xl mb-4" />
          <p className="text-white text-lg text-center opacity-90">
            PG management, simplified
          </p>
        </div>
        
        <div className="w-full mb-16">
          <Progress value={66} className="h-1" />
        </div>
      </div>
    </MobileFrame>
  );
}
