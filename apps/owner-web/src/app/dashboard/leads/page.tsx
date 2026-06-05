import type { Metadata } from 'next';
import { supabase } from '@stayflo/utils';
import { Download, Phone, MessageSquare, Calendar, Users, MapPin, IndianRupee } from 'lucide-react';
import { Button, Card, Badge } from '@stayflo/ui';
import { WhatsAppForm } from './_components/WhatsAppForm';
import { StatusDropdown } from './_components/StatusDropdown';
import React from 'react';

export const metadata: Metadata = {
  title: 'Leads | Native Next.js',
  description: 'Track and manage prospective tenant leads and enquiries.',
};

// Helper for formatting the timestamp nicely
function formatLeadDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export default async function LeadsPage() {
  // Fetch data natively on the server
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[LeadsPage] Supabase error:', error);
  }

  const safeLeads = leads || [];

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-slate-50 to-[#14b8a6]/[0.03] p-8 space-y-8 relative text-left" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>Prospects & Invites</h1>
          <p className="text-slate-500 text-xs font-medium">Manage your PG pipeline with real-time updates.</p>
        </div>
        <form>
          <Button variant="outline" formAction={async () => {
            'use server';
            console.log('Export CSV Triggered');
          }} className="flex items-center gap-2 whitespace-nowrap rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-700 h-10 px-4 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </form>
      </div>

      {/* WhatsApp Invite Form */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <WhatsAppForm />
      </div>

      {/* Leads Table */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily: 'var(--font-heading)' }}>Pipeline</h3>
            <span className="bg-teal-50 text-teal-700 border border-teal-100/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-none">
              {safeLeads.length} Active Leads
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Prospect Info</th>
                <th className="px-6 py-4">Enquiry Details</th>
                <th className="px-6 py-4">Arrival</th>
                <th className="px-6 py-4">Lead Status</th>
                <th className="px-6 py-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white text-sm">
              {safeLeads.map((lead: any) => {
                const roomString = lead.sharing_type === 'single' ? 'Single Room' : lead.sharing_type === 'double' ? 'Double Sharing' : lead.sharing_type === 'triple' ? 'Triple Sharing' : 'Any Room';
                
                return (
                  <tr key={lead.id} className="group hover:bg-slate-50/40 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100/30 text-teal-600 font-semibold text-sm">
                          {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block group-hover:text-teal-650 transition-colors">{lead.name || 'Unnamed Prospect'}</span>
                          <span className="text-xs text-slate-400 font-medium mt-0.5 block">{lead.phone_number}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-800">{roomString}</span>
                        </div>
                        {(lead.move_in_date || lead.budget) && (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            {lead.move_in_date && (
                              <span className="flex items-center gap-1" title="Move In Date">
                                <Calendar className="w-3 h-3 text-slate-350" /> {new Date(lead.move_in_date).toLocaleDateString('en-IN', {month:'short', day:'numeric'})}
                              </span>
                            )}
                            {lead.budget && (
                              <span className="flex items-center gap-1" title="Budget">
                                <IndianRupee className="w-3 h-3 text-slate-350" /> {lead.budget}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1.5 text-xs">
                        <span className="font-semibold text-slate-700">
                          {formatLeadDate(lead.created_at)}
                        </span>
                        {lead.work_location && (
                          <span className="flex items-center gap-1 text-slate-400 font-medium">
                            <MapPin className="w-3 h-3 text-slate-355" /> {lead.work_location}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusDropdown leadId={lead.id} currentStatus={lead.status} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={`https://api.whatsapp.com/send?phone=${lead.phone_number?.replace(/\D/g, '')}&text=${encodeURIComponent(`Hi ${lead.name}, checking in regarding your visit schedule at Sunrise PG!`)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button size="sm" variant="ghost" className="text-teal-600 hover:bg-teal-50/50 text-xs font-bold rounded-xl transition-all px-3 h-8 border border-transparent hover:border-teal-100">
                            <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Chat
                          </Button>
                        </a>
                        <a href={`tel:${lead.phone_number}`}>
                          <Button size="sm" variant="ghost" className="text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all px-3 h-8 border border-slate-100 hover:border-slate-200">
                            <Phone className="w-3 h-3 mr-1.5" /> Call
                          </Button>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {/* Premium Empty State */}
              {safeLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100/50">
                        <Users className="w-8 h-8 text-slate-300" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-slate-900 font-semibold text-base" style={{ fontFamily: 'var(--font-heading)' }}>Your pipeline is clear</h4>
                        <p className="text-slate-400 text-xs max-w-sm mx-auto">Use the WhatsApp generator above to invite prospects to view your PG portfolio. Leads will magically appear here!</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
