import { useState } from 'react'; import { useNavigate } from 'react-router'; import { RentfloLogo } from '@rentflo/ui';
import { Button } from '@rentflo/ui';
import { Card } from '@rentflo/ui';

export function PortfolioLeadCapture() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    type: 'Single',
    moveIn: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('explore');
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-between p-6 text-left"
      style={{ background: '#0D0D0D', color: '#F5F5F0' }}
    >
      {/* Load Cormorant Garamond */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      
      <div className="flex-1 flex flex-col justify-center items-center py-12 max-w-md mx-auto w-full">
        <RentfloLogo variant="white" className="text-3xl mb-8" />
        
        <h1 
          className="text-4xl text-center mb-2"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
        >
          You're one step away
        </h1>
        <p 
          className="text-sm text-center mb-8"
          style={{ color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}
        >
          Enter your details to explore Sunrise PG
        </p>

        <Card 
          className="w-full p-6 border border-neutral-850"
          style={{ background: '#131313' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: '#9CA3AF' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aditi Nair"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] bg-neutral-950 text-sm text-[#F5F5F0]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: '#9CA3AF' }}>
                Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-neutral-800 bg-neutral-950 text-sm" style={{ color: '#9CA3AF' }}>
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-r-lg border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] bg-neutral-950 text-sm text-[#F5F5F0]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: '#9CA3AF' }}>
                Looking for?
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] bg-neutral-950 text-sm text-[#F5F5F0]"
              >
                <option value="Single">Single Occupancy</option>
                <option value="Double">Double Occupancy</option>
                <option value="Triple">Triple Occupancy</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: '#9CA3AF' }}>
                Move-in Date
              </label>
              <input
                type="date"
                required
                value={form.moveIn}
                onChange={(e) => setForm({ ...form, moveIn: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#1D9E75] bg-neutral-950 text-sm text-[#F5F5F0]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 mt-4 text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity" 
              style={{ background: '#1D9E75', color: '#FFFFFF' }}
            >
              Explore Sunrise PG →
            </Button>
          </form>
        </Card>
      </div>

      <p className="text-[10px] text-center" style={{ color: '#6B7280' }}>
        By continuing, you agree to our Terms. We promise never to spam you.
      </p>
    </div>
  );
}
