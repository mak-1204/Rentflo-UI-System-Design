import { useState, useEffect } from 'react'; import { Download, MessageSquare, Phone, Check, RefreshCw, Send, HelpCircle } from 'lucide-react'; import { Card } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';
import { Input } from '@rentflo/ui';

interface Lead {
  name: string;
  phone: string;
  room: string;
  moveIn: string;
  source: string;
  received: string;
  status: 'Scheduled visit' | 'Called' | 'Joined the PG' | 'Joined another PG' | 'Not interested';
}

export function OwnerWebLeads({ initialLeads }: { initialLeads?: Lead[] } = {}) {
  const [notif, setNotif] = useState<string | null>(null);

  // Leads list in state (loaded from localStorage if exists)
  const [leads, setLeads] = useState<Lead[]>(() => {
    if (initialLeads && initialLeads.length > 0) return initialLeads;
    const saved = typeof window !== 'undefined' ? localStorage.getItem('rentflo_leads_list') : null;
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { name: 'Rohan Sharma', phone: '+91 90123 45678', room: 'Single Occupancy', moveIn: '15 Jun 2026', source: 'Website', received: '1 day ago', status: 'Scheduled visit' },
      { name: 'Deepika K.', phone: '+91 98765 00112', room: 'Double Occupancy', moveIn: '01 Jul 2026', source: 'Website', received: '2 days ago', status: 'Called' },
      { name: 'Arun Prasath', phone: '+91 99887 76655', room: 'Single Occupancy', moveIn: '10 Jun 2026', source: 'Direct Reference', received: '3 days ago', status: 'Joined the PG' },
      { name: 'Megha Sen', phone: '+91 91234 88776', room: 'Triple Occupancy', moveIn: '20 Jun 2026', source: 'Website', received: '4 days ago', status: 'Not interested' },
    ];
  });

  // Save leads to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rentflo_leads_list', JSON.stringify(leads));
    }
  }, [leads]);

  // Lead URL Generator states
  const [inputPhone, setInputPhone] = useState('');
  const [inputName, setInputName] = useState('');
  const [selectedRoomInterest, setSelectedRoomInterest] = useState('Single Occupancy');
  const [landmark, setLandmark] = useState('Koramangala 4th Block, near Sony World Signal');
  
  // Custom message state
  const ownerName = 'Rajan Kumar';
  const pgName = 'Sunrise PG';
  const portfolioLink = typeof window !== 'undefined' ? `${window.location.origin}/portfolio/sunrise-pg/explore` : '';
  
  const generatePrefilledMessage = (name: string) => {
    return `Hello ${name || 'there'},\n\nThis is ${ownerName} from ${pgName}. Thank you for your interest! We are located at ${landmark}.\n\nYou can explore our PG details, interactive rooms layout, and amenities at our website:\n${portfolioLink}\n\n*Note*: Please put your office location in the map section on our website to see rooms closest to your office!\n\nLet me know if you would like to schedule a visit.`;
  };

  const [messageText, setMessageText] = useState(generatePrefilledMessage(''));

  // Update message preview when name or landmark changes
  useEffect(() => {
    setMessageText(generatePrefilledMessage(inputName));
  }, [inputName, landmark, portfolioLink]);

  const triggerToast = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPhone) {
      triggerToast('Please enter a phone number!');
      return;
    }

    // Clean phone number for WhatsApp api (digits only, prefix country code if needed)
    let formattedPhone = inputPhone.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone; // default Indian code
    }

    // Generate WhatsApp link
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(messageText)}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
    triggerToast(`Redirecting to WhatsApp for ${inputName || 'Lead'}...`);

    // Proactively add to leads list if not already there
    const phoneWithPrefix = inputPhone.startsWith('+') ? inputPhone : `+91 ${inputPhone}`;
    const exists = leads.some(l => l.phone === phoneWithPrefix || l.phone.replace(/\s/g,'') === inputPhone.replace(/\s/g,''));
    
    if (!exists) {
      const newLead: Lead = {
        name: inputName || 'Unnamed Prospect',
        phone: phoneWithPrefix,
        room: selectedRoomInterest,
        moveIn: 'Flexible',
        source: 'WhatsApp Generator',
        received: 'Just now',
        status: 'Called'
      };
      setLeads(prev => [newLead, ...prev]);
    }

    // Reset generator fields
    setInputPhone('');
    setInputName('');
  };

  const handleStatusChange = (index: number, newStatus: any) => {
    setLeads(prev => prev.map((l, i) => i === index ? { ...l, status: newStatus } : l));
    triggerToast(`Lead status updated to: ${newStatus}`);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto relative text-left">
      {/* Toast */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-[#111827] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold z-50 animate-bounce">
          <Check className="w-4 h-4 text-[#1D9E75]" /> {notif}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Leads & Invite Management</h1>
          <p className="text-slate-500 mt-1">Generate WhatsApp portfolio invites and track prospective tenant statuses in real-time</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap" onClick={() => triggerToast('CSV Export triggered!')}>
          <Download className="w-4 h-4" /> Export Leads CSV
        </Button>
      </div>

      {/* TOP HALF: WHATSAPP INVITE GENERATOR */}
      <Card className="p-6 border border-slate-200">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Send className="w-5 h-5 text-[#1D9E75]" /> Generate & Share Portfolio Link via WhatsApp
        </h2>
        
        <form onSubmit={handleGenerateLink} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 lg:col-span-1">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Lead Phone Number (with Country Code)</label>
              <Input
                type="text"
                placeholder="e.g. 9876543210"
                value={inputPhone}
                onChange={(e) => setInputPhone(e.target.value)}
                required
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Enter 10 digit number or prefix with country code (e.g. 919876543210)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Lead Name (Optional)</label>
              <Input
                type="text"
                placeholder="e.g. Rohan Sharma"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Room Interest</label>
              <select
                value={selectedRoomInterest}
                onChange={(e) => setSelectedRoomInterest(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] bg-white text-sm"
              >
                <option value="Single Occupancy">Single Occupancy</option>
                <option value="Double Occupancy">Double Sharing</option>
                <option value="Triple Occupancy">Triple Sharing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">PG Nearby Location / Landmarks</label>
              <Input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Koramangala, near Sony World Signal"
              />
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center justify-between">
                <span>Message Preview</span>
                <span className="text-[10px] text-slate-400">Includes landmark, office location note & portfolio URL</span>
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={8}
                className="w-full p-3 border rounded-lg bg-slate-50 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#1D9E75] leading-relaxed"
              />
            </div>

            <Button
              type="submit"
              style={{ background: '#25D366', color: '#FFFFFF' }}
              className="w-full hover:opacity-90 font-bold uppercase tracking-wider text-xs h-11 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Generate Link & Send WhatsApp Invite
            </Button>
          </div>
        </form>
      </Card>

      {/* BOTTOM HALF: LEADS TABLE & STATUS DROPDOWNS */}
      <Card className="overflow-hidden border border-slate-200">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">Prospect Directory ({leads.length} Active Leads)</h3>
          <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200">Database Sync Active</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Lead Details</th>
                <th className="px-6 py-4">Room Preference</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Received</th>
                <th className="px-6 py-4">Status Dropdown</th>
                <th className="px-6 py-4 text-right">Direct Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm">
              {leads.map((lead, idx) => (
                <tr key={idx} className="hover:bg-slate-50/55 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800 block">{lead.name}</span>
                    <span className="text-xs text-slate-400 font-mono">{lead.phone}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-slate-50">{lead.room}</Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{lead.source}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{lead.received}</td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(idx, e.target.value)}
                      className="px-2 py-1.5 border rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75] bg-white cursor-pointer"
                      style={{
                        color: 
                          lead.status === 'Joined the PG' ? '#085041' :
                          lead.status === 'Joined another PG' ? '#791F1F' :
                          lead.status === 'Not interested' ? '#6B7280' :
                          lead.status === 'Scheduled visit' ? '#854F0B' : '#0C447C',
                        backgroundColor:
                          lead.status === 'Joined the PG' ? '#E1F5EE' :
                          lead.status === 'Joined another PG' ? '#FCEBEB' :
                          lead.status === 'Not interested' ? '#F3F4F6' :
                          lead.status === 'Scheduled visit' ? '#FAEEDA' : '#E6F1FB',
                      }}
                    >
                      <option value="Called">Called / Follow Up</option>
                      <option value="Scheduled visit">Scheduled Visit</option>
                      <option value="Joined the PG">Joined the PG ✓</option>
                      <option value="Joined another PG">Joined another PG ✗</option>
                      <option value="Not interested">Not Interested</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-[#1D9E75] hover:bg-teal-50 text-xs"
                        onClick={() => {
                          const whatsappUrl = `https://api.whatsapp.com/send?phone=${lead.phone.replace(/\D/g, '')}&text=${encodeURIComponent(`Hi ${lead.name}, checking in regarding your visit schedule!`)}`;
                          window.open(whatsappUrl, '_blank');
                        }}
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1" /> WhatsApp
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => triggerToast(`Dialing phone ${lead.phone}...`)}
                      >
                        <Phone className="w-3 h-3 mr-1" /> Call
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
