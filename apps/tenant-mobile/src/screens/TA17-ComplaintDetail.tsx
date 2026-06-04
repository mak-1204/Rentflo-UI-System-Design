import { useNavigate, useParams } from 'react-router'; import { ChevronLeft, Clock, CheckCircle2 } from 'lucide-react'; import { Card } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';

export function TenantComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="px-4 pt-12 pb-4 h-full flex flex-col" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-lg border border-slate-100">
        <button onClick={() => navigate(-1)} className="-ml-1">
          <ChevronLeft className="w-6 h-6 text-slate-800" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Complaint Details</h1>
          <p className="text-xs text-slate-400">Ref: {id || 'CMP-401'}</p>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {/* Category & Status */}
        <Card className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</span>
            <Badge style={{ background: '#EEEDFE', color: '#534AB7' }}>Electrical</Badge>
          </div>
          <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</span>
            <Badge style={{ background: '#FAEEDA', color: '#633806' }}>In Progress</Badge>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The AC in Room 4 is not cooling properly and making a loud rattling sound since yesterday night. Please send a technician.
          </p>
        </Card>

        {/* Timeline */}
        <Card className="p-4 space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Timeline</p>
          <div className="space-y-4 relative pl-4 border-l border-slate-200 ml-1">
            <div className="relative">
              <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#1D9E75]" />
              <p className="text-xs font-semibold text-slate-800">Complaint Raised</p>
              <p className="text-[10px] text-slate-400 mt-0.5">17 Jun 2026, 9:30 AM</p>
            </div>
            <div className="relative">
              <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#EF9F27]" />
              <p className="text-xs font-semibold text-slate-800">Assigned & Viewed by Owner</p>
              <p className="text-[10px] text-slate-400 mt-0.5">17 Jun 2026, 11:15 AM · Technician scheduled for tomorrow</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
