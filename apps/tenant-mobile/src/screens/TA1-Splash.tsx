import { useEffect } from 'react'; import { useNavigate } from 'react-router'; import { StayfloLogo } from '@stayflo/ui';
import { Progress } from '@stayflo/ui';

export function TenantSplash() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/tenant-mobile/login');
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between px-8 py-12"
      style={{ background: '#1D9E75' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <StayfloLogo variant="white" className="text-6xl mb-4" />
        <p className="text-white text-xl text-center opacity-90 font-medium">
          Your home away from home
        </p>
      </div>
      
      <div className="w-full max-w-md mb-8">
        <Progress value={66} className="h-1 bg-white/30" />
      </div>
    </div>
  );
}
