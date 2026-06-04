import { useState, useEffect } from 'react'; import { Check, AlertTriangle, Megaphone, Trash2, Calendar, Sparkles, Clock, CheckCircle2, User, Image as ImageIcon, Plus, MapPin } from 'lucide-react'; import { Card } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';
import { Button } from '@stayflo/ui';
import { Input } from '@stayflo/ui';

interface Complaint {
  id: number;
  room: string;
  tenantName: string;
  type: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

interface Announcement {
  id: number;
  title: string;
  category: 'Maintenance' | 'Power Cut' | 'Water Shortage' | 'General';
  message: string;
  date: string;
}

interface CleaningTask {
  room: string;
  floor: string;
  lastCleaned: string;
  nextScheduled: string;
  status: 'Cleaned' | 'Pending' | 'Requested';
  assignedTo: string;
}

export function OwnerWebOperations({ initialComplaints }: { initialComplaints?: Complaint[] } = {}) {
  const [activeTab, setActiveTab] = useState<'complaints' | 'announcements' | 'cleaning' | 'location'>('complaints');
  const [notif, setNotif] = useState<string | null>(null);

  // Complaints state
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    if (initialComplaints && initialComplaints.length > 0) return initialComplaints;
    return [
    {
      id: 1,
      room: 'Room 4',
      tenantName: 'Amit Kumar',
      type: 'Plumbing',
      description: 'The tap in the washroom is dripping continuously, causing water accumulation.',
      mediaUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      date: '31 May 2026',
      status: 'Open',
    },
    {
      id: 2,
      room: 'Room 8',
      tenantName: 'Vijay Nair',
      type: 'Electrical',
      description: 'Air conditioner is making a loud rattling sound and cooling is insufficient.',
      mediaUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      date: '30 May 2026',
      status: 'In Progress',
    },
    {
      id: 3,
      room: 'Room 2',
      tenantName: 'Sanjay Ramaswamy',
      type: 'WiFi / Internet',
      description: 'Internet router on the Ground Floor keeps resetting every 10 minutes.',
      mediaUrl: '',
      mediaType: 'image',
      date: '28 May 2026',
      status: 'Resolved',
    }
    ];
  });

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: 'Water Supply Interruption',
      category: 'Water Shortage',
      message: 'Municipal water maintenance scheduled for tomorrow morning. Water tanker will arrive at 10 AM. Please conserve water.',
      date: '31 May 2026'
    },
    {
      id: 2,
      title: 'Monthly Pest Control Treatment',
      category: 'Maintenance',
      message: 'Pest control service is scheduled for all floors on Sunday from 10 AM to 2 PM. Please cooperate by keeping your doors unlocked.',
      date: '28 May 2026'
    }
  ]);

  // Cleaning Tasks state
  const [cleaningTasks, setCleaningTasks] = useState<CleaningTask[]>([
    { room: 'Room 4', floor: '1st Floor', lastCleaned: '29 May 2026', nextScheduled: '02 Jun 2026', status: 'Cleaned', assignedTo: 'Ramesh Singh' },
    { room: 'Room 2', floor: 'Ground Floor', lastCleaned: '28 May 2026', nextScheduled: '01 Jun 2026', status: 'Pending', assignedTo: 'Ramesh Singh' },
    { room: 'Room 8', floor: '2nd Floor', lastCleaned: '30 May 2026', nextScheduled: '03 Jun 2026', status: 'Cleaned', assignedTo: 'Suresh K.' },
    { room: 'Room 5', floor: '1st Floor', lastCleaned: '27 May 2026', nextScheduled: '31 May 2026', status: 'Requested', assignedTo: 'Suresh K.' },
  ]);

  // Form states for new announcement
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Maintenance' | 'Power Cut' | 'Water Shortage' | 'General'>('General');
  const [newMessage, setNewMessage] = useState('');

  // Location Map Coords & Commute state
  const [mapCoords, setMapCoords] = useState({ lat: 12.9345, lng: 77.6269 });
  const [address, setAddress] = useState('No. 14, 5th Cross, Koramangala 4th Block, Bengaluru, 560034');
  const [commuteWalkTime, setCommuteWalkTime] = useState('5 mins');
  const [commuteBikeTime, setCommuteBikeTime] = useState('2 mins');
  const [commuteTransitTime, setCommuteTransitTime] = useState('300m away');
  const [commuteDestination, setCommuteDestination] = useState('Manyata Tech Park');

  // Load custom state from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('stayflo_builder_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.mapCoords) setMapCoords(parsed.mapCoords);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.commuteWalkTime) setCommuteWalkTime(parsed.commuteWalkTime);
        if (parsed.commuteBikeTime) setCommuteBikeTime(parsed.commuteBikeTime);
        if (parsed.commuteTransitTime) setCommuteTransitTime(parsed.commuteTransitTime);
        if (parsed.commuteDestination) setCommuteDestination(parsed.commuteDestination);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveStateToLocalStorage = (updates: any) => {
    const saved = localStorage.getItem('stayflo_builder_state');
    let currentState = {};
    if (saved) {
      try {
        currentState = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const merged = { ...currentState, ...updates };
    localStorage.setItem('stayflo_builder_state', JSON.stringify(merged));
    window.dispatchEvent(new Event('stayflo_website_update'));
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lat = +(12.9300 + (1 - y / rect.height) * 0.0100).toFixed(4);
    const lng = +(77.6200 + (x / rect.width) * 0.0150).toFixed(4);
    const newCoords = { lat, lng };
    setMapCoords(newCoords);
    saveStateToLocalStorage({ mapCoords: newCoords });
  };

  const triggerToast = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  const handleStatusChange = (complaintId: number, nextStatus: 'Open' | 'In Progress' | 'Resolved') => {
    setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status: nextStatus } : c));
    triggerToast(`Complaint status updated to ${nextStatus}!`);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;
    const fresh: Announcement = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      message: newMessage,
      date: 'Today'
    };
    setAnnouncements([fresh, ...announcements]);
    setNewTitle('');
    setNewMessage('');
    triggerToast('Broadcast sent successfully to all tenant mobile notifications!');
  };

  const handleMarkCleaned = (roomNum: string) => {
    setCleaningTasks(prev => prev.map(t => t.room === roomNum ? { ...t, status: 'Cleaned', lastCleaned: 'Today' } : t));
    triggerToast(`Room ${roomNum} marked as cleaned!`);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto relative min-h-screen">
      {/* Toast */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold z-50 border border-slate-800 animate-bounce">
          <Check className="w-4 h-4 text-[#14b8a6]" /> {notif}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading" style={{ fontFamily: 'var(--font-heading)' }}>Operations & Maintenance</h1>
        <p className="text-slate-500 text-sm mt-1">Manage tenant maintenance requests, broadcast announcements, and organize cleaning staff schedules</p>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200/80 mb-2 gap-2">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`pb-3 px-4 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all ${
            activeTab === 'complaints'
              ? 'border-[#14b8a6] text-[#14b8a6]'
              : 'border-transparent text-slate-400 hover:text-slate-900'
          }`}
        >
          Tenant Complaints ({complaints.filter(c => c.status !== 'Resolved').length})
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`pb-3 px-4 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all ${
            activeTab === 'announcements'
              ? 'border-[#14b8a6] text-[#14b8a6]'
              : 'border-transparent text-slate-400 hover:text-slate-900'
          }`}
        >
          Broadcasting & Announcements
        </button>
        <button
          onClick={() => setActiveTab('cleaning')}
          className={`pb-3 px-4 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all ${
            activeTab === 'cleaning'
              ? 'border-[#14b8a6] text-[#14b8a6]'
              : 'border-transparent text-slate-400 hover:text-slate-900'
          }`}
        >
          Cleaning Schedule
        </button>
        <button
          onClick={() => setActiveTab('location')}
          className={`pb-3 px-4 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all ${
            activeTab === 'location'
              ? 'border-[#14b8a6] text-[#14b8a6]'
              : 'border-transparent text-slate-400 hover:text-slate-900'
          }`}
        >
          PG Location & Commute
        </button>
      </div>

      {/* TAB 1: COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {complaints.map(c => (
              <Card key={c.id} className="p-8 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-955 text-base font-heading" style={{ fontFamily: 'var(--font-heading)' }}>{c.type}</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="bg-slate-50 text-slate-650 border border-slate-200/60 text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wide">{c.room}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        c.status === 'Open'
                          ? 'bg-rose-50 text-rose-600 border-rose-100/50'
                          : c.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-600 border-amber-100/50'
                          : 'bg-teal-50 text-teal-600 border-teal-100/50'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold">Raised by {c.tenantName} on {c.date}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs font-semibold h-9 px-3 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                      onClick={() => handleStatusChange(c.id, 'In Progress')}
                      disabled={c.status === 'In Progress' || c.status === 'Resolved'}
                    >
                      In Progress
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs font-bold uppercase tracking-widest h-9 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-white border-none shadow-sm disabled:opacity-50 transition-all duration-200"
                      onClick={() => handleStatusChange(c.id, 'Resolved')}
                      disabled={c.status === 'Resolved'}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">{c.description}</p>

                {c.mediaUrl && (
                  <div className="border border-slate-200/80 rounded-2xl overflow-hidden max-w-md bg-slate-50 relative group shadow-sm">
                    <img src={c.mediaUrl} alt="Complaint detail" className="w-full h-48 object-cover object-center transition-transform duration-350 group-hover:scale-105" />
                    <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-[9px] flex items-center gap-1.5 font-bold tracking-wider uppercase">
                      <ImageIcon className="w-3.5 h-3.5 text-teal-400" /> Attachment
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Quick Metrics */}
          <div className="space-y-6">
            <Card className="p-8 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl space-y-6">
              <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-heading">Operational Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                  <span className="text-slate-550 font-medium">Average Resolution Time</span>
                  <span className="font-bold text-slate-800 font-heading" style={{ fontFamily: 'var(--font-heading)' }}>4.2 Hours</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                  <span className="text-slate-550 font-medium">Resolution Rate (Weekly)</span>
                  <span className="font-bold text-teal-600 font-heading" style={{ fontFamily: 'var(--font-heading)' }}>94%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-550 font-medium">Open Tickets</span>
                  <span className="font-bold text-rose-500 font-heading" style={{ fontFamily: 'var(--font-heading)' }}>{complaints.filter(c => c.status === 'Open').length} pending</span>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-slate-900 text-white rounded-2xl space-y-6 border-none shadow-lg shadow-slate-900/10 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm font-heading tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Need a vendor?</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Stayflo Preferred Electricians & Plumbers</p>
                </div>
              </div>
              <Button className="w-full bg-white hover:bg-slate-100 text-slate-950 font-extrabold uppercase tracking-widest text-xs h-11 rounded-xl transition-all duration-200 mt-2 relative z-10 border-none shadow-md">
                Call Local Vendor
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Creator form */}
          <Card className="p-8 h-fit lg:col-span-1 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl space-y-6">
            <h3 className="text-base font-bold text-slate-905 flex items-center gap-2.5 font-heading" style={{ fontFamily: 'var(--font-heading)' }}>
              <Megaphone className="w-5 h-5 text-amber-500" /> New Broadcast
            </h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-5">
              <div className="group">
                <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Title</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lift maintenance service"
                  required
                  className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Category</label>
                <div className="relative">
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="General">General Notification</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Power Cut">Power Shutdown</option>
                    <option value="Water Shortage">Water shortage</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Message Description</label>
                <textarea
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Describe the maintenance, timing, and what tenants should prepare for..."
                  className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold p-4 rounded-xl transition-all shadow-inner resize-none leading-relaxed"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-extrabold uppercase tracking-widest text-xs h-11 rounded-xl shadow-lg shadow-teal-500/10 border-none cursor-pointer transition-all duration-200">
                Send to All Tenants
              </Button>
            </form>
          </Card>

          {/* Past Announcements Feed */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1 font-heading" style={{ fontFamily: 'var(--font-heading)' }}>Broadcast Log</h3>

            {announcements.map(ann => (
              <Card key={ann.id} className="p-8 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl flex items-start gap-5 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 border border-orange-100/30">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="font-bold text-slate-805 text-sm font-heading truncate" style={{ fontFamily: 'var(--font-heading)' }}>{ann.title}</h4>
                    <span className="text-[9px] bg-orange-50 text-orange-700 border border-orange-100/50 px-2 py-0.5 rounded-full font-bold tracking-wider uppercase">
                      {ann.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">{ann.message}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-350" /> Sent {ann.date}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLEANING SCHEDULE */}
      {activeTab === 'cleaning' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 font-heading" style={{ fontFamily: 'var(--font-heading)' }}>Cleaning Log & Schedule</h3>
            <span className="bg-teal-50 text-teal-800 border border-teal-100/50 text-[10px] px-3 py-1 rounded-full font-bold tracking-wider uppercase">
              Staff: Ramesh Singh & Suresh Kumar
            </span>
          </div>

          <Card className="overflow-hidden bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Room / Area</th>
                    <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Floor</th>
                    <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Last Cleaned</th>
                    <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Next Scheduled</th>
                    <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Assigned Hand</th>
                    <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {cleaningTasks.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 font-bold text-slate-800 font-heading text-sm" style={{ fontFamily: 'var(--font-heading)' }}>{t.room}</td>
                      <td className="px-8 py-5 text-slate-500 font-medium">{t.floor}</td>
                      <td className="px-8 py-5 text-slate-400 font-semibold">{t.lastCleaned}</td>
                      <td className="px-8 py-5 text-slate-400 font-semibold">{t.nextScheduled}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                          <User className="w-3.5 h-3.5 text-slate-400" /> {t.assignedTo}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          t.status === 'Cleaned'
                            ? 'bg-teal-50 text-teal-650 border-teal-100/50'
                            : t.status === 'Pending'
                            ? 'bg-amber-50 text-amber-650 border-amber-100/50'
                            : 'bg-rose-50 text-rose-650 border-rose-100/50'
                        }`}>
                          {t.status === 'Requested' ? 'Tenant Requested ⚡' : t.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {t.status !== 'Cleaned' ? (
                          <Button
                            size="sm"
                            className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold uppercase tracking-wider h-8 px-3 rounded-xl border-none cursor-pointer transition-colors shadow-sm"
                            onClick={() => handleMarkCleaned(t.room)}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Cleaned
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold tracking-wider uppercase italic">Done ✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: PG LOCATION */}
      {activeTab === 'location' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-8 lg:col-span-2 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading" style={{ fontFamily: 'var(--font-heading)' }}>PG Map Location</h3>
              <p className="text-xs text-slate-450 mt-1 font-medium">Click anywhere on the map to drop the PG coordinate pin. Sunrise PG location will update instantly.</p>
            </div>

            <div 
              className="relative h-[420px] bg-slate-50 border border-slate-200/85 rounded-2xl overflow-hidden cursor-crosshair flex items-center justify-center shadow-inner"
              onClick={handleMapClick}
            >
              <svg className="absolute inset-0 w-full h-full text-slate-200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <line x1="0" y1="150" x2="800" y2="150" stroke="#e2e8f0" strokeWidth="24" />
                <line x1="300" y1="0" x2="300" y2="500" stroke="#e2e8f0" strokeWidth="24" />
              </svg>

              <div 
                className="absolute pointer-events-none flex flex-col items-center -mt-8"
                style={{
                  left: `${((mapCoords.lng - 77.6200) / 0.0150) * 100}%`,
                  top: `${(1 - (mapCoords.lat - 12.9300) / 0.0100) * 100}%`,
                }}
              >
                <MapPin className="w-8 h-8 text-rose-500 fill-current animate-bounce" />
                <span className="bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md uppercase tracking-wider -mt-1 border border-rose-400">
                  Sunrise PG Pin
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-1 shadow-lg">
                <p className="font-semibold text-slate-800"><strong>Configured Address:</strong> {address}</p>
                <p className="text-[10px] text-slate-400 font-bold tracking-wider">Lat: {mapCoords.lat} · Lng: {mapCoords.lng} (Click map to change)</p>
              </div>
            </div>
          </Card>

          <div className="space-y-6 lg:col-span-1">
            <Card className="p-8 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading" style={{ fontFamily: 'var(--font-heading)' }}>PG Address Settings</h3>
                <p className="text-xs text-slate-450 mt-1 font-medium">Update the physical address of the PG co-living home.</p>
              </div>
              <div className="group">
                <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">PG Address</label>
                <textarea 
                  value={address} 
                  rows={3}
                  className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold p-4 rounded-xl transition-all shadow-inner resize-none leading-relaxed"
                  onChange={(e) => { 
                    setAddress(e.target.value); 
                    saveStateToLocalStorage({ address: e.target.value }); 
                  }} 
                />
              </div>
            </Card>

            <Card className="p-8 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading" style={{ fontFamily: 'var(--font-heading)' }}>Office Proximity Config</h3>
                <p className="text-xs text-slate-450 mt-1 font-medium">Configure approximate commute details shown to prospects working at this target office.</p>
              </div>
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Target Office Name</label>
                  <Input 
                    value={commuteDestination} 
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                    onChange={(e) => { 
                      setCommuteDestination(e.target.value); 
                      saveStateToLocalStorage({ commuteDestination: e.target.value });
                    }} 
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Walking Commute Time</label>
                  <Input 
                    value={commuteWalkTime} 
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                    onChange={(e) => { 
                      setCommuteWalkTime(e.target.value); 
                      saveStateToLocalStorage({ commuteWalkTime: e.target.value });
                    }} 
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Bike/Auto Commute Time</label>
                  <Input 
                    value={commuteBikeTime} 
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                    onChange={(e) => { 
                      setCommuteBikeTime(e.target.value); 
                      saveStateToLocalStorage({ commuteBikeTime: e.target.value });
                    }} 
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider group-focus-within:text-teal-600 transition-colors">Nearest Transit Proximity</label>
                  <Input 
                    value={commuteTransitTime} 
                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" 
                    onChange={(e) => { 
                      setCommuteTransitTime(e.target.value); 
                      saveStateToLocalStorage({ commuteTransitTime: e.target.value });
                    }} 
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
