interface StayfloLogoProps {
  variant?: 'default' | 'white' | 'compact';
  className?: string;
}

export function StayfloLogo({ variant = 'default', className = '' }: StayfloLogoProps) {
  if (variant === 'white') {
    return (
      <div className={`font-semibold ${className}`}>
        <span style={{ color: '#FFFFFF' }}>Stayflo</span>
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className={`font-semibold ${className}`}>
        <span style={{ color: '#111827' }}>Stay</span>
        <span style={{ color: '#1D9E75' }}>flo</span>
      </div>
    );
  }
  
  return (
    <div className={`font-semibold ${className}`}>
      <span style={{ color: '#111827' }}>Stay</span>
      <span style={{ color: '#1D9E75' }}>flo</span>
    </div>
  );
}
