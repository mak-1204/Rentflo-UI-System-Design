import { useNavigate } from 'react-router'; import { LogOut, FileText, Bell, MessageSquare, ClipboardCheck, Star } from 'lucide-react'; import { Card } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Avatar, AvatarFallback } from '@rentflo/ui';

export function TenantMore() {
  const navigate = useNavigate();

  const menu = [
    { label: 'Announcements', icon: Bell, badge: '1 new' },
    { label: 'Community Board', icon: MessageSquare },
    { label: 'Rental Agreement', icon: FileText },
    { label: 'Cleaning Request', icon: ClipboardCheck },
    { label: 'Rate Your Stay', icon: Star },
  ];

  return (
    <div className="px-4 pt-12 pb-4 h-full flex flex-col" style={{ background: '#F8F9FA' }}>
      {/* User Info card */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 mb-6">
        <Avatar className="w-14 h-14">
          <AvatarFallback style={{ background: '#1D9E75', color: '#FFFFFF', fontSize: '18px' }}>
            AK
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-slate-800 text-base">Amit Kumar</h2>
          <p className="text-xs text-slate-400">Sunrise PG · Room 4</p>
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-2 flex-1">
        {menu.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card 
              key={idx} 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => alert(`Navigating to ${item.label}...`)}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#FAEEDA', color: '#633806' }}>
                    {item.badge}
                  </span>
                )}
                <span className="text-slate-300">→</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Log Out */}
      <button 
        onClick={() => navigate('/')}
        className="w-full mt-6 py-3 border border-rose-100 rounded-xl bg-rose-50 text-rose-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
      >
        <LogOut className="w-4 h-4" /> Log Out
      </button>
    </div>
  );
}
