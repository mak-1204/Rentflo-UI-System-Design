import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Home, Users, IndianRupee, UtensilsCrossed, Globe, UserCheck, Wrench, Menu, X } from "lucide-react";
import { RentfloLogo, Avatar, AvatarFallback } from "@rentflo/ui";

export function OwnerWebLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPgDropdownOpen, setIsPgDropdownOpen] = useState(false);

  const allProperties = ["Sunrise PG", "Starlight Co-Living", "Elite Mansion"];

  const [selectedPgs, setSelectedPgs] = useState<string[]>(() => {
    const saved = localStorage.getItem('rentflo_selected_pgs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (err) {
        // Fallback
      }
    }
    const single = localStorage.getItem('rentflo_selected_pg') || 'Sunrise PG';
    return [single];
  });

  const handlePgsChange = (nextPgs: string[]) => {
    setSelectedPgs(nextPgs);
    localStorage.setItem('rentflo_selected_pgs', JSON.stringify(nextPgs));
    
    // Maintain single selection compatibility (first selected or default)
    const primaryPg = nextPgs.length > 0 ? nextPgs[0] : 'Sunrise PG';
    localStorage.setItem('rentflo_selected_pg', primaryPg);
    
    // Also sync the PG Name to builder state
    const saved = localStorage.getItem('rentflo_builder_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.pgName = primaryPg;
        localStorage.setItem('rentflo_builder_state', JSON.stringify(parsed));
      } catch (err) {
        console.error(err);
      }
    }
    
    // Dispatch event to update other pages instantly
    window.dispatchEvent(new Event('rentflo_website_update'));
  };

  const togglePg = (pg: string) => {
    let next: string[];
    if (selectedPgs.includes(pg)) {
      if (selectedPgs.length === 1) return; // Don't allow empty
      next = selectedPgs.filter(item => item !== pg);
    } else {
      next = [...selectedPgs, pg];
    }
    handlePgsChange(next);
  };

  const toggleSelectAll = () => {
    if (selectedPgs.length === allProperties.length) {
      handlePgsChange([allProperties[0]]);
    } else {
      handlePgsChange([...allProperties]);
    }
  };

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('rentflo_selected_pgs');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSelectedPgs(parsed);
            return;
          }
        } catch (e) {
          // ignore
        }
      }
      const single = localStorage.getItem('rentflo_selected_pg') || 'Sunrise PG';
      setSelectedPgs([single]);
    };
    window.addEventListener('rentflo_website_update', handleUpdate);
    return () => window.removeEventListener('rentflo_website_update', handleUpdate);
  }, []);

  // Close sidebar drawer on route navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/owner-web', label: 'Dashboard', icon: Home, exact: true },
    { path: '/owner-web/tenants', label: 'Tenants', icon: Users },
    { path: '/owner-web/rent-collection', label: 'Rent Collection', icon: IndianRupee },
    { path: '/owner-web/food', label: 'Food Management', icon: UtensilsCrossed },
    { path: '/owner-web/operations', label: 'Operations', icon: Wrench },
    { path: '/owner-web/website-builder', label: 'PG Website', icon: Globe },
    { path: '/owner-web/leads', label: 'Leads', icon: UserCheck },
  ];
  
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F8F9FA' }}>
      
      {/* Mobile Top Header (only visible on mobile/tablet) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-4 z-40" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 focus:outline-none"
            aria-label="Toggle Sidebar Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <RentfloLogo className="text-xl" />
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded bg-[#E1F5EE] text-[#1D9E75] truncate max-w-[150px]">
          {selectedPgs.length === allProperties.length ? "All PGs" : selectedPgs[0]}
        </span>
      </div>

      {/* Sidebar Mobile Backdrop Drawer overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - sliding drawer on mobile, static on desktop */}
      <div 
        className={`w-60 bg-white border-r flex flex-col fixed md:relative inset-y-0 left-0 z-50 md:z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ borderColor: '#E5E7EB' }}
      >
        {/* Sidebar Header with Logo & Mobile Close Button */}
        <div className="p-6 border-b flex flex-col relative" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex justify-between items-center">
            <RentfloLogo className="text-2xl" />
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 rounded-md hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active PG Properties Multi-select filter widget */}
          <div className="mt-4 relative z-30">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Active PG Properties
            </label>
            
            <button
              onClick={() => setIsPgDropdownOpen(!isPgDropdownOpen)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg p-2.5 flex items-center justify-between transition-all outline-none font-medium cursor-pointer"
            >
              <span className="truncate pr-1 text-left text-xs">
                {selectedPgs.length === allProperties.length
                  ? "All Properties"
                  : selectedPgs.join(", ")}
              </span>
              <svg className={`fill-current h-4 w-4 text-slate-500 transition-transform ${isPgDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </button>

            {isPgDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsPgDropdownOpen(false)} />
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-20 space-y-1">
                  <label className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 cursor-pointer text-xs font-semibold border-b border-slate-100 pb-2">
                    <input
                      type="checkbox"
                      checked={selectedPgs.length === allProperties.length}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-[#1D9E75] focus:ring-[#1D9E75] h-3.5 w-3.5"
                    />
                    <span style={{ color: '#111827' }}>Select All ({allProperties.length})</span>
                  </label>
                  
                  {allProperties.map(pg => (
                    <label key={pg} className="flex items-center gap-2.5 px-3.5 py-1.5 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={selectedPgs.includes(pg)}
                        onChange={() => togglePg(pg)}
                        className="rounded border-slate-300 text-[#1D9E75] focus:ring-[#1D9E75] h-3.5 w-3.5"
                      />
                      <span style={{ color: '#374151' }}>{pg}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
            
            <div className="mt-2.5 flex items-center justify-between">
              <a
                href={selectedPgs.length > 0 ? `http://localhost:5175/portfolio/${selectedPgs[0].toLowerCase().replace(/\s+/g, '-')}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] hover:underline font-semibold flex items-center gap-1"
                style={{ color: '#1D9E75' }}
              >
                View live site →
              </a>
              <Link
                to="/owner-web/website-builder"
                className="text-[11px] hover:underline text-slate-400"
              >
                Edit details
              </Link>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                style={{
                  background: isActive ? '#E1F5EE' : 'transparent',
                  color: isActive ? '#1D9E75' : '#6B7280'
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Subscription Badge */}
        <div className="p-4 border-t" style={{ borderColor: '#E5E7EB' }}>
          <div className="px-3 py-2 rounded-lg text-center" style={{ background: '#E1F5EE' }}>
            <p className="text-sm font-semibold" style={{ color: '#1D9E75' }}>PG Plan ✓</p>
            <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Active</p>
          </div>
        </div>
        
        {/* Profile */}
        <div className="p-4 border-t" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback style={{ background: '#1D9E75', color: '#FFFFFF' }}>RK</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#111827' }}>Rajan Kumar</p>
              <button 
                onClick={() => navigate('/')}
                className="text-xs hover:underline" 
                style={{ color: '#6B7280' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area (supports scroll, matches padding top for mobile layout header) */}
      <div className="flex-1 overflow-y-auto mt-16 md:mt-0 relative">
        <Outlet />
      </div>
    </div>
  );
}
