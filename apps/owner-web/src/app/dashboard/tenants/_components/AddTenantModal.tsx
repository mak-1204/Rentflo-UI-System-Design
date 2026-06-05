'use client';

import { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { Button, Input } from '@stayflo/ui';
import type { Tenant } from '../types';

interface AddTenantModalProps {
  pgProperties: { id: string; name: string }[];
  onClose: () => void;
  onSave: (tenant: Omit<Tenant, 'id' | 'pg_name'> & { pgId?: string }) => void;
}

export function AddTenantModal({ pgProperties, onClose, onSave }: AddTenantModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    room: '',
    floor: '0',
    rent: 8500,
    phone: '',
    email: '',
    status: 'Paid' as 'Paid' | 'Overdue',
    moveIn: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    pg_id: pgProperties[0]?.id || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    
    // Check if user entered "room" in room field
    if (formData.room.toLowerCase().includes('room')) {
      newErrors.room = 'Just enter the room number (e.g. "8"), do not type "room"';
    } else if (!formData.room.trim()) {
      newErrors.room = 'Room number is required';
    }

    const floorNum = parseInt(formData.floor, 10);
    if (isNaN(floorNum) || floorNum < 0) {
      newErrors.floor = 'Please enter a valid floor number (0, 1, 2, etc.)';
    }

    // Phone validation
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedPg = pgProperties.find(p => p.id === formData.pg_id);
    
    // Format move-in date to standard display format e.g. "05 Jun 2026"
    const parsedDate = new Date(formData.moveIn);
    const formattedDate = parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const getFloorName = (num: number) => {
      if (num === 0) return '0th floor';
      if (num === 1) return '1st floor';
      if (num === 2) return '2nd floor';
      if (num === 3) return '3rd floor';
      return `${num}th floor`;
    };

    const floorNum = parseInt(formData.floor, 10);
    const formattedFloor = getFloorName(isNaN(floorNum) ? 0 : floorNum);

    const rawRoom = formData.room.trim();
    const formattedRoom = /^\d+$/.test(rawRoom) ? `Room ${rawRoom}` : rawRoom;

    onSave({
      name: formData.name,
      room: formattedRoom,
      floor: formattedFloor,
      rent: Number(formData.rent),
      phone: formData.phone,
      email: formData.email,
      status: formData.status,
      moveIn: formattedDate,
      activeMonths: 0,
      pg_id: formData.pg_id,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-left">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              Add New Tenant
            </h3>
            <p className="text-xs text-slate-400 mt-1">Fill in details carefully to avoid onboarding errors.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
            />
            {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.name}</p>}
          </div>

          {/* PG Property Selection */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
              Assigned PG Property
            </label>
            <select
              value={formData.pg_id}
              onChange={(e) => setFormData({ ...formData, pg_id: e.target.value })}
              className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner cursor-pointer"
            >
              {pgProperties.map((pg) => (
                <option key={pg.id} value={pg.id}>
                  {pg.name}
                </option>
              ))}
            </select>
          </div>

          {/* Room & Floor side-by-side with guidelines */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                Room Number <span title="Just the number, e.g. 102"><HelpCircle className="w-3.5 h-3.5 text-teal-500" /></span>
              </label>
              <Input
                type="text"
                required
                placeholder="e.g. 104"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
              />
              <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                Note: Just add the number "8" instead of "room 8"
              </span>
              {errors.room && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.room}</p>}
            </div>

            <div>
              <label className="flex items-center gap-1 text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                Floor <span title="0 for Ground, 1 for 1st, 2 for 2nd, etc."><HelpCircle className="w-3.5 h-3.5 text-teal-500" /></span>
              </label>
              <Input
                type="number"
                required
                min={0}
                placeholder="e.g. 1"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
              />
              <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                Note: Enter floor number (0 for Ground, 1 for 1st, etc.)
              </span>
              {errors.floor && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.floor}</p>}
            </div>
          </div>

          {/* Monthly Rent & Move-In Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                Monthly Rent (₹)
              </label>
              <Input
                type="number"
                required
                min={0}
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: Number(e.target.value) })}
                className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                Move-In Date
              </label>
              <Input
                type="date"
                required
                value={formData.moveIn}
                onChange={(e) => setFormData({ ...formData, moveIn: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner cursor-pointer"
              />
            </div>
          </div>

          {/* Contact Details: Phone & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                Phone Number
              </label>
              <Input
                type="tel"
                required
                placeholder="10-digit number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
              />
              {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="e.g. rahul@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Rent Status */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
              Initial Rent Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Paid' | 'Overdue' })}
              className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner cursor-pointer"
            >
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <Button
              type="submit"
              className="flex-1 font-bold text-white border-none rounded-xl h-11"
              style={{ background: '#14b8a6' }}
            >
              Onboard Tenant
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 font-bold text-slate-500 rounded-xl h-11 border-slate-200"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
