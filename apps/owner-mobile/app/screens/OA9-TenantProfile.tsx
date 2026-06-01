import { ChevronLeft, Phone, Mail } from 'lucide-react'; import { useNavigate } from 'react-router'; import { Avatar, AvatarFallback } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';
import { Card } from '@rentflo/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@rentflo/ui';

export function OwnerTenantProfile() {
  const navigate = useNavigate();
  
  const payments = [
    { date: '5 Jun 2026', amount: 8500, method: 'UPI', receipt: true },
    { date: '5 May 2026', amount: 8500, method: 'Cash', receipt: true },
    { date: '5 Apr 2026', amount: 8500, method: 'Card', receipt: true },
  ];
  
  const utilities = [
    { month: 'June 2026', prev: 1240, current: 1285, units: 45, amount: 450, hasPhoto: true },
    { month: 'May 2026', prev: 1195, current: 1240, units: 45, amount: 450, hasPhoto: true },
  ];
  
  return (
    <div className="h-full flex flex-col" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-4 bg-white border-b" style={{ borderColor: '#E5E7EB' }}>
        <button onClick={() => navigate(-1)} className="mb-4 -ml-2">
          <ChevronLeft className="w-6 h-6" style={{ color: '#111827' }} />
        </button>
        
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback style={{ background: '#EF9F27', color: '#FFFFFF', fontSize: '24px' }}>
              AK
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl font-semibold" style={{ color: '#111827' }}>Amit Kumar</h1>
            <div className="flex items-center gap-2 mt-1 mb-2">
              <Badge style={{ background: '#E1F5EE', color: '#1D9E75' }}>Room 4</Badge>
              <span className="text-sm" style={{ color: '#9CA3AF' }}>Active since 8 months</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="p-2 rounded-lg" style={{ background: '#E1F5EE' }}>
                <Phone className="w-4 h-4" style={{ color: '#1D9E75' }} />
              </button>
              <button className="p-2 rounded-lg" style={{ background: '#E1F5EE' }}>
                <Mail className="w-4 h-4" style={{ color: '#1D9E75' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start px-4 bg-white rounded-none border-b" style={{ borderColor: '#E5E7EB' }}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="utilities">Utilities</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0 space-y-4">
            {/* Rent Card */}
            <Card className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Monthly Rent</p>
                  <p className="text-2xl font-semibold mt-1" style={{ color: '#111827' }}>₹8,500</p>
                </div>
                <Badge style={{ background: '#FCEBEB', color: '#791F1F' }}>8 days overdue</Badge>
              </div>
              <p className="text-sm mb-3" style={{ color: '#6B7280' }}>Due date: 5th of every month</p>
              <Button className="w-full" style={{ background: '#1D9E75' }}>
                Mark as Paid
              </Button>
            </Card>
            
            {/* This Month Charges */}
            <Card className="p-4">
              <p className="font-semibold mb-3" style={{ color: '#111827' }}>This Month Charges</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7280' }}>Rent</span>
                  <span style={{ color: '#111827' }}>₹8,500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7280' }}>Electricity (45 units)</span>
                  <span style={{ color: '#111827' }}>₹450</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7280' }}>Water</span>
                  <span style={{ color: '#111827' }}>₹80</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7280' }}>Food</span>
                  <span style={{ color: '#111827' }}>₹0</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t" style={{ borderColor: '#E5E7EB' }}>
                  <span className="font-semibold" style={{ color: '#111827' }}>Total</span>
                  <span className="font-semibold" style={{ color: '#1D9E75' }}>₹9,030</span>
                </div>
              </div>
            </Card>
            
            {/* Status Items */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Agreement</p>
                <Badge style={{ background: '#E1F5EE', color: '#085041', fontSize: '12px' }}>Signed ✓</Badge>
              </Card>
              <Card className="p-3">
                <p className="text-xs mb-1" style={{ color: '#6B7280' }}>KYC</p>
                <Badge style={{ background: '#E1F5EE', color: '#085041', fontSize: '12px' }}>Verified ✓</Badge>
              </Card>
            </div>
            
            <Card className="p-3">
              <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Move-in Date</p>
              <p className="font-medium" style={{ color: '#111827' }}>15 Oct 2025</p>
            </Card>
          </TabsContent>
          
          {/* Payments Tab */}
          <TabsContent value="payments" className="mt-0 space-y-3">
            {payments.map((payment, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium" style={{ color: '#111827' }}>₹{payment.amount.toLocaleString()}</p>
                    <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{payment.method}</Badge>
                    {payment.receipt && (
                      <button className="text-xs mt-2 block" style={{ color: '#1D9E75' }}>
                        View receipt
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
          
          {/* Utilities Tab */}
          <TabsContent value="utilities" className="mt-0 space-y-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium" style={{ color: '#111827' }}>Electricity Bills</p>
              <Button size="sm" style={{ background: '#1D9E75' }}>+ Add Bill</Button>
            </div>
            
            {utilities.map((utility, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium" style={{ color: '#111827' }}>{utility.month}</p>
                    <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                      {utility.prev} → {utility.current} ({utility.units} units)
                    </p>
                  </div>
                  <p className="font-semibold" style={{ color: '#1D9E75' }}>₹{utility.amount}</p>
                </div>
                {utility.hasPhoto && (
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
                    <button className="text-xs" style={{ color: '#1D9E75' }}>View meter photo →</button>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>
          
          {/* Docs Tab */}
          <TabsContent value="docs" className="mt-0 space-y-3">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: '#111827' }}>Rental Agreement</p>
                  <Badge className="mt-1" style={{ background: '#E1F5EE', color: '#085041' }}>Signed</Badge>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: '#111827' }}>Move-in Checklist</p>
                  <p className="text-xs mt-1" style={{ color: '#6B7280' }}>15 Oct 2025</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
