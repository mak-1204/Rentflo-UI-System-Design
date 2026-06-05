'use client';

import { useState } from 'react';
import { Phone, Mail, X, Edit3, Trash2 } from 'lucide-react';
import { Badge, Button, Input } from '@stayflo/ui';
import type { Tenant } from '../types';

interface TenantDetailPanelProps {
  tenant: Tenant;
  pgProperties: { id: string; name: string }[];
  onClose: () => void;
  onSave: (updated: Tenant) => void;
  onDelete: () => void;
}

export function TenantDetailPanel({
  tenant,
  pgProperties,
  onClose,
  onSave,
  onDelete,
}: TenantDetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Tenant>({ ...tenant });

  // Keep draft in sync if the parent sends a different tenant
  const handleEdit = () => {
    setDraft({ ...tenant });
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft({ ...tenant });
    setIsEditing(false);
  };

  const field = (label: string, value: string | number, onChange: (v: string) => void, type = 'text') => (
    <div>
      <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
      />
    </div>
  );

  return (
    <div className="w-full bg-white flex flex-col">
      {/* Panel header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
          {isEditing ? 'Edit Tenant Profile' : 'Tenant Details'}
        </h3>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1.5 h-8 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50"
              onClick={handleEdit}
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </Button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!isEditing ? (
          /* ── VIEW MODE ── */
          <div className="space-y-6">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-teal-50 text-[#14b8a6] flex items-center justify-center font-extrabold text-xl uppercase border border-teal-100/30 flex-shrink-0">
                {tenant.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                  {tenant.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Moved in on {tenant.moveIn}
                </p>
                {tenant.pg_name && (
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-md border border-teal-100">
                    🏠 {tenant.pg_name}
                  </span>
                )}
              </div>
            </div>

            {/* Room + Rent */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider mb-1">
                  Room / Floor
                </span>
                <span className="font-bold text-slate-800">
                  {tenant.room} ({tenant.floor})
                </span>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider mb-1">
                  Monthly Rent
                </span>
                <span className="font-extrabold text-[#14b8a6]">₹{tenant.rent.toLocaleString()}</span>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3.5 pt-5 border-t border-slate-100">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Contact Info</p>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                <Phone className="w-4 h-4 text-slate-400" /> {tenant.phone}
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                <Mail className="w-4 h-4 text-slate-400" /> {tenant.email}
              </div>
            </div>

            {/* KYC */}
            <div className="space-y-3.5 pt-5 border-t border-slate-100">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">KYC Compliance</p>
              {[
                { label: 'Rental Agreement', status: 'Signed ✓' },
                { label: 'Aadhaar Card Verification', status: 'Verified ✓' },
              ].map(({ label, status }) => (
                <div key={label} className="flex justify-between items-center text-xs p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                  <span className="text-slate-700 font-semibold">{label}</span>
                  <Badge className="bg-teal-50 text-teal-700 border-none font-bold text-[10px] rounded-md px-2 py-0.5">
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── EDIT MODE ── */
          <div className="space-y-5 text-xs">
            {field('Full Name', draft.name, (v) => setDraft({ ...draft, name: v }))}

            {/* PG Property Dropdown */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                Assigned PG Property
              </label>
              <select
                value={draft.pg_id || ''}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const pg = pgProperties.find(p => p.id === selectedId);
                  setDraft({
                    ...draft,
                    pg_id: selectedId || undefined,
                    pg_name: pg ? pg.name : undefined
                  });
                }}
                className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner cursor-pointer"
              >
                <option value="">No PG Selected</option>
                {pgProperties.map((pg) => (
                  <option key={pg.id} value={pg.id}>
                    {pg.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {field('Room', draft.room, (v) => setDraft({ ...draft, room: v }))}
              {field('Floor', draft.floor, (v) => setDraft({ ...draft, floor: v }))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {field('Monthly Rent (₹)', draft.rent, (v) => setDraft({ ...draft, rent: +v }), 'number')}
              {field('Move-In Date', draft.moveIn, (v) => setDraft({ ...draft, moveIn: v }))}
            </div>

            {field('Phone Number', draft.phone, (v) => setDraft({ ...draft, phone: v }))}
            {field('Email Address', draft.email, (v) => setDraft({ ...draft, email: v }))}

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                Rent Status
              </label>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as 'Paid' | 'Overdue' })}
                className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner cursor-pointer"
              >
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t bg-slate-50/50 flex gap-3">
        {isEditing ? (
          <>
            <Button
              className="flex-1 font-bold text-white border-none rounded-xl h-11"
              style={{ background: '#14b8a6' }}
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              className="flex-1 font-bold text-slate-500 rounded-xl h-11 border-slate-200"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              className="flex-1 font-bold rounded-xl h-11 border-slate-250 hover:bg-slate-50 text-slate-650"
              variant="outline"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4 mr-1 text-rose-600" /> Remove
            </Button>
            <Button
              className="flex-1 font-bold text-white border-none rounded-xl h-11"
              style={{ background: '#14b8a6' }}
              onClick={onClose}
            >
              Close
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
