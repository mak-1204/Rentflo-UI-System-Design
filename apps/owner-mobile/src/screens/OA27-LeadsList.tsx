import { ChevronLeft, Phone, MessageCircle } from 'lucide-react'; import { useNavigate } from 'react-router'; import { Avatar, AvatarFallback } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';
import { Button } from '@stayflo/ui';
import { Card } from '@stayflo/ui';

export function OwnerLeadsList() {
  const navigate = useNavigate();
  
  const leads = [
    { 
      id: 1, 
      name: 'Rohan Desai', 
      phone: '+91 98765 43210', 
      room: 'Single', 
      moveIn: '1 Aug 2026', 
      status: 'new',
      received: '2h ago',
      initials: 'RD',
      color: '#1D9E75'
    },
    { 
      id: 2, 
      name: 'Kavya Menon', 
      phone: '+91 87654 32109', 
      room: 'Double', 
      moveIn: '15 Jul 2026', 
      status: 'scheduled',
      received: '1d ago',
      initials: 'KM',
      color: '#EF9F27'
    },
    { 
      id: 3, 
      name: 'Arjun Patel', 
      phone: '+91 76543 21098', 
      room: 'Single', 
      moveIn: '20 Jul 2026', 
      status: 'called',
      received: '2d ago',
      initials: 'AP',
      color: '#534AB7'
    },
    { 
      id: 4, 
      name: 'Divya Iyer', 
      phone: '+91 65432 10987', 
      room: 'Single', 
      moveIn: '1 Jul 2026', 
      status: 'joined',
      received: '5d ago',
      initials: 'DI',
      color: '#1D9E75'
    },
  ];
  
  const getStatusBadge = (status: string) => {
    if (status === 'new') {
      return <Badge style={{ background: '#E6F1FB', color: '#0C447C' }}>New</Badge>;
    } else if (status === 'scheduled') {
      return <Badge style={{ background: '#FAEEDA', color: '#633806' }}>Scheduled</Badge>;
    } else if (status === 'called') {
      return <Badge style={{ background: '#EEEDFE', color: '#534AB7' }}>Called</Badge>;
    } else {
      return <Badge style={{ background: '#E1F5EE', color: '#085041' }}>Joined ✓</Badge>;
    }
  };
  
  return (
    <div className="h-full flex flex-col" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-4 bg-white border-b" style={{ borderColor: '#E5E7EB' }}>
        <button onClick={() => navigate(-1)} className="mb-4 -ml-2">
          <ChevronLeft className="w-6 h-6" style={{ color: '#111827' }} />
        </button>
        <h1 className="text-2xl font-semibold" style={{ color: '#111827' }}>
          Website Leads
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          From your Stayflo portfolio
        </p>
      </div>
      
      {/* Metrics */}
      <div className="px-4 py-4 bg-white border-b flex gap-2 overflow-x-auto" style={{ borderColor: '#E5E7EB' }}>
        <div className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#E1F5EE' }}>
          <p className="text-xs" style={{ color: '#085041' }}>Total</p>
          <p className="text-xl font-semibold" style={{ color: '#1D9E75' }}>48</p>
        </div>
        <div className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#FAEEDA' }}>
          <p className="text-xs" style={{ color: '#633806' }}>Scheduled</p>
          <p className="text-xl font-semibold" style={{ color: '#EF9F27' }}>12</p>
        </div>
        <div className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#EEEDFE' }}>
          <p className="text-xs" style={{ color: '#534AB7' }}>Called</p>
          <p className="text-xl font-semibold" style={{ color: '#534AB7' }}>8</p>
        </div>
        <div className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#E1F5EE' }}>
          <p className="text-xs" style={{ color: '#085041' }}>Joined</p>
          <p className="text-xl font-semibold" style={{ color: '#1D9E75' }}>6</p>
        </div>
      </div>
      
      {/* Filter Chips */}
      <div className="px-4 py-3 bg-white border-b flex gap-2 overflow-x-auto" style={{ borderColor: '#E5E7EB' }}>
        <button className="px-4 py-2 rounded-lg font-medium whitespace-nowrap" style={{ background: '#1D9E75', color: '#FFFFFF' }}>
          All
        </button>
        <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#F8F9FA', color: '#6B7280' }}>
          New
        </button>
        <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#F8F9FA', color: '#6B7280' }}>
          Scheduled
        </button>
        <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#F8F9FA', color: '#6B7280' }}>
          Joined
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Leads List */}
        <div className="space-y-3">
          {leads.map((lead) => (
            <Card key={lead.id} className="p-4">
              <div className="flex gap-3 mb-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback style={{ background: lead.color, color: '#FFFFFF' }}>
                    {lead.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium" style={{ color: '#111827' }}>{lead.name}</p>
                  <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{lead.phone}</p>
                </div>
                {getStatusBadge(lead.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>Room Interest</p>
                  <Badge variant="outline" className="mt-1">{lead.room}</Badge>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>Move-in Date</p>
                  <p className="text-sm font-medium mt-1" style={{ color: '#111827' }}>{lead.moveIn}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Received {lead.received}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 px-3">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" className="h-8 px-3" style={{ background: '#25D366' }}>
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
