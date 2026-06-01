import { Wrench, Zap, Sofa, Sparkles, Wifi, AlertCircle } from 'lucide-react'; import { Link } from 'react-router'; import { Badge } from '@rentflo/ui';
import { Card } from '@rentflo/ui';

export function OwnerComplaintsList() {
  const complaints = [
    { 
      id: 1, 
      category: 'Electrical', 
      icon: Zap, 
      name: 'Amit Kumar', 
      room: 4, 
      description: 'AC not working in my room', 
      time: '2h ago', 
      status: 'open',
      color: '#EF9F27',
      bgColor: '#FAEEDA'
    },
    { 
      id: 2, 
      category: 'Plumbing', 
      icon: Wrench, 
      name: 'Sneha Patel', 
      room: 3, 
      description: 'Bathroom tap leaking continuously', 
      time: '5h ago', 
      status: 'in-progress',
      color: '#0C447C',
      bgColor: '#E6F1FB'
    },
    { 
      id: 3, 
      category: 'Internet', 
      icon: Wifi, 
      name: 'Vikram Singh', 
      room: 9, 
      description: 'WiFi not working since morning', 
      time: '1d ago', 
      status: 'open',
      color: '#993C1D',
      bgColor: '#FAECE7'
    },
    { 
      id: 4, 
      category: 'Cleanliness', 
      icon: Sparkles, 
      name: 'Priya Sharma', 
      room: 7, 
      description: 'Common area needs cleaning', 
      time: '3d ago', 
      status: 'resolved',
      color: '#1D9E75',
      bgColor: '#E1F5EE',
      hasPhoto: true
    },
  ];
  
  const getStatusBadge = (status: string) => {
    if (status === 'open') {
      return <Badge style={{ background: '#FCEBEB', color: '#791F1F' }}>Open</Badge>;
    } else if (status === 'in-progress') {
      return <Badge style={{ background: '#FAEEDA', color: '#633806' }}>In Progress</Badge>;
    } else {
      return <Badge style={{ background: '#E1F5EE', color: '#085041' }}>Resolved</Badge>;
    }
  };
  
  return (
    <div className="px-4 pt-12 pb-4" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-6" style={{ color: '#111827' }}>
        Complaints
      </h1>
      
      {/* Filter Chips */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button className="px-4 py-2 rounded-lg font-medium whitespace-nowrap" style={{ background: '#1D9E75', color: '#FFFFFF' }}>
          All
        </button>
        <button className="px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-1.5" style={{ background: '#FFFFFF', color: '#6B7280' }}>
          Open 
          <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center" style={{ background: '#FCEBEB', color: '#791F1F' }}>
            2
          </span>
        </button>
        <button className="px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-1.5" style={{ background: '#FFFFFF', color: '#6B7280' }}>
          In Progress
          <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center" style={{ background: '#FAEEDA', color: '#633806' }}>
            1
          </span>
        </button>
        <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#FFFFFF', color: '#6B7280' }}>
          Resolved
        </button>
      </div>
      
      {/* Complaints List */}
      <div className="space-y-3">
        {complaints.map((complaint) => (
          <Link key={complaint.id} to={`/owner-mobile/app/complaints/${complaint.id}`}>
            <Card className="p-4">
              <div className="flex gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: complaint.bgColor }}
                >
                  <complaint.icon className="w-6 h-6" style={{ color: complaint.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm" style={{ color: '#111827' }}>{complaint.name}</p>
                      <Badge variant="outline" className="text-xs">Room {complaint.room}</Badge>
                    </div>
                    {getStatusBadge(complaint.status)}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge style={{ background: complaint.bgColor, color: complaint.color, fontSize: '11px' }}>
                      {complaint.category}
                    </Badge>
                    <span className="text-xs" style={{ color: '#9CA3AF' }}>{complaint.time}</span>
                  </div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{complaint.description}</p>
                  {complaint.hasPhoto && (
                    <div className="mt-2">
                      <div className="w-16 h-16 rounded-lg" style={{ background: '#E5E7EB' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
