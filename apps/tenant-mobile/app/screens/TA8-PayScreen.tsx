import { ChevronLeft } from 'lucide-react'; import { useNavigate } from 'react-router'; import { Button } from '@rentflo/ui';
import { Card } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';

export function TenantPayScreen() {
  const navigate = useNavigate();
  
  return (
    <div className="h-full flex flex-col" style={{ background: '#F8F9FA' }}>
      <div className="px-4 pt-12 pb-4 bg-white border-b" style={{ borderColor: '#E5E7EB' }}>
        <button onClick={() => navigate(-1)} className="mb-4 -ml-2">
          <ChevronLeft className="w-6 h-6" style={{ color: '#111827' }} />
        </button>
        <h1 className="text-2xl font-semibold" style={{ color: '#111827' }}>Payment</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>June 2026 dues</p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <Card className="p-6 mb-4">
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>Itemized Breakdown</p>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: '#6B7280' }}>Rent</span>
              <span className="text-sm font-medium" style={{ color: '#111827' }}>₹8,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: '#6B7280' }}>Electricity (45 units)</span>
              <span className="text-sm font-medium" style={{ color: '#111827' }}>₹450</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: '#6B7280' }}>Water</span>
              <span className="text-sm font-medium" style={{ color: '#111827' }}>₹80</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: '#6B7280' }}>Food charges</span>
              <span className="text-sm font-medium" style={{ color: '#111827' }}>₹0</span>
            </div>
            
            <div className="pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold" style={{ color: '#111827' }}>Total</span>
                <span className="text-3xl font-bold" style={{ color: '#1D9E75' }}>₹9,030</span>
              </div>
            </div>
          </div>
        </Card>
        
        <Button className="w-full h-14 text-lg mb-3" style={{ background: '#1D9E75' }}>
          Pay ₹9,030
        </Button>
        
        <Button variant="outline" className="w-full h-12">
          Request Payment Delay
        </Button>
      </div>
    </div>
  );
}
