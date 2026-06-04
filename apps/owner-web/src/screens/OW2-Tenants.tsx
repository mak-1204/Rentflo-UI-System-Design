import { useState, useEffect } from 'react'; import { Search, Plus, Phone, Mail, X, Edit3, Check, Trash2, Calendar } from 'lucide-react'; import { Card } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';
import { Button } from '@stayflo/ui';
import { Input } from '@stayflo/ui';

interface Tenant {
  name: string;
  room: string;
  floor: string;
  rent: number;
  phone: string;
  email: string;
  status: 'Paid' | 'Overdue';
  moveIn: string;
  activeMonths: number;
}

export function OwnerWebTenants({ initialTenants }: { initialTenants?: Tenant[] } = {}) {
  const [search, setSearch] = useState('');
  const [notif, setNotif] = useState<string | null>(null);

  // Load / initialize tenants list
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    if (initialTenants && initialTenants.length > 0) {
      return initialTenants.map((t: any, idx) => ({
        name: t.name || (t.userId === 'u-2' ? 'Amit Kumar' : `Resident ${idx + 1}`),
        room: t.room || (t.bedId ? `Room ${t.bedId.replace(/[^0-9]/g, '')}` : 'Room TBD'),
        floor: t.floor || (t.bedId?.includes('101') ? 'Ground Floor' : '1st Floor'),
        rent: typeof t.rent === 'number' ? t.rent : (t.baseRent || 8500),
        phone: t.phone || '+91 99999 88888',
        email: t.email || 'resident@stayflo.com',
        status: t.status === 'Paid' || t.status === 'Overdue' ? t.status : 'Paid',
        moveIn: t.moveIn || t.checkInDate || 'Today',
        activeMonths: typeof t.activeMonths === 'number' ? t.activeMonths : 1
      }));
    }
    const saved = typeof window !== 'undefined' ? localStorage.getItem('stayflo_tenants_list') : null;
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { name: 'Amit Kumar', room: 'Room 4', floor: '1st Floor', rent: 8500, phone: '+91 98765 43210', email: 'amit.k@gmail.com', status: 'Overdue', moveIn: '15 Oct 2025', activeMonths: 8 },
      { name: 'Sanjay Ramaswamy', room: 'Room 2', floor: 'Ground Floor', rent: 8500, phone: '+91 99000 88776', email: 'sanjay.r@outlook.com', status: 'Paid', moveIn: '01 Nov 2025', activeMonths: 7 },
      { name: 'Vijay Nair', room: 'Room 8', floor: '2nd Floor', rent: 9200, phone: '+91 91234 56789', email: 'vijay.nair@yahoo.com', status: 'Paid', moveIn: '10 Jan 2026', activeMonths: 5 },
    ];
  });

  // Selected tenant index for side panel
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields states
  const [editName, setEditName] = useState('');
  const [editRoom, setEditRoom] = useState('');
  const [editFloor, setEditFloor] = useState('');
  const [editRent, setEditRent] = useState(8500);
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editStatus, setEditStatus] = useState<'Paid' | 'Overdue'>('Paid');
  const [editMoveIn, setEditMoveIn] = useState('');
  const [editActiveMonths, setEditActiveMonths] = useState(1);

  // Save tenants list
  useEffect(() => {
    localStorage.setItem('stayflo_tenants_list', JSON.stringify(tenants));
  }, [tenants]);

  // Load edit states when tenant is selected
  const handleSelectTenant = (index: number) => {
    setSelectedIndex(index);
    const t = tenants[index];
    setEditName(t.name);
    setEditRoom(t.room);
    setEditFloor(t.floor);
    setEditRent(t.rent);
    setEditPhone(t.phone);
    setEditEmail(t.email);
    setEditStatus(t.status);
    setEditMoveIn(t.moveIn);
    setEditActiveMonths(t.activeMonths);
    setIsEditing(false);
  };

  const triggerToast = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  const handleSaveChanges = () => {
    if (selectedIndex === null) return;
    const updated: Tenant = {
      name: editName,
      room: editRoom,
      floor: editFloor,
      rent: editRent,
      phone: editPhone,
      email: editEmail,
      status: editStatus,
      moveIn: editMoveIn,
      activeMonths: editActiveMonths
    };

    setTenants(prev => prev.map((t, idx) => idx === selectedIndex ? updated : t));
    setIsEditing(false);
    triggerToast('Tenant profile updated successfully!');
  };

  const handleAddTenant = () => {
    const newTenant: Tenant = {
      name: 'New Resident',
      room: 'Room TBD',
      floor: 'Ground Floor',
      rent: 8500,
      phone: '+91 99999 88888',
      email: 'resident@stayflo.com',
      status: 'Paid',
      moveIn: 'Today',
      activeMonths: 0
    };
    setTenants(prev => [...prev, newTenant]);
    handleSelectTenant(tenants.length); // select the newly added tenant
    setIsEditing(true); // put in edit mode directly
    triggerToast('Added draft tenant. Customize details in edit panel.');
  };

  const handleDeleteTenant = () => {
    if (selectedIndex === null) return;
    if (window.confirm(`Are you sure you want to delete ${tenants[selectedIndex].name}?`)) {
      setTenants(prev => prev.filter((_, idx) => idx !== selectedIndex));
      setSelectedIndex(null);
      setIsEditing(false);
      triggerToast('Tenant deleted from PG directory.');
    }
  };

  const filteredTenants = tenants.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.room.toLowerCase().includes(search.toLowerCase()));
  const selectedTenant = selectedIndex !== null ? tenants[selectedIndex] : null;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto relative overflow-hidden text-left min-h-screen" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Toast */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold z-50 animate-in fade-in duration-300">
          <Check className="w-4 h-4 text-[#14b8a6]" /> {notif}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>Tenants Directory</h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">Manage tenant profiles, stay details, room rents, and KYC documents</p>
        </div>
        <Button 
          style={{ background: '#14b8a6', color: '#FFFFFF' }} 
          className="hover:opacity-95 active:scale-98 whitespace-nowrap rounded-xl text-xs font-bold h-10 px-4 transition-all shadow-md shadow-teal-500/10 border-none cursor-pointer" 
          onClick={handleAddTenant}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Tenant
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by resident name or room number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 rounded-xl bg-[#f8fafc] transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Room Info</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Monthly Rent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Move-In Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {filteredTenants.map((t, idx) => {
                // find absolute index in main tenants array
                const originalIndex = tenants.findIndex(x => x.phone === t.phone);
                return (
                  <tr 
                    key={idx} 
                    onClick={() => handleSelectTenant(originalIndex)}
                    className={`hover:bg-slate-50/40 transition-colors cursor-pointer duration-200 ${selectedIndex === originalIndex ? 'bg-teal-50/[0.15] border-l-4 border-l-[#14b8a6]' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-teal-50 text-[#14b8a6] flex items-center justify-center font-bold text-xs uppercase border border-teal-100/30">
                          {t.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-teal-650 transition-colors">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">{t.room} · {t.floor}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-400 font-medium">
                        <p>{t.phone}</p>
                        <p className="truncate max-w-[150px]">{t.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-800">₹{t.rent.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-transparent shadow-none" style={{
                        background: t.status === 'Paid' ? '#f0fdfa' : '#FCEBEB',
                        color: t.status === 'Paid' ? '#0f766e' : '#791F1F',
                        borderColor: t.status === 'Paid' ? 'rgba(20,184,166,0.1)' : 'rgba(239,68,68,0.1)'
                      }}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-400">{t.moveIn}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Side Slide-In Panel (Details / Edit Mode) */}
      {selectedTenant && (
        <div className="fixed inset-y-0 right-0 w-[460px] bg-white border-l border-slate-205 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
              {isEditing ? 'Edit Tenant Profile' : 'Tenant Details'}
            </h3>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button size="sm" variant="outline" className="flex items-center gap-1.5 h-8 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50" onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </Button>
              )}
              <button onClick={() => setSelectedIndex(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* VIEW MODE */}
            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-teal-50 text-[#14b8a6] flex items-center justify-center font-extrabold text-xl uppercase border border-teal-100/30">
                    {selectedTenant.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-lg" style={{ fontFamily: 'var(--font-heading)' }}>{selectedTenant.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">Active stay since {selectedTenant.activeMonths} months · Moved in on {selectedTenant.moveIn}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider mb-1">Room / Floor</span>
                    <span className="font-bold text-slate-800">{selectedTenant.room} ({selectedTenant.floor})</span>
                  </div>
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider mb-1">Monthly Rent</span>
                    <span className="font-extrabold text-[#14b8a6]">₹{selectedTenant.rent.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3.5 pt-5 border-t border-slate-100">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Contact Info</p>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400" /> {selectedTenant.phone}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400" /> {selectedTenant.email}
                  </div>
                </div>

                <div className="space-y-3.5 pt-5 border-t border-slate-100">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">KYC Compliance</p>
                  <div className="flex justify-between items-center text-xs p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <span className="text-slate-700 font-semibold">Rental Agreement</span>
                    <Badge className="bg-teal-50 text-teal-700 border-none font-bold text-[10px] rounded-md px-2 py-0.5">Signed ✓</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <span className="text-slate-700 font-semibold">Aadhaar Card Verification</span>
                    <Badge className="bg-teal-50 text-teal-700 border-none font-bold text-[10px] rounded-md px-2 py-0.5">Verified ✓</Badge>
                  </div>
                </div>
              </div>
            ) : (
              // EDIT MODE FORM
              <div className="space-y-5 text-xs">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Room</label>
                    <Input value={editRoom} onChange={(e) => setEditRoom(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Floor</label>
                    <Input value={editFloor} onChange={(e) => setEditFloor(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Monthly Rent (₹)</label>
                    <Input type="number" value={editRent} onChange={(e) => setEditRent(+e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Move-In Date</label>
                    <Input value={editMoveIn} onChange={(e) => setEditMoveIn(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Phone Number</label>
                  <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Rent Status</label>
                    <select
                      value={editStatus}
                      onChange={(e: any) => setEditStatus(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner cursor-pointer"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Active Months</label>
                    <Input type="number" value={editActiveMonths} onChange={(e) => setEditActiveMonths(+e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer Actions */}
          <div className="p-4 border-t bg-slate-50/50 flex gap-3">
            {isEditing ? (
              <>
                <Button className="flex-1 font-bold text-white border-none rounded-xl h-11" style={{ background: '#14b8a6' }} onClick={handleSaveChanges}>
                  Save Changes
                </Button>
                <Button variant="outline" className="flex-1 font-bold text-slate-500 rounded-xl h-11 border-slate-200" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button className="flex-1 font-bold rounded-xl h-11 border-slate-250 hover:bg-slate-50 text-slate-650" variant="outline" onClick={handleDeleteTenant}>
                  <Trash2 className="w-4 h-4 mr-1 text-rose-600" /> Remove
                </Button>
                <Button className="flex-1 font-bold text-white border-none rounded-xl h-11" style={{ background: '#14b8a6' }} onClick={() => setSelectedIndex(null)}>
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
