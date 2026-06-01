interface RentfloLogoProps {
  variant?: 'default' | 'white' | 'compact';
  className?: string;
}

export function RentfloLogo({ variant = 'default', className = '' }: RentfloLogoProps) {
  if (variant === 'white') {
    return (
      <div className={`font-semibold ${className}`}>
        <span style={{ color: '#FFFFFF' }}>Rentflo</span>
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className={`font-semibold ${className}`}>
        <span style={{ color: '#111827' }}>Rent</span>
        <span style={{ color: '#1D9E75' }}>flo</span>
      </div>
    );
  }
  
  return (
    <div className={`font-semibold ${className}`}>
      <span style={{ color: '#111827' }}>Rent</span>
      <span style={{ color: '#1D9E75' }}>flo</span>
    </div>
  );
}
