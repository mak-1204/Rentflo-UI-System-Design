'use client';

import logoImg from '../../../logo.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-16 px-6 bg-[#f8fafc] dark:bg-navy-deep border-t border-border-subtle dark:border-outline-variant transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:justify-between items-start gap-12 text-left">
        {/* Brand Column */}
        <div className="space-y-6 max-w-sm">
          <div className="flex items-center gap-3">
            <img 
              alt="StayFloww Logo" 
              className="h-10 w-auto object-contain" 
              src={logoImg.src} 
            />
            <span className="text-xl font-bold text-navy-deep dark:text-white uppercase tracking-wider">
              StayFloww
            </span>
          </div>
          <p className="text-sm text-on-surface-variant dark:text-outline-variant leading-relaxed">
            Redefining coliving for the modern professional with curated spaces and seamless management.
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
          © {currentYear} StayFloww Coliving. All rights reserved.
        </p>
        <p className="text-xs font-bold text-stayflow-teal uppercase tracking-widest">
          Powered by StayFloww
        </p>
      </div>
    </footer>
  );
}

