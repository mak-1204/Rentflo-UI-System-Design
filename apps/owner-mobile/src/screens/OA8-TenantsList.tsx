import { Search, Plus } from 'lucide-react'; import { Link } from 'react-router'; import { Avatar, AvatarFallback } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';
import { Button } from '@stayflo/ui';
import { Card } from '@stayflo/ui';
import { Input } from '@stayflo/ui';

export function OwnerTenantsList() {
  const tenants = [
    { id: 1, name: 'Amit Kumar', initials: 'AK', room: 4, rent: 8500, status: 'overdue', amount: 2400, color: '#EF9F27' },
    { id: 2, name: 'Priya Sharma', initials: 'PS', room: 7, rent: 8500, status: 'paid', color: '#534AB7' },
    { id: 3, name: 'Rahul Verma', initials: 'RV', room: 11, rent: 8000, status: 'overdue', amount: 1900, color: '#993C1D' },
    { id: 4, name: 'Sneha Patel', initials: 'SP', room: 3, rent: 9000, status: 'paid', color: '#1D9E75' },
    { id: 5, name: 'Vikram Singh', initials: 'VS', room: 9, rent: 8500, status: 'due', amount: 8500, color: '#0C447C' },
    { id: 6, name: 'Ananya Reddy', initials: 'AR', room: 2, rent: 9000, status: 'paid', color: '#993556' },
  ];
  
  const getStatusBadge = (status: string, amount?: number) => {
    if (status === 'paid') {
      return <Badge style={{ background: '#E1F5EE', color: '#085041' }}>Paid ✓</Badge>;
    } else if (status === 'overdue') {
      return <Badge style={{ background: '#FCEBEB', color: '#791F1F' }}>Overdue</Badge>;
    } else {
      return <Badge style={{ background: '#FAEEDA', color: '#633806' }}>Due</Badge>;
    }
  };
  
  return (
    <div className="px-4 pt-12 pb-4" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-6" style={{ color: '#111827' }}>
        Tenants
      </h1>
      
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
          <Input 
            placeholder="Search tenants..."
            className="pl-10 h-12"
          />
        </div>
      </div>
      
      {/* Filter Chips */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button className="px-4 py-2 rounded-lg font-medium whitespace-nowrap" style={{ background: '#1D9E75', color: '#FFFFFF' }}>
          All
        </button>
        <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#FFFFFF', color: '#6B7280' }}>
          Active
        </button>
        <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#FFFFFF', color: '#6B7280' }}>
          Overdue
        </button>
        <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#FFFFFF', color: '#6B7280' }}>
          New
        </button>
      </div>
      
      {/* Tenants List */}
      <div className="space-y-3">
        {tenants.map((tenant) => (
          <Link key={tenant.id} to={`/owner-mobile/app/tenants/${tenant.id}`}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback style={{ background: tenant.color, color: '#FFFFFF' }}>
                    {tenant.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium" style={{ color: '#111827' }}>{tenant.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">Room {tenant.room}</Badge>
                    {getStatusBadge(tenant.status, tenant.amount)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold" style={{ color: '#111827' }}>₹{tenant.rent.toLocaleString()}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>per month</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* FAB */}
      <button 
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
        style={{ background: '#1D9E75' }}
      >
        <Plus className="w-6 h-6" style={{ color: '#FFFFFF' }} />
      </button>
    </div>
  );
}
