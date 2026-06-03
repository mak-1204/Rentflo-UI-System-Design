'use client';

import { useState, useTransition } from 'react';
import { Send, MessageSquare, Loader2, Link2 } from 'lucide-react';
import { Button, Input, Card, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@rentflo/ui';
import { createLeadAction } from '../actions';

export function WhatsAppForm() {
  const [isPending, startTransition] = useTransition();

  // Local state only for the live text preview
  const [inputPhone, setInputPhone] = useState('');
  const [inputName, setInputName] = useState('');
  const [selectedRoomInterest, setSelectedRoomInterest] = useState('Single Occupancy');
  const [landmark, setLandmark] = useState('Koramangala 4th Block, near Sony World Signal');

  const ownerName = 'Rajan Kumar';
  const pgName = 'Sunrise PG';
  const portfolioLink = typeof window !== 'undefined' ? `${window.location.origin}/portfolio/sunrise-pg/explore` : '';

  const messageText = `Hello ${inputName || 'there'},\n\nThis is ${ownerName} from ${pgName}. Thank you for your interest! We are located at ${landmark}.\n\nYou can explore our PG details, interactive rooms layout, and amenities at our website:\n${portfolioLink}\n\n*Note*: Please put your office location in the map section on our website to see rooms closest to your office!\n\nLet me know if you would like to schedule a visit.`;

  const handleAction = (formData: FormData) => {
    // 1. Open WhatsApp in new tab immediately
    let formattedPhone = inputPhone.replace(/\D/g, '');
    if (formattedPhone.length === 10) formattedPhone = '91' + formattedPhone;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');

    // 2. Execute Server Action in background
    startTransition(async () => {
      const result = await createLeadAction(formData);
      if (result.error) {
        alert('Failed to save lead to database: ' + result.error);
      } else {
        // Reset local form state on success
        setInputPhone('');
        setInputName('');
      }
    });
  };

  return (
    <Card className="p-6 md:p-8 border-none bg-gradient-to-br from-white to-slate-50 shadow-xl shadow-slate-200/40 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shadow-inner border border-teal-100">
          <Send className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Generate Portfolio Link</h2>
          <p className="text-xs text-slate-500 font-medium">Send a beautifully formatted WhatsApp invite to your prospect.</p>
        </div>
      </div>
      
      <form action={handleAction} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="space-y-5 lg:col-span-5">
          <div className="group">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Lead Phone Number</label>
            <Input
              name="phone"
              type="text"
              placeholder="e.g. 9876543210"
              value={inputPhone}
              onChange={(e) => setInputPhone(e.target.value)}
              required
              disabled={isPending}
              className="w-full bg-white shadow-sm border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 transition-all rounded-xl"
            />
          </div>

          <div className="group">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Lead Name (Optional)</label>
            <Input
              name="name"
              type="text"
              placeholder="e.g. Rohan Sharma"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              disabled={isPending}
              className="w-full bg-white shadow-sm border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 transition-all rounded-xl"
            />
          </div>

          <div className="group">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Room Interest(Optional)</label>
            <Select
              name="room"
              value={selectedRoomInterest}
              onValueChange={setSelectedRoomInterest}
              disabled={isPending}
            >
              <SelectTrigger className="w-full bg-white h-11 border-slate-200 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl shadow-sm hover:border-slate-300 transition-all">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl shadow-xl border-slate-100">
                <SelectItem value="Single Occupancy" className="focus:bg-teal-50 focus:text-teal-900 cursor-pointer text-sm font-medium">Single Occupancy</SelectItem>
                <SelectItem value="Double Occupancy" className="focus:bg-teal-50 focus:text-teal-900 cursor-pointer text-sm font-medium">Double Sharing</SelectItem>
                <SelectItem value="Triple Occupancy" className="focus:bg-teal-50 focus:text-teal-900 cursor-pointer text-sm font-medium">Triple Sharing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="group">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">PG Nearby Landmark</label>
            <Input
              name="landmark"
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Koramangala, near Sony World Signal"
              disabled={isPending}
              className="w-full bg-white shadow-sm border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 transition-all rounded-xl"
            />
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="flex-1 bg-slate-800 rounded-2xl p-1 shadow-inner relative overflow-hidden">
            {/* Minimalist Phone Mockup Vibe */}
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between rounded-t-xl border-b border-slate-700/50">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Live Message Preview</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700 font-medium tracking-wide flex items-center gap-1"><Link2 className="w-3 h-3" /> Auto-generates Portfolio Link</span>
            </div>
            <textarea
              readOnly
              value={messageText}
              className="w-full h-[calc(100%-45px)] p-5 bg-transparent text-slate-300 font-mono text-xs focus:outline-none leading-relaxed resize-none selection:bg-teal-500/30 custom-scrollbar"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || !inputPhone}
            style={{ backgroundColor: '#25D366' }}
            className={`w-full hover:bg-[#20bd5a] text-white font-bold uppercase tracking-widest text-xs h-14 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 transition-all duration-300 ${isPending ? 'opacity-80 scale-[0.98]' : 'hover:-translate-y-0.5 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:hover:translate-y-0'}`}
          >
            {isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> SAVING LEAD...</>
            ) : (
              <><MessageSquare className="w-5 h-5" /> Generate Link & Send WhatsApp</>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
