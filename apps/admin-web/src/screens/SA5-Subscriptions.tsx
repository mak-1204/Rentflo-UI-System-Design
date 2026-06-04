import { Card } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';

export function AdminSubscriptions() {
  const subscriptions = [
    { owner: 'Rajan Swamy', pgName: 'Sunrise PG', plan: 'PG Plan', price: 1500, start: '12 Jan 2025', renewal: '15 Jun 2026', status: 'Active' },
    { owner: 'Amit Kumar', pgName: 'Zolo Stay Koramangala', plan: 'Pro Plan', price: 3000, start: '15 Feb 2025', renewal: '18 Jun 2026', status: 'Active' },
    { owner: 'Priya Narayanan', pgName: 'Sea Breeze Stay', plan: 'PG Plan', price: 4500, start: '20 Mar 2025', renewal: '25 Jun 2026', status: 'Active' },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Subscription Management</h1>
          <p className="text-slate-500 mt-1">Manage plans, pricing tiers, and recurring billing cycles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Subscription Overview</h3>
          <div className="space-y-4">
            {subscriptions.map((sub, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-semibold text-slate-800">{sub.pgName}</p>
                  <p className="text-xs text-slate-400">Owner: {sub.owner} · Started {sub.start}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">{sub.plan}</Badge>
                  <p className="text-sm font-bold text-slate-800">₹{sub.price.toLocaleString()} / mo</p>
                  <span className="text-xs text-slate-400">Next renewal: {sub.renewal}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pricing Tiers Mockup Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Plan Distribution</h3>
          <div className="h-48 w-full flex items-center justify-center relative">
            <svg className="w-36 h-36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="4" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1D9E75" strokeWidth="4" strokeDasharray="60 40" strokeDashoffset="25" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EF9F27" strokeWidth="4" strokeDasharray="30 70" strokeDashoffset="85" />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-bold block text-slate-800">410</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Subscribed</span>
            </div>
          </div>
          <div className="space-y-2 mt-4 text-xs">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#1D9E75] rounded-full" /> PG Plan (60%)</span>
              <span className="font-semibold text-slate-700">246 PGs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#EF9F27] rounded-full" /> Pro Plan (30%)</span>
              <span className="font-semibold text-slate-700">123 PGs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-300 rounded-full" /> Free/Trial (10%)</span>
              <span className="font-semibold text-slate-700">41 PGs</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
