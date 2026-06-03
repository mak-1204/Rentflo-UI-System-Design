import { Card } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';

export function AdminPayments() {
  const platformPayments = [
    { date: '18 Jun 2026', pg: 'Sunrise PG', tenant: 'Sanjay R.', type: 'Rent Payment', amount: 8500, method: 'Razorpay UPI', rzpId: 'pay_QWERTY123456', status: 'Settled' },
    { date: '17 Jun 2026', pg: 'Zolo Stay', tenant: 'Karan J.', type: 'Rent Payment', amount: 12000, method: 'Razorpay Card', rzpId: 'pay_ASDFGH789012', status: 'Settled' },
    { date: '15 Jun 2026', pg: 'Sea Breeze Stay', tenant: 'Nisha S.', type: 'Deposit', amount: 15000, method: 'Razorpay UPI', rzpId: 'pay_ZXCVBN345678', status: 'Settled' },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Platform Payments</h1>
          <p className="text-slate-500 mt-1">Real-time ledger of Razorpay platform route transactions and payouts</p>
        </div>
        <Button variant="outline">Export Ledger CSV</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Processed</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">₹1.84 Cr</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">This Month Volume</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">₹34,80,000</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Fees (0.5%)</p>
          <p className="text-2xl font-bold text-teal-600 mt-1">₹17,400</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Failed Transactions</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">0.12%</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">PG & Resident</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Method & Razorpay ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm">
            {platformPayments.map((pay, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-600">{pay.date}</td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-800 block">{pay.pg}</span>
                  <span className="text-xs text-slate-400">Tenant: {pay.tenant}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary">{pay.type}</Badge>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">₹{pay.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="block font-medium text-slate-800">{pay.method}</span>
                  <span className="text-xs text-slate-400 font-mono">{pay.rzpId}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{pay.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
