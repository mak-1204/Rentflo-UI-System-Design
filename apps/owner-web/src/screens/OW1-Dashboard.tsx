import { useState, useEffect } from 'react';
import { Bell, TrendingUp, TrendingDown, IndianRupee, Zap, Droplets, Wrench, ShieldAlert, Check, Plus, QrCode, Scan, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';
import { Button } from '@stayflo/ui';
import { Card } from '@stayflo/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Booking {
  name: string;
  room: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  servedMeals: { breakfast?: boolean; lunch?: boolean; dinner?: boolean };
}

export function OwnerWebDashboard({
  initialTenants,
  initialComplaints,
}: {
  initialTenants?: any[];
  initialComplaints?: any[];
} = {}) {
  const [notif, setNotif] = useState<string | null>(null);

  // Scanner simulator state
  const [showScanner, setShowScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [scannedResult, setScannedResult] = useState<any>(null);

  const [bookings, setBookings] = useState<Booking[]>([
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
    setScannedResult((prev: any) => ({
      ...prev,
      servedMeals: {
        ...(prev.servedMeals || {}),
        [mealType]: true
      }
    }));

    triggerToast(`Marked ${mealType} as served for ${scannedResult.name}!`);
  };

  // Load / initialize tenants & rentData states dynamically from localStorage/props
  const [tenants, setTenants] = useState<any[]>([]);
  const [rentRecords, setRentRecords] = useState<any[]>([]);
  const [opExpenses, setOpExpenses] = useState<any[]>([]);

  useEffect(() => {
    // 1. Tenants list
    const savedTenants = localStorage.getItem('stayflo_tenants_list');
    let loadedTenants = [];
    if (savedTenants) {
      try { loadedTenants = JSON.parse(savedTenants); } catch (e) {}
    }
    if (!loadedTenants || loadedTenants.length === 0) {
      loadedTenants = initialTenants && initialTenants.length > 0 ? initialTenants.map((t: any, idx) => ({
        name: t.name || (t.userId === 'u-2' ? 'Amit Kumar' : `Resident ${idx + 1}`),
        room: t.room || (t.bedId ? `Room ${t.bedId.replace(/[^0-9]/g, '')}` : 'Room TBD'),
        floor: t.floor || (t.bedId?.includes('101') ? 'Ground Floor' : '1st Floor'),
        rent: typeof t.rent === 'number' ? t.rent : (t.baseRent || 8500),
        phone: t.phone || '+91 99999 88888',
        email: t.email || 'resident@stayflo.com',
        status: t.status === 'Paid' || t.status === 'Overdue' ? t.status : 'Paid',
        moveIn: t.moveIn || t.checkInDate || 'Today',
        activeMonths: typeof t.activeMonths === 'number' ? t.activeMonths : 1
      })) : [
        { name: 'Amit Kumar', room: 'Room 4', floor: '1st Floor', rent: 8500, phone: '+91 98765 43210', email: 'amit.k@gmail.com', status: 'Overdue', moveIn: '15 Oct 2025', activeMonths: 8 },
        { name: 'Sanjay Ramaswamy', room: 'Room 2', floor: 'Ground Floor', rent: 8500, phone: '+91 99000 88776', email: 'sanjay.r@outlook.com', status: 'Paid', moveIn: '01 Nov 2025', activeMonths: 7 },
        { name: 'Vijay Nair', room: 'Room 8', floor: '2nd Floor', rent: 9200, phone: '+91 91234 56789', email: 'vijay.nair@yahoo.com', status: 'Paid', moveIn: '10 Jan 2026', activeMonths: 5 },
      ];
    }
    setTenants(loadedTenants);

    // 2. Rent Records
    const savedRent = localStorage.getItem('stayflo_rent_records');
    let loadedRent = [];
    if (savedRent) {
      try { loadedRent = JSON.parse(savedRent); } catch (e) {}
    }
    if (!loadedRent || loadedRent.length === 0) {
      loadedRent = [
        { name: 'Amit Kumar', room: 'Room 4', rent: 8500, utilities: 530, lateFee: 250, status: 'Overdue', date: '-', method: '-' },
        { name: 'Sanjay Ramaswamy', room: 'Room 2', rent: 8500, utilities: 450, lateFee: 0, status: 'Paid', date: '05 Jun 2026', method: 'Razorpay UPI' },
        { name: 'Vijay Nair', room: 'Room 8', rent: 9200, utilities: 480, lateFee: 0, status: 'Paid', date: '04 Jun 2026', method: 'Cash' },
        { name: 'Rahul Verma', room: 'Room 11', rent: 8000, utilities: 420, lateFee: 0, status: 'Delay Requested', date: '-', method: '-' },
      ];
    }
    setRentRecords(loadedRent);

    // 3. Operational Expenses
    const savedExpenses = localStorage.getItem('stayflo_operational_expenses');
    let loadedExpenses = [];
    if (savedExpenses) {
      try { loadedExpenses = JSON.parse(savedExpenses); } catch (e) {}
    }
    if (!loadedExpenses || loadedExpenses.length === 0) {
      loadedExpenses = [
        { name: 'Electricity (BESCOM)', amount: '₹8,450', date: 'Due in 5 days', status: 'Unpaid' },
        { name: 'Water Tanker Sourcing', amount: '₹4,200', date: 'Paid on 28 May', status: 'Paid' },
        { name: 'Catering / Cook Sourcing', amount: '₹18,500', date: 'Paid on 30 May', status: 'Paid' },
        { name: 'Cleaning & Consumables', amount: '₹3,400', date: 'Paid on 25 May', status: 'Paid' },
        { name: 'Elevator Maintenance', amount: '₹2,500', date: 'Due in 10 days', status: 'Unpaid' },
      ];
    }
    setOpExpenses(loadedExpenses);
  }, [initialTenants]);

  // Rent Collected (Default: 48200)
  const paidRentSum = rentRecords.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.rent, 0);
  const rentCollectedVal = 30500 + paidRentSum;

  // Pending Dues (Default: 6400)
  const unpaidRentSum = rentRecords.filter(r => r.status !== 'Paid').reduce((sum, r) => sum + r.rent, 0);
  const pendingDuesVal = Math.max(0, -10100 + unpaidRentSum);

  // Electricity Charges (Default: 8450)
  const electricityVal = opExpenses
    .filter(e => e.name.toLowerCase().includes('electricity'))
    .reduce((sum, e) => sum + parseInt(e.amount.replace(/[^0-9]/g, '') || '0'), 0);

  // Water Tanker Fees (Default: 4200)
  const waterVal = opExpenses
    .filter(e => e.name.toLowerCase().includes('water'))
    .reduce((sum, e) => sum + parseInt(e.amount.replace(/[^0-9]/g, '') || '0'), 0);

  // Catering / Food Sourcing (Default: 18500 -> June chart shows 9800)
  const cateringVal = opExpenses
    .filter(e => e.name.toLowerCase().includes('catering') || e.name.toLowerCase().includes('cook'))
    .reduce((sum, e) => sum + parseInt(e.amount.replace(/[^0-9]/g, '') || '0'), 0);
  const foodVal = Math.max(0, cateringVal - 8700);

  const metrics = [
    { label: 'Rent Collected', value: `₹${rentCollectedVal.toLocaleString()}`, change: '+12%', trend: 'up', color: '#f0fdfa', textColor: '#0f766e', icon: IndianRupee },
    { label: 'Pending Dues', value: `₹${pendingDuesVal.toLocaleString()}`, change: '-8%', trend: 'down', color: '#fff7ed', textColor: '#c2410c', icon: IndianRupee },
    { label: 'Electricity Charges', value: `₹${electricityVal.toLocaleString()}`, change: `${Math.round(electricityVal / 9.94)} units`, trend: 'up', color: '#eff6ff', textColor: '#1d4ed8', icon: Zap },
    { label: 'Water Tanker Fees', value: `₹${waterVal.toLocaleString()}`, change: `${Math.round(waterVal / 700)} Tankers`, trend: 'up', color: '#f0fdfa', textColor: '#0f766e', icon: Droplets },
  ];

  const pendingDues = rentRecords
    .filter(r => r.status !== 'Paid')
    .map(r => ({
      name: r.name,
      room: parseInt(r.room.replace(/[^0-9]/g, '') || '0') || 4,
      rent: r.rent,
      utilities: r.utilities,
      total: r.rent + r.utilities + r.lateFee,
      days: r.status === 'Overdue' ? 8 : r.status === 'Delay Requested' ? 12 : 3
    }));

  const chartData = [
    { month: 'Jan', Rent: 96000, Utilities: 8900, Food: 14000 },
    { month: 'Feb', Rent: 94500, Utilities: 9200, Food: 13500 },
    { month: 'Mar', Rent: 102000, Utilities: 9800, Food: 15000 },
    { month: 'Apr', Rent: 99500, Utilities: 10500, Food: 14800 },
    { month: 'May', Rent: 101000, Utilities: 11800, Food: 16000 },
    { month: 'Jun', Rent: rentCollectedVal, Utilities: electricityVal + waterVal, Food: foodVal },
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
    <div className="h-full overflow-y-auto text-left bg-gradient-to-br from-slate-50 via-slate-50 to-[#14b8a6]/[0.03] pb-12 relative" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Toast */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Check className="w-4 h-4 text-[#14b8a6]" /> {notif}
        </div>
      )}

      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-8 py-5 flex items-center justify-between" style={{ borderColor: '#E5E7EB' }}>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>Owner Dashboard</h1>
          <p className="text-xs mt-1 text-slate-450 font-medium">Sunrise PG · Koramangala · June 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowScanner(true)}
            style={{ background: '#14b8a6', color: '#FFFFFF' }}
            className="hover:opacity-95 active:scale-98 flex items-center gap-2 h-10 px-4 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-teal-500/10 transition-all cursor-pointer border-none"
          >
            <QrCode className="w-4 h-4" /> Scan Food Pass
          </Button>
          <button 
            className="relative p-2 rounded-xl hover:bg-slate-55 text-slate-500 hover:text-slate-700 transition-colors" 
            onClick={() => triggerToast('No new notifications!')}
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></div>
          </button>
          <Avatar>
            <AvatarFallback style={{ background: '#14b8a6', color: '#FFFFFF' }}>RK</AvatarFallback>
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
              <h4 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5" style={{ fontFamily: 'var(--font-heading)' }}>
                <Scan className="w-5 h-5 text-[#14b8a6]" /> Scanner: Daily Food Pass
              </h4>
              <p className="text-xs text-slate-500">Simulate or scan active resident food passes for verification</p>
            </div>

            {scanStatus === 'idle' && (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-teal-50 text-[#14b8a6] flex items-center justify-center">
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
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.15),transparent)] animate-pulse" />
                <div className="absolute left-0 right-0 h-1 bg-[#14b8a6] shadow-[0_0_10px_#14b8a6] top-0 animate-[bounce_2s_infinite]" />
                <div className="w-16 h-16 rounded-xl border-2 border-white/20 flex items-center justify-center text-white text-xl animate-pulse">
                  📷
                </div>
                <p className="text-sm font-bold text-white relative z-10">Accessing Camera Viewport...</p>
                <p className="text-xs text-slate-400 relative z-10">Scanning QR pattern...</p>
              </div>
            )}

            {scanStatus === 'success' && scannedResult && (
              <div className="space-y-4 text-left">
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{scannedResult.name}</p>
                    <p className="text-xs text-slate-500">{scannedResult.room} · Daily Food Pass</p>
                  </div>
                  <Badge className="bg-[#14b8a6] text-white font-bold border-none text-[10px] px-2.5 py-0.5 rounded-md">VALID PASS ✓</Badge>
                </div>

                <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 text-xs text-slate-700 bg-slate-50/50">
                  <div className="p-3.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">Breakfast Booking</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">8:00 AM - 9:00 AM</p>
                    </div>
                    <div>
                      {scannedResult.meals.breakfast ? (
                        scannedResult.servedMeals.breakfast ? (
                          <Badge className="bg-slate-100 text-slate-500 border-none font-semibold text-[10px] px-2 py-0.5 rounded-md">Served ✓</Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            style={{ background: '#14b8a6', color: '#FFFFFF' }}
                            className="h-8 text-[10px] font-bold rounded-lg border-none px-3"
                            onClick={() => handleServeMeal('breakfast')}
                          >
                            Mark Served
                          </Button>
                        )
                      ) : (
                        <Badge className="bg-rose-50 text-rose-700 border-none font-semibold text-[10px] px-2 py-0.5 rounded-md">Not Registered ✗</Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">Lunch Booking</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">12:00 PM - 1:00 PM</p>
                    </div>
                    <div>
                      {scannedResult.meals.lunch ? (
                        scannedResult.servedMeals.lunch ? (
                          <Badge className="bg-slate-100 text-slate-500 border-none font-semibold text-[10px] px-2 py-0.5 rounded-md">Served ✓</Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            style={{ background: '#14b8a6', color: '#FFFFFF' }}
                            className="h-8 text-[10px] font-bold rounded-lg border-none px-3"
                            onClick={() => handleServeMeal('lunch')}
                          >
                            Mark Served
                          </Button>
                        )
                      ) : (
                        <Badge className="bg-rose-50 text-rose-700 border-none font-semibold text-[10px] px-2 py-0.5 rounded-md">Not Registered ✗</Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">Dinner Booking</p>
                      <p className="text-[10px] text-slate-455 mt-0.5">7:00 PM - 8:00 PM</p>
                    </div>
                    <div>
                      {scannedResult.meals.dinner ? (
                        scannedResult.servedMeals.dinner ? (
                          <Badge className="bg-slate-100 text-slate-500 border-none font-semibold text-[10px] px-2 py-0.5 rounded-md">Served ✓</Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            style={{ background: '#14b8a6', color: '#FFFFFF' }}
                            className="h-8 text-[10px] font-bold rounded-lg border-none px-3"
                            onClick={() => handleServeMeal('dinner')}
                          >
                            Mark Served
                          </Button>
                        )
                      ) : (
                        <Badge className="bg-rose-50 text-rose-700 border-none font-semibold text-[10px] px-2 py-0.5 rounded-md">Not Registered ✗</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    className="flex-1 rounded-xl h-11 border-slate-200 text-slate-650 hover:bg-slate-50 font-bold"
                    variant="outline"
                    onClick={() => { setScannedResult(null); setScanStatus('idle'); }}
                  >
                    Scan Another
                  </Button>
                  <Button 
                    className="flex-1 rounded-xl h-11 border-none font-bold text-white"
                    style={{ background: '#14b8a6' }}
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
      
      <div className="p-8 space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <Card 
                key={i} 
                style={{ backgroundColor: metric.color }}
                className="p-6 border-none rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p 
                      style={{ color: metric.textColor }}
                      className="text-[10px] mb-1.5 font-extrabold uppercase tracking-wider opacity-80"
                    >
                      {metric.label}
                    </p>
                    <p 
                      style={{ fontFamily: 'var(--font-heading)', color: metric.textColor }}
                      className="text-3xl font-extrabold mb-1 tracking-tight"
                    >
                      {metric.value}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Icon className="w-5 h-5" style={{ color: metric.textColor }} />
                  </div>
                </div>
                <div 
                  style={{ color: metric.textColor }}
                  className="flex items-center gap-1.5 text-xs mt-3 font-bold opacity-90"
                >
                  <span>
                    {metric.change}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Dues & Charts */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart: Stacked monthly revenue and expenses */}
            <Card className="p-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Revenue & Utility Tracking</h2>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">Monthly breakdown of Rent Collection vs Utilities & Food expenses</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-none whitespace-nowrap">
                  June projections look stable
                </span>
              </div>
              <div className="h-[350px] px-2 py-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#94A3B8' }} tickLine={false} axisLine={false} style={{ fontSize: '11px', fontFamily: 'var(--font-sans)' }} />
                    <YAxis tick={{ fill: '#94A3B8' }} tickLine={false} axisLine={false} style={{ fontSize: '11px', fontFamily: 'var(--font-sans)' }} />
                    <Tooltip 
                      contentStyle={{ background: '#0F172A', border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '11px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                      itemStyle={{ color: '#94A3B8' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-sans)', paddingBottom: '10px' }} />
                    <Line type="monotone" dataKey="Rent" name="Rent Collected" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, stroke: '#14b8a6', strokeWidth: 1, fill: '#fff' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Utilities" name="Utility Bills" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, stroke: '#6366f1', strokeWidth: 1, fill: '#fff' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Food" name="Food Sourcing" stroke="#94a3b8" strokeWidth={3} dot={{ r: 4, stroke: '#94a3b8', strokeWidth: 1, fill: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Pending Dues Table */}
            <Card className="p-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Dues Monitoring</h2>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Tenants with unpaid rent and utility bill breakdowns</p>
                </div>
                <Button size="sm" variant="outline" className="whitespace-nowrap rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-700 h-9 px-4 transition-all" onClick={() => triggerToast('Redirecting to Rent Collection tab...')}>View All Dues</Button>
              </div>
              
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left min-w-[600px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                      <th className="text-left px-5 py-4">Name</th>
                      <th className="text-center px-5 py-4">Room</th>
                      <th className="text-right px-5 py-4">Rent</th>
                      <th className="text-right px-5 py-4">Utilities Due</th>
                      <th className="text-right px-5 py-4">Total Due</th>
                      <th className="text-center px-5 py-4">Overdue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {pendingDues.map((tenant, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 font-semibold text-slate-900">{tenant.name}</td>
                        <td className="px-5 py-4 text-center">
                          <Badge variant="outline" className="text-[10px] font-bold border-slate-200/80 text-slate-600 rounded-md bg-white px-2 py-0.5">{tenant.room}</Badge>
                        </td>
                        <td className="px-5 py-4 text-right text-slate-600">₹{tenant.rent.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right text-slate-600">₹{tenant.utilities}</td>
                        <td className="px-5 py-4 text-right font-extrabold text-[#14b8a6]">₹{tenant.total.toLocaleString()}</td>
                        <td className="px-5 py-4 text-center">
                          <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-100/50">{tenant.days} days</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

          </div>
          
          {/* Right Column - Expenses & Activity */}
          <div className="space-y-8">
            
            {/* Utility & Operational Cost monitoring */}
            <Card className="p-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
              <h3 className="text-xl font-bold mb-6 text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Operational Expenses</h3>
              <div className="space-y-3">
                {operationalExpenses.map((exp, i) => (
                  <div key={i} className="flex justify-between items-center text-xs p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800">{exp.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{exp.date}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-extrabold text-slate-900">{exp.amount}</p>
                      <Badge style={{
                        background: exp.status === 'Paid' ? '#f0fdfa' : '#FCEBEB',
                        color: exp.status === 'Paid' ? '#14b8a6' : '#791F1F'
                      }} className="text-[9px] px-2 py-0.5 border-none font-bold rounded-md uppercase tracking-wider">
                        {exp.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Today's Food waste alerts */}
            <Card className="p-8 bg-slate-950 border border-slate-900 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="font-extrabold text-lg text-white" style={{ fontFamily: 'var(--font-heading)' }}>Meal Bookings Count</h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Saves ~30% in food waste daily</p>
                </div>
                <Badge className="bg-[#14b8a6] text-white border-none font-bold text-[10px] px-2 py-0.5 rounded-md">ACTIVE</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center py-3 bg-slate-900/60 rounded-xl border border-slate-800/80 relative z-10 shadow-inner">
                <div>
                  <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Breakfast</p>
                  <p className="text-xl font-extrabold text-white mt-1">8</p>
                </div>
                <div className="border-x border-slate-800">
                  <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Lunch</p>
                  <p className="text-xl font-extrabold text-white mt-1">11</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Dinner</p>
                  <p className="text-xl font-extrabold text-white mt-1">9</p>
                </div>
              </div>
            </Card>
            
            {/* Recent Activity */}
            <Card className="p-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
              <h3 className="text-xl font-bold mb-6 text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Recent Activity Log</h3>
              <div className="space-y-5">
                {activities.map((activity, i) => (
                  <div key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <p className="text-xs text-slate-650 leading-relaxed font-semibold">{activity.text}</p>
                    <p className="text-[10px] mt-1.5 text-slate-400 font-medium">{activity.time}</p>
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
