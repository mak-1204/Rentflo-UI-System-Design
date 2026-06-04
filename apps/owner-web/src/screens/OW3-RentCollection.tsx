import { useState, useEffect } from 'react'; import { Download, Bell, Check, Zap, Droplets, Image as ImageIcon, CheckCircle, X, CreditCard, DollarSign, RefreshCw } from 'lucide-react'; import { Card } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';
import { Button } from '@stayflo/ui';
import { Input } from '@stayflo/ui';

interface RentRecord {
  name: string;
  room: string;
  rent: number;
  utilities: number;
  lateFee: number;
  status: 'Paid' | 'Overdue' | 'Delay Approved' | 'Delay Requested';
  date: string;
  method: string;
}

export function OwnerWebRentCollection() {
  const [rentData, setRentData] = useState<RentRecord[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('stayflo_rent_records') : null;
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { name: 'Amit Kumar', room: 'Room 4', rent: 8500, utilities: 530, lateFee: 250, status: 'Overdue', date: '-', method: '-' },
      { name: 'Sanjay Ramaswamy', room: 'Room 2', rent: 8500, utilities: 450, lateFee: 0, status: 'Paid', date: '05 Jun 2026', method: 'Razorpay UPI' },
      { name: 'Vijay Nair', room: 'Room 8', rent: 9200, utilities: 480, lateFee: 0, status: 'Paid', date: '04 Jun 2026', method: 'Cash' },
      { name: 'Rahul Verma', room: 'Room 11', rent: 8000, utilities: 420, lateFee: 0, status: 'Delay Requested', date: '-', method: '-' },
    ];
  });

  const [notif, setNotif] = useState<string | null>(null);

  // Save rent records
  useEffect(() => {
    localStorage.setItem('stayflo_rent_records', JSON.stringify(rentData));
  }, [rentData]);

  // Utility calculator states
  const [calcRoom, setCalcRoom] = useState('Room 4');
  const [calcType, setCalcType] = useState<'electricity' | 'water'>('electricity');
  const [prevReading, setPrevReading] = useState(1240);
  const [currReading, setCurrReading] = useState(1325);
  const [unitRate, setUnitRate] = useState(8); // BESCOM rate per unit
  const [calculatedCharges, setCalculatedCharges] = useState(0);
  const [uploadedMeterPhoto, setUploadedMeterPhoto] = useState('https://images.unsplash.com/photo-1590133322246-7f8a3ecf5cca?auto=format&fit=crop&w=300&q=80');

  // Payment Collector state
  const [activeCollectTenant, setActiveCollectTenant] = useState<RentRecord | null>(null);
  const [collectMethod, setCollectMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Calculate utility charges dynamically
  useEffect(() => {
    if (calcType === 'electricity') {
      const units = Math.max(0, currReading - prevReading);
      setCalculatedCharges(units * unitRate);
    } else {
      // water flat tanker fee or flat charges
      setCalculatedCharges(unitRate); // water flat charge or input value
    }
  }, [prevReading, currReading, unitRate, calcType]);

  const triggerToast = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  const handleApplyCalculatedUtilities = () => {
    // find tenant with matching room
    const index = rentData.findIndex(r => r.room === calcRoom);
    if (index === -1) {
      triggerToast(`No tenant found in ${calcRoom}!`);
      return;
    }

    setRentData(prev => prev.map((item, idx) => 
      idx === index 
        ? { ...item, utilities: item.utilities + calculatedCharges } 
        : item
    ));

    triggerToast(`Added ₹${calculatedCharges} in utility charges to ${rentData[index].name} (${calcRoom})!`);
  };

  const triggerReminder = (name: string, phone: string = '+919876543210') => {
    const msg = `Hi ${name}, this is a gentle reminder that your PG rent & utilities due is pending. Please pay using UPI/Stripe inside the Stayflo app. Thanks!`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    triggerToast(`Sent WhatsApp Rent reminder to ${name}!`);
  };

  const handleApproveDelay = (name: string) => {
    setRentData(prev => prev.map(item => 
      item.name === name 
        ? { ...item, status: 'Delay Approved', lateFee: 0 } // waive late fee on delay approval
        : item
    ));
    triggerToast(`Delay approved for ${name}. Late fees waived successfully!`);
  };

  const handleCollectPayment = () => {
    if (!activeCollectTenant) return;
    setIsProcessingPayment(true);
    
    setTimeout(() => {
      setRentData(prev => prev.map(item => 
        item.name === activeCollectTenant.name 
          ? { 
              ...item, 
              status: 'Paid', 
              date: 'Today', 
              method: collectMethod === 'upi' ? 'Razorpay UPI' : collectMethod === 'card' ? 'Stripe Card' : 'Cash Counter' 
            } 
          : item
      ));
      setIsProcessingPayment(false);
      setActiveCollectTenant(null);
      triggerToast(`Payment of ₹${(activeCollectTenant.rent + activeCollectTenant.utilities + activeCollectTenant.lateFee).toLocaleString()} processed successfully!`);
    }, 1500);
  };

  const totalDues = (r: RentRecord) => r.rent + r.utilities + r.lateFee;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto relative text-left min-h-screen" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Toast */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold z-50 animate-in fade-in duration-300">
          <Check className="w-4 h-4 text-[#14b8a6]" /> {notif}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>Rent & Utility Bills</h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">Track monthly rent collections, calculate utility bills, and authorize payment delay waivers</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 whitespace-nowrap rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-700 h-10 px-4 transition-all shadow-sm" 
            onClick={() => triggerToast('CSV exported!')}
          >
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Grid: Main metrics, Utility calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Rent Collection & Dues */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Collection Status strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-[10px] font-extrabold text-slate-455 uppercase tracking-wider mb-1.5">Collected Dues</p>
              <p className="text-2xl font-extrabold text-teal-600 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
                ₹{rentData.filter(r => r.status === 'Paid').reduce((acc, r) => acc + totalDues(r), 0).toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400 font-semibold block mt-1">{rentData.filter(r => r.status === 'Paid').length} tenants cleared</span>
            </Card>

            <Card className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-[10px] font-extrabold text-slate-455 uppercase tracking-wider mb-1.5">Pending Dues</p>
              <p className="text-2xl font-extrabold text-amber-600 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
                ₹{rentData.filter(r => r.status !== 'Paid').reduce((acc, r) => acc + totalDues(r), 0).toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400 font-semibold block mt-1">{rentData.filter(r => r.status !== 'Paid').length} pending collection</span>
            </Card>

            <Card className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-[10px] font-extrabold text-slate-455 uppercase tracking-wider mb-1.5">Accumulated Late Fees</p>
              <p className="text-2xl font-extrabold text-rose-600 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
                ₹{rentData.reduce((acc, r) => acc + r.lateFee, 0).toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400 font-semibold block mt-1">₹250 default applied past due date</span>
            </Card>
          </div>

          {/* Dues Tracking Table */}
          <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Resident</th>
                    <th className="px-6 py-4 text-center">Room</th>
                    <th className="px-6 py-4">Rent</th>
                    <th className="px-6 py-4">Utilities</th>
                    <th className="px-6 py-4">Late Fee</th>
                    <th className="px-6 py-4">Total Due</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white text-sm">
                  {rentData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/40 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">{row.name}</span>
                        {row.status === 'Paid' && (
                          <span className="block text-[10px] font-medium text-slate-400 mt-0.5">via {row.method}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="outline" className="text-[10px] font-bold border-slate-200/80 text-slate-650 rounded-md bg-white px-2 py-0.5">{row.room}</Badge>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">₹{row.rent.toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">₹{row.utilities}</td>
                      <td className="px-6 py-4 text-rose-600 font-semibold text-xs">₹{row.lateFee}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">₹{totalDues(row).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge style={{
                          background:
                            row.status === 'Paid' ? '#f0fdfa' :
                            row.status === 'Overdue' ? '#FCEBEB' :
                            row.status === 'Delay Approved' ? '#E6F1FB' : '#FAEEDA',
                          color:
                            row.status === 'Paid' ? '#0f766e' :
                            row.status === 'Overdue' ? '#791F1F' :
                            row.status === 'Delay Approved' ? '#0c447c' : '#633806'
                        }} className="border-none font-bold text-[10px] px-2 py-0.5 rounded-md">
                          {row.status === 'Delay Requested' ? 'Delay Request ⚡' : row.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {row.status === 'Delay Requested' && (
                            <Button 
                              size="sm" 
                              style={{ background: '#14b8a6', color: '#FFFFFF' }}
                              className="text-xs font-bold rounded-lg h-8 px-3 border-none cursor-pointer"
                              onClick={() => handleApproveDelay(row.name)}
                            >
                              Approve Delay
                            </Button>
                          )}
                          {row.status !== 'Paid' ? (
                            <>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-teal-600 hover:bg-teal-50/50 text-xs font-bold rounded-xl transition-all px-3 h-8 border border-transparent hover:border-teal-100"
                                onClick={() => setActiveCollectTenant(row)}
                              >
                                Collect
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all px-2.5 h-8 border border-transparent hover:border-slate-100"
                                onClick={() => triggerReminder(row.name)}
                              >
                                <Bell className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          ) : (
                            <span className="text-xs text-teal-600 font-bold flex items-center gap-0.5">
                              <Check className="w-3.5 h-3.5" /> Cleared
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>

        {/* Right Column: Utility calculator tool */}
        <div className="space-y-6">
          
          <Card className="p-8 space-y-5 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <Zap className="w-5 h-5 text-amber-500" /> Utility Bill Calculator
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">Calculate electricity and water charges floor-wise and apply directly to resident ledgers</p>
            
            <div className="flex border border-slate-150 rounded-xl overflow-hidden p-0.5 bg-slate-50">
              <button 
                onClick={() => { setCalcType('electricity'); setUnitRate(8); }}
                className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wide rounded-lg transition-all ${calcType === 'electricity' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Electricity
              </button>
              <button 
                onClick={() => { setCalcType('water'); setUnitRate(450); }}
                className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wide rounded-lg transition-all ${calcType === 'water' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Water Tanker
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Target Resident Room</label>
                <select 
                  value={calcRoom}
                  onChange={(e) => setCalcRoom(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner cursor-pointer"
                >
                  {rentData.map(r => (
                    <option key={r.room} value={r.room}>{r.room} - {r.name}</option>
                  ))}
                </select>
              </div>

              {calcType === 'electricity' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Previous Unit</label>
                      <Input type="number" value={prevReading} onChange={(e) => setPrevReading(+e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Current Unit</label>
                      <Input type="number" value={currReading} onChange={(e) => setCurrReading(+e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Unit Rate (BESCOM ₹)</label>
                    <Input type="number" value={unitRate} onChange={(e) => setUnitRate(+e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Water tanker / Flat charge (₹)</label>
                  <Input type="number" value={unitRate} onChange={(e) => setUnitRate(+e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner" />
                </div>
              )}

              {/* Meter Photo preview */}
              <div className="pt-2">
                <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span>Meter Reading Reference Photo</span>
                  <span className="text-[10px] text-teal-600 font-bold lowercase">Simulated Upload ✓</span>
                </label>
                <div className="h-28 border border-slate-100 rounded-xl overflow-hidden relative group bg-slate-50 flex items-center justify-center shadow-inner">
                  <img src={uploadedMeterPhoto} className="w-full h-full object-cover brightness-90" alt="Meter reading reference" />
                  <button 
                    onClick={() => triggerToast('Photo upload simulation started! Select a file...')}
                    className="absolute inset-0 bg-slate-950/40 text-white flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" /> Change Photo
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                <div className="flex justify-between font-bold text-slate-800 text-sm">
                  <span>Calculated Due:</span>
                  <span className="text-[#14b8a6] text-base">₹{calculatedCharges}</span>
                </div>
                {calcType === 'electricity' && (
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">({currReading - prevReading} units consumed at ₹{unitRate}/unit)</p>
                )}
              </div>

              <Button 
                style={{ background: '#14b8a6', color: '#FFFFFF' }} 
                className="w-full font-bold uppercase tracking-wider text-xs h-11 hover:opacity-95 rounded-xl border-none shadow-md shadow-teal-500/10 cursor-pointer"
                onClick={handleApplyCalculatedUtilities}
              >
                Apply Utility Charges
              </Button>
            </div>
          </Card>

        </div>

      </div>

      {/* Virtual Razorpay/Stripe Collect Payment Drawer Modal */}
      {activeCollectTenant && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="w-[420px] p-6 space-y-4 bg-white relative rounded-2xl border border-slate-100 shadow-2xl">
            <button 
              onClick={() => setActiveCollectTenant(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>Collect Dues Simulation</h3>
              <p className="text-xs text-slate-500">Log transactions or request Razorpay/UPI payments for {activeCollectTenant.name}</p>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 text-xs space-y-2.5 font-medium">
              <div className="flex justify-between text-slate-600">
                <span>Room Number</span>
                <span className="font-bold text-slate-900">{activeCollectTenant.room}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Monthly Rent</span>
                <span className="font-bold text-slate-900">₹{activeCollectTenant.rent}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Utilities Dues</span>
                <span className="font-bold text-slate-900">₹{activeCollectTenant.utilities}</span>
              </div>
              {activeCollectTenant.lateFee > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Late Fee Applied</span>
                  <span>₹{activeCollectTenant.lateFee}</span>
                </div>
              )}
              <hr className="border-slate-100" />
              <div className="flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Charge Amount:</span>
                <span className="text-[#14b8a6]">₹{totalDues(activeCollectTenant).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Select Sourcing Gateway</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCollectMethod('upi')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-[10px] transition-all cursor-pointer ${collectMethod === 'upi' ? 'border-[#14b8a6] bg-teal-50/50 text-[#14b8a6] font-bold' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  <CheckCircle className={`w-4 h-4 ${collectMethod === 'upi' ? 'text-[#14b8a6]' : 'text-slate-300'}`} />
                  <span>Razorpay UPI</span>
                </button>
                <button
                  onClick={() => setCollectMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-[10px] transition-all cursor-pointer ${collectMethod === 'card' ? 'border-[#14b8a6] bg-teal-50/50 text-[#14b8a6] font-bold' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  <CreditCard className={`w-4 h-4 ${collectMethod === 'card' ? 'text-[#14b8a6]' : 'text-slate-300'}`} />
                  <span>Stripe Card</span>
                </button>
                <button
                  onClick={() => setCollectMethod('cash')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-[10px] transition-all cursor-pointer ${collectMethod === 'cash' ? 'border-[#14b8a6] bg-teal-50/50 text-[#14b8a6] font-bold' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  <DollarSign className={`w-4 h-4 ${collectMethod === 'cash' ? 'text-[#14b8a6]' : 'text-slate-300'}`} />
                  <span>Cash Payment</span>
                </button>
              </div>
            </div>

            {collectMethod === 'upi' && (
              <div className="p-3.5 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-3.5">
                {/* Simulated QR Code box */}
                <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center text-[10px] text-slate-800 font-bold select-none p-1">
                  {/* Mock QR */}
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100">
                    <rect width="25" height="25" fill="currentColor"/>
                    <rect x="75" width="25" height="25" fill="currentColor"/>
                    <rect y="75" width="25" height="25" fill="currentColor"/>
                    <rect x="35" y="35" width="30" height="30" fill="currentColor"/>
                  </svg>
                </div>
                <div className="text-left text-xs space-y-0.5">
                  <p className="font-bold text-slate-100">Scan to pay UPI</p>
                  <p className="text-slate-450 mt-0.5 text-[10px]">Merchant: stayflo.sunrise@razorpay</p>
                </div>
              </div>
            )}

            <Button
              style={{ background: '#14b8a6', color: '#FFFFFF' }}
              className="w-full font-bold uppercase tracking-wider text-xs h-11 flex items-center justify-center gap-2 hover:opacity-95 rounded-xl border-none shadow-md shadow-teal-500/10 cursor-pointer"
              onClick={handleCollectPayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Processing Transaction...
                </>
              ) : (
                <span>Confirm Payment Receipt</span>
              )}
            </Button>
          </Card>
        </div>
      )}

    </div>
  );
}
