import { ReactNode } from 'react';

interface MobileFrameProps {
  children: ReactNode;
  showStatusBar?: boolean;
}

export function MobileFrame({ children, showStatusBar = true }: MobileFrameProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F8F9FA' }}>
      <div 
        className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden"
        style={{ 
          width: '390px', 
          height: '844px',
          border: '12px solid #1A1A1A'
        }}
      >
        {/* Status Bar */}
        {showStatusBar && (
          <div className="absolute top-0 left-0 right-0 h-11 px-6 flex items-center justify-between text-xs font-medium z-50" style={{ color: '#111827' }}>
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 border border-current rounded-sm relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-2 bg-current rounded-r"></div>
                <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-2.5 h-2 bg-current rounded-sm"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Screen Content */}
        <div className="w-full h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
