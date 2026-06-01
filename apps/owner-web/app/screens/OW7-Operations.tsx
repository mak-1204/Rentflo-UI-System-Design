import { useState, useEffect } from 'react'; import { Check, AlertTriangle, Megaphone, Trash2, Calendar, Sparkles, Clock, CheckCircle2, User, Image as ImageIcon, Plus } from 'lucide-react'; import { Card } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';
import { Input } from '@rentflo/ui';

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

export function OwnerWebOperations() {
  const [activeTab, setActiveTab] = useState<'complaints' | 'announcements' | 'cleaning'>('complaints');
  const [notif, setNotif] = useState<string | null>(null);

  // Complaints state
  const [complaints, setComplaints] = useState<Complaint[]>([
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
  ]);

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
    <div className="p-8 space-y-6 max-w-7xl mx-auto relative min-h-screen">
      {/* Toast */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-[#111827] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold z-50 animate-bounce">
          <Check className="w-4 h-4 text-[#1D9E75]" /> {notif}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Operations & Maintenance</h1>
        <p className="text-slate-500 mt-1">Manage tenant maintenance requests, broadcast announcements, and organize cleaning staff schedules</p>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`pb-3 px-6 text-sm font-semibold border-b-2 transition-all ${activeTab === 'complaints' ? 'border-[#1D9E75] text-[#1D9E75]' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          Tenant Complaints ({complaints.filter(c => c.status !== 'Resolved').length})
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`pb-3 px-6 text-sm font-semibold border-b-2 transition-all ${activeTab === 'announcements' ? 'border-[#1D9E75] text-[#1D9E75]' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          Broadcasting & Announcements
        </button>
        <button
          onClick={() => setActiveTab('cleaning')}
          className={`pb-3 px-6 text-sm font-semibold border-b-2 transition-all ${activeTab === 'cleaning' ? 'border-[#1D9E75] text-[#1D9E75]' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          Cleaning Schedule
        </button>
      </div>

      {/* TAB 1: COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {complaints.map(c => (
              <Card key={c.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-950 text-base">{c.type}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <Badge variant="outline">{c.room}</Badge>
                      <Badge style={{
                        background: c.status === 'Open' ? '#FCEBEB' : c.status === 'In Progress' ? '#FAEEDA' : '#E1F5EE',
                        color: c.status === 'Open' ? '#791F1F' : c.status === 'In Progress' ? '#633806' : '#085041'
                      }} className="border-none font-semibold">
                        {c.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">Raised by {c.tenantName} on {c.date}</p>
                  </div>

                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleStatusChange(c.id, 'In Progress')}
                      disabled={c.status === 'In Progress' || c.status === 'Resolved'}
                    >
                      In Progress
                    </Button>
                    <Button
                      size="sm"
                      style={{ background: '#1D9E75', color: '#FFFFFF' }}
                      className="text-xs hover:bg-[#0F6E56]"
                      onClick={() => handleStatusChange(c.id, 'Resolved')}
                      disabled={c.status === 'Resolved'}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">{c.description}</p>

                {c.mediaUrl && (
                  <div className="border rounded-xl overflow-hidden max-w-md bg-slate-50 relative group">
                    <img src={c.mediaUrl} alt="Complaint detail" className="w-full h-48 object-cover object-center" />
                    <div className="absolute top-2 left-2 bg-black/75 text-white px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-medium">
                      <ImageIcon className="w-3 h-3" /> Attachment
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Quick Metrics */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Operational Health</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-500">Average Resolution Time</span>
                  <span className="font-semibold text-slate-800">4.2 Hours</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-500">Resolution Rate (Weekly)</span>
                  <span className="font-semibold text-teal-600">94%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Open Tickets</span>
                  <span className="font-bold text-rose-600">{complaints.filter(c => c.status === 'Open').length} pending</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-900 text-white space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-800 text-teal-200 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Need a vendor?</h4>
                  <p className="text-xs text-slate-400">Rentflo Preferred Electricians & Plumbers</p>
                </div>
              </div>
              <Button className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs h-10 mt-2">
                Call Local Vendor
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Creator form */}
          <Card className="p-6 h-fit lg:col-span-1 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#EF9F27]" /> New Broadcast
            </h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lift maintenance service"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] bg-white text-sm"
                >
                  <option value="General">General Notification</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Power Cut">Power Shutdown</option>
                  <option value="Water Shortage">Water shortage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Message Description</label>
                <textarea
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Describe the maintenance, timing, and what tenants should prepare for..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] bg-white text-sm"
                  required
                />
              </div>

              <Button type="submit" style={{ background: '#1D9E75', color: '#FFFFFF' }} className="w-full font-semibold">
                Send to All Tenants
              </Button>
            </form>
          </Card>

          {/* Past Announcements Feed */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">Broadcast Log</h3>

            {announcements.map(ann => (
              <Card key={ann.id} className="p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{ann.title}</h4>
                    <Badge variant="outline" className="text-[10px] text-orange-700 bg-orange-50 border-orange-200">
                      {ann.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{ann.message}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5" /> Sent {ann.date}
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
            <h3 className="text-base font-semibold text-slate-800">Cleaning Log & Schedule</h3>
            <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200">
              Staff: Ramesh Singh & Suresh Kumar
            </Badge>
          </div>

          <Card className="overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Room / Area</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Floor</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Cleaned</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Scheduled</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Hand</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm">
                {cleaningTasks.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-800">{t.room}</td>
                    <td className="px-6 py-4 text-slate-600">{t.floor}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{t.lastCleaned}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{t.nextScheduled}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-700 text-xs">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {t.assignedTo}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge style={{
                        background: t.status === 'Cleaned' ? '#E1F5EE' : t.status === 'Pending' ? '#FAEEDA' : '#FAECE7',
                        color: t.status === 'Cleaned' ? '#085041' : t.status === 'Pending' ? '#633806' : '#993C1D'
                      }} className="border-none font-semibold">
                        {t.status === 'Requested' ? 'Tenant Requested ⚡' : t.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {t.status !== 'Cleaned' ? (
                        <Button
                          size="sm"
                          style={{ background: '#1D9E75', color: '#FFFFFF' }}
                          className="hover:bg-[#0F6E56] text-xs"
                          onClick={() => handleMarkCleaned(t.room)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Cleaned
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Done ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}
