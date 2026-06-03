import { ChevronLeft } from 'lucide-react'; import { useNavigate } from 'react-router'; import { Avatar, AvatarFallback } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';
import { Card } from '@rentflo/ui';
import { Progress } from '@rentflo/ui';

export function OwnerPaymentsOverview() {
  const navigate = useNavigate();
  
  const tenants = [
    { id: 1, name: 'Amit Kumar', initials: 'AK', room: 4, amount: 9030, status: 'overdue', method: null, color: '#EF9F27' },
    { id: 2, name: 'Priya Sharma', initials: 'PS', room: 7, amount: 8500, status: 'paid', method: 'upi', color: '#534AB7' },
    { id: 3, name: 'Rahul Verma', initials: 'RV', room: 11, amount: 8420, status: 'overdue', method: null, color: '#993C1D' },
    { id: 4, name: 'Sneha Patel', initials: 'SP', room: 3, amount: 9200, status: 'paid', method: 'card', color: '#1D9E75' },
    { id: 5, name: 'Vikram Singh', initials: 'VS', room: 9, amount: 8500, status: 'pending', method: null, color: '#0C447C' },
  ];
  
  const collected = 38500;
  const pending = 6400;
  const lateFees = 800;
  const total = collected + pending;
  const percentage = (collected / total) * 100;
  
  return (
    <div className="h-full flex flex-col" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-4 bg-white border-b" style={{ borderColor: '#E5E7EB' }}>
        <button onClick={() => navigate(-1)} className="mb-4 -ml-2">
          <ChevronLeft className="w-6 h-6" style={{ color: '#111827' }} />
        </button>
        <h1 className="text-2xl font-semibold" style={{ color: '#111827' }}>
          Rent Collection
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>June 2026</p>
      </div>
      
      {/* Month Selector */}
      <div className="px-4 py-4 bg-white border-b flex gap-2 overflow-x-auto" style={{ borderColor: '#E5E7EB' }}>
        <button className="px-4 py-2 rounded-lg font-medium whitespace-nowrap" style={{ background: '#E1F5EE', color: '#1D9E75' }}>
          June 2026
        </button>
        <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#F8F9FA', color: '#6B7280' }}>
          May 2026
        </button>
        <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#F8F9FA', color: '#6B7280' }}>
          April 2026
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Summary */}
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm" style={{ color: '#6B7280' }}>Collected</p>
              <p className="text-2xl font-semibold" style={{ color: '#1D9E75' }}>₹{collected.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm" style={{ color: '#6B7280' }}>Pending</p>
              <p className="text-2xl font-semibold" style={{ color: '#EF9F27' }}>₹{pending.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span style={{ color: '#6B7280' }}>Collection progress</span>
              <span style={{ color: '#111827' }}>{Math.round(percentage)}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
          
          <div className="pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: '#6B7280' }}>Late fees collected</span>
              <span style={{ color: '#111827' }}>₹{lateFees}</span>
            </div>
          </div>
        </Card>
        
        {/* Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button className="px-4 py-2 rounded-lg font-medium whitespace-nowrap" style={{ background: '#1D9E75', color: '#FFFFFF' }}>
            All
          </button>
          <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#FFFFFF', color: '#6B7280' }}>
            Paid
          </button>
          <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#FFFFFF', color: '#6B7280' }}>
            Pending
          </button>
          <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#FFFFFF', color: '#6B7280' }}>
            Overdue
          </button>
        </div>
        
        {/* Tenant List */}
        <div className="space-y-2 mb-4">
          {tenants.map((tenant) => (
            <Card key={tenant.id} className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback style={{ background: tenant.color, color: '#FFFFFF' }}>
                    {tenant.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm" style={{ color: '#111827' }}>{tenant.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs">Room {tenant.room}</Badge>
                    <span className="text-xs" style={{ color: '#6B7280' }}>₹{tenant.amount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  {tenant.status === 'paid' ? (
                    <>
                      <Badge style={{ background: '#E1F5EE', color: '#085041' }}>Paid ✓</Badge>
                      <div className="mt-1 text-xs" style={{ color: '#9CA3AF' }}>
                        {tenant.method === 'upi' ? '🎯 UPI' : '💳 Card'}
                      </div>
                    </>
                  ) : tenant.status === 'overdue' ? (
                    <Badge style={{ background: '#FCEBEB', color: '#791F1F' }}>Overdue</Badge>
                  ) : (
                    <Badge style={{ background: '#FAEEDA', color: '#633806' }}>Pending</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <Button 
          className="w-full h-12"
          style={{ background: '#EF9F27' }}
        >
          Remind All Pending
        </Button>
      </div>
    </div>
  );
}
