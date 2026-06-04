import { useState, useEffect } from 'react';
import { Share2, Check, X, Calendar, AlertTriangle, Send, ShieldAlert, Sparkles, Clock, HelpCircle, QrCode, Scan } from 'lucide-react';
import { Card } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';
import { Button } from '@stayflo/ui';

interface FoodBooking {
  name: string;
  room: string;
  phone: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  status: 'Booked' | 'Not Booked' | 'Missed Cutoff';
  servedMeals?: { breakfast?: boolean; lunch?: boolean; dinner?: boolean };
}

export function OwnerWebFood() {
  const [selectedDay, setSelectedDay] = useState('Tomorrow');
  const [notif, setNotif] = useState<string | null>(null);

  // Scanner Simulator States
  const [showScanner, setShowScanner] = useState(false);
  const [scannedResult, setScannedResult] = useState<any>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');

  // Bookings list state
  const [bookings, setBookings] = useState<FoodBooking[]>([
    { name: 'Amit Kumar', room: 'Room 4', phone: '+91 98765 43210', breakfast: true, lunch: false, dinner: true, status: 'Booked', servedMeals: { breakfast: true } },
    { name: 'Sanjay Ramaswamy', room: 'Room 2', phone: '+91 99000 88776', breakfast: true, lunch: true, dinner: true, status: 'Booked', servedMeals: {} },
    { name: 'Vijay Nair', room: 'Room 8', phone: '+91 91234 56789', breakfast: true, lunch: true, dinner: false, status: 'Booked', servedMeals: { breakfast: true, lunch: true } },
    { name: 'Rahul Verma', room: 'Room 11', phone: '+91 90123 00112', breakfast: false, lunch: false, dinner: false, status: 'Not Booked', servedMeals: {} },
    { name: 'Vikram Singh', room: 'Room 9', phone: '+91 99887 76655', breakfast: false, lunch: false, dinner: false, status: 'Not Booked', servedMeals: {} },
  ]);

  const [currentTime, setCurrentTime] = useState('09:54 PM');

  // Counts based on active bookings
  const mealCounts = {
    breakfast: bookings.filter(b => b.breakfast).length,
    lunch: bookings.filter(b => b.lunch).length,
    dinner: bookings.filter(b => b.dinner).length,
  };

  const totalTenants = bookings.length;
  const unbookedTenants = bookings.filter(b => b.status === 'Not Booked');

  const triggerToast = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  const shareWithCook = () => {
    const summaryMsg = `Sunrise PG Meal Counts for ${selectedDay}:\n- Breakfast: ${mealCounts.breakfast}\n- Lunch: ${mealCounts.lunch}\n- Dinner: ${mealCounts.dinner}\nTotal active plates: ${mealCounts.breakfast + mealCounts.lunch + mealCounts.dinner}\n\nGenerated via Stayflo Food Waste Control Panel.`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=+919012345678&text=${encodeURIComponent(summaryMsg)}`;
    window.open(whatsappUrl, '_blank');
    triggerToast('Shared meal counts with Cook via WhatsApp API!');
  };

  const handleSendReminder = (name: string, phone: string) => {
    const msg = `Hi ${name}, this is Sunrise PG. Please book your Breakfast, Lunch, and Dinner for tomorrow on the Stayflo app before the 6:00 PM cutoff to ensure your meals are cooked. Thank you!`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone.replace(/\D/g, '')}&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    triggerToast(`Sent unbooked meal alert to ${name}!`);
  };

  const handleSendAllReminders = () => {
    triggerToast(`Sent WhatsApp food cutoff alerts to ${unbookedTenants.length} unbooked residents!`);
  };

  // Simulate scanning of QR code payload
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

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto relative text-left min-h-screen" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Toast */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold z-50 animate-in fade-in duration-300">
          <Check className="w-4 h-4 text-[#14b8a6]" /> {notif}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>Food Waste Reduction</h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">Keep track of daily meal bookings, cutoff lists, cook updates, and menus to save money</p>
        </div>
        <div className="flex gap-2">
          <Button 
            style={{ background: '#14b8a6', color: '#FFFFFF' }} 
            className="hover:opacity-95 active:scale-98 flex items-center gap-2 rounded-xl text-xs font-bold h-10 px-4 border-none shadow-md shadow-teal-500/10 cursor-pointer" 
            onClick={() => setShowScanner(true)}
          >
            <QrCode className="w-4 h-4" /> Scan Food Pass QR
          </Button>
          <Button 
            style={{ background: '#25D366', color: '#FFFFFF' }} 
            className="hover:opacity-95 active:scale-98 flex items-center gap-2 rounded-xl text-xs font-bold h-10 px-4 border-none shadow-md shadow-emerald-500/10 cursor-pointer" 
            onClick={shareWithCook}
          >
            <Share2 className="w-4 h-4" /> WhatsApp count to Cook
          </Button>
        </div>
      </div>

      {/* QR Scanner Simulator Modal */}
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
              <div className="space-y-4">
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-center justify-between">
                  <div className="text-left">
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

      {/* Date Toggle & Timer */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2">
          {['Yesterday', 'Today', 'Tomorrow'].map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer border-slate-250"
              style={{
                background: selectedDay === day ? '#f0fdfa' : '#FFFFFF',
                color: selectedDay === day ? '#14b8a6' : '#6B7280',
                borderColor: selectedDay === day ? 'rgba(20,184,166,0.2)' : '#E5E7EB'
              }}
            >
              {day}
            </button>
          ))}
        </div>

        {/* 6 PM Cutoff Status Card */}
        <span className="px-4 py-2 border border-orange-200/50 bg-orange-50 text-orange-800 flex items-center gap-2 rounded-xl text-xs font-semibold">
          <Clock className="w-4 h-4" />
          <span>
            6:00 PM Booking Cutoff Status: <span className="font-bold text-orange-950">CLOSED</span>
          </span>
        </span>
      </div>

      {/* Counts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Breakfast plates</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>{mealCounts.breakfast} booked</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">8:00 - 9:00 AM · Cutoff passed</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100/30 text-[#14b8a6] flex items-center justify-center text-lg font-bold">B</div>
        </Card>

        <Card className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Lunch plates</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>{mealCounts.lunch} booked</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">12:00 - 1:00 PM · Cutoff passed</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100/30 text-amber-700 flex items-center justify-center text-lg font-bold">L</div>
        </Card>

        <Card className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Dinner plates</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>{mealCounts.dinner} booked</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">7:00 - 8:00 PM · Cutoff passed</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100/30 text-[#14b8a6] flex items-center justify-center text-lg font-bold">D</div>
        </Card>
      </div>

      {/* Main Panel Content split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bookings details table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-900 text-sm" style={{ fontFamily: 'var(--font-heading)' }}>Meal Bookings Log ({selectedDay})</h3>
              <span className="bg-rose-50 text-rose-700 border border-rose-100/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-none whitespace-nowrap">Cutoff Passed</span>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Resident</th>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4 text-center">Breakfast</th>
                  <th className="px-6 py-4 text-center">Lunch</th>
                  <th className="px-6 py-4 text-center">Dinner</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white text-sm">
                {bookings.map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50/40 transition-colors duration-200">
                    <td className="px-6 py-4 font-bold text-slate-900">{b.name}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">{b.room}</td>
                    <td className="px-6 py-4 text-center">
                      {b.breakfast ? (
                        b.servedMeals?.breakfast ? (
                          <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] font-bold rounded-md px-2 py-0.5">Served ✓</Badge>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-[#14b8a6]" title="Booked but not served"><Check className="w-4 h-4" /></span>
                        )
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300"><X className="w-4 h-4" /></span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {b.lunch ? (
                        b.servedMeals?.lunch ? (
                          <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] font-bold rounded-md px-2 py-0.5">Served ✓</Badge>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-[#14b8a6]" title="Booked but not served"><Check className="w-4 h-4" /></span>
                        )
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300"><X className="w-4 h-4" /></span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {b.dinner ? (
                        b.servedMeals?.dinner ? (
                          <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] font-bold rounded-md px-2 py-0.5">Served ✓</Badge>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-[#14b8a6]" title="Booked but not served"><Check className="w-4 h-4" /></span>
                        )
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300"><X className="w-4 h-4" /></span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-transparent shadow-none" style={{
                        background: b.status === 'Booked' ? '#f0fdfa' : '#FCEBEB',
                        color: b.status === 'Booked' ? '#0f766e' : '#791F1F',
                        borderColor: b.status === 'Booked' ? 'rgba(20,184,166,0.1)' : 'rgba(239,68,68,0.1)'
                      }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Right side: Food waste report and unbooked reminders */}
        <div className="space-y-6">
          
          {/* Food waste savings metrics */}
          <Card className="p-8 space-y-5 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <Sparkles className="w-4 h-4 text-teal-650" /> Food Sourcing Savings
            </h3>
            <div className="space-y-4">
              <div className="p-5 bg-teal-50/50 rounded-xl border border-teal-100/50">
                <p className="text-xs text-teal-800 font-semibold">Estimated Monthly Savings</p>
                <p className="text-3xl font-extrabold text-teal-900 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>₹14,500</p>
                <p className="text-[10px] text-teal-700 mt-1 font-bold">~38% reduction in daily food waste</p>
              </div>

              <div className="space-y-3 text-xs text-slate-500 font-semibold">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Total PG Strength</span>
                  <span className="font-bold text-slate-900">{totalTenants} Residents</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Unbooked (Missed)</span>
                  <span className="font-bold text-slate-900">{unbookedTenants.length} Residents</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Sourcing Saved Today</span>
                  <span className="font-extrabold text-[#14b8a6]">₹480</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Unbooked residents reminder panel */}
          <Card className="p-8 space-y-5 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>Unbooked Residents</h3>
              <Badge className="bg-rose-50 text-rose-700 border-none text-[10px] font-bold rounded-md px-2 py-0.5">{unbookedTenants.length} left</Badge>
            </div>

            {unbookedTenants.length > 0 ? (
              <div className="space-y-3">
                {unbookedTenants.map(ub => (
                  <div key={ub.name} className="flex justify-between items-center text-xs p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div>
                      <p className="font-bold text-slate-800">{ub.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{ub.room}</p>
                    </div>
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="text-orange-600 hover:bg-orange-50 text-[10px] font-bold rounded-lg px-2.5 h-8 border border-slate-100 hover:border-orange-200"
                      onClick={() => handleSendReminder(ub.name, ub.phone)}
                    >
                      <Send className="w-3 h-3 mr-1" /> Alert
                    </Button>
                  </div>
                ))}
                
                <Button 
                  onClick={handleSendAllReminders}
                  style={{ background: '#EF9F27', color: '#FFFFFF' }} 
                  className="w-full text-xs font-bold uppercase tracking-wider h-11 mt-2 hover:opacity-95 rounded-xl border-none shadow-md shadow-amber-500/10 cursor-pointer"
                >
                  Alert All Unbooked
                </Button>
              </div>
            ) : (
              <p className="text-xs text-slate-400">All residents have booked tomorrow's meals! No food wastage projected. 🎉</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
