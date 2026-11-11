import React from 'react';
import { Star, GraduationCap, Store, Award, Building } from 'lucide-react';

interface PortfolioSectionProps {
  onRequestQuote?: (category: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = () => {
  const projects = [
    {
      id: 'proj-1',
      category: 'academic',
      productName: 'Textbooks',
      title: 'State Curriculum Textbooks & Examination Answer Booklets',
      typesAvailable: [
        { label: 'Available Sizes', value: 'A4, A5, Crown 1/4, Royal Octavo & Custom' },
        { label: 'Pages / Extent', value: '64 to 500+ Pages (Custom Page Counts)' },
        { label: 'Print Colours', value: 'Single Color (B/W), 2-Color, Full Color CMYK' },
        { label: 'Binding Types', value: 'Smyth-Sewn Hardcover, Perfect Bound, Saddle Stitch' },
      ],
      icon: GraduationCap,
      tag: 'Academic Publishing',
      accentColor: '#3B82F6',
      // Visual Photo Mockup for Textbook
      renderPreview: () => (
        <div className="relative w-full h-52 sm:h-56 bg-gradient-to-br from-[#0D1524] to-[#080C14] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#292F3B] group-hover:border-[#D6AD61]/50 transition-colors">
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-radial from-[#1E293B]/60 to-transparent pointer-events-none" />

          {/* Realistic Textbook Graphic Mockup */}
          <div className="relative w-36 h-48 sm:w-40 sm:h-52 bg-gradient-to-br from-[#101B2B] to-[#0A101A] rounded-r-lg rounded-l-sm border-r-2 border-b-2 border-[#D6AD61]/40 shadow-2xl transform -rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 flex flex-col justify-between p-3">
            {/* Spine Fold */}
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-transparent border-r border-[#D6AD61]/20" />
            
            {/* Gold Frame on Cover */}
            <div className="absolute inset-2 rounded border border-[#D6AD61]/60 flex flex-col items-center justify-between p-2 pointer-events-none">
              <span className="text-[7px] font-technical text-[#D6AD61] tracking-widest uppercase">35 YEARS EXCELLENCE</span>
              <div className="text-center">
                <span className="block font-editorial text-[13px] font-bold text-[#F5F3ED] leading-tight">MAYURI PRESS</span>
                <span className="block text-[8px] font-technical text-[#D6AD61] mt-0.5">ACADEMIC CURRICULUM</span>
              </div>
              <span className="text-[6px] font-technical text-[#A1A8B5]">SMYTH-SEWN BINDING</span>
            </div>

            {/* Fanned Pages Edge Simulation */}
            <div className="absolute -right-2 top-1.5 bottom-1.5 w-2 bg-[#F8F5EC] rounded-r-sm shadow-md border-y border-r border-[#D1D5DB]" />
          </div>
        </div>
      ),
    },
    {
      id: 'proj-2',
      category: 'retail',
      productName: 'Bill Books',
      title: 'High-Security Triplicate Carbonless GST Bill Books',
      typesAvailable: [
        { label: 'Available Sizes', value: '1/4 Demy, 1/6 Demy, 1/8 Demy, A4, A5 & Pocket' },
        { label: 'Pages & Copies', value: 'Duplicate (2-Part), Triplicate (3-Part), 4-Part (50–100 Sets)' },
        { label: 'Paper Colours', value: 'White, Pink, Yellow, Blue, Green NCR Carbonless' },
        { label: 'Binding & Finish', value: 'Red Crash Numbering, Perforated & Cloth Spine' },
      ],
      icon: Store,
      tag: 'Retail & Commercial',
      accentColor: '#F59E0B',
      // Visual Photo Mockup for Bill Book
      renderPreview: () => (
        <div className="relative w-full h-52 sm:h-56 bg-gradient-to-br from-[#1A1510] to-[#0D0B08] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#292F3B] group-hover:border-[#D6AD61]/50 transition-colors">
          <div className="absolute inset-0 bg-radial from-[#D6AD61]/10 to-transparent pointer-events-none" />

          {/* Realistic Multi-Part Bill Book Mockup */}
          <div className="relative w-36 h-48 sm:w-40 sm:h-52 bg-[#FDFCFA] rounded-sm shadow-2xl transform -rotate-1 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 p-2.5 flex flex-col justify-between border border-gray-300">
            {/* Red Cloth Binding Spine Tape */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#991B1B] border-r border-[#7F1D1D] shadow-sm" />

            {/* Micro-Perforation Line */}
            <div className="absolute left-5 top-0 bottom-0 w-px border-r border-dashed border-gray-400" />

            {/* Content Simulation */}
            <div className="pl-4">
              <div className="flex justify-between items-start border-b border-gray-800 pb-1">
                <div>
                  <span className="block font-editorial text-[9px] font-bold text-gray-900 leading-tight">TAX INVOICE</span>
                  <span className="block text-[6px] font-mono text-gray-500">MAYURI PRINTERS</span>
                </div>
                <span className="text-[7px] font-mono font-bold text-red-600">№ 084192</span>
              </div>

              {/* Grid Lines */}
              <div className="mt-2 space-y-1">
                {[1, 2, 3, 4, 5, 6].map((r) => (
                  <div key={r} className="h-1 bg-gray-200 rounded-xs" />
                ))}
              </div>
            </div>

            {/* Fanned Pink Duplicate Leaf Peeking Out */}
            <div className="absolute -left-1 -bottom-1.5 right-1.5 h-6 bg-[#FCE7F3] -z-10 rounded border border-pink-300 shadow" />
            {/* Yellow Triplicate Leaf Peeking Out */}
            <div className="absolute -left-2 -bottom-3 right-3 h-6 bg-[#FEF9C3] -z-20 rounded border border-yellow-300 shadow" />
          </div>
        </div>
      ),
    },
    {
      id: 'proj-3',
      category: 'corporate',
      productName: 'Visiting Cards',
      title: 'Bespoke Executive Stationery & Triplex Visiting Cards',
      typesAvailable: [
        { label: 'Available Sizes', value: 'Standard (89×51mm / 3.5"×2"), Square & Custom Die-Cut' },
        { label: 'Paper & GSM', value: '350 GSM Art Card, 700 GSM Triplex Cotton Board, Kraft' },
        { label: 'Colours & Foils', value: '24K Gold, Silver, Rose Gold Hot Foil & Spot UV' },
        { label: 'Edge Finishes', value: 'Matte / Velvet Touch, Gold Leaf Edge Gilding, Rounded' },
      ],
      icon: Building,
      tag: 'Executive Identity',
      accentColor: '#D6AD61',
      // Visual Photo Mockup for Visiting Card
      renderPreview: () => (
        <div className="relative w-full h-52 sm:h-56 bg-gradient-to-br from-[#12141C] to-[#0A0B10] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#292F3B] group-hover:border-[#D6AD61]/50 transition-colors">
          <div className="absolute inset-0 bg-radial from-[#D6AD61]/10 to-transparent pointer-events-none" />

          {/* Realistic 700 GSM Visiting Card Mockup */}
          <div className="relative w-48 h-28 sm:w-56 sm:h-32 bg-[#12141A] rounded border-2 border-[#D6AD61] shadow-2xl transform -rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 p-3 flex flex-col justify-between ring-1 ring-[#D6AD61]/30">
            {/* Inner Gold Foil Stamped Border */}
            <div className="absolute inset-1.5 border border-[#D6AD61]/50 rounded-sm pointer-events-none" />

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#D6AD61] flex items-center justify-center text-[10px] font-bold text-[#090B10]">
                M
              </div>
              <span className="font-editorial text-xs font-bold text-[#D6AD61] tracking-wider">MAYURI PRINTERS</span>
            </div>

            <div>
              <span className="block font-editorial text-sm font-bold text-[#F5F3ED]">BINAY RATHI</span>
              <span className="block text-[8px] font-technical text-[#D6AD61]">FOUNDER & MANAGING DIRECTOR</span>
            </div>

            <div className="flex justify-between items-end text-[7px] font-technical text-[#A1A8B5]">
              <span>700 GSM COTTON BOARD</span>
              <span className="text-[#D6AD61]">24K HOT FOIL</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'proj-4',
      category: 'certificates',
      productName: 'Certificates',
      title: 'Anti-Counterfeit Degree Certificates with 24K Hot Foil Seals',
      typesAvailable: [
        { label: 'Available Sizes', value: 'A4, Legal, A3 & Custom University Diploma' },
        { label: 'Paper & GSM', value: '250–350 GSM Heavy Parchment, Linen Texture, Non-Tearable' },
        { label: 'Colours & Foil', value: '24K Gold / Silver Embossed Foil Seals & Multi-Color Borders' },
        { label: 'Security Types', value: 'Guilloche Rosette Border, Hologram Strip, Anti-Copy Tint' },
      ],
      icon: Award,
      tag: 'Certificates',
      accentColor: '#10B981',
      // Visual Photo Mockup for Certificate
      renderPreview: () => (
        <div className="relative w-full h-52 sm:h-56 bg-gradient-to-br from-[#12161A] to-[#090D11] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#292F3B] group-hover:border-[#D6AD61]/50 transition-colors">
          <div className="absolute inset-0 bg-radial from-[#10B981]/10 to-transparent pointer-events-none" />

          {/* Realistic Certificate Mockup */}
          <div className="relative w-52 h-36 sm:w-60 sm:h-40 bg-[#FCFAF5] rounded shadow-2xl transform rotate-1 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 p-2.5 flex flex-col justify-between border-2 border-[#D6AD61]">
            {/* Guilloche Inner Border */}
            <div className="absolute inset-1 border border-[#D6AD61]/60 flex flex-col items-center justify-between p-1.5 pointer-events-none">
              <div className="w-full flex justify-between items-center text-[6px] font-mono">
                <span className="text-gray-500">ACADEMIC COUNCIL</span>
                <span className="text-red-600 font-bold">№ CERT-084192</span>
              </div>

              <div className="text-center my-auto">
                <span className="block font-editorial text-[10px] font-bold text-gray-900 leading-tight">CERTIFICATE OF EXCELLENCE</span>
                <span className="block text-[6px] font-technical text-[#D6AD61]">HIGHEST SCHOLASTIC MERIT</span>
                <div className="w-16 h-px bg-[#D6AD61] mx-auto my-0.5" />
                <span className="block font-editorial text-[9px] font-bold text-gray-800">ARUN KUMAR SHARMA</span>
              </div>

              {/* Gold Embossed Seal with Red Ribbon Tails */}
              <div className="w-full flex justify-between items-end pt-1">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-[#D6AD61] border border-white flex items-center justify-center text-[7px] text-white shadow-sm relative">
                    ★
                    {/* Ribbon Tails */}
                    <div className="absolute -bottom-2 -left-0.5 w-1.5 h-3 bg-red-700 -z-10 rounded-b-sm" />
                    <div className="absolute -bottom-2 -right-0.5 w-1.5 h-3 bg-red-700 -z-10 rounded-b-sm" />
                  </div>
                </div>
                <div className="text-right text-[6px] font-mono text-gray-600">
                  <span>BINAY RATHI</span>
                  <div className="w-12 h-px bg-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="portfolio" className="pt-4 sm:pt-6 pb-16 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#141821] border border-[#292F3B] text-[#D6AD61] text-xs font-technical font-semibold mb-3">
            <Star className="w-3.5 h-3.5 fill-[#D6AD61]" />
            <span>VERIFIED PRODUCTION PORTFOLIO & PROVENANCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#F5F3ED]">
            Trusted by Universities, Enterprises & Global Importers
          </h2>
          <p className="text-sm text-[#A1A8B5] mt-2 max-w-xl">
            Explore verified high-volume manufacturing case studies across commercial press, educational, and institutional supply.
          </p>
        </div>
      </div>

      {/* Case Study Cards With Photo Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {projects.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-[#141821] rounded-2xl border border-[#292F3B] hover:border-[#D6AD61]/50 transition-all flex flex-col justify-between group shadow-sm overflow-hidden"
            >
              {/* Product Visual Picture Preview (Realistic Photo Mockup) */}
              <div className="relative overflow-hidden">
                {item.renderPreview()}
              </div>

              {/* Case Details */}
              <div className="p-6 lg:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#1A202B] text-[#D6AD61] flex items-center justify-center border border-[#292F3B]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-technical px-2.5 py-0.5 rounded-md bg-[#1A202B] text-[#D6AD61] border border-[#292F3B] font-medium">
                      {item.productName}
                    </span>
                  </div>

                  <h3 className="text-xl font-editorial font-bold text-[#F5F3ED] group-hover:text-[#D6AD61] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Types Available (Sizes, Pages, Colours, Finishes) */}
                  <div className="mt-4 p-3.5 rounded-xl bg-[#1A202B] border border-[#292F3B] space-y-2 text-xs font-technical">
                    <div className="text-[11px] font-technical uppercase font-semibold text-[#D6AD61] pb-1.5 border-b border-[#292F3B] flex items-center justify-between">
                      <span>Available Types & Options</span>
                    </div>
                    {item.typesAvailable.map((opt, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-2 pt-0.5">
                        <span className="text-[#A1A8B5] shrink-0">{opt.label}:</span>
                        <span className="text-[#F5F3ED] text-right font-medium">{opt.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
