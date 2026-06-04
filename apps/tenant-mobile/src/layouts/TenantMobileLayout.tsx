import { Outlet, Link, useLocation } from "react-router"; import { Home, CreditCard, UtensilsCrossed, MessageSquare, MoreHorizontal, Bell } from "lucide-react"; import { StayfloLogo } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';

export function TenantMobileLayout() {
  const location = useLocation();
  
  const tabs = [
    { path: '/tenant-mobile/app', label: 'Dashboard', icon: Home, exact: true },
    { path: '/tenant-mobile/app/pay', label: 'Payments', icon: CreditCard },
    { path: '/tenant-mobile/app/food', label: 'Food Sourcing', icon: UtensilsCrossed },
    { path: '/tenant-mobile/app/complaints', label: 'Complaints', icon: MessageSquare },
    { path: '/tenant-mobile/app/more', label: 'More', icon: MoreHorizontal },
  ];
  
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col text-left">
      {/* Top Header Bar for Desktop/Tablet & Mobile */}
      <header className="sticky top-0 z-40 bg-white border-b px-6 py-3" style={{ borderColor: '#E5E7EB' }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <StayfloLogo className="text-xl" />
            <Badge style={{ background: '#E1F5EE', color: '#1D9E75' }} className="border-none">Room 4</Badge>
          </div>
          
          {/* Desktop/Tablet Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.exact 
                ? location.pathname === tab.path
                : location.pathname.startsWith(tab.path);
              
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className="flex items-center gap-2 text-sm font-semibold transition-colors py-2 border-b-2"
                  style={{
                    color: isActive ? '#1D9E75' : '#6B7280',
                    borderColor: isActive ? '#1D9E75' : 'transparent'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-4">
            <button className="p-1.5 hover:bg-slate-100 rounded-full relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <Badge variant="outline" className="hidden md:inline-flex">Sunrise PG Resident</Badge>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile Devices */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-45" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.exact
              ? location.pathname === tab.path
              : location.pathname.startsWith(tab.path);
            
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center justify-center py-1.5 px-3 min-w-0 flex-1"
              >
                <Icon 
                  className="w-5.5 h-5.5 mb-0.5" 
                  style={{ color: isActive ? '#1D9E75' : '#9CA3AF' }}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span 
                  className="text-[10px] whitespace-nowrap"
                  style={{ color: isActive ? '#1D9E75' : '#9CA3AF', fontWeight: isActive ? 600 : 400 }}
                >
                  {tab.label.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
