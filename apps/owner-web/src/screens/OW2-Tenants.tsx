import { useState, useEffect } from 'react'; import { Search, Plus, Phone, Mail, X, Edit3, Check, Trash2, Calendar } from 'lucide-react'; import { Card } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';
import { Input } from '@rentflo/ui';

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
        email: t.email || 'resident@rentflo.com',
        status: t.status === 'Paid' || t.status === 'Overdue' ? t.status : 'Paid',
        moveIn: t.moveIn || t.checkInDate || 'Today',
        activeMonths: typeof t.activeMonths === 'number' ? t.activeMonths : 1
      }));
    }
    const saved = typeof window !== 'undefined' ? localStorage.getItem('rentflo_tenants_list') : null;
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
    localStorage.setItem('rentflo_tenants_list', JSON.stringify(tenants));
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
      email: 'resident@rentflo.com',
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
    <div className="p-8 space-y-6 max-w-7xl mx-auto relative overflow-hidden text-left min-h-screen">
      {/* Toast */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-[#111827] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold z-50 animate-bounce">
          <Check className="w-4 h-4 text-[#1D9E75]" /> {notif}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tenants Directory</h1>
          <p className="text-slate-500 mt-1">Manage tenant profiles, stay details, room rents, and KYC documents</p>
        </div>
        <Button style={{ background: '#1D9E75', color: '#FFFFFF' }} className="hover:bg-[#0F6E56] whitespace-nowrap" onClick={handleAddTenant}>
          <Plus className="w-4 h-4 mr-2" /> Add Tenant
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by resident name or room number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9E75] bg-white text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Room Info</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Monthly Rent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Move-In Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredTenants.map((t, idx) => {
                // find absolute index in main tenants array
                const originalIndex = tenants.findIndex(x => x.phone === t.phone);
                return (
                  <tr 
                    key={idx} 
                    onClick={() => handleSelectTenant(originalIndex)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedIndex === originalIndex ? 'bg-slate-50/80 border-l-4 border-l-[#1D9E75]' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-100 text-[#1D9E75] flex items-center justify-center font-bold text-xs uppercase">
                          {t.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold text-slate-800">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{t.room} · {t.floor}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-500">
                        <p>{t.phone}</p>
                        <p className="truncate max-w-[150px]">{t.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">₹{t.rent.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{
                        background: t.status === 'Paid' ? '#E1F5EE' : '#FCEBEB',
                        color: t.status === 'Paid' ? '#085041' : '#791F1F'
                      }}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{t.moveIn}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Side Slide-In Panel (Details / Edit Mode) */}
      {selectedTenant && (
        <div className="fixed inset-y-0 right-0 w-[460px] bg-white border-l shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
          <div className="p-6 border-b flex justify-between items-center bg-slate-50">
            <h3 className="text-base font-bold text-slate-900">
              {isEditing ? 'Edit Tenant Profile' : 'Tenant Details'}
            </h3>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button size="sm" variant="outline" className="flex items-center gap-1.5 h-8 text-xs font-semibold" onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </Button>
              )}
              <button onClick={() => setSelectedIndex(null)} className="p-1 hover:bg-slate-200 rounded">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* VIEW MODE */}
            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-teal-100 text-[#1D9E75] flex items-center justify-center font-bold text-xl uppercase">
                    {selectedTenant.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{selectedTenant.name}</h4>
                    <p className="text-xs text-slate-400">Active stay since {selectedTenant.activeMonths} months · Moved in on {selectedTenant.moveIn}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Room / Floor</span>
                    <span className="font-bold text-slate-700">{selectedTenant.room} ({selectedTenant.floor})</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Monthly Rent</span>
                    <span className="font-bold text-[#1D9E75]">₹{selectedTenant.rent.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Info</p>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400" /> {selectedTenant.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400" /> {selectedTenant.email}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">KYC Compliance</p>
                  <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded border">
                    <span className="text-slate-600 font-medium">Rental Agreement</span>
                    <Badge style={{ background: '#E1F5EE', color: '#085041' }}>Signed ✓</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded border">
                    <span className="text-slate-600 font-medium">Aadhaar Card Verification</span>
                    <Badge style={{ background: '#E1F5EE', color: '#085041' }}>Verified ✓</Badge>
                  </div>
                </div>
              </div>
            ) : (
              // EDIT MODE FORM
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Full Name</label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Room</label>
                    <Input value={editRoom} onChange={(e) => setEditRoom(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Floor</label>
                    <Input value={editFloor} onChange={(e) => setEditFloor(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Monthly Rent (₹)</label>
                    <Input type="number" value={editRent} onChange={(e) => setEditRent(+e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Move-In Date</label>
                    <Input value={editMoveIn} onChange={(e) => setEditMoveIn(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Phone Number</label>
                  <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Email Address</label>
                  <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Rent Status</label>
                    <select
                      value={editStatus}
                      onChange={(e: any) => setEditStatus(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white text-xs"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Active Months</label>
                    <Input type="number" value={editActiveMonths} onChange={(e) => setEditActiveMonths(+e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer Actions */}
          <div className="p-4 border-t bg-slate-50 flex gap-2">
            {isEditing ? (
              <>
                <Button className="flex-1 font-semibold" style={{ background: '#1D9E75', color: '#FFFFFF' }} onClick={handleSaveChanges}>
                  Save Profile Changes
                </Button>
                <Button variant="outline" className="flex-1 font-semibold text-slate-500" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button className="flex-1 font-semibold" variant="outline" onClick={handleDeleteTenant}>
                  <Trash2 className="w-4 h-4 mr-1 text-rose-600" /> Remove Tenant
                </Button>
                <Button className="flex-1 font-semibold" style={{ background: '#1D9E75', color: '#FFFFFF' }} onClick={() => setSelectedIndex(null)}>
                  Close Details
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
