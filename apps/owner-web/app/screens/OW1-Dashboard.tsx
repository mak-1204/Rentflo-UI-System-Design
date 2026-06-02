import { useState } from 'react';
import { Bell, TrendingUp, TrendingDown, IndianRupee, Zap, Droplets, Wrench, ShieldAlert, Check, Plus, QrCode, Scan, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';
import { Card } from '@rentflo/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function OwnerWebDashboard() {
  const [notif, setNotif] = useState<string | null>(null);

  // Scanner simulator state
  const [showScanner, setShowScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [scannedResult, setScannedResult] = useState<any>(null);

  const [bookings, setBookings] = useState([
    { name: 'Amit Kumar', room: 'Room 4', breakfast: true, lunch: false, dinner: true, servedMeals: { breakfast: true } },
    { name: 'Sanjay Ramaswamy', room: 'Room 2', breakfast: true, lunch: true, dinner: true, servedMeals: {} },
    { name: 'Vijay Nair', room: 'Room 8', breakfast: true, lunch: true, dinner: false, servedMeals: { breakfast: true, lunch: true } },
  ]);

  const triggerToast = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  const handleSimulateScan = (residentName: string) => {
    setScanStatus('scanning');
    setTimeout(() => {
      const resident = bookings.find(b => b.name === residentName);
      if (resident) {
        setScannedResult({
          name: resident.name,
          room: resident.room,
          date: '2026-06-02',
          meals: {
            breakfast: resident.breakfast,
            lunch: resident.lunch,
            dinner: resident.dinner
          },
          servedMeals: resident.servedMeals || {}
        });
        setScanStatus('success');
      } else {
        setScanStatus('error');
      }
    }, 1200);
  };

  const handleServeMeal = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    if (!scannedResult) return;
    
    // Update local bookings state
    setBookings(prev => prev.map(b => {
      if (b.name === scannedResult.name) {
        return {
          ...b,
          servedMeals: {
            ...(b.servedMeals || {}),
            [mealType]: true
          }
        };
      }
      return b;
    }));

    // Update scanned result to show checkmark instantly
    setScannedResult(prev => ({
      ...prev,
      servedMeals: {
        ...(prev.servedMeals || {}),
        [mealType]: true
      }
    }));

    triggerToast(`Marked ${mealType} as served for ${scannedResult.name}!`);
  };

  const metrics = [
    { label: 'Rent Collected', value: '₹48,200', change: '+12%', trend: 'up', color: '#E1F5EE', textColor: '#1D9E75', icon: IndianRupee },
    { label: 'Pending Dues', value: '₹6,400', change: '-8%', trend: 'down', color: '#FAEEDA', textColor: '#EF9F27', icon: IndianRupee },
    { label: 'Electricity Charges', value: '₹8,450', change: '850 units', trend: 'up', color: '#E6F1FB', textColor: '#0C447C', icon: Zap },
    { label: 'Water Tanker Fees', value: '₹4,200', change: '6 Tankers', trend: 'up', color: '#E1F5EE', textColor: '#085041', icon: Droplets },
  ];
  
  const pendingDues = [
    { name: 'Amit Kumar', room: 4, rent: 8500, utilities: 530, total: 9030, days: 8 },
    { name: 'Rahul Verma', room: 11, rent: 8000, utilities: 420, total: 8420, days: 12 },
    { name: 'Vikram Singh', room: 9, rent: 8500, utilities: 0, total: 8500, days: 3 },
  ];
  
  const chartData = [
    { month: 'Jan', Rent: 96000, Utilities: 8900, Food: 14000 },
    { month: 'Feb', Rent: 94500, Utilities: 9200, Food: 13500 },
    { month: 'Mar', Rent: 102000, Utilities: 9800, Food: 15000 },
    { month: 'Apr', Rent: 99500, Utilities: 10500, Food: 14800 },
    { month: 'May', Rent: 101000, Utilities: 11800, Food: 16000 },
    { month: 'Jun', Rent: 48200, Utilities: 12650, Food: 9800 },
  ];
  
  const activities = [
    { text: 'Priya Sharma paid rent ₹8,500 + Electricity', time: '2 hours ago' },
    { text: 'Amit Kumar uploaded electricity meter photo for Room 4', time: '3 hours ago' },
    { text: 'Water tanker of 2000L delivered & logged', time: '5 hours ago' },
    { text: 'Rahul Verma requested payment delay (Approve in bills)', time: '1 day ago' },
  ];

  const operationalExpenses = [
    { name: 'Electricity (BESCOM)', amount: '₹8,450', date: 'Due in 5 days', status: 'Unpaid' },
    { name: 'Water Tanker Sourcing', amount: '₹4,200', date: 'Paid on 28 May', status: 'Paid' },
    { name: 'Catering / Cook Sourcing', amount: '₹18,500', date: 'Paid on 30 May', status: 'Paid' },
    { name: 'Cleaning & Consumables', amount: '₹3,400', date: 'Paid on 25 May', status: 'Paid' },
    { name: 'Elevator Maintenance', amount: '₹2,500', date: 'Due in 10 days', status: 'Unpaid' },
  ];
  
  return (
    <div className="h-full overflow-y-auto text-left bg-[#F8F9FA] pb-12 relative">
      {/* Toast */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-[#111827] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold z-50 animate-bounce">
          <Check className="w-4 h-4 text-[#1D9E75]" /> {notif}
        </div>
      )}

      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b px-8 py-4 flex items-center justify-between" style={{ borderColor: '#E5E7EB' }}>
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: '#111827' }}>Owner Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Sunrise PG · Koramangala · June 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowScanner(true)}
            style={{ background: '#1D9E75', color: '#FFFFFF' }}
            className="hover:opacity-90 flex items-center gap-2 h-9 px-3 text-xs font-semibold rounded-lg shadow-sm"
          >
            <QrCode className="w-4 h-4" /> Scan Food Pass
          </Button>
          <button className="relative p-2" onClick={() => triggerToast('No new notifications!')}>
            <Bell className="w-5 h-5" style={{ color: '#6B7280' }} />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#EF9F27' }}></div>
          </button>
          <Avatar>
            <AvatarFallback style={{ background: '#1D9E75', color: '#FFFFFF' }}>RK</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* QR Scanner Simulator Modal inside Dashboard */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setShowScanner(false); setScannedResult(null); setScanStatus('idle'); }} />
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative z-10 border border-slate-100 shadow-2xl space-y-4">
            <button 
              onClick={() => { setShowScanner(false); setScannedResult(null); setScanStatus('idle'); }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5"><Scan className="w-5 h-5 text-[#1D9E75]" /> Scanner: Daily Food Pass</h4>
              <p className="text-xs text-slate-500">Simulate or scan active resident food passes for verification</p>
            </div>

            {scanStatus === 'idle' && (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-teal-50 text-[#1D9E75] flex items-center justify-center">
                  <QrCode className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">Ready to Scan</p>
                  <p className="text-xs text-slate-400">Click a resident below to simulate camera scanning their QR pass</p>
                </div>
                <div className="w-full space-y-1.5 pt-2">
                  {bookings.map(b => (
                    <button
                      key={b.name}
                      onClick={() => handleSimulateScan(b.name)}
                      className="w-full py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold shadow-sm transition-all"
                    >
                      Scan QR for {b.name} ({b.room})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {scanStatus === 'scanning' && (
              <div className="bg-slate-900 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden h-[240px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(29,158,117,0.15),transparent)] animate-pulse" />
                <div className="absolute left-0 right-0 h-1 bg-[#1D9E75] shadow-[0_0_10px_#1D9E75] top-0 animate-[bounce_2s_infinite]" />
                <div className="w-16 h-16 rounded-xl border-2 border-white/20 flex items-center justify-center text-white text-xl animate-pulse">
                  📷
                </div>
                <p className="text-sm font-bold text-white relative z-10">Accessing Camera Viewport...</p>
                <p className="text-xs text-slate-400 relative z-10">Scanning QR pattern...</p>
              </div>
            )}

            {scanStatus === 'success' && scannedResult && (
              <div className="space-y-4 text-left">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-extrabold text-emerald-950">{scannedResult.name}</p>
                    <p className="text-xs text-emerald-800">{scannedResult.room} · Daily Food Pass</p>
                  </div>
                  <Badge className="bg-emerald-500 text-white font-bold border-none">VALID PASS ✓</Badge>
                </div>

                <div className="border border-slate-200 rounded-xl divide-y text-xs text-slate-700">
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold">Breakfast Booking</p>
                      <p className="text-[10px] text-slate-400">8:00 AM - 9:00 AM</p>
                    </div>
                    <div>
                      {scannedResult.meals.breakfast ? (
                        scannedResult.servedMeals.breakfast ? (
                          <Badge className="bg-slate-100 text-slate-500 border-none font-semibold">Served ✓</Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            style={{ background: '#1D9E75', color: '#FFFFFF' }}
                            className="h-7 text-[10px]"
                            onClick={() => handleServeMeal('breakfast')}
                          >
                            Mark Served
                          </Button>
                        )
                      ) : (
                        <Badge className="bg-rose-50 text-rose-700 border-none font-semibold">Not Registered ✗</Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold">Lunch Booking</p>
                      <p className="text-[10px] text-slate-400">12:00 PM - 1:00 PM</p>
                    </div>
                    <div>
                      {scannedResult.meals.lunch ? (
                        scannedResult.servedMeals.lunch ? (
                          <Badge className="bg-slate-100 text-slate-500 border-none font-semibold">Served ✓</Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            style={{ background: '#1D9E75', color: '#FFFFFF' }}
                            className="h-7 text-[10px]"
                            onClick={() => handleServeMeal('lunch')}
                          >
                            Mark Served
                          </Button>
                        )
                      ) : (
                        <Badge className="bg-rose-50 text-rose-700 border-none font-semibold">Not Registered ✗</Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold">Dinner Booking</p>
                      <p className="text-[10px] text-slate-400">7:00 PM - 8:00 PM</p>
                    </div>
                    <div>
                      {scannedResult.meals.dinner ? (
                        scannedResult.servedMeals.dinner ? (
                          <Badge className="bg-slate-100 text-slate-500 border-none font-semibold">Served ✓</Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            style={{ background: '#1D9E75', color: '#FFFFFF' }}
                            className="h-7 text-[10px]"
                            onClick={() => handleServeMeal('dinner')}
                          >
                            Mark Served
                          </Button>
                        )
                      ) : (
                        <Badge className="bg-rose-50 text-rose-700 border-none font-semibold">Not Registered ✗</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    variant="outline"
                    onClick={() => { setScannedResult(null); setScanStatus('idle'); }}
                  >
                    Scan Another
                  </Button>
                  <Button 
                    className="flex-1"
                    style={{ background: '#1D9E75' }}
                    onClick={() => { setShowScanner(false); setScannedResult(null); setScanStatus('idle'); }}
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="p-8 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <Card key={i} className="p-6 relative overflow-hidden" style={{ background: metric.color, border: 'none' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs mb-1 font-semibold text-slate-500 uppercase tracking-wider">{metric.label}</p>
                    <p className="text-3xl font-bold mb-1" style={{ color: metric.textColor }}>
                      {metric.value}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/60">
                    <Icon className="w-5 h-5" style={{ color: metric.textColor }} />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs mt-2 font-medium" style={{ color: metric.textColor }}>
                  <span>{metric.change}</span>
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Dues & Charts */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Chart: Stacked monthly revenue and expenses */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Revenue & Utility Tracking</h2>
                  <p className="text-xs text-slate-400">Monthly breakdown of Rent Collection vs Utilities & Food expenses</p>
                </div>
                <Badge className="bg-[#E1F5EE] text-[#085041]">June projections look stable</Badge>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" tick={{ fill: '#6B7280' }} />
                    <YAxis tick={{ fill: '#6B7280' }} />
                    <Tooltip />
                    <Bar dataKey="Rent" name="Rent Collected" fill="#1D9E75" stackId="a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Utilities" name="Utility Bills" fill="#0C447C" stackId="b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Food" name="Food Sourcing" fill="#EF9F27" stackId="b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Pending Dues Table */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Dues Monitoring</h2>
                  <p className="text-xs text-slate-400">Tenants with unpaid rent and utility bill breakdowns</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => triggerToast('Redirecting to Rent Collection tab...')}>View All Dues</Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ background: '#F8F9FA' }}>
                      <th className="text-left text-xs font-semibold px-4 py-3 text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="text-center text-xs font-semibold px-4 py-3 text-slate-500 uppercase tracking-wider">Room</th>
                      <th className="text-right text-xs font-semibold px-4 py-3 text-slate-500 uppercase tracking-wider">Rent</th>
                      <th className="text-right text-xs font-semibold px-4 py-3 text-slate-500 uppercase tracking-wider">Utilities Due</th>
                      <th className="text-right text-xs font-semibold px-4 py-3 text-slate-500 uppercase tracking-wider">Total Due</th>
                      <th className="text-center text-xs font-semibold px-4 py-3 text-slate-500 uppercase tracking-wider">Overdue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDues.map((tenant, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: '#E5E7EB' }}>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-900">{tenant.name}</td>
                        <td className="px-4 py-4 text-center">
                          <Badge variant="outline">{tenant.room}</Badge>
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-slate-700">₹{tenant.rent.toLocaleString()}</td>
                        <td className="px-4 py-4 text-right text-sm text-slate-700">₹{tenant.utilities}</td>
                        <td className="px-4 py-4 text-right text-sm font-bold text-[#1D9E75]">₹{tenant.total.toLocaleString()}</td>
                        <td className="px-4 py-4 text-center">
                          <Badge style={{ background: '#FCEBEB', color: '#791F1F' }}>{tenant.days} days</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

          </div>
          
          {/* Right Column - Expenses & Activity */}
          <div className="space-y-6">
            
            {/* Utility & Operational Cost monitoring */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Operational Expenses Log</h3>
              <div className="space-y-3">
                {operationalExpenses.map((exp, i) => (
                  <div key={i} className="flex justify-between items-center text-xs p-3 rounded-lg border bg-white">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-800">{exp.name}</p>
                      <p className="text-slate-400">{exp.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-950">{exp.amount}</p>
                      <Badge style={{
                        background: exp.status === 'Paid' ? '#E1F5EE' : '#FCEBEB',
                        color: exp.status === 'Paid' ? '#085041' : '#791F1F'
                      }} className="text-[9px] px-1.5 py-0 border-none font-semibold">
                        {exp.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Today's Food waste alerts */}
            <Card className="p-6 bg-slate-900 text-white relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-base">Meal Bookings Count</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Saves ~30% in food waste daily</p>
                </div>
                <Badge className="bg-[#1D9E75] text-white">Active</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-[10px] text-slate-400">Breakfast</p>
                  <p className="text-lg font-bold text-white">8</p>
                </div>
                <div className="border-x border-slate-700">
                  <p className="text-[10px] text-slate-400">Lunch</p>
                  <p className="text-lg font-bold text-white">11</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Dinner</p>
                  <p className="text-lg font-bold text-white">9</p>
                </div>
              </div>
            </Card>
            
            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Recent Activity Log</h3>
              <div className="space-y-4">
                {activities.map((activity, i) => (
                  <div key={i} className="pb-4 border-b last:border-0 last:pb-0" style={{ borderColor: '#E5E7EB' }}>
                    <p className="text-sm text-slate-700 leading-relaxed">{activity.text}</p>
                    <p className="text-xs mt-1 text-slate-400 font-medium">{activity.time}</p>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
