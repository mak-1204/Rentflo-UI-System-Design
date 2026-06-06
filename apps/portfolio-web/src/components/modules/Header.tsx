'use client';

import { useState, useEffect } from 'react';
import { Star, Phone, Menu, X } from 'lucide-react';
import logoImg from '../../../logo.png';

interface HeaderProps {
  pgName?: string;
  rating?: number;
  onCallClick?: () => void;
  onBookClick?: () => void;
}

export function Header({
  pgName = 'Sunrise PG',
  rating = 4.8,
  onCallClick,
  onBookClick,
}: HeaderProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'commute', 'rooms', 'food'];
      let currentSection = sections[0];

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the top of the element is above or close to the header (80px + buffer)
          if (rect.top <= 150) {
            currentSection = section;
          }
        }
      }

      // Check if we've reached the bottom of the page
      if (window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 50) {
        currentSection = sections[sections.length - 1];
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCallClick = () => {
    if (onCallClick) {
      onCallClick();
    } else {
      window.location.href = 'tel:9876543210';
    }
  };

  const navItems = [
    { label: 'Properties', id: 'hero', href: '#hero' },
    { label: 'Location', id: 'commute', href: '#commute' },
    { label: 'Living Experience', id: 'rooms', href: '#rooms' },
    { label: 'Weekly Menu', id: 'food', href: '#food' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full h-20 z-50 bg-white/95 dark:bg-navy-deep/95 backdrop-blur-md border-b border-border-subtle dark:border-outline-variant shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex justify-between items-center relative">
          {/* Left Brand Area */}
          <div className="flex items-center z-10">
            <a
              className="flex items-center gap-2 relative cursor-pointer"
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-xl font-black uppercase tracking-wider text-navy-deep dark:text-white font-heading whitespace-nowrap">
                  {pgName}
                </span>
                <span className="text-slate-300 dark:text-outline-variant/30 text-xs sm:text-lg font-light">|</span>
                <div className="flex items-center gap-0.5 sm:gap-1 translate-y-[1px] sm:translate-y-[2px]">
                  <span className="text-[6px] sm:text-[9px] font-bold text-slate-400 tracking-widest leading-none">By</span>
                  <img src={logoImg.src} alt="stayfloww" className="h-[6px] sm:h-[10px] w-auto object-contain dark:brightness-0 dark:invert" />
                </div>
              </div>
            </a>
          </div>

          {/* Right Actions Area */}
          <div className="flex items-center gap-2 sm:gap-5 h-full">
            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 h-full">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.querySelector(item.href);
                      if (target) {
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className={`flex flex-col text-left justify-center h-full border-b-2 transition-all duration-200 ${isActive
                      ? 'text-navy-deep dark:text-white border-navy-deep dark:border-white font-extrabold'
                      : 'text-slate-500 hover:text-navy-deep dark:text-slate-400 dark:hover:text-white border-transparent font-bold'
                      }`}
                  >
                    <span className="text-xs uppercase tracking-wider whitespace-nowrap">
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </nav>

            <div className="hidden lg:block w-px h-6 bg-border-subtle dark:bg-outline-variant/50"></div>



            {/* Phone Action */}
            <button
              onClick={handleCallClick}
              className="hidden sm:flex w-10 h-10 rounded-full border border-slate-200 dark:border-outline-variant text-stayflow-teal hover:bg-slate-50 dark:hover:bg-white/5 items-center justify-center transition-all cursor-pointer shadow-sm bg-white dark:bg-transparent shrink-0"
              title="Call Owner"
              aria-label="Call Owner"
            >
              <Phone size={16} />
            </button>

            {/* Schedule a Visit Button */}
            <button
              onClick={onBookClick}
              className="bg-stayflow-teal hover:bg-stayflow-teal-dark text-white px-3.5 sm:px-5.5 py-2.5 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow transition-all cursor-pointer whitespace-nowrap shrink-0 border-none"
            >
              Schedule a Visit
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-navy-deep dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border-none bg-transparent cursor-pointer shrink-0"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-40 bg-white dark:bg-navy-deep border-t border-border-subtle dark:border-outline-variant/30 flex flex-col justify-between p-6 animate-in slide-in-from-right duration-250 lg:hidden overflow-y-auto">
          <nav className="flex flex-col gap-6 pt-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    const target = document.querySelector(item.href);
                    if (target) {
                      const headerOffset = 80;
                      const elementPosition = target.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`text-lg font-bold pb-2 border-b border-border-subtle/40 dark:border-outline-variant/15 flex items-center justify-between ${isActive ? 'text-stayflow-teal' : 'text-slate-655 dark:text-slate-350'
                    }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs">➔</span>
                </a>
              );
            })}
          </nav>

          <div className="space-y-6 pb-8">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleCallClick();
                }}
                className="flex-1 py-3.5 border border-slate-200 dark:border-outline-variant rounded-xl text-navy-deep dark:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-55 dark:hover:bg-white/5 cursor-pointer bg-transparent"
              >
                <Phone size={14} />
                Call Owner
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
