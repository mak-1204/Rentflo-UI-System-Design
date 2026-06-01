import { useState } from 'react'; import { Clock, Check, X, Calendar, AlertCircle } from 'lucide-react'; import { Card } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';

export function TenantFoodBooking() {
  const [isPostCutoff, setIsPostCutoff] = useState(false);
  const [meals, setMeals] = useState({
    breakfast: true,
    lunch: false,
    dinner: true,
  });
  const [activeTab, setActiveTab] = useState('booking');

  const history = [
    { date: '18 Jun 2026', breakfast: true, lunch: true, dinner: true, status: 'Served' },
    { date: '17 Jun 2026', breakfast: true, lunch: false, dinner: true, status: 'Served' },
    { date: '16 Jun 2026', breakfast: false, lunch: false, dinner: true, status: 'Missed' },
  ];

  return (
    <div className="px-4 pt-12 pb-4 h-full flex flex-col" style={{ background: '#F8F9FA' }}>
      {/* Navigation tabs */}
      <div className="flex border-b mb-4 bg-white rounded-lg p-1" style={{ borderColor: '#E5E7EB' }}>
        <button 
          onClick={() => setActiveTab('booking')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'booking' ? 'bg-[#E1F5EE] text-[#085041]' : 'text-slate-500'}`}
        >
          Book Meals
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'history' ? 'bg-[#E1F5EE] text-[#085041]' : 'text-slate-500'}`}
        >
          Booking History
        </button>
      </div>

      {activeTab === 'booking' ? (
        <div className="flex-1 space-y-4">
          {/* Status Header */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-800">Tomorrow's Meals</p>
              <p className="text-xs text-slate-400">Wednesday, 18 Jun 2026</p>
            </div>
            {!isPostCutoff ? (
              <Badge style={{ background: '#FAEEDA', color: '#633806' }} className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Closes in 2h 14m
              </Badge>
            ) : (
              <Badge style={{ background: '#FCEBEB', color: '#791F1F' }}>
                Booking Closed
              </Badge>
            )}
          </div>

          {/* Cutoff Toggle Simulator */}
          <div className="flex items-center justify-between bg-teal-50 border border-teal-100 p-3 rounded-lg text-xs">
            <span className="text-[#085041] font-semibold">Simulate Cutoff State:</span>
            <button 
              onClick={() => setIsPostCutoff(!isPostCutoff)}
              className="px-2 py-1 bg-white border rounded text-[10px] font-bold text-slate-700"
            >
              {isPostCutoff ? 'Switch to Pre-Cutoff' : 'Switch to Post-Cutoff'}
            </button>
          </div>

          {/* Cards container */}
          {!isPostCutoff ? (
            <div className="space-y-3">
              {/* Breakfast */}
              <Card className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">Breakfast</p>
                  <p className="text-xs text-slate-400 mt-0.5">Idli, Vada, Sambar, Chutney</p>
                  <p className="text-[10px] text-[#1D9E75] font-semibold mt-1">Included in Rent</p>
                </div>
                <button 
                  onClick={() => setMeals({ ...meals, breakfast: !meals.breakfast })}
                  className={`w-14 h-8 rounded-full transition-all relative p-1 ${meals.breakfast ? 'bg-[#1D9E75]' : 'bg-slate-200'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-all shadow-sm ${meals.breakfast ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </Card>

              {/* Lunch */}
              <Card className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">Lunch</p>
                  <p className="text-xs text-slate-400 mt-0.5">Rice, Dal, Potato Roast, Papad</p>
                  <p className="text-[10px] text-[#1D9E75] font-semibold mt-1">Included in Rent</p>
                </div>
                <button 
                  onClick={() => setMeals({ ...meals, lunch: !meals.lunch })}
                  className={`w-14 h-8 rounded-full transition-all relative p-1 ${meals.lunch ? 'bg-[#1D9E75]' : 'bg-slate-200'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-all shadow-sm ${meals.lunch ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </Card>

              {/* Dinner */}
              <Card className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">Dinner</p>
                  <p className="text-xs text-slate-400 mt-0.5">Chapati, Paneer Butter Masala, Salad</p>
                  <p className="text-[10px] text-[#1D9E75] font-semibold mt-1">Included in Rent</p>
                </div>
                <button 
                  onClick={() => setMeals({ ...meals, dinner: !meals.dinner })}
                  className={`w-14 h-8 rounded-full transition-all relative p-1 ${meals.dinner ? 'bg-[#1D9E75]' : 'bg-slate-200'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-all shadow-sm absolute ${meals.dinner ? 'right-1' : 'left-1'}`} />
                </button>
              </Card>

              <Button className="w-full h-11 mt-4" style={{ background: '#1D9E75' }} onClick={() => alert('Booking Saved!')}>
                Confirm Booking
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Card className="p-5 border-2 border-teal-500 bg-[#E1F5EE]/40 text-center space-y-2">
                <p className="font-bold text-[#085041] text-base">Tomorrow's Meals Booked</p>
                <div className="flex justify-center gap-4 py-2">
                  <span className="text-xs font-semibold text-slate-700 bg-white px-3 py-1 rounded-full border">
                    {meals.breakfast ? '✓ Breakfast' : '✗ Breakfast'}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 bg-white px-3 py-1 rounded-full border">
                    {meals.lunch ? '✓ Lunch' : '✗ Lunch'}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 bg-white px-3 py-1 rounded-full border">
                    {meals.dinner ? '✓ Dinner' : '✗ Dinner'}
                  </span>
                </div>
                <p className="text-[10px] text-[#085041]/80">Booking closed at 9:00 PM. Opens again tomorrow at 6:00 AM.</p>
              </Card>

              <Card className="p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Today's Menu Details</p>
                <div className="space-y-2.5 text-xs">
                  <p><strong>Breakfast:</strong> Poha, Sambar · Served</p>
                  <p><strong>Lunch:</strong> Rice, Dal, Curd · Served</p>
                  <p><strong>Dinner:</strong> Chapati, Mix Veg · 7:00 PM onwards</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Past 3 Days Bookings</p>
          {history.map((day, idx) => (
            <Card key={idx} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">{day.date}</p>
                <div className="flex gap-2 mt-1.5 text-[10px] text-slate-500">
                  <span>B: {day.breakfast ? '✓' : '✗'}</span>
                  <span>L: {day.lunch ? '✓' : '✗'}</span>
                  <span>D: {day.dinner ? '✓' : '✗'}</span>
                </div>
              </div>
              <Badge style={{
                background: day.status === 'Served' ? '#E1F5EE' : '#FCEBEB',
                color: day.status === 'Served' ? '#085041' : '#791F1F'
              }}>
                {day.status}
              </Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
