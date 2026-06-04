import { Bell, ChevronRight } from 'lucide-react'; import { Link } from 'react-router'; import { Avatar, AvatarFallback } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';
import { Button } from '@stayflo/ui';
import { Card } from '@stayflo/ui';

export function OwnerDashboard() {
  const pendingDues = [
    { id: 1, name: 'Amit Kumar', initials: 'AK', room: 4, amount: 2400, days: 8, color: '#EF9F27' },
    { id: 2, name: 'Priya Sharma', initials: 'PS', room: 7, amount: 2100, days: 3, color: '#534AB7' },
    { id: 3, name: 'Rahul Verma', initials: 'RV', room: 11, amount: 1900, days: 12, color: '#993C1D' },
  ];
  
  const foodCounts = [
    { meal: 'Breakfast', count: 8 },
    { meal: 'Lunch', count: 11 },
    { meal: 'Dinner', count: 9 },
  ];
  
  const activities = [
    { icon: '💰', text: 'Priya Sharma paid rent ₹8,500', time: '2h ago', color: '#E1F5EE' },
    { icon: '🔧', text: 'New complaint: Room 4 - AC not working', time: '3h ago', color: '#FAECE7' },
    { icon: '📝', text: 'Amit Kumar booked tomorrow\'s meals', time: '5h ago', color: '#E6F1FB' },
  ];
  
  return (
    <div className="px-4 pt-12 pb-4" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: '#111827' }}>
            Good morning, Rajan 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
            Sunrise PG
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative">
            <Bell className="w-6 h-6" style={{ color: '#111827' }} />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: '#EF9F27' }}></div>
          </button>
          <Avatar className="w-10 h-10">
            <AvatarFallback style={{ background: '#1D9E75', color: '#FFFFFF' }}>RK</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Month Selector */}
      <div className="mb-6">
        <button className="px-4 py-2 rounded-lg font-medium" style={{ background: '#E1F5EE', color: '#1D9E75' }}>
          June 2026
        </button>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-4" style={{ background: '#E1F5EE', border: 'none' }}>
          <p className="text-xs mb-1" style={{ color: '#085041' }}>Rent Collected</p>
          <p className="text-2xl font-semibold" style={{ color: '#1D9E75' }}>₹48,200</p>
        </Card>
        
        <Card className="p-4" style={{ background: '#FAEEDA', border: 'none' }}>
          <p className="text-xs mb-1" style={{ color: '#633806' }}>Pending Dues</p>
          <p className="text-2xl font-semibold" style={{ color: '#EF9F27' }}>₹6,400</p>
        </Card>
        
        <Card className="p-4" style={{ background: '#E1F5EE', border: 'none' }}>
          <p className="text-xs mb-1" style={{ color: '#085041' }}>Occupancy</p>
          <p className="text-2xl font-semibold" style={{ color: '#1D9E75' }}>11/12</p>
        </Card>
        
        <Card className="p-4" style={{ background: '#FAECE7', border: 'none' }}>
          <p className="text-xs mb-1" style={{ color: '#993C1D' }}>Complaints Open</p>
          <p className="text-2xl font-semibold" style={{ color: '#993C1D' }}>3</p>
        </Card>
      </div>
      
      {/* Pending Dues */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>Pending Dues</h2>
          <Link to="/owner-mobile/app/payments" className="text-sm" style={{ color: '#1D9E75' }}>
            View all
          </Link>
        </div>
        
        <div className="space-y-2">
          {pendingDues.map((tenant) => (
            <Card key={tenant.id} className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback style={{ background: tenant.color, color: '#FFFFFF' }}>
                    {tenant.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm" style={{ color: '#111827' }}>{tenant.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs px-2 py-0">Room {tenant.room}</Badge>
                    <span className="text-xs" style={{ color: '#6B7280' }}>₹{tenant.amount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge style={{ background: '#FCEBEB', color: '#791F1F', fontSize: '11px' }}>
                    {tenant.days}d overdue
                  </Badge>
                  <Button size="sm" className="mt-2 h-7 text-xs" style={{ background: '#EF9F27' }}>
                    Remind
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Today's Food */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>Today's Food</h2>
          <Link to="/owner-mobile/app/food" className="text-sm" style={{ color: '#1D9E75' }}>
            View list →
          </Link>
        </div>
        
        <Card className="p-4">
          <div className="flex items-center justify-around">
            {foodCounts.map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-xs mb-1" style={{ color: '#6B7280' }}>{item.meal}</p>
                <p className="text-2xl font-semibold" style={{ color: '#1D9E75' }}>{item.count}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-3" style={{ color: '#111827' }}>Recent Activity</h2>
        
        <div className="space-y-2">
          {activities.map((activity, i) => (
            <Card key={i} className="p-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: activity.color }}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: '#111827' }}>{activity.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{activity.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
