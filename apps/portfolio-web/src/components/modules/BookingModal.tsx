'use client';

import { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pgName?: string;
  defaultDate?: 'today' | 'tomorrow' | '';
}

export function BookingModal({
  isOpen,
  onClose,
  pgName = 'Sunrise PG',
  defaultDate = '',
}: BookingModalProps) {
  const [dateType, setDateType] = useState<'today' | 'tomorrow' | 'custom'>(
    defaultDate === 'today' ? 'today' : defaultDate === 'tomorrow' ? 'tomorrow' : 'custom'
  );
  
  const getFormattedDate = (type: 'today' | 'tomorrow' | 'custom', customVal: string) => {
    const d = new Date();
    if (type === 'today') {
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    if (type === 'tomorrow') {
      d.setDate(d.getDate() + 1);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    if (customVal) {
      return new Date(customVal).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return 'Selected Date';
  };

  const [customDate, setCustomDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingType, setBookingType] = useState<'tour' | 'callback'>('tour');

  if (!isOpen) return null;

  const timeSlots = [
    '09:00 AM',
    '11:00 AM',
    '02:00 PM',
    '04:00 PM',
    '06:00 PM',
  ];

  const handleBook = () => {
    setIsBooked(true);
  };

  const formattedBookingDate = getFormattedDate(dateType, customDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-navy-deep rounded-3xl p-6 shadow-2xl overflow-hidden text-left flex flex-col justify-between min-h-[400px] animate-in zoom-in-95 duration-200">
        
        {/* Close button */}
        {!isBooked && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {!isBooked ? (
          /* Step 1: Schedule Selection */
          <div className="space-y-6 flex-grow flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-navy-deep dark:text-white font-heading">
                  Schedule Your Tour
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose a convenient time to visit {pgName}
                </p>
              </div>

              {/* Date selection */}
              <div className="space-y-2.5">
                <label className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-widest">
                  Select Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDateType('today')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer bg-transparent ${
                      dateType === 'today'
                        ? 'border-stayflow-teal text-stayflow-teal bg-stayflow-teal/5'
                        : 'border-slate-200 text-slate-650 hover:bg-slate-50 dark:border-outline-variant/30 dark:text-slate-350'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateType('tomorrow')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer bg-transparent ${
                      dateType === 'tomorrow'
                        ? 'border-stayflow-teal text-stayflow-teal bg-stayflow-teal/5'
                        : 'border-slate-200 text-slate-650 hover:bg-slate-50 dark:border-outline-variant/30 dark:text-slate-350'
                    }`}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateType('custom')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer bg-transparent ${
                      dateType === 'custom'
                        ? 'border-stayflow-teal text-stayflow-teal bg-stayflow-teal/5'
                        : 'border-slate-200 text-slate-650 hover:bg-slate-50 dark:border-outline-variant/30 dark:text-slate-350'
                    }`}
                  >
                    Other Date
                  </button>
                </div>

                {dateType === 'custom' && (
                  <div className="relative mt-2">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full text-xs font-semibold p-3 border border-slate-200 dark:border-outline-variant/30 rounded-xl bg-transparent text-slate-800 dark:text-white focus:outline-none focus:border-stayflow-teal"
                    />
                  </div>
                )}
              </div>

              {/* Time Slots */}
              <div className="space-y-2.5">
                <label className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-widest">
                  Select Time Slot
                </label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer bg-transparent ${
                        selectedTime === time
                          ? 'border-stayflow-teal text-stayflow-teal bg-stayflow-teal/5'
                          : 'border-slate-200 text-slate-650 hover:bg-slate-50 dark:border-outline-variant/30 dark:text-slate-350'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleBook}
              className="w-full bg-stayflow-teal hover:bg-stayflow-teal-dark text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 text-sm cursor-pointer border-none mt-6"
            >
              <Calendar className="w-4 h-4" />
              Confirm Booking
            </button>
          </div>
        ) : (
          /* Step 2: Confirmation Screen */
          <div className="space-y-6 flex-grow flex flex-col justify-center items-center text-center py-6 animate-in zoom-in-95 duration-300">
            <CheckCircle2 className="w-16 h-16 text-teal-500 animate-bounce" />
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-navy-deep dark:text-white font-heading">
                Tour Scheduled!
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Your physical tour at {pgName} has been successfully scheduled.
              </p>
            </div>

            <div className="w-full bg-slate-50 dark:bg-navy-deep/40 border border-slate-100 dark:border-outline-variant/20 rounded-2xl p-4 space-y-3.5 text-xs text-slate-700 dark:text-slate-350 text-left">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-stayflow-teal" />
                <span className="font-bold">{formattedBookingDate}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-stayflow-teal" />
                <span className="font-bold">{selectedTime}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              * A stayfloww manager will call you shortly to coordinate the visit details.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-navy-deep dark:bg-white dark:text-navy-deep text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-all text-xs uppercase tracking-wider cursor-pointer border-none mt-4"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
