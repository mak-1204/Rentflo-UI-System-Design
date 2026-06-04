import { ChevronLeft, Share2, Coffee, UtensilsCrossed, Moon } from 'lucide-react'; import { useNavigate } from 'react-router'; import { Button } from '@stayflo/ui';
import { Card } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';

export function OwnerFoodDashboard() {
  const navigate = useNavigate();
  
  const meals = [
    { type: 'Breakfast', icon: Coffee, count: 8, color: '#1D9E75', bgColor: '#E1F5EE', time: '8:00–9:00 AM' },
    { type: 'Lunch', icon: UtensilsCrossed, count: 11, color: '#EF9F27', bgColor: '#FAEEDA', time: '12:00–1:00 PM' },
    { type: 'Dinner', icon: Moon, count: 9, color: '#534AB7', bgColor: '#EEEDFE', time: '7:00–8:00 PM' },
  ];
  
  const breakdown = [
    { name: 'Amit Kumar', room: 4, b: true, l: false, d: true },
    { name: 'Priya Sharma', room: 7, b: true, l: true, d: true },
    { name: 'Rahul Verma', room: 11, b: false, l: true, d: true },
    { name: 'Sneha Patel', room: 3, b: true, l: true, d: true },
    { name: 'Vikram Singh', room: 9, b: true, l: true, d: false },
    { name: 'Ananya Reddy', room: 2, b: true, l: true, d: true },
    { name: 'Karthik Iyer', room: 6, b: false, l: true, d: true },
    { name: 'Meera Nair', room: 8, b: true, l: false, d: true },
  ];
  
  return (
    <div className="h-full flex flex-col" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-4 bg-white border-b" style={{ borderColor: '#E5E7EB' }}>
        <button onClick={() => navigate(-1)} className="mb-4 -ml-2">
          <ChevronLeft className="w-6 h-6" style={{ color: '#111827' }} />
        </button>
        <h1 className="text-2xl font-semibold" style={{ color: '#111827' }}>
          Food Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Tomorrow — Wed 18 Jun</p>
      </div>
      
      {/* Day Tabs */}
      <div className="px-4 py-3 bg-white border-b flex gap-2 overflow-x-auto" style={{ borderColor: '#E5E7EB' }}>
        <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#F8F9FA', color: '#6B7280' }}>
          Yesterday
        </button>
        <button className="px-4 py-2 rounded-lg whitespace-nowrap" style={{ background: '#F8F9FA', color: '#6B7280' }}>
          Today
        </button>
        <button className="px-4 py-2 rounded-lg font-medium whitespace-nowrap" style={{ background: '#E1F5EE', color: '#1D9E75' }}>
          Tomorrow
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Status Badge */}
        <div className="mb-4 flex justify-center">
          <Badge style={{ background: '#FAEEDA', color: '#633806', padding: '8px 16px' }}>
            Booking closed · 9:00 PM
          </Badge>
        </div>
        
        {/* Meal Count Cards */}
        <div className="space-y-3 mb-6">
          {meals.map((meal) => (
            <Card 
              key={meal.type} 
              className="p-6"
              style={{ background: meal.bgColor, border: 'none' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: '#FFFFFF' }}
                  >
                    <meal.icon className="w-7 h-7" style={{ color: meal.color }} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold" style={{ color: '#111827' }}>
                      {meal.type}
                    </p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>
                      {meal.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold" style={{ color: meal.color }}>
                    {meal.count}
                  </p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>
                    booked
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Share Button */}
        <Button 
          className="w-full h-12 mb-6"
          style={{ background: '#25D366', color: '#FFFFFF' }}
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share Count with Cook
        </Button>
        
        {/* Breakdown */}
        <div className="mb-4">
          <p className="text-lg font-semibold mb-3" style={{ color: '#111827' }}>
            Breakdown
          </p>
          
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#F8F9FA' }}>
                    <th className="text-left text-xs font-medium px-4 py-3" style={{ color: '#6B7280' }}>Name</th>
                    <th className="text-center text-xs font-medium px-2 py-3" style={{ color: '#6B7280' }}>Room</th>
                    <th className="text-center text-xs font-medium px-2 py-3" style={{ color: '#6B7280' }}>B</th>
                    <th className="text-center text-xs font-medium px-2 py-3" style={{ color: '#6B7280' }}>L</th>
                    <th className="text-center text-xs font-medium px-2 py-3" style={{ color: '#6B7280' }}>D</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((tenant, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: '#E5E7EB' }}>
                      <td className="text-sm px-4 py-3" style={{ color: '#111827' }}>{tenant.name}</td>
                      <td className="text-sm text-center px-2 py-3" style={{ color: '#6B7280' }}>{tenant.room}</td>
                      <td className="text-center px-2 py-3">
                        {tenant.b ? <span style={{ color: '#1D9E75' }}>✓</span> : <span style={{ color: '#E5E7EB' }}>✗</span>}
                      </td>
                      <td className="text-center px-2 py-3">
                        {tenant.l ? <span style={{ color: '#1D9E75' }}>✓</span> : <span style={{ color: '#E5E7EB' }}>✗</span>}
                      </td>
                      <td className="text-center px-2 py-3">
                        {tenant.d ? <span style={{ color: '#1D9E75' }}>✓</span> : <span style={{ color: '#E5E7EB' }}>✗</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
