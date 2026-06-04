'use client';

import { useState, useTransition, useCallback } from 'react';
import { Share2, Clock, QrCode, Check, Loader2 } from 'lucide-react';
import { Button } from '@stayflo/ui';

import { BookingsLog } from './_components/BookingsLog';
import { SavingsMetrics } from './_components/SavingsMetrics';
import { UnbookedReminders } from './_components/UnbookedReminders';
import { ScannerModal } from './_components/ScannerModal';
import { fetchFoodBookings, markMealServed } from './actions';
import type { FoodBooking } from './types';

interface FoodPageClientProps {
  initialBookings: FoodBooking[];
}

// Helper to get local date string (YYYY-MM-DD)
export function getRelativeDateString(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function FoodPageClient({ initialBookings }: FoodPageClientProps) {
  const [selectedDay, setSelectedDay] = useState<'Yesterday' | 'Today' | 'Tomorrow'>('Tomorrow');
  const [bookings, setBookings] = useState<FoodBooking[]>(initialBookings);
  const [notif, setNotif] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isPending, startTransition] = useTransition();

  const triggerToast = useCallback((msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  }, []);

  // Compute date string based on selection
  const getDateForSelection = (day: 'Yesterday' | 'Today' | 'Tomorrow') => {
    if (day === 'Yesterday') return getRelativeDateString(-1);
    if (day === 'Today') return getRelativeDateString(0);
    return getRelativeDateString(1);
  };

  const handleDayChange = (day: 'Yesterday' | 'Today' | 'Tomorrow') => {
    setSelectedDay(day);
    const dateStr = getDateForSelection(day);
    
    startTransition(async () => {
      const data = await fetchFoodBookings(dateStr);
      setBookings(data);
    });
  };

  // Sourcing counts based on bookings state
  const mealCounts = {
    breakfast: bookings.filter((b) => b.breakfast).length,
    lunch: bookings.filter((b) => b.lunch).length,
    dinner: bookings.filter((b) => b.dinner).length,
  };

  const unbookedTenants = bookings.filter((b) => b.status === 'Not Booked');

  const shareWithCook = () => {
    const totalPlates = mealCounts.breakfast + mealCounts.lunch + mealCounts.dinner;
    const summaryMsg = `Sunrise PG Meal Counts for ${selectedDay} (${getDateForSelection(selectedDay)}):\n- Breakfast: ${mealCounts.breakfast}\n- Lunch: ${mealCounts.lunch}\n- Dinner: ${mealCounts.dinner}\nTotal active plates: ${totalPlates}\n\nGenerated via Stayflo Food Waste Control Panel.`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=+919012345678&text=${encodeURIComponent(summaryMsg)}`;
    window.open(whatsappUrl, '_blank');
    triggerToast('Shared meal counts with Cook via WhatsApp API!');
  };

  const handleSendReminder = (name: string, phone: string) => {
    const msg = `Hi ${name}, this is Sunrise PG. Please book your Breakfast, Lunch, and Dinner for tomorrow on the Stayflo app before the 6:00 PM cutoff to ensure your meals are cooked. Thank you!`;
    const cleanPhone = phone.replace(/\D/g, '') || '919012345678';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    triggerToast(`Sent unbooked meal alert to ${name}!`);
  };

  const handleSendAllReminders = () => {
    triggerToast(`Sent WhatsApp food cutoff alerts to ${unbookedTenants.length} unbooked residents!`);
  };

  const handleServeMeal = async (tenantId: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const dateStr = getDateForSelection(selectedDay);
    const result = await markMealServed(tenantId, dateStr, mealType);
    
    if (result.success) {
      // Instantly update UI booking state
      setBookings((prev) =>
        prev.map((b) => {
          if (b.tenant_id === tenantId) {
            return {
              ...b,
              breakfast: mealType === 'breakfast' ? true : b.breakfast,
              lunch: mealType === 'lunch' ? true : b.lunch,
              dinner: mealType === 'dinner' ? true : b.dinner,
              [`${mealType}_served`]: true,
              status: 'Booked',
            };
          }
          return b;
        })
      );
      triggerToast(`Marked ${mealType} as served!`);
    } else {
      triggerToast(`Failed to serve: ${result.error}`);
    }
  };

  return (
    <div
      className="p-8 space-y-8 max-w-7xl mx-auto relative text-left min-h-screen"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Toast Notification */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold z-50 animate-in fade-in duration-300">
          <Check className="w-4 h-4 text-[#14b8a6]" /> {notif}
        </div>
      )}

      {/* Syncing Overlay */}
      {isPending && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs text-slate-600 font-semibold">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-500" /> Fetching bookings...
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Food Waste Reduction
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            Keep track of daily meal bookings, cutoff lists, cook updates, and menus to save money
          </p>
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

      {/* QR Scanner Modal */}
      {showScanner && (
        <ScannerModal
          bookings={bookings}
          onClose={() => setShowScanner(false)}
          onServeMeal={handleServeMeal}
        />
      )}

      {/* Date Toggle & Timer */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2">
          {(['Yesterday', 'Today', 'Tomorrow'] as const).map((day) => (
            <button
              key={day}
              onClick={() => handleDayChange(day)}
              className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer"
              style={{
                background: selectedDay === day ? '#f0fdfa' : '#FFFFFF',
                color: selectedDay === day ? '#14b8a6' : '#6B7280',
                borderColor: selectedDay === day ? 'rgba(20,184,166,0.2)' : '#E5E7EB',
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
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Breakfast plates
            </p>
            <p
              className="text-2xl font-extrabold text-slate-900 mt-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {mealCounts.breakfast} booked
            </p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">8:00 - 9:00 AM · Cutoff passed</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100/30 text-[#14b8a6] flex items-center justify-center text-lg font-bold">
            B
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Lunch plates</p>
            <p
              className="text-2xl font-extrabold text-slate-900 mt-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {mealCounts.lunch} booked
            </p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">12:00 - 1:00 PM · Cutoff passed</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100/30 text-amber-700 flex items-center justify-center text-lg font-bold">
            L
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              Dinner plates
            </p>
            <p
              className="text-2xl font-extrabold text-slate-900 mt-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {mealCounts.dinner} booked
            </p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">7:00 - 8:00 PM · Cutoff passed</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100/30 text-[#14b8a6] flex items-center justify-center text-lg font-bold">
            D
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <BookingsLog bookings={bookings} selectedDay={selectedDay} />
        </div>
        <div className="space-y-6">
          <SavingsMetrics totalTenants={bookings.length} unbookedCount={unbookedTenants.length} />
          <UnbookedReminders
            unbookedTenants={unbookedTenants.map((u) => ({
              name: u.name,
              room: u.room,
              phone: u.phone,
            }))}
            onAlertIndividual={handleSendReminder}
            onAlertAll={handleSendAllReminders}
          />
        </div>
      </div>
    </div>
  );
}
