import { ChevronLeft, Zap } from 'lucide-react'; import { useNavigate } from 'react-router'; import { Avatar, AvatarFallback } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';
import { Button } from '@stayflo/ui';
import { Card } from '@stayflo/ui';
import { Textarea } from '@stayflo/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@stayflo/ui';

export function OwnerComplaintDetail() {
  const navigate = useNavigate();
  
  const timeline = [
    { status: 'Raised', date: '17 Jun, 2:30 PM', note: 'Complaint raised by tenant', active: true },
    { status: 'Viewed', date: '17 Jun, 2:45 PM', note: 'Viewed by owner', active: true },
    { status: 'In Progress', date: '', note: '', active: false },
    { status: 'Resolved', date: '', note: '', active: false },
  ];
  
  return (
    <div className="h-full flex flex-col" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-4 bg-white border-b" style={{ borderColor: '#E5E7EB' }}>
        <button onClick={() => navigate(-1)} className="mb-4 -ml-2">
          <ChevronLeft className="w-6 h-6" style={{ color: '#111827' }} />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <Badge style={{ background: '#FAEEDA', color: '#EF9F27' }}>Electrical</Badge>
          <Badge style={{ background: '#FCEBEB', color: '#791F1F' }}>Open</Badge>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Tenant Info */}
        <Card className="p-4 mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback style={{ background: '#EF9F27', color: '#FFFFFF' }}>
                AK
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium" style={{ color: '#111827' }}>Amit Kumar</p>
              <Badge variant="outline" className="mt-1 text-xs">Room 4</Badge>
            </div>
          </div>
        </Card>
        
        {/* Description */}
        <Card className="p-4 mb-4">
          <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Description</p>
          <p style={{ color: '#111827' }}>
            AC not working in my room. It stopped cooling since last night. Please get it fixed as soon as possible.
          </p>
        </Card>
        
        {/* Photo */}
        <Card className="p-4 mb-4">
          <p className="text-sm font-medium mb-3" style={{ color: '#6B7280' }}>Attached Photo</p>
          <div className="w-full h-48 rounded-lg" style={{ background: '#E5E7EB' }}></div>
        </Card>
        
        {/* Status Timeline */}
        <Card className="p-4 mb-4">
          <p className="text-sm font-medium mb-4" style={{ color: '#6B7280' }}>Status Timeline</p>
          
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                    style={{ 
                      borderColor: item.active ? '#1D9E75' : '#E5E7EB',
                      background: item.active ? '#1D9E75' : '#FFFFFF'
                    }}
                  >
                    {item.active && <span className="text-white text-xs">✓</span>}
                  </div>
                  {i < timeline.length - 1 && (
                    <div 
                      className="w-0.5 h-12"
                      style={{ background: item.active ? '#1D9E75' : '#E5E7EB' }}
                    ></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p 
                    className="font-medium text-sm"
                    style={{ color: item.active ? '#111827' : '#9CA3AF' }}
                  >
                    {item.status}
                  </p>
                  {item.date && (
                    <>
                      <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{item.date}</p>
                      <p className="text-xs mt-1" style={{ color: '#6B7280' }}>{item.note}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Update Status */}
        <Card className="p-4">
          <p className="text-sm font-medium mb-3" style={{ color: '#111827' }}>Update Status</p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>Status</label>
              <Select defaultValue="in-progress">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="open">Reopen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm mb-2" style={{ color: '#6B7280' }}>Add Note</label>
              <Textarea 
                placeholder="e.g., Electrician will visit tomorrow"
                rows={3}
              />
            </div>
            
            <Button 
              className="w-full h-11"
              style={{ background: '#1D9E75' }}
            >
              Update Status
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
