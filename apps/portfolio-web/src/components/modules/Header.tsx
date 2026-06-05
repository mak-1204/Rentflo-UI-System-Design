'use client';

import { Star, Phone } from 'lucide-react';
import logoImg from '../../../logo.png';

interface HeaderProps {
  pgName?: string;
  rating?: number;
  onGetStartedClick?: () => void;
  onScheduleVisitClick?: () => void;
  onCallClick?: () => void;
}

export function Header({
  pgName = 'Sunrise PG',
  rating = 4.8,
  onGetStartedClick,
  onScheduleVisitClick,
  onCallClick,
}: HeaderProps) {
  const handleCallClick = () => {
    if (onCallClick) {
      onCallClick();
    } else {
      window.location.href = 'tel:9876543210';
    }
  };

  const handleScheduleClick = onScheduleVisitClick || onGetStartedClick;

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-20 bg-surface/90 backdrop-blur-md dark:bg-navy-deep/90 border-b border-border-subtle dark:border-outline-variant z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        {/* Left Brand Area */}
        <div className="flex items-center gap-8">
          <a className="flex items-center gap-3 relative cursor-pointer" href="#hero">
            <img 
              alt="StayFloww Logo" 
              className="h-10 w-auto object-contain object-left" 
              src={logoImg.src} 
            />
            <span className="text-xl font-bold text-navy-deep dark:text-white uppercase tracking-wider">
              {pgName}
            </span>
          </a>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors text-base font-semibold" href="#hero">Properties</a>
            <a className="text-primary dark:text-primary-fixed font-bold border-b-2 border-primary dark:border-primary-fixed text-base" href="#rooms">Living Experience</a>
            <a className="text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors text-base font-semibold" href="#food">Weekly Menu</a>
            <a className="text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors text-base font-semibold" href="#location">Location</a>
          </nav>
        </div>

        {/* Right Actions Area */}
        <div className="flex items-center gap-6">
          {/* Rating Badge - Desktop */}
          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs text-emerald-700 font-bold select-none">
            <Star size={14} className="fill-emerald-500 text-emerald-550" />
            <span>{rating.toFixed(1)} Rating</span>
          </div>

          {/* Phone Action */}
          <button
            onClick={handleCallClick}
            className="w-10 h-10 rounded-full border border-stayflow-teal text-stayflow-teal flex items-center justify-center hover:bg-stayflow-teal/5 transition-all cursor-pointer shadow-sm"
            title="Call Owner"
            aria-label="Call Owner"
          >
            <Phone size={16} />
          </button>

          {/* Book Visit CTA */}
          <button
            onClick={handleScheduleClick}
            className="hidden sm:block bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed px-8 py-2.5 rounded-full font-bold hover:opacity-90 transition-all duration-200 shadow-md cursor-pointer"
          >
            Book a Visit
          </button>

          {/* Profile Picture */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed shadow-sm">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8WDx9eCdsAvGJKyR-pA9Znwt5NWTcYCESU0fyGtGakYN3as7V0rK7ZQHon1saHiQKnIMXxgyZsn-6q2R0QrJlpw5ntgHIpJ-a0k___hbVanVhwOcKmkGOzZfRwsvosv_xf0Cf4enUgF49petBrI3v6nYzb7gPxpWWiboPr9FqiVkzSUM2PJtl3v-_CF98-HB8BYeNxqafN4TTm-tq6xjAM2C1_-EPrDI3VBvfCHVSO4dbfKqamt3K3lKyG6vkXFGOkBeq2WARcA"
            />
          </div>
        </div>
      </div>
    </header>
  );
}


