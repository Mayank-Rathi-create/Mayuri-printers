import React, { useState } from 'react';
import { Calculator, TrendingDown } from 'lucide-react';

type Currency = 'NPR' | 'INR';

export const InteractivePriceEstimator: React.FC = () => {
  const [productType, setProductType] = useState<'billbook' | 'textbook' | 'card' | 'export-reel'>('billbook');
  const [quantity, setQuantity] = useState<number>(500);
  const [currency, setCurrency] = useState<Currency>('NPR');
  const [paperGrade, setPaperGrade] = useState<'standard' | 'premium' | 'luxury'>('premium');
  const [finishing, setFinishing] = useState<{ foil: boolean; numbering: boolean; hardbound: boolean }>({
    foil: false,
    numbering: true,
    hardbound: false,
  });

  // Currency exchange rates: 1 INR = 1.60 NPR (Fixed official peg)
  const currencyRates: Record<Currency, { symbol: string; label: string; rate: number }> = {
    NPR: { symbol: 'रू ', label: 'Nepalese Rupee (NPR)', rate: 1.6 },
    INR: { symbol: '₹', label: 'Indian Rupee (INR)', rate: 1.0 },
  };

  // Base calculation math
  const getBaseUnitPriceINR = () => {
    let base = 48; // INR for Bill Book
    if (productType === 'textbook') base = 85;
    if (productType === 'card') base = 8.5; // per card
    if (productType === 'export-reel') base = 58000; // per ton

    // Substrate multiplier
    if (paperGrade === 'premium') base *= 1.2;
    if (paperGrade === 'luxury') base *= 1.45;

    // Finishing additions
    if (finishing.foil) base += productType === 'card' ? 4.0 : 15.0;
    if (finishing.numbering && productType === 'billbook') base += 6.0;
    if (finishing.hardbound) base += 22.0;

    // Volume discount curve
    let discount = 1.0;
    if (quantity >= 500) discount = 0.88;
    if (quantity >= 2500) discount = 0.76;
    if (quantity >= 10000) discount = 0.65;
    if (quantity >= 50000) discount = 0.55;

    return base * discount;
  };

  const curr = currencyRates[currency];
  const unitPriceINR = getBaseUnitPriceINR();
  const unitPriceConverted = (unitPriceINR * curr.rate).toFixed(2);
  const totalPriceConverted = (unitPriceINR * quantity * curr.rate).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const savingsPercent = quantity >= 50000 ? 45 : quantity >= 10000 ? 35 : quantity >= 2500 ? 24 : quantity >= 500 ? 12 : 0;

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#12161F] rounded-3xl border border-[#232B3B] p-6 lg:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#C89D56]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C89D56]/15 border border-[#C89D56]/30 text-[#C89D56] text-xs font-technical font-semibold mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>LIVE INDUSTRIAL PRICE & QUANTITY ESTIMATION ENGINE</span>
            </div>
            <h2 className="text-3xl font-editorial font-bold text-[#F7F5F0]">
              Transparent Factory-Direct Price Calculator
            </h2>
            <p className="text-xs sm:text-sm text-[#858E9B] mt-1 max-w-xl">
              Compute real-time volume price tiers. Instant calculations reflect paper substrate weight, press makeready, and automated post-press finishing.
            </p>
          </div>

          {/* Currency Switcher: NPR & INR only */}
          <div className="flex items-center gap-1.5 bg-[#161B24] p-1.5 rounded-xl border border-[#232B3B]">
            {(['NPR', 'INR'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  currency === c
                    ? 'bg-[#C89D56] text-[#0E1116] shadow-md'
                    : 'text-[#858E9B] hover:text-[#F7F5F0]'
                }`}
              >
                {c === 'NPR' ? 'NPR (रू)' : 'INR (₹)'}
              </button>
            ))}
          </div>
        </div>

        {/* Calculator Body Grid: Config (7 cols) / Price Summary Card (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Product Selection */}
            <div>
              <label className="text-xs font-technical text-[#858E9B] block mb-2 font-semibold">
                1. SELECT PRODUCT ARCHETYPE
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'billbook', label: 'Bill Books / NCR' },
                  { id: 'textbook', label: 'Textbooks / Books' },
                  { id: 'card', label: 'Visiting Cards' },
                  { id: 'export-reel', label: 'Export Reels (Ton)' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setProductType(p.id as any);
                      if (p.id === 'export-reel') setQuantity(25);
                      else if (p.id === 'card') setQuantity(1000);
                      else setQuantity(500);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all truncate ${
                      productType === p.id
                        ? 'bg-[#C89D56] text-[#0E1116] border-[#C89D56] font-bold shadow-md'
                        : 'bg-[#161B24] text-[#858E9B] border-[#232B3B] hover:text-[#F7F5F0]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Quantity Slider & Presets */}
            <div className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B] space-y-3">
              <div className="flex items-center justify-between text-xs font-technical">
                <span className="text-[#F7F5F0] font-semibold">2. PRODUCTION RUN VOLUME</span>
                <span className="text-[#C89D56] font-mono text-sm font-bold">
                  {quantity.toLocaleString()} {productType === 'export-reel' ? 'Metric Tons' : 'Units'}
                </span>
              </div>

              {productType !== 'export-reel' ? (
                <div>
                  <input
                    type="range"
                    min={productType === 'card' ? 250 : 100}
                    max={25000}
                    step={productType === 'card' ? 250 : 100}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full accent-[#C89D56] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#7A828A] font-mono mt-1">
                    <span>100</span>
                    <span>1,000</span>
                    <span>5,000</span>
                    <span>10,000</span>
                    <span>25,000+</span>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="range"
                    min={5}
                    max={200}
                    step={5}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full accent-[#C89D56] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#7A828A] font-mono mt-1">
                    <span>5 MT</span>
                    <span>50 MT</span>
                    <span>100 MT</span>
                    <span>200 MT (Full FCL)</span>
                  </div>
                </div>
              )}

              {/* Volume Discount Alert Banner */}
              {savingsPercent > 0 && (
                <div className="flex items-center gap-2 text-xs text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-lg border border-[#10B981]/20">
                  <TrendingDown className="w-4 h-4 shrink-0" />
                  <span>
                    Volume Efficiency Tier Unlocked: <strong>{savingsPercent}% lower unit cost</strong> vs. small runs!
                  </span>
                </div>
              )}
            </div>

            {/* 3. Paper Substrate Grade */}
            <div className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B]">
              <label className="text-xs font-technical text-[#858E9B] block mb-2 font-semibold">
                3. PAPER SUBSTRATE TIER
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard', label: 'Standard Commercial', desc: '56 GSM NCR / 70 GSM Maplitho' },
                  { id: 'premium', label: 'High-Opacity Premium', desc: '80 GSM Royal / 350 GSM Art' },
                  { id: 'luxury', label: 'Executive Luxury', desc: '600–700 GSM Cotton / Triplex' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setPaperGrade(s.id as any)}
                    className={`p-2.5 rounded-lg text-left border transition-all ${
                      paperGrade === s.id
                        ? 'bg-[#232B3B] text-[#C89D56] border-[#C89D56] font-semibold'
                        : 'bg-[#12161F] text-[#858E9B] border-[#232B3B] hover:text-[#F7F5F0]'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{s.label}</div>
                    <div className="text-[10px] text-[#7A828A] mt-0.5 truncate">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Finishes */}
            <div className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B]">
              <label className="text-xs font-technical text-[#858E9B] block mb-2 font-semibold">
                4. OPTIONAL FINISHES & TREATMENTS
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#12161F] border border-[#232B3B] text-[#D1D5DB] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={finishing.foil}
                    onChange={(e) => setFinishing({ ...finishing, foil: e.target.checked })}
                    className="accent-[#C89D56]"
                  />
                  <span>24K Hot Stamping Foil</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#12161F] border border-[#232B3B] text-[#D1D5DB] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={finishing.numbering}
                    onChange={(e) => setFinishing({ ...finishing, numbering: e.target.checked })}
                    className="accent-[#C89D56]"
                  />
                  <span>Red Rotary Numbering</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#12161F] border border-[#232B3B] text-[#D1D5DB] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={finishing.hardbound}
                    onChange={(e) => setFinishing({ ...finishing, hardbound: e.target.checked })}
                    className="accent-[#C89D56]"
                  />
                  <span>Reinforced Cloth Spine</span>
                </label>
              </div>
            </div>
          </div>

          {/* Live Price Output Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#161B24] to-[#0E1116] border border-[#C89D56]/40 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#232B3B] pb-4">
              <span className="text-xs font-technical text-[#C89D56] font-semibold">
                ESTIMATED BULK QUOTE
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 font-bold">
                MILL DIRECT PRICING
              </span>
            </div>

            {/* Total Price */}
            <div>
              <div className="text-[11px] font-technical text-[#858E9B] uppercase">ESTIMATED TOTAL PRODUCTION</div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-white mt-1">
                <span className="text-[#C89D56]">{curr.symbol}</span>
                {totalPriceConverted}
              </div>
            </div>

            {/* Unit Price */}
            <div className="p-3.5 rounded-xl bg-[#12161F] border border-[#232B3B] flex items-center justify-between font-mono text-xs">
              <span className="text-[#858E9B]">Effective Unit Price:</span>
              <span className="text-base font-bold text-[#10B981]">
                {curr.symbol}{unitPriceConverted} / unit
              </span>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 text-xs font-mono text-[#D1D5DB] pt-1">
              <div className="flex justify-between text-[#858E9B]">
                <span>Prepress & CTP Plates:</span>
                <span className="text-white">Included</span>
              </div>
              <div className="flex justify-between text-[#858E9B]">
                <span>Quality Control (ISO 12647):</span>
                <span className="text-white">Included</span>
              </div>
              <div className="flex justify-between text-[#858E9B]">
                <span>Standard Lead Time:</span>
                <span className="text-[#C89D56] font-bold">4–6 Business Days</span>
              </div>
              <div className="flex justify-between text-[#858E9B]">
                <span>Packaging:</span>
                <span className="text-white">Moisture-Proof Bundled</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#rfq-section"
                className="w-full block text-center py-3 px-4 rounded-xl bg-[#C89D56] hover:bg-[#E2BC7A] text-[#0E1116] font-semibold text-xs transition-all shadow-lg shadow-[#C89D56]/20 font-technical"
              >
                Lock In This Estimation in Formal RFQ &rarr;
              </a>
            </div>

            <p className="text-[10px] text-[#7A828A] text-center leading-normal">
              * Indicative quotation subject to final artwork preflight analysis and exact shipping destination tariffs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
