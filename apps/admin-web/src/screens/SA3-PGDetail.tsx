import { useParams, useRouter } from 'next/navigation'; import { ArrowLeft, Edit2, ShieldAlert, CheckCircle, Globe, DollarSign, Users, HelpCircle } from 'lucide-react'; import { Card } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';
import { Button } from '@stayflo/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@stayflo/ui';

export function AdminPGDetail() {
  const { id } = useParams() as { id?: string };
  const router = useRouter();

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sunrise PG</h1>
            <Badge style={{ background: '#E1F5EE', color: '#085041' }}>Active</Badge>
            <Badge style={{ background: '#EEEDFE', color: '#534AB7' }}>PG Plan</Badge>
          </div>
          <p className="text-slate-500 mt-1">Koramangala, Bengaluru · Code: {id || 'SUNPG'}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" className="flex items-center gap-2">
          <Edit2 className="w-4 h-4" /> Edit PG Settings
        </Button>
        <Button variant="destructive" className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> Deactivate PG
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Total Rooms</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-3xl font-bold text-slate-900">12</p>
            <span className="text-xs text-slate-400">10 single · 2 double</span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Active Tenants</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-3xl font-bold text-slate-900">11</p>
            <span className="text-xs text-teal-600 font-semibold">91.6% occupancy</span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Rent Collected (Jun)</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-3xl font-bold text-slate-900">₹48,200</p>
            <span className="text-xs text-amber-600 font-semibold">₹6,400 pending</span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Website Leads</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-3xl font-bold text-slate-900">48</p>
            <span className="text-xs text-slate-400">12 scheduled visits</span>
          </div>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border-b w-full justify-start rounded-none p-0 h-auto">
          <TabsTrigger value="overview" className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#993C1D] data-[state=active]:text-[#993C1D]">Overview</TabsTrigger>
          <TabsTrigger value="tenants" className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#993C1D] data-[state=active]:text-[#993C1D]">Tenants</TabsTrigger>
          <TabsTrigger value="payments" className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#993C1D] data-[state=active]:text-[#993C1D]">Payments</TabsTrigger>
          <TabsTrigger value="website" className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#993C1D] data-[state=active]:text-[#993C1D]">Website</TabsTrigger>
        </TabsList>

        {/* Overview Content */}
        <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-0">
          <Card className="p-6 lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">PG Information</h3>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-slate-400 block mb-1">PG Name</span>
                  <span className="font-semibold text-slate-800">Sunrise PG</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Unique Code</span>
                  <span className="font-semibold text-[#1D9E75] font-mono">SUNPG</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Address</span>
                  <span className="font-semibold text-slate-800">No. 14, 5th Cross, Koramangala 4th Block, Bengaluru, 560034</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Amenities Listed</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {['WiFi', 'RO Water', 'AC', 'CCTV', 'Power Backup', 'Food'].map(am => (
                      <Badge key={am} variant="secondary" className="text-xs">{am}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Billing & Rules</h3>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-slate-400 block mb-1">Late Fee</span>
                  <span className="font-semibold text-slate-800">₹200 per day after grace period</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Grace Period</span>
                  <span className="font-semibold text-slate-800">5 days</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Food Cutoff Time</span>
                  <span className="font-semibold text-slate-800">9:00 PM (Previous Day)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Payment Method Connected</span>
                  <span className="text-[#1D9E75] font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Razorpay Live
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Owner Card Info */}
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Owner Details</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-lg">
                RS
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Rajan Swamy</h4>
                <p className="text-sm text-slate-500">+91 98450 12345</p>
              </div>
            </div>
            <div className="space-y-3 pt-6 border-t border-slate-100 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subscription Status</span>
                <Badge style={{ background: '#E1F5EE', color: '#085041' }}>Paid</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Renewal Date</span>
                <span className="font-semibold text-slate-800">15 Jun 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Owner since</span>
                <span className="font-semibold text-slate-800">12 Jan 2025</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tenants Tab */}
        <TabsContent value="tenants" className="mt-0">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Resident Roster</h3>
            <div className="space-y-4">
              {[
                { name: 'Amit Kumar', room: 'Room 4', phone: '+91 98765 43210', dues: '₹9,030 (Overdue)', joined: '15 Oct 2025' },
                { name: 'Sanjay Ramaswamy', room: 'Room 2', phone: '+91 99000 88776', dues: '₹0 (Paid)', joined: '01 Nov 2025' },
                { name: 'Vijay Nair', room: 'Room 8', phone: '+91 91234 56789', dues: '₹0 (Paid)', joined: '10 Jan 2026' }
              ].map((tenant, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm">
                  <div>
                    <p className="font-semibold text-slate-800">{tenant.name}</p>
                    <p className="text-xs text-slate-400">{tenant.phone} · Joined {tenant.joined}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{tenant.room}</Badge>
                    <span className={`text-xs font-semibold ${tenant.dues.includes('Overdue') ? 'text-rose-600' : 'text-teal-600'}`}>
                      {tenant.dues}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-0">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Rent Collection History</h3>
            <div className="space-y-3">
              {[
                { date: '18 Jun 2026', tenant: 'Sanjay Ramaswamy', amount: '₹8,500', method: 'Razorpay UPI', status: 'Success' },
                { date: '15 Jun 2026', tenant: 'Vijay Nair', amount: '₹9,200', method: 'Razorpay Card', status: 'Success' },
                { date: '05 Jun 2026', tenant: 'Amit Kumar', amount: '₹9,030', method: 'Pending', status: 'Unpaid' }
              ].map((pay, i) => (
                <div key={i} className="flex justify-between items-center p-3 border-b last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{pay.tenant}</p>
                    <p className="text-xs text-slate-400">{pay.date} · via {pay.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{pay.amount}</p>
                    <span className={`text-xs font-semibold ${pay.status === 'Success' ? 'text-teal-600' : 'text-amber-600'}`}>
                      {pay.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Website Builder Status */}
        <TabsContent value="website" className="mt-0">
          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">PG Lead Capture Page</h3>
                <a href="/portfolio/sunrise-pg" target="_blank" className="text-xs text-teal-600 hover:underline flex items-center gap-1 mt-1">
                  <Globe className="w-3.5 h-3.5" /> stayflo.in/pg/sunrise-pg
                </a>
              </div>
              <Badge style={{ background: '#E1F5EE', color: '#085041' }}>Published</Badge>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
              <p><strong>Cover Image:</strong> Custom Uploaded ✓</p>
              <p className="mt-1"><strong>Room configurations:</strong> 3 types configured ✓</p>
              <p className="mt-1"><strong>Rules & Policies:</strong> Added ✓</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
