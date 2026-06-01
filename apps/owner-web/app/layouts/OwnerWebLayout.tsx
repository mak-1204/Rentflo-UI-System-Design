import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Home, Users, IndianRupee, UtensilsCrossed, MessageSquare, Globe, UserCheck, Settings, LogOut, Wrench } from "lucide-react";
import { RentfloLogo, Avatar, AvatarFallback, Button } from "@rentflo/ui";

export function OwnerWebLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
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
    <div className="flex h-screen" style={{ background: '#F8F9FA' }}>
      {/* Sidebar */}
      <div className="w-60 bg-white border-r flex flex-col" style={{ borderColor: '#E5E7EB' }}>
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
          <RentfloLogo className="text-2xl" />
          <div className="mt-3">
            <p className="text-sm font-medium" style={{ color: '#111827' }}>Sunrise PG</p>
            <Link to="/owner-web/website-builder" className="text-xs hover:underline" style={{ color: '#1D9E75' }}>
              View website →
            </Link>
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
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
