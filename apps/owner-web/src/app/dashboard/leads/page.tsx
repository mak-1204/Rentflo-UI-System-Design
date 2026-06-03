import type { Metadata } from 'next';
import { supabase } from '@rentflo/utils';
import { Download, Phone, MessageSquare, Calendar, Users, MapPin, IndianRupee } from 'lucide-react';
import { Button, Card, Badge } from '@rentflo/ui';
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
    <div className="p-8 space-y-8 max-w-7xl mx-auto relative text-left">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">Prospects & Invites</h1>
          <p className="text-slate-500 text-sm font-medium">Manage your PG pipeline with real-time updates.</p>
        </div>
        <form>
          <Button variant="outline" formAction={async () => {
            'use server';
            console.log('Export CSV Triggered');
          }} className="flex items-center gap-2 whitespace-nowrap shadow-sm hover:shadow-md transition-shadow">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </form>
      </div>

      {/* WhatsApp Invite Form */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <WhatsAppForm />
      </div>

      {/* Leads Table */}
      <Card className="overflow-hidden border border-slate-200/60 shadow-lg shadow-slate-200/20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="p-5 border-b bg-white/50 backdrop-blur-md flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-800 text-base">Pipeline</h3>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm">
              {safeLeads.length} Active Leads
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/80 border-b text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Prospect Info</th>
                <th className="px-6 py-4">Enquiry Details</th>
                <th className="px-6 py-4">Arrival</th>
                <th className="px-6 py-4">Lead Status</th>
                <th className="px-6 py-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm">
              {safeLeads.map((lead) => {
                const roomString = lead.sharing_type === 'single' ? 'Single Room' : lead.sharing_type === 'double' ? 'Double Sharing' : lead.sharing_type === 'triple' ? 'Triple Sharing' : 'Any Room';
                
                return (
                  <tr key={lead.id} className="group hover:bg-slate-50/80 transition-all duration-200 ease-in-out">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-emerald-50 flex items-center justify-center border border-teal-100/50 text-teal-700 font-bold shadow-sm">
                          {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block group-hover:text-teal-700 transition-colors">{lead.name || 'Unnamed Prospect'}</span>
                          <span className="text-xs text-slate-500 font-mono mt-0.5 block">{lead.phone_number}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium">{roomString}</span>
                        </div>
                        {(lead.move_in_date || lead.budget) && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            {lead.move_in_date && (
                              <span className="flex items-center gap-1" title="Move In Date">
                                <Calendar className="w-3 h-3" /> {new Date(lead.move_in_date).toLocaleDateString('en-IN', {month:'short', day:'numeric'})}
                              </span>
                            )}
                            {lead.budget && (
                              <span className="flex items-center gap-1" title="Budget">
                                <IndianRupee className="w-3 h-3" /> {lead.budget}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1 text-xs">
                        <span className="font-medium text-slate-700">
                          {formatLeadDate(lead.created_at)}
                        </span>
                        {lead.work_location && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3 h-3" /> {lead.work_location}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusDropdown leadId={lead.id} currentStatus={lead.status} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={`https://api.whatsapp.com/send?phone=${lead.phone_number?.replace(/\D/g, '')}&text=${encodeURIComponent(`Hi ${lead.name}, checking in regarding your visit schedule at Sunrise PG!`)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button size="sm" variant="ghost" className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 text-xs shadow-sm border border-transparent hover:border-emerald-100 transition-all">
                            <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Chat
                          </Button>
                        </a>
                        <a href={`tel:${lead.phone_number}`}>
                          <Button size="sm" variant="outline" className="text-xs text-slate-600 hover:text-slate-900 shadow-sm transition-all">
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
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner border border-slate-100">
                        <Users className="w-8 h-8 text-slate-300" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-slate-900 font-semibold text-lg">Your pipeline is clear</h4>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto">Use the WhatsApp generator above to invite prospects to view your PG portfolio. Leads will magically appear here!</p>
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
