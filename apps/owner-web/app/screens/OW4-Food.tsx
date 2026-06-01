import { useState, useEffect } from 'react'; import { Share2, Check, X, Calendar, AlertTriangle, Send, ShieldAlert, Sparkles, Clock, HelpCircle } from 'lucide-react'; import { Card } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';

interface FoodBooking {
  name: string;
  room: string;
  phone: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  status: 'Booked' | 'Not Booked' | 'Missed Cutoff';
}

export function OwnerWebFood() {
  const [selectedDay, setSelectedDay] = useState('Tomorrow');
  const [notif, setNotif] = useState<string | null>(null);

  // Bookings list state
  const [bookings, setBookings] = useState<FoodBooking[]>([
    { name: 'Amit Kumar', room: 'Room 4', phone: '+91 98765 43210', breakfast: true, lunch: false, dinner: true, status: 'Booked' },
    { name: 'Sanjay Ramaswamy', room: 'Room 2', phone: '+91 99000 88776', breakfast: true, lunch: true, dinner: true, status: 'Booked' },
    { name: 'Vijay Nair', room: 'Room 8', phone: '+91 91234 56789', breakfast: true, lunch: true, dinner: false, status: 'Booked' },
    { name: 'Rahul Verma', room: 'Room 11', phone: '+91 90123 00112', breakfast: false, lunch: false, dinner: false, status: 'Not Booked' },
    { name: 'Vikram Singh', room: 'Room 9', phone: '+91 99887 76655', breakfast: false, lunch: false, dinner: false, status: 'Not Booked' },
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
    const summaryMsg = `Sunrise PG Meal Counts for ${selectedDay}:\n- Breakfast: ${mealCounts.breakfast}\n- Lunch: ${mealCounts.lunch}\n- Dinner: ${mealCounts.dinner}\nTotal active plates: ${mealCounts.breakfast + mealCounts.lunch + mealCounts.dinner}\n\nGenerated via Rentflo Food Waste Control Panel.`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=+919012345678&text=${encodeURIComponent(summaryMsg)}`;
    window.open(whatsappUrl, '_blank');
    triggerToast('Shared meal counts with Cook via WhatsApp API!');
  };

  const handleSendReminder = (name: string, phone: string) => {
    const msg = `Hi ${name}, this is Sunrise PG. Please book your Breakfast, Lunch, and Dinner for tomorrow on the Rentflo app before the 6:00 PM cutoff to ensure your meals are cooked. Thank you!`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone.replace(/\D/g, '')}&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    triggerToast(`Sent unbooked meal alert to ${name}!`);
  };

  const handleSendAllReminders = () => {
    triggerToast(`Sent WhatsApp food cutoff alerts to ${unbookedTenants.length} unbooked residents!`);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto relative text-left bg-[#F8F9FA] min-h-screen">
      {/* Toast */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-[#111827] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold z-50 animate-bounce">
          <Check className="w-4 h-4 text-[#1D9E75]" /> {notif}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Food Waste Reduction Panel</h1>
          <p className="text-slate-500 mt-1">Keep track of daily meal bookings, cutoff lists, cook updates, and menus to save money</p>
        </div>
        <div className="flex gap-2">
          <Button style={{ background: '#25D366', color: '#FFFFFF' }} className="hover:opacity-90 flex items-center gap-2" onClick={shareWithCook}>
            <Share2 className="w-4 h-4" /> WhatsApp count to Cook
          </Button>
        </div>
      </div>

      {/* Date Toggle & Timer */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2">
          {['Yesterday', 'Today', 'Tomorrow'].map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                background: selectedDay === day ? '#E1F5EE' : '#FFFFFF',
                color: selectedDay === day ? '#085041' : '#6B7280',
                borderColor: selectedDay === day ? '#E1F5EE' : '#E5E7EB'
              }}
            >
              {day}
            </button>
          ))}
        </div>

        {/* 6 PM Cutoff Status Card */}
        <Badge variant="outline" className="px-4 py-2 border-orange-200 bg-orange-50 text-orange-800 flex items-center gap-2">
          <Clock className="w-4 h-4 animate-pulse" />
          <span className="font-semibold text-xs">
            6:00 PM Booking Cutoff Status: <span className="font-bold text-orange-950">CLOSED</span>
          </span>
        </Badge>
      </div>

      {/* Counts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-[#1D9E75] flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Breakfast plates</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{mealCounts.breakfast} booked</p>
            <p className="text-xs text-slate-400 mt-1">8:00 - 9:00 AM · Cutoff passed</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#E1F5EE] text-[#085041] flex items-center justify-center text-xl font-bold">B</div>
        </Card>

        <Card className="p-6 border-l-4 border-l-[#EF9F27] flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lunch plates</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{mealCounts.lunch} booked</p>
            <p className="text-xs text-slate-400 mt-1">12:00 - 1:00 PM · Cutoff passed</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-xl font-bold">L</div>
        </Card>

        <Card className="p-6 border-l-4 border-l-[#1D9E75] flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dinner plates</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{mealCounts.dinner} booked</p>
            <p className="text-xs text-slate-400 mt-1">7:00 - 8:00 PM · Cutoff passed</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#E1F5EE] text-[#085041] flex items-center justify-center text-xl font-bold">D</div>
        </Card>
      </div>

      {/* Main Panel Content split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bookings details table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden border border-slate-200">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Meal Bookings Log ({selectedDay})</h3>
              <Badge style={{ background: '#FCEBEB', color: '#791F1F' }} className="border-none">Cutoff Passed</Badge>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Resident</th>
                  <th className="px-6 py-3">Room</th>
                  <th className="px-6 py-3 text-center">Breakfast</th>
                  <th className="px-6 py-3 text-center">Lunch</th>
                  <th className="px-6 py-3 text-center">Dinner</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm">
                {bookings.map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-800">{b.name}</td>
                    <td className="px-6 py-4 text-slate-600">{b.room}</td>
                    <td className="px-6 py-4 text-center">
                      {b.breakfast ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-teal-600"><Check className="w-4 h-4" /></span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300"><X className="w-4 h-4" /></span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {b.lunch ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-teal-600"><Check className="w-4 h-4" /></span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300"><X className="w-4 h-4" /></span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {b.dinner ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-teal-600"><Check className="w-4 h-4" /></span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300"><X className="w-4 h-4" /></span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge style={{
                        background: b.status === 'Booked' ? '#E1F5EE' : '#FCEBEB',
                        color: b.status === 'Booked' ? '#085041' : '#791F1F'
                      }} className="border-none font-semibold">
                        {b.status}
                      </Badge>
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
          <Card className="p-6 space-y-4 border border-slate-200 bg-white">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" /> Food Sourcing Savings
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 rounded-lg">
                <p className="text-xs text-teal-800 font-semibold">Estimated Monthly Savings</p>
                <p className="text-3xl font-bold text-teal-900 mt-1">₹14,500</p>
                <p className="text-[10px] text-teal-700 mt-1">~38% reduction in daily food waste</p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between border-b pb-1.5">
                  <span>Total PG Strength</span>
                  <span className="font-semibold text-slate-900">{totalTenants} Residents</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span>Unbooked (Missed)</span>
                  <span className="font-semibold text-slate-900">{unbookedTenants.length} Residents</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Sourcing Saved Today</span>
                  <span className="font-semibold text-[#1D9E75]">₹480</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Unbooked residents reminder panel */}
          <Card className="p-6 space-y-4 border border-slate-200 bg-white">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Unbooked Residents</h3>
              <Badge style={{ background: '#FCEBEB', color: '#791F1F' }} className="border-none">{unbookedTenants.length} left</Badge>
            </div>

            {unbookedTenants.length > 0 ? (
              <div className="space-y-3">
                {unbookedTenants.map(ub => (
                  <div key={ub.name} className="flex justify-between items-center text-xs p-2.5 rounded border bg-slate-50">
                    <div>
                      <p className="font-semibold text-slate-800">{ub.name}</p>
                      <p className="text-slate-400">{ub.room}</p>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-orange-600 border-orange-200 hover:bg-orange-50 text-[10px] h-7 px-2 font-bold"
                      onClick={() => handleSendReminder(ub.name, ub.phone)}
                    >
                      <Send className="w-3 h-3 mr-1" /> Alert
                    </Button>
                  </div>
                ))}
                
                <Button 
                  onClick={handleSendAllReminders}
                  style={{ background: '#EF9F27', color: '#FFFFFF' }} 
                  className="w-full text-xs font-bold uppercase tracking-wider h-10 mt-2 hover:opacity-90"
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
