import { useState } from 'react';
import { Navbar } from './components/ui/Navbar';
import { CursorLight } from './components/ui/CursorLight';
import { PortfolioSection } from './components/ui/PortfolioSection';
import { RfqSection } from './components/ui/RfqSection';
import { AdminPortalModal } from './components/admin/AdminPortalModal';
import { Footer } from './components/ui/Footer';

export function App() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [rfqCategory, setRfqCategory] = useState<string>('billbooks');

  const scrollToRfq = () => {
    const el = document.getElementById('rfq-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#090B10] text-[#F5F3ED] selection:bg-[#D6AD61]/30 selection:text-white subtle-grid overflow-hidden">
      {/* 1. Global Liquid Cursor-Following Yellow Light (Exactly One Light) */}
      <CursorLight />

      {/* 2. Top Header Navigation (Includes Admin Portal Login Symbol) */}
      <Navbar
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        unit={unit}
        setUnit={setUnit}
      />

      {/* 3. Main Content */}
      <main className="relative z-10">
        {/* HERO SECTION: Editorial Luxury Dark Aesthetic (Top gap space removed) */}
        <section className="relative pt-3 sm:pt-5 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Centered Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141821] border border-[#292F3B] text-[11px] sm:text-xs font-technical text-[#D6AD61] mb-6 shadow-sm font-semibold tracking-wider backdrop-blur-md">
            <span>• MAYURI PRINTERS • EST. 1991 • 35 YEARS OF EXCELLENCE •</span>
          </div>

          {/* Hero Editorial Serif Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-editorial font-bold tracking-tight text-[#F5F3ED] leading-[1.08] max-w-4xl mx-auto">
            We Print <span className="italic font-serif text-[#D6AD61]">Excellence</span> <br className="hidden sm:inline" />
            That Endures Decades
          </h1>

          {/* Editorial Subtitle */}
          <p className="mt-6 text-sm sm:text-base lg:text-lg text-[#A1A8B5] max-w-2xl mx-auto leading-relaxed font-normal">
            A 35-year commercial printing factory delivering precision carbonless bill books, curriculum textbooks, executive visiting cards, and certificates.
          </p>

          {/* WHAT PRODUCTS WE SELL & MAKE */}
          <div id="products" className="mt-8 sm:mt-10 max-w-4xl mx-auto w-full scroll-mt-24">
            <div className="text-[11px] font-technical text-[#D6AD61] uppercase tracking-widest font-semibold mb-4 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6AD61]" />
              <span>PRODUCTS WE MANUFACTURE & SUPPLY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6AD61]" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {[
                {
                  rfqCategory: 'billbooks',
                  title: 'Carbonless Bill Books',
                  desc: 'Duplicate & triplicate NCR pads with red numbering & perforations',
                },
                {
                  rfqCategory: 'textbooks',
                  title: 'Academic Textbooks',
                  desc: 'Smyth-sewn 180° lay-flat binding, softcover & casebound',
                },
                {
                  rfqCategory: 'visiting-cards',
                  title: 'Visiting Cards & Ledgers',
                  desc: '600+ GSM thick cotton boards, 24K hot foil & register ledgers',
                },
                {
                  rfqCategory: 'certificates',
                  title: 'Certificates',
                  desc: 'Gold-embossed diplomas, merit awards & institutional certificates',
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setRfqCategory(item.rfqCategory);
                    scrollToRfq();
                  }}
                  className="p-4 rounded-xl bg-[#141821] border border-[#292F3B] hover:border-[#D6AD61]/50 hover:bg-[#1A202B]/80 transition-all group text-left shadow-sm block hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="text-xs font-semibold text-[#F5F3ED] group-hover:text-[#D6AD61] transition-colors leading-tight">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#A1A8B5] mt-1.5 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3 Metric Stats (No top line, minimized gap) */}
          <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-6 sm:gap-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="font-editorial text-2xl sm:text-4xl font-bold text-[#F5F3ED]">
                35+ <span className="text-[#D6AD61] text-lg sm:text-2xl font-normal">Yrs</span>
              </div>
              <div className="text-[10px] sm:text-xs font-technical uppercase text-[#A1A8B5] mt-1 tracking-wider">
                Industry Experience
              </div>
            </div>

            <div className="text-center border-x border-[#292F3B] px-2 sm:px-6">
              <div className="font-editorial text-2xl sm:text-4xl font-bold text-[#F5F3ED]">
                10M+
              </div>
              <div className="text-[10px] sm:text-xs font-technical uppercase text-[#A1A8B5] mt-1 tracking-wider">
                Books & Invoices Printed
              </div>
            </div>

            <div className="text-center">
              <div className="font-editorial text-2xl sm:text-4xl font-bold text-[#F5F3ED]">
                99.8%
              </div>
              <div className="text-[10px] sm:text-xs font-technical uppercase text-[#A1A8B5] mt-1 tracking-wider">
                Client Satisfaction
              </div>
            </div>
          </div>
        </section>

        {/* 4. REAL PRODUCTION PORTFOLIO (With Product Photos) */}
        <PortfolioSection
          onRequestQuote={(cat) => {
            setRfqCategory(cat);
            scrollToRfq();
          }}
        />

        {/* 5. RFQ / QUOTATION CONFIGURATOR */}
        <RfqSection key={rfqCategory} initialCategory={rfqCategory} />
      </main>

      {/* EXECUTIVE ADMIN ORDERS PORTAL (Binay Rathi) */}
      <AdminPortalModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* 6. FOOTER: EXCLUSIVE DESTINATION FOR OWNER CONTACT (Binay Rathi) */}
      <Footer />
    </div>
  );
}

export default App;
