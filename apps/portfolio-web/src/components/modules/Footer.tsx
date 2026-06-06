'use client';

import logoImg from '../../../logo.png';

interface FooterProps {
  pgName?: string;
}

export function Footer({ pgName = 'Sunrise PG' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-16 px-6 bg-[#f8fafc] dark:bg-navy-deep border-t border-border-subtle dark:border-outline-variant transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:justify-between items-start gap-12 text-left">
        {/* Brand Column */}
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-navy-deep dark:text-white uppercase tracking-wider">
              {pgName}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant dark:text-outline-variant leading-relaxed">
            Experience custom designed living spaces for working professionals and students.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-16">
          <div className="space-y-6">
            <p className="text-xs font-bold text-navy-deep dark:text-surface-gray uppercase tracking-widest">
              Company
            </p>
            <nav className="flex flex-col gap-4">
              <a className="text-sm text-on-surface-variant dark:text-outline-variant hover:text-stayflow-teal transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="text-sm text-on-surface-variant dark:text-outline-variant hover:text-stayflow-teal transition-colors" href="#">
                Terms of Service
              </a>
            </nav>
          </div>
          <div className="space-y-6">
            <p className="text-xs font-bold text-navy-deep dark:text-surface-gray uppercase tracking-widest">
              Partners
            </p>
            <nav className="flex flex-col gap-4">
              <a className="text-sm text-on-surface-variant dark:text-outline-variant hover:text-stayflow-teal transition-colors" href="#">
                Contact Us
              </a>
              <a className="text-sm text-on-surface-variant dark:text-outline-variant hover:text-stayflow-teal transition-colors" href="#">
                Partner with Us
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border-subtle dark:border-outline-variant/30 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-on-surface-variant dark:text-outline-variant">
          © {currentYear} {pgName}. All rights reserved.
        </p>
        <div className="flex items-center gap-1 opacity-70">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">by</span>
          <img src={logoImg.src} alt="stayfloww" className="h-3.5 w-auto object-contain dark:brightness-0 dark:invert" />
        </div>
      </div>
    </footer>
  );
}


