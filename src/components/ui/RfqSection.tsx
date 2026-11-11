import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  FileUp,
  Send,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  PackageCheck,
} from 'lucide-react';
import type { RfqFormData } from '../../types';
import { createOrderFromRfq } from '../../utils/orderStorage';

interface RfqSectionProps {
  initialCategory?: string;
}

export const RfqSection: React.FC<RfqSectionProps> = ({ initialCategory = 'billbooks' }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState('');

  // Form State
  const [formData, setFormData] = useState<RfqFormData>({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    category: initialCategory,
    productType: 'Carbonless Triplicate Bill Book (A5)',
    quantity: 500,
    customNotes: '',
    needSampleBox: true,
  });

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      fileUploaded: {
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        dpi: 300,
        colorSpace: 'CMYK',
        hasBleed: true,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `MP-2026-${Math.floor(105 + Math.random() * 890)}`;
    setQuoteId(generatedId);
    
    // Automatically record this order in the Admin Portal order database
    createOrderFromRfq(formData, generatedId);
    
    setSubmitted(true);

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D6AD61', '#10B981', '#FFFFFF'],
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <section id="rfq-section" className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="bg-[#141821] rounded-3xl border border-[#292F3B] p-6 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Subtle Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D6AD61]/5 rounded-full blur-3xl pointer-events-none" />

        {!submitted ? (
          <div>
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1A202B] border border-[#292F3B] text-[#D6AD61] text-xs font-technical font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D6AD61]" />
                <span>STEP {step} OF 3 // ESTIMATION & ORDER SPECIFICATION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#F5F3ED]">
                Request Your Printing Quotation
              </h2>
              <p className="text-xs sm:text-sm text-[#A1A8B5] mt-1">
                Reviewed by our factory print estimators. Guaranteed itemized quotation within 4 hours.
              </p>

              {/* Progress Steps */}
              <div className="grid grid-cols-3 gap-2 mt-6">
                {[
                  { num: 1, label: 'Select Product' },
                  { num: 2, label: 'Size & Quantity' },
                  { num: 3, label: 'Contact Details' },
                ].map((s) => (
                  <div key={s.num} className="space-y-1">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        step >= s.num ? 'bg-[#D6AD61]' : 'bg-[#292F3B]'
                      }`}
                    />
                    <div
                      className={`text-[10px] font-technical uppercase truncate ${
                        step === s.num ? 'text-[#D6AD61] font-semibold' : 'text-[#A1A8B5]'
                      }`}
                    >
                      {s.num}. {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Product Selection */}
              {step === 1 && (
                <div className="space-y-4">
                  <label className="text-xs font-technical text-[#F5F3ED] block font-semibold">
                    CHOOSE WHAT YOU NEED PRINTED
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        id: 'billbooks',
                        title: 'Custom Carbonless Bill Books & Invoices',
                        desc: 'Duplicate, triplicate or 4-part NCR books with red sequential numbering.',
                      },
                      {
                        id: 'textbooks',
                        title: 'Academic Textbooks & Registers',
                        desc: 'Smyth-sewn thread hardcover, softcover perfect bound or wire saddle stitch.',
                      },
                      {
                        id: 'visiting-cards',
                        title: 'Executive Visiting Cards & Letterheads',
                        desc: '600–700 GSM luxury sandwich boards with 24K hot foil stamping.',
                      },
                      {
                        id: 'certificates',
                        title: 'Certificates',
                        desc: 'Gold-foil embossed university diplomas, school degrees & award certificates.',
                      },
                    ].map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.category === cat.id
                            ? 'bg-[#1A202B] border-[#D6AD61] text-[#F5F3ED] shadow-sm'
                            : 'bg-[#090B10] border-[#292F3B] text-[#A1A8B5] hover:border-[#D6AD61]/30 hover:text-[#F5F3ED]'
                        }`}
                      >
                        <div className="text-sm font-semibold text-[#D6AD61]">{cat.title}</div>
                        <div className="text-xs text-[#A1A8B5] mt-1">{cat.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Size & Quantity */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-technical text-[#A1A8B5] block mb-1 font-semibold">
                        SIZE / FORMAT
                      </label>
                      <select
                        value={formData.productType}
                        onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                        className="w-full bg-[#090B10] border border-[#292F3B] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F3ED] focus:border-[#D6AD61] focus:outline-none transition-colors"
                      >
                        <option>A4 Size (210 x 297 mm)</option>
                        <option>A5 Standard (148 x 210 mm)</option>
                        <option>B5 Academic Crown (176 x 250 mm)</option>
                        <option>Custom Trim Size</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-technical text-[#A1A8B5] block mb-1 font-semibold">
                        PRODUCTION QUANTITY
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[100, 500, 2500, 10000].map((qty) => (
                          <button
                            type="button"
                            key={qty}
                            onClick={() => setFormData({ ...formData, quantity: qty })}
                            className={`py-2.5 rounded-lg text-xs font-technical border transition-all ${
                              formData.quantity === qty
                                ? 'bg-[#D6AD61] text-[#090B10] border-[#D6AD61] font-semibold'
                                : 'bg-[#090B10] text-[#A1A8B5] border-[#292F3B] hover:text-[#F5F3ED]'
                            }`}
                          >
                            {qty.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Optional File Upload */}
                  <div className="border border-dashed border-[#292F3B] rounded-xl p-5 text-center bg-[#090B10]/60 relative hover:border-[#D6AD61]/40 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.ai,.eps,.jpg,.png"
                      onChange={handleSimulateUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FileUp className="w-6 h-6 text-[#D6AD61] mx-auto mb-1.5" />
                    <div className="text-xs font-semibold text-[#F5F3ED]">
                      {formData.fileUploaded ? `Uploaded: ${formData.fileUploaded.name}` : 'Attach Sample Artwork / Logo (Optional)'}
                    </div>
                    <div className="text-[11px] text-[#A1A8B5] mt-1">Click or drag your PDF/image file</div>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact Details */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-technical text-[#A1A8B5] block mb-1 font-semibold">
                        YOUR NAME *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Ramesh Sharma"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-[#090B10] border border-[#292F3B] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F3ED] focus:border-[#D6AD61] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-technical text-[#A1A8B5] block mb-1 font-semibold">
                        COMPANY / SCHOOL / BUSINESS *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Modern Academy"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-[#090B10] border border-[#292F3B] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F3ED] focus:border-[#D6AD61] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-technical text-[#A1A8B5] block mb-1 font-semibold">
                        PHONE / WHATSAPP NUMBER *
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="+977 98XXXXXX or +91 XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#090B10] border border-[#292F3B] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F3ED] focus:border-[#D6AD61] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-technical text-[#A1A8B5] block mb-1 font-semibold">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#090B10] border border-[#292F3B] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F3ED] focus:border-[#D6AD61] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Free Sample Box Checkbox */}
                  <div className="p-3.5 rounded-xl bg-[#1A202B] border border-[#292F3B] flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="sampleBox"
                      checked={formData.needSampleBox}
                      onChange={(e) => setFormData({ ...formData, needSampleBox: e.target.checked })}
                      className="accent-[#D6AD61] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="sampleBox" className="cursor-pointer text-xs text-[#A1A8B5]">
                      <strong className="text-[#F5F3ED]">Also send me a free Mayuri Paper Sample Box</strong> with real paper swatches and foil shade cards.
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-[#292F3B]">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s - 1) as any)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#A1A8B5] hover:text-[#F5F3ED] bg-[#1A202B] border border-[#292F3B] flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s + 1) as any)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#D6AD61] hover:bg-[#E0BC74] text-[#090B10] flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#D6AD61] hover:bg-[#E0BC74] text-[#090B10] flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Quote Request</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation */
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center mx-auto shadow-sm">
              <PackageCheck className="w-8 h-8" />
            </div>

            <div className="inline-block px-3 py-1 rounded-md bg-[#1A202B] border border-[#292F3B] text-xs font-technical text-[#D6AD61]">
              REFERENCE ID: {quoteId}
            </div>

            <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-[#F5F3ED]">
              Thank You! Your Request Has Been Received.
            </h3>

            <p className="text-xs sm:text-sm text-[#A1A8B5] max-w-lg mx-auto leading-relaxed">
              Our factory production team has received your order parameters and will send you an itemized, formal quotation within 4 hours.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href="#footer-contact"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#D6AD61] hover:bg-[#E0BC74] text-[#090B10] flex items-center gap-2 transition-all shadow-sm"
              >
                <span>View Factory & Owner Details</span>
              </a>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-medium text-[#A1A8B5] hover:text-[#F5F3ED] bg-[#1A202B] border border-[#292F3B] transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
