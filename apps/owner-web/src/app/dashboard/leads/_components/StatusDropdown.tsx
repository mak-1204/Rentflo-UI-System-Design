'use client';

import { useTransition } from 'react';
import { updateLeadStatus } from '../actions';
import { Loader2 } from 'lucide-react';

export function StatusDropdown({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, newStatus);
      if (result.error) {
        alert('Failed to update status: ' + result.error);
      }
    });
  };

  return (
    <div className="relative inline-block min-w-[120px]">
      <select
        value={currentStatus || 'new'}
        onChange={handleChange}
        disabled={isPending}
        className={`w-full appearance-none pl-3 pr-8 py-2 border border-transparent rounded-lg text-xs font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer transition-all duration-300 ease-out shadow-sm hover:shadow ${isPending ? 'opacity-50 scale-[0.98]' : 'opacity-100 hover:scale-[1.01]'}`}
        style={{
          color:
            currentStatus === 'booked' ? '#047857' :
              currentStatus === 'lost' ? '#B91C1C' :
                currentStatus === 'new' ? '#475569' :
                  currentStatus === 'site_visit' ? '#B45309' : '#0369A1',
          backgroundColor:
            currentStatus === 'booked' ? '#D1FAE5' :
              currentStatus === 'lost' ? '#FEE2E2' :
                currentStatus === 'new' ? '#F1F5F9' :
                  currentStatus === 'site_visit' ? '#FEF3C7' : '#E0F2FE',
        }}
      >
        <option value="new">New Lead</option>
        <option value="contacted">Contacted</option>
        <option value="site_visit">Site Visit</option>
        <option value="booked">Booked ✓</option>
        <option value="lost">Lost ✗</option>
      </select>

      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin opacity-60" style={{ color: 'inherit' }} />
        ) : (
          <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
        )}
      </div>
    </div>
  );
}
