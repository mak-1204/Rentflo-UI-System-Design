import { Outlet, Link, useLocation } from "react-router"; import { Home, Users, UtensilsCrossed, Globe, MoreHorizontal } from "lucide-react"; import { MobileFrame } from '@rentflo/ui';

export function OwnerMobileLayout() {
  const location = useLocation();
  
  const tabs = [
    { path: '/owner-mobile/app', label: 'Dashboard', icon: Home },
    { path: '/owner-mobile/app/tenants', label: 'Tenants', icon: Users },
    { path: '/owner-mobile/app/food', label: 'Food', icon: UtensilsCrossed },
    { path: '/owner-mobile/app/website', label: 'Website', icon: Globe },
    { path: '/owner-mobile/app/complaints', label: 'More', icon: MoreHorizontal },
  ];
  
  return (
    <MobileFrame>
      <div className="flex flex-col h-full">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          <Outlet />
        </div>
        
        {/* Bottom Tab Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center justify-around px-2 py-2 max-w-[390px] mx-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path || 
                             (location.pathname.startsWith(tab.path) && tab.path !== '/owner-mobile/app');
              
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1"
                >
                  <Icon 
                    className="w-6 h-6 mb-1" 
                    style={{ color: isActive ? '#1D9E75' : '#9CA3AF' }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span 
                    className="text-xs whitespace-nowrap"
                    style={{ color: isActive ? '#1D9E75' : '#9CA3AF', fontWeight: isActive ? 600 : 400 }}
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
