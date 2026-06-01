import { useState, useEffect } from 'react'; import { Download, Bell, Check, Zap, Droplets, Image as ImageIcon, CheckCircle, X, CreditCard, DollarSign, RefreshCw } from 'lucide-react'; import { Card } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';
import { Input } from '@rentflo/ui';

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
    const saved = localStorage.getItem('rentflo_rent_records');
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
    localStorage.setItem('rentflo_rent_records', JSON.stringify(rentData));
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
    const msg = `Hi ${name}, this is a gentle reminder that your PG rent & utilities due is pending. Please pay using UPI/Stripe inside the Rentflo app. Thanks!`;
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
    <div className="p-8 space-y-6 max-w-7xl mx-auto relative text-left bg-[#F8F9FA] min-h-screen">
      {/* Toast */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-[#111827] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold z-50 animate-bounce">
          <Check className="w-4 h-4 text-[#1D9E75]" /> {notif}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Rent & Utility Bills</h1>
          <p className="text-slate-500 mt-1">Track monthly rent collections, calculate utility bills, and authorize payment delay waivers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => triggerToast('CSV exported!')}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Grid: Main metrics, Utility calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Rent Collection & Dues */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Collection Status strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 bg-teal-50 border-teal-200">
              <p className="text-xs font-bold text-teal-800 uppercase tracking-wider">Collected Dues</p>
              <p className="text-2xl font-bold text-teal-900 mt-1">
                ₹{rentData.filter(r => r.status === 'Paid').reduce((acc, r) => acc + totalDues(r), 0).toLocaleString()}
              </p>
              <span className="text-[10px] text-teal-600 font-semibold">{rentData.filter(r => r.status === 'Paid').length} tenants cleared</span>
            </Card>

            <Card className="p-5 bg-orange-50 border-orange-200">
              <p className="text-xs font-bold text-orange-800 uppercase tracking-wider">Pending Dues</p>
              <p className="text-2xl font-bold text-orange-950 mt-1 font-mono">
                ₹{rentData.filter(r => r.status !== 'Paid').reduce((acc, r) => acc + totalDues(r), 0).toLocaleString()}
              </p>
              <span className="text-[10px] text-orange-600 font-semibold">{rentData.filter(r => r.status !== 'Paid').length} pending collection</span>
            </Card>

            <Card className="p-5 bg-rose-50 border-rose-200">
              <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Accumulated Late Fees</p>
              <p className="text-2xl font-bold text-rose-950 mt-1 font-mono">
                ₹{rentData.reduce((acc, r) => acc + r.lateFee, 0).toLocaleString()}
              </p>
              <span className="text-[10px] text-rose-600 font-semibold">₹250 default applied past due date</span>
            </Card>
          </div>

          {/* Dues Tracking Table */}
          <Card className="overflow-hidden border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
              <tbody className="divide-y divide-slate-100 bg-white text-sm">
                {rentData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {row.name}
                      {row.status === 'Paid' && (
                        <span className="block text-[10px] font-normal text-slate-400">via {row.method}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline">{row.room}</Badge>
                    </td>
                    <td className="px-6 py-4">₹{row.rent.toLocaleString()}</td>
                    <td className="px-6 py-4">₹{row.utilities}</td>
                    <td className="px-6 py-4 text-rose-600 font-medium">₹{row.lateFee}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">₹{totalDues(row).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Badge style={{
                        background:
                          row.status === 'Paid' ? '#E1F5EE' :
                          row.status === 'Overdue' ? '#FCEBEB' :
                          row.status === 'Delay Approved' ? '#E6F1FB' : '#FAEEDA',
                        color:
                          row.status === 'Paid' ? '#085041' :
                          row.status === 'Overdue' ? '#791F1F' :
                          row.status === 'Delay Approved' ? '#0C447C' : '#633806'
                      }} className="border-none font-semibold">
                        {row.status === 'Delay Requested' ? 'Delay Request ⚡' : row.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {row.status === 'Delay Requested' && (
                          <Button 
                            size="sm" 
                            style={{ background: '#0C447C', color: '#FFFFFF' }}
                            className="text-xs hover:bg-[#08335C]"
                            onClick={() => handleApproveDelay(row.name)}
                          >
                            Approve Delay
                          </Button>
                        )}
                        {row.status !== 'Paid' ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-xs"
                              onClick={() => setActiveCollectTenant(row)}
                            >
                              Collect
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-orange-600 hover:bg-orange-50 text-xs"
                              onClick={() => triggerReminder(row.name)}
                            >
                              <Bell className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-teal-600 font-semibold flex items-center gap-0.5">
                            <Check className="w-3.5 h-3.5" /> Cleared
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

        </div>

        {/* Right Column: Utility calculator tool */}
        <div className="space-y-6">
          
          <Card className="p-6 space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Utility Bill Calculator
            </h3>
            <p className="text-xs text-slate-500">Calculate electricity and water charges floor-wise and apply directly to resident ledgers</p>
            
            <div className="flex border rounded-lg overflow-hidden p-0.5 bg-slate-100">
              <button 
                onClick={() => { setCalcType('electricity'); setUnitRate(8); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${calcType === 'electricity' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Electricity
              </button>
              <button 
                onClick={() => { setCalcType('water'); setUnitRate(450); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${calcType === 'water' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Water Tanker
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Target Resident Room</label>
                <select 
                  value={calcRoom}
                  onChange={(e) => setCalcRoom(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {rentData.map(r => (
                    <option key={r.room} value={r.room}>{r.room} - {r.name}</option>
                  ))}
                </select>
              </div>

              {calcType === 'electricity' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Previous Unit</label>
                      <Input type="number" value={prevReading} onChange={(e) => setPrevReading(+e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Current Unit</label>
                      <Input type="number" value={currReading} onChange={(e) => setCurrReading(+e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Unit Rate (BESCOM ₹)</label>
                    <Input type="number" value={unitRate} onChange={(e) => setUnitRate(+e.target.value)} />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Water tanker / Flat charge (₹)</label>
                  <Input type="number" value={unitRate} onChange={(e) => setUnitRate(+e.target.value)} />
                </div>
              )}

              {/* Meter Photo preview */}
              <div className="pt-2">
                <label className="block text-slate-500 font-bold mb-1 flex items-center justify-between">
                  <span>Meter Reading Reference Photo</span>
                  <span className="text-[10px] text-teal-600">Simulated Upload ✓</span>
                </label>
                <div className="h-28 border rounded-lg overflow-hidden relative group bg-slate-50 flex items-center justify-center">
                  <img src={uploadedMeterPhoto} className="w-full h-full object-cover brightness-90" alt="Meter reading reference" />
                  <button 
                    onClick={() => triggerToast('Photo upload simulation started! Select a file...')}
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    <ImageIcon className="w-4 h-4" /> Change Photo
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between font-bold text-slate-800 text-sm">
                  <span>Calculated Due:</span>
                  <span className="text-[#1D9E75]">₹{calculatedCharges}</span>
                </div>
                {calcType === 'electricity' && (
                  <p className="text-[10px] text-slate-400 mt-1">({currReading - prevReading} units consumed at ₹{unitRate}/unit)</p>
                )}
              </div>

              <Button 
                style={{ background: '#1D9E75', color: '#FFFFFF' }} 
                className="w-full font-bold uppercase tracking-wider text-xs h-10 hover:bg-[#0F6E56]"
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
          <Card className="w-[420px] p-6 space-y-4 bg-white relative">
            <button 
              onClick={() => setActiveCollectTenant(null)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Collect Dues Simulation</h3>
              <p className="text-xs text-slate-500">Log transactions or request Razorpay/UPI payments for {activeCollectTenant.name}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Room Number</span>
                <span className="font-semibold text-slate-900">{activeCollectTenant.room}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Monthly Rent</span>
                <span className="font-semibold text-slate-900">₹{activeCollectTenant.rent}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Utilities Dues</span>
                <span className="font-semibold text-slate-900">₹{activeCollectTenant.utilities}</span>
              </div>
              {activeCollectTenant.lateFee > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Late Fee Applied</span>
                  <span className="font-semibold">₹{activeCollectTenant.lateFee}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-sm font-bold text-slate-900">
                <span>Total Charge Amount:</span>
                <span className="text-[#1D9E75]">₹{totalDues(activeCollectTenant).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-slate-500">Select Sourcing Gateway</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCollectMethod('upi')}
                  className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 text-xs transition-all ${collectMethod === 'upi' ? 'border-[#1D9E75] bg-teal-50 text-[#1D9E75] font-semibold' : 'bg-white'}`}
                >
                  <CheckCircle className={`w-4 h-4 ${collectMethod === 'upi' ? 'text-[#1D9E75]' : 'text-slate-300'}`} />
                  <span>Razorpay UPI</span>
                </button>
                <button
                  onClick={() => setCollectMethod('card')}
                  className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 text-xs transition-all ${collectMethod === 'card' ? 'border-[#1D9E75] bg-teal-50 text-[#1D9E75] font-semibold' : 'bg-white'}`}
                >
                  <CreditCard className={`w-4 h-4 ${collectMethod === 'card' ? 'text-[#1D9E75]' : 'text-slate-300'}`} />
                  <span>Stripe Card</span>
                </button>
                <button
                  onClick={() => setCollectMethod('cash')}
                  className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 text-xs transition-all ${collectMethod === 'cash' ? 'border-[#1D9E75] bg-teal-50 text-[#1D9E75] font-semibold' : 'bg-white'}`}
                >
                  <DollarSign className={`w-4 h-4 ${collectMethod === 'cash' ? 'text-[#1D9E75]' : 'text-slate-300'}`} />
                  <span>Cash Payment</span>
                </button>
              </div>
            </div>

            {collectMethod === 'upi' && (
              <div className="p-3 bg-neutral-900 text-white rounded-lg flex items-center justify-center gap-3">
                {/* Simulated QR Code box */}
                <div className="w-16 h-16 bg-white rounded border flex items-center justify-center text-[10px] text-slate-800 font-bold select-none p-1">
                  {/* Mock QR */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <rect width="25" height="25" fill="currentColor"/>
                    <rect x="75" width="25" height="25" fill="currentColor"/>
                    <rect y="75" width="25" height="25" fill="currentColor"/>
                    <rect x="35" y="35" width="30" height="30" fill="currentColor"/>
                  </svg>
                </div>
                <div className="text-left text-xs">
                  <p className="font-bold">Scan to pay UPI</p>
                  <p className="text-slate-400 mt-0.5 text-[10px]">Merchant: rentflo.sunrise@razorpay</p>
                </div>
              </div>
            )}

            <Button
              style={{ background: '#1D9E75', color: '#FFFFFF' }}
              className="w-full font-bold uppercase tracking-wider text-xs h-11 flex items-center justify-center gap-2 hover:bg-[#0F6E56]"
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
