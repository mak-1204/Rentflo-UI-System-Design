import { TrendingUp, Users, Building, AlertCircle, ArrowUpRight, DollarSign } from 'lucide-react'; import { Card } from '@rentflo/ui';

export function AdminOverview() {
  const metrics = [
    { title: 'Total PGs', value: '482', change: '+12% this week', icon: Building, color: '#1D9E75', bg: '#E1F5EE' },
    { title: 'Active PGs', value: '410', change: '85% occupancy avg', icon: Building, color: '#085041', bg: '#EAF3DE' },
    { title: 'Total Owners', value: '380', change: '+8 new owners', icon: Users, color: '#534AB7', bg: '#EEEDFE' },
    { title: 'Total Tenants', value: '4,280', change: '92% overall occupancy', icon: Users, color: '#0C447C', bg: '#E6F1FB' },
    { title: 'MRR (Platform)', value: '₹12,48,000', change: '+15.2% MoM', icon: DollarSign, color: '#993C1D', bg: '#FAECE7' },
    { title: 'Payments Processed', value: '₹1.84 Cr', change: 'June 2026', icon: TrendingUp, color: '#3B6D11', bg: '#EAF3DE' },
    { title: 'New Signups (Week)', value: '24 PGs', change: '5 onboarding', icon: ArrowUpRight, color: '#993556', bg: '#FBEAF0' },
    { title: 'Open Tickets', value: '14', change: '8 high priority', icon: AlertCircle, color: '#791F1F', bg: '#FCEBEB' },
  ];

  const activity = [
    { title: 'New PG Registered', desc: 'Zolo Stay, Koramangala registered under Owner Amit K.', time: '10 mins ago', type: 'new' },
    { title: 'Payment Processed', desc: '₹9,230 paid by Tenant Rajesh R. (Sunrise PG)', time: '22 mins ago', type: 'payment' },
    { title: 'Support Ticket Raised', desc: 'Owner Rajan S.: Razorpay API connection error', time: '1 hr ago', type: 'ticket' },
    { title: 'Owner Upgraded Plan', desc: 'Priya Narayanan upgraded to "PG Plan" (3 PGs)', time: '3 hrs ago', type: 'upgrade' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Rentflo Admin Overview</h1>
          <p className="text-slate-500 mt-1">Platform analytics and health indicators</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">Rajesh Gopalan</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center">
            RG
          </div>
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card key={idx} className="p-6 flex items-start justify-between relative overflow-hidden transition-all hover:shadow-md">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">{metric.title}</p>
                <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: metric.bg, color: metric.color }}>
                  {metric.change}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: metric.bg }}>
                <Icon className="w-6 h-6" style={{ color: metric.color }} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MRR Growth SVG Chart */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">MRR Growth & PG Signups</h3>
          <div className="h-64 w-full bg-slate-50 rounded-xl relative flex flex-col justify-end p-4">
            {/* SVG Line & Bar chart mockup */}
            <svg className="w-full h-48 overflow-visible" viewBox="0 0 600 200">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="#E2E8F0" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#E2E8F0" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="#E2E8F0" strokeDasharray="4 4" />
              {/* Bars for PG Signups */}
              <rect x="30" y="80" width="30" height="120" fill="#E1F5EE" rx="4" />
              <rect x="130" y="60" width="30" height="140" fill="#E1F5EE" rx="4" />
              <rect x="230" y="50" width="30" height="150" fill="#E1F5EE" rx="4" />
              <rect x="330" y="40" width="30" height="160" fill="#1D9E75" rx="4" />
              <rect x="430" y="30" width="30" height="170" fill="#1D9E75" rx="4" />
              <rect x="530" y="20" width="30" height="180" fill="#1D9E75" rx="4" />
              {/* MRR Line */}
              <path
                d="M 45 160 L 145 120 L 245 90 L 345 70 L 445 40 L 545 15"
                fill="none"
                stroke="#EF9F27"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Tooltip Dot */}
              <circle cx="545" cy="15" r="6" fill="#EF9F27" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-xs text-slate-400 mt-4 px-2">
              <span>Jan 2026</span>
              <span>Feb 2026</span>
              <span>Mar 2026</span>
              <span>Apr 2026</span>
              <span>May 2026</span>
              <span>Jun 2026</span>
            </div>
          </div>
          <div className="flex gap-6 mt-4 text-sm justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF9F27]" />
              <span className="text-slate-600">MRR (Scale on right)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#1D9E75]" />
              <span className="text-slate-600">PG Signups (Scale on left)</span>
            </div>
          </div>
        </Card>

        {/* Activity Feed */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Platform Activity</h3>
          <div className="space-y-6">
            {activity.map((act, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{
                  background: act.type === 'new' ? '#1D9E75' : act.type === 'payment' ? '#3B6D11' : act.type === 'ticket' ? '#791F1F' : '#534AB7'
                }} />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{act.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{act.desc}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
