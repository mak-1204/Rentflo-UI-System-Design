import { Bell, ChevronRight } from 'lucide-react'; import { Link } from 'react-router'; import { RentfloLogo } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';
import { Card } from '@rentflo/ui';

export function TenantHome() {
  return (
    <div className="px-4 pt-12 pb-4" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <RentfloLogo className="text-xl" />
          <Badge style={{ background: '#E1F5EE', color: '#1D9E75' }}>Room 4</Badge>
        </div>
        <button>
          <Bell className="w-6 h-6" style={{ color: '#111827' }} />
        </button>
      </div>
      
      {/* Rent Status Card - DUE STATE */}
      <Card className="p-5 mb-4" style={{ border: '2px solid #1D9E75' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-lg font-semibold" style={{ color: '#1D9E75' }}>₹9,030 due</p>
            <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Payment due on 5 Jul 2026</p>
          </div>
          <Badge style={{ background: '#FAEEDA', color: '#633806' }}>Due</Badge>
        </div>
        
        <div className="space-y-2 mb-4 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex justify-between text-sm">
            <span style={{ color: '#6B7280' }}>Rent</span>
            <span style={{ color: '#111827' }}>₹8,500</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: '#6B7280' }}>Electricity</span>
            <span style={{ color: '#111827' }}>₹450</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: '#6B7280' }}>Water</span>
            <span style={{ color: '#111827' }}>₹80</span>
          </div>
        </div>
        
        <Link to="/tenant-mobile/app/pay">
          <Button className="w-full h-11" style={{ background: '#1D9E75' }}>
            Pay Now
          </Button>
        </Link>
        
        <button className="w-full mt-2 py-2 text-sm" style={{ color: '#6B7280' }}>
          Request payment delay
        </button>
      </Card>
      
      {/* Today's Food Card */}
      <Card className="p-5 mb-4">
        <h3 className="font-semibold mb-4" style={{ color: '#111827' }}>Today's Meals</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: '#E5E7EB' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: '#111827' }}>Breakfast</p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Idli, Sambar, Chutney</p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>8:00–9:00 AM</p>
            </div>
            <Badge style={{ background: '#E1F5EE', color: '#085041' }}>Booked ✓</Badge>
          </div>
          
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: '#E5E7EB' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: '#111827' }}>Lunch</p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Rice, Dal, Sabzi, Papad</p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>12:00–1:00 PM</p>
            </div>
            <Badge style={{ background: '#E1F5EE', color: '#085041' }}>Booked ✓</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: '#111827' }}>Dinner</p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Chapati, Paneer, Salad</p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>7:00–8:00 PM</p>
            </div>
            <Badge style={{ background: '#E1F5EE', color: '#085041' }}>Booked ✓</Badge>
          </div>
        </div>
        
        <Link to="/tenant-mobile/app/food">
          <button className="w-full mt-4 py-2 text-sm font-medium" style={{ color: '#1D9E75' }}>
            Book tomorrow's meals →
          </button>
        </Link>
      </Card>
      
      {/* Latest Announcement */}
      <Card className="p-5 mb-4" style={{ background: '#E6F1FB', border: 'none' }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: '#FFFFFF' }}>
            📢
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1" style={{ color: '#0C447C' }}>Power Maintenance</p>
            <p className="text-sm" style={{ color: '#0C447C' }}>
              Scheduled maintenance on Sunday 10 AM - 2 PM
            </p>
            <p className="text-xs mt-2" style={{ color: '#0C447C', opacity: 0.7 }}>2 days ago</p>
          </div>
          <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: '#0C447C' }} />
        </div>
      </Card>
      
      {/* Open Complaint */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: '#111827' }}>1 open complaint</p>
            <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>AC not working</p>
          </div>
          <Link to="/tenant-mobile/app/complaints">
            <Badge style={{ background: '#FAEEDA', color: '#633806' }}>View</Badge>
          </Link>
        </div>
      </Card>
    </div>
  );
}
