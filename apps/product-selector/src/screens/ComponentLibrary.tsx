import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Bell, MessageSquare, ShieldAlert, Plus, Check } from 'lucide-react';
import { Button, Card, Badge, Avatar, AvatarFallback } from '@rentflo/ui';

export function ComponentLibrary() {
  const [toast, setToast] = useState<string | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 pb-24 relative">
      {/* Header */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Rentflo Component Library</h1>
            <p className="text-slate-500 mt-1">Design System, Color Tokens, and Reusable UI Components</p>
          </div>
        </div>

        {/* Brand System Tokens */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Color Tokens & Brand Identity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Primary (Teal green)', hex: '#1D9E75', bg: '#1D9E75', text: '#FFFFFF' },
              { name: 'Primary Light', hex: '#E1F5EE', bg: '#E1F5EE', text: '#085041' },
              { name: 'Primary Dark', hex: '#0F6E56', bg: '#0F6E56', text: '#FFFFFF' },
              { name: 'Secondary (Amber)', hex: '#EF9F27', bg: '#EF9F27', text: '#FFFFFF' },
              { name: 'Success Bg', hex: '#E1F5EE · text #085041', bg: '#E1F5EE', text: '#085041' },
              { name: 'Danger Bg', hex: '#FCEBEB · text #791F1F', bg: '#FCEBEB', text: '#791F1F' },
              { name: 'Warning Bg', hex: '#FAEEDA · text #633806', bg: '#FAEEDA', text: '#633806' },
              { name: 'Purple Bg', hex: '#EEEDFE · text #534AB7', bg: '#EEEDFE', text: '#534AB7' },
            ].map(col => (
              <div key={col.name} className="p-3 rounded-lg border text-xs" style={{ background: '#FFFFFF' }}>
                <div className="h-10 rounded-md mb-2 flex items-center justify-center font-bold" style={{ backgroundColor: col.bg, color: col.text }}>
                  Aa
                </div>
                <span className="font-semibold text-slate-800 block truncate">{col.name}</span>
                <span className="text-slate-400 font-mono text-[10px]">{col.hex}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Buttons State */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <p className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">Primary State</p>
              <Button style={{ background: '#1D9E75', color: '#FFFFFF' }}>Primary Button</Button>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">Secondary State</p>
              <Button style={{ background: '#EF9F27', color: '#FFFFFF' }}>Secondary</Button>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">Outlined</p>
              <Button variant="outline">Outline Button</Button>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">Danger</p>
              <Button variant="destructive" style={{ background: '#791F1F', color: '#FFFFFF' }}>Danger action</Button>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">Disabled</p>
              <Button disabled>Disabled State</Button>
            </div>
          </div>
        </Card>

        {/* Input Fields State */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Inputs & Form controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Default Input</label>
              <input type="text" placeholder="Enter username..." className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1.5">Focus State (Teal)</label>
              <input type="text" defaultValue="Active text input" className="w-full px-3 py-2 border rounded-lg outline-none ring-2 ring-[#1D9E75] text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1.5">Error State</label>
              <input type="text" defaultValue="Invalid email" className="w-full px-3 py-2 border border-rose-500 rounded-lg focus:outline-none text-sm bg-rose-50/50" />
              <span className="text-[10px] text-rose-600 block mt-1">Please enter a valid email address</span>
            </div>
          </div>
        </Card>

        {/* Badge & Chip variants */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Badge / Chip Variants</h2>
          <div className="flex flex-wrap gap-3">
            <Badge style={{ background: '#E1F5EE', color: '#085041' }}>Success</Badge>
            <Badge style={{ background: '#FCEBEB', color: '#791F1F' }}>Danger / Overdue</Badge>
            <Badge style={{ background: '#FAEEDA', color: '#633806' }}>Warning / Due</Badge>
            <Badge style={{ background: '#E6F1FB', color: '#0C447C' }}>Info / Info bg</Badge>
            <Badge style={{ background: '#EEEDFE', color: '#534AB7' }}>Purple badge</Badge>
            <Badge style={{ background: '#FAECE7', color: '#993C1D' }}>Coral badge</Badge>
            <Badge style={{ background: '#FBEAF0', color: '#993556' }}>Pink badge</Badge>
            <Badge style={{ background: '#EAF3DE', color: '#3B6D11' }}>Green badge</Badge>
          </div>
        </Card>

        {/* Avatar styles */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Avatar Styles</h2>
          <div className="flex gap-4">
            <Avatar className="w-10 h-10">
              <AvatarFallback style={{ background: '#1D9E75', color: '#FFFFFF' }}>AK</AvatarFallback>
            </Avatar>
            <Avatar className="w-12 h-12">
              <AvatarFallback style={{ background: '#EF9F27', color: '#FFFFFF' }}>RS</AvatarFallback>
            </Avatar>
            <Avatar className="w-14 h-14">
              <AvatarFallback style={{ background: '#534AB7', color: '#FFFFFF' }}>PN</AvatarFallback>
            </Avatar>
            <Avatar className="w-16 h-16">
              <AvatarFallback style={{ background: '#993C1D', color: '#FFFFFF' }}>SA</AvatarFallback>
            </Avatar>
          </div>
        </Card>

        {/* Interactive Elements / Sheets / Toasts */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Interactive Components (Mockups)</h2>
          <div className="flex gap-4">
            <Button style={{ background: '#1D9E75', color: '#FFFFFF' }} onClick={() => triggerToast('Dues reminded successfully!')}>
              Trigger Toast Notification
            </Button>
            <Button variant="outline" onClick={() => setShowBottomSheet(true)}>
              Open Bottom Sheet (Mobile view)
            </Button>
          </div>
        </Card>

        {/* Empty States */}
        <Card className="p-6 space-y-4 text-center">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2 text-left">Empty State Illustration</h2>
          <div className="py-8 flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">No complaints registered yet</p>
            <p className="text-xs text-slate-400 max-w-xs">When residents raise complaints, they will appear here chronological with media files.</p>
          </div>
        </Card>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#111827] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold z-50 animate-bounce">
          <Check className="w-4 h-4 text-[#1D9E75]" /> {toast}
        </div>
      )}

      {/* Bottom Sheet Mockup */}
      {showBottomSheet && (
        <div className="fixed inset-0 bg-black/40 flex justify-end flex-col z-50" onClick={() => setShowBottomSheet(false)}>
          <div className="bg-white rounded-t-2xl p-6 max-w-md w-full mx-auto space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2" />
            <h3 className="text-lg font-bold text-slate-900">Add Electricity Bill</h3>
            <p className="text-xs text-slate-400">Previous reading: 1240 units</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1">Current Reading</label>
                <input type="number" placeholder="e.g. 1285" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1D9E75] text-sm" />
              </div>
              <div className="p-3 bg-teal-50 rounded-lg text-xs font-semibold text-[#085041]">
                Calculation: 45 units × ₹10 = ₹450
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button className="w-full" style={{ background: '#1D9E75', color: '#FFFFFF' }} onClick={() => setShowBottomSheet(false)}>
                Add to dues
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
