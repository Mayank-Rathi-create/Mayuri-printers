import React, { useState } from 'react';
import { X, Box, CheckCircle2, Truck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { addStoredOrder } from '../../utils/orderStorage';

interface SampleBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SampleBoxModal: React.FC<SampleBoxModalProps> = ({ isOpen, onClose }) => {
  const [ordered, setOrdered] = useState(false);
  const [boxData, setBoxData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    selectedSwatches: [
      '45-450 GSM Paper Swatch Fan Deck',
      'Hot Foil Stamping Shade Card (24K Gold, Rose, Holo)',
      'Smyth-Sewn Thread Signature Specimen',
      'Carbonless (NCR) 3-Part Transfer Test Pad',
    ],
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Automatically record sample box shipment order in the Admin Portal
    addStoredOrder({
      id: `MP-BOX-${Math.floor(100 + Math.random() * 900)}`,
      client: boxData.company ? `${boxData.company} (${boxData.name})` : boxData.name || 'Sample Kit Request',
      location: `${boxData.address || 'Courier Dispatch'} • Ph: ${boxData.phone}`,
      product: 'Mayuri Deluxe Paper Specimen & Foil Sample Box',
      amount: '1 Deluxe Box Kit',
      price: 'Free Sample Kit',
      specs: `Swatches: ${boxData.selectedSwatches.join(', ')} • Recipient: ${boxData.email}`,
      status: 'not_started',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isNew: true,
    });

    setOrdered(true);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#D6AD61', '#FFFFFF', '#10B981'],
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#141821] border border-[#292F3B] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Subtle Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#D6AD61]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#A1A8B5] hover:text-[#F5F3ED] bg-[#1A202B] border border-[#292F3B] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!ordered ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-technical text-[#D6AD61] font-semibold mb-2">
              <Box className="w-4 h-4" />
              <span>MAYURI CURATED PAPER SPECIMEN BOX</span>
            </div>

            <h3 className="text-2xl font-editorial font-bold text-[#F5F3ED]">
              Request Tangible Paper Swatches & Foil Cards
            </h3>
            <p className="text-xs text-[#A1A8B5] mt-1 leading-relaxed">
              Experience the actual tactile grain, caliper weight, and metallic sheen before issuing purchase orders. Delivered directly to your office via courier.
            </p>

            {/* Visual Box Kit Preview */}
            <div className="my-6 p-4 rounded-2xl bg-[#1A202B] border border-[#292F3B]">
              <div className="text-[11px] font-technical text-[#D6AD61] font-semibold uppercase mb-2">
                WHAT'S PACKAGED INSIDE THE SPECIMEN BOX:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#F5F3ED]">
                {boxData.selectedSwatches.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#141821] p-2.5 rounded-xl border border-[#292F3B]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                    <span className="leading-tight text-xs text-[#F5F3ED]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Dispatch Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-technical text-[#A1A8B5] block mb-1 font-semibold">YOUR NAME *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. S. Venkatraman"
                    value={boxData.name}
                    onChange={(e) => setBoxData({ ...boxData, name: e.target.value })}
                    className="w-full bg-[#090B10] border border-[#292F3B] rounded-xl px-3.5 py-2 text-xs text-[#F5F3ED] focus:border-[#D6AD61] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-technical text-[#A1A8B5] block mb-1 font-semibold">COMPANY / INSTITUTION *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Oxford Book Depot"
                    value={boxData.company}
                    onChange={(e) => setBoxData({ ...boxData, company: e.target.value })}
                    className="w-full bg-[#090B10] border border-[#292F3B] rounded-xl px-3.5 py-2 text-xs text-[#F5F3ED] focus:border-[#D6AD61] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-technical text-[#A1A8B5] block mb-1 font-semibold">WORK EMAIL *</label>
                  <input
                    required
                    type="email"
                    placeholder="procurement@company.com"
                    value={boxData.email}
                    onChange={(e) => setBoxData({ ...boxData, email: e.target.value })}
                    className="w-full bg-[#090B10] border border-[#292F3B] rounded-xl px-3.5 py-2 text-xs text-[#F5F3ED] focus:border-[#D6AD61] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-technical text-[#A1A8B5] block mb-1 font-semibold">PHONE NUMBER *</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98200 XXXXX"
                    value={boxData.phone}
                    onChange={(e) => setBoxData({ ...boxData, phone: e.target.value })}
                    className="w-full bg-[#090B10] border border-[#292F3B] rounded-xl px-3.5 py-2 text-xs text-[#F5F3ED] focus:border-[#D6AD61] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-technical text-[#A1A8B5] block mb-1 font-semibold">COURIER DELIVERY ADDRESS *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Street address, Office / Plant number, City, Pin code"
                  value={boxData.address}
                  onChange={(e) => setBoxData({ ...boxData, address: e.target.value })}
                  className="w-full bg-[#090B10] border border-[#292F3B] rounded-xl px-3.5 py-2 text-xs text-[#F5F3ED] focus:border-[#D6AD61] focus:outline-none resize-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-[#10B981]">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Complimentary Courier for B2B Clients</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#D6AD61] hover:bg-[#E0BC74] text-[#090B10] flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <span>Dispatch Sample Box</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h4 className="text-xl font-editorial font-bold text-[#F5F3ED]">
              Sample Box Dispatch Scheduled
            </h4>
            <p className="text-xs text-[#A1A8B5] max-w-md mx-auto leading-relaxed">
              We have dispatched your physical paper swatch fan deck and foil card set to{' '}
              <span className="text-[#F5F3ED] font-semibold">{boxData.company}</span>. Expected delivery within 2–3 business days.
            </p>

            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 rounded-xl text-xs font-semibold bg-[#D6AD61] hover:bg-[#E0BC74] text-[#090B10] transition-colors"
            >
              Back to Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
