import { useState } from 'react';
import { Bell, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router';
import { RentfloLogo } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';
import { Card } from '@rentflo/ui';

export function TenantHome() {
  const [showQrModal, setShowQrModal] = useState(false);
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
        
        <div className="flex gap-2 mt-4 pt-2">
          <Link to="/tenant-mobile/app/food" className="flex-1">
            <button className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-all text-center">
              Book tomorrow's meals →
            </button>
          </Link>
          <button 
            onClick={() => setShowQrModal(true)}
            className="px-4 py-2.5 bg-[#1D9E75] hover:bg-[#1A8B67] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
          >
            <span>📷</span> Show QR
          </button>
        </div>
      </Card>

      {/* QR Code Modal Popover */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowQrModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative z-10 border border-slate-100 shadow-2xl text-center space-y-4">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-800">Your Daily Food Pass</h4>
              <p className="text-xs text-slate-500">Scan this at the counter to claim your meals</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center space-y-3">
              {/* QR Code Generator API (free and fast) */}
              <div className="bg-white p-3 rounded-lg border border-slate-250/70 shadow-sm">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    JSON.stringify({
                      tenantName: 'Rajan Kumar',
                      roomId: 'Room 4',
                      date: '2026-06-02',
                      meals: { breakfast: true, lunch: true, dinner: true }
                    })
                  )}`} 
                  alt="Daily Food QR Code"
                  className="w-40 h-40"
                  onError={(e) => {
                    // Fail-safe mock QR code placeholder
                    e.currentTarget.src = "https://picsum.photos/180/180";
                  }}
                />
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-widest font-bold">PASS-ID: RF-20260602-R4</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-left p-3 rounded-xl space-y-1">
              <p className="text-xs font-bold">Registered Meals (June 02):</p>
              <div className="flex gap-2.5 text-[10.5px] font-semibold text-emerald-700">
                <span>✓ Breakfast</span>
                <span>✓ Lunch</span>
                <span>✓ Dinner</span>
              </div>
            </div>

            <Button 
              className="w-full"
              style={{ background: '#1D9E75' }}
              onClick={() => setShowQrModal(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}
      
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
