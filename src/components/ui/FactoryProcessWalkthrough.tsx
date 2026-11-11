import React, { useState } from 'react';
import { Factory, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProcessStep {
  step: string;
  title: string;
  machinery: string;
  description: string;
  qcGate: string;
  specs: string[];
}

export const FactoryProcessWalkthrough: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps: ProcessStep[] = [
    {
      step: '01',
      title: 'Digital Prepress & Thermal CTP Laser Plates',
      machinery: 'Screen PlateRite HD 8900 Laser Engine',
      description: 'Customer vector PDFs undergo automated RIP screening, trapping calibration, and direct laser thermal plate imaging at 2,400 DPI with zero dot distortion.',
      qcGate: 'Spectrophotometric proof matching to ISO 12647-2 (Delta-E < 1.4)',
      specs: ['2,400 DPI Laser Imaging', 'Dynamic Trapping & Overprint Check', 'FOGRA39 Standard Calibration'],
    },
    {
      step: '02',
      title: 'High-Speed Web & Sheetfed Offset Presses',
      machinery: 'Heidelberg Speedmaster CD 102 & Harris Web Offset',
      description: 'Continuous web offset and sheetfed multi-color presses print high-opacity book signatures and multi-ply carbonless sheets at speeds up to 45,000 impressions per hour.',
      qcGate: 'In-line optical densitometry with continuous ink-zone regulation',
      specs: ['Up to 45,000 Signatures / Hour', 'Substrates from 45 to 700 GSM', 'Alcohol-Free Eco Dampening'],
    },
    {
      step: '03',
      title: 'Precision Rotary Numbering & Micro-Perforation',
      machinery: 'Heidelberg Cylinder & Morgana AutoCreaser Pro',
      description: 'Consecutive gothic red numbering with zero skipped sequences for commercial bill books, paired with clean 17-teeth/inch micro-perforation dies for effortless tear-off.',
      qcGate: 'Dual-camera electronic serial scanner verifying every sequential sheet',
      specs: ['Zero-Skip Mechanical Numbering', 'Clean-Edge Micro Perforation', 'Tamper-Evident Chemical Verification'],
    },
    {
      step: '04',
      title: 'Automated Smyth Thread Sewing & PUR Binding',
      machinery: 'Aster Smyth Thread Sewer & Welbound 12-Clamp PUR Binder',
      description: 'Textbook signatures are Smyth-sewn with high-tensile cotton-polyester thread for lay-flat opening, followed by square spine thermal PUR gluing.',
      qcGate: 'Tensile page-pull test (Pull strength exceeding 4.8 N/cm)',
      specs: ['100% Lay-Flat Reading Spine', 'PUR Hot-Melt Elastic Bonding', 'Casebound Hardcover Cloth Backing'],
    },
    {
      step: '05',
      title: 'Moisture-Barrier Export Packing & Container Stowage',
      machinery: 'Robopac Automated Turntable Stretch Wrapper',
      description: 'Finished books and industrial reels are heat-sealed in multi-layer polymer moisture barrier wrap, palletized on heat-treated ISPM-15 export pallets, and strapped for container transit.',
      qcGate: 'Core moisture test (< 6.5% humidity retention in ocean freight)',
      specs: ['ISPM-15 Fumigated Wooden Pallets', 'Poly-Shrink Vacuum Seal', 'Nhava Sheva & Mundra Port Loading'],
    },
  ];

  const currentStep = steps[activeStepIndex];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C89D56]/15 border border-[#C89D56]/30 text-[#C89D56] text-xs font-technical font-semibold mb-2">
          <Factory className="w-3.5 h-3.5" />
          <span>INDUSTRIAL PRINTING PIPELINE & PRODUCTION PROVENANCE</span>
        </div>
        <h2 className="text-3xl font-editorial font-bold text-[#F7F5F0]">
          From Raw Pulp to Finished Edition: The Factory Floor
        </h2>
        <p className="text-xs sm:text-sm text-[#858E9B] mt-1 max-w-xl">
          Follow the rigorous five-stage manufacturing process that guarantees zero binding failures and razor-sharp color calibration across high-volume production runs.
        </p>
      </div>

      {/* Step Selector Horizontal Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
        {steps.map((st, i) => (
          <button
            key={st.step}
            onClick={() => setActiveStepIndex(i)}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeStepIndex === i
                ? 'bg-[#1E2535] border-[#C89D56] shadow-lg shadow-[#C89D56]/10'
                : 'bg-[#12161F] border-[#232B3B] hover:border-[#384358]'
            }`}
          >
            <div className="text-xs font-mono font-bold text-[#C89D56] mb-1">
              STAGE {st.step}
            </div>
            <div className="text-xs font-bold text-[#F7F5F0] truncate">{st.title.split('&')[0]}</div>
          </button>
        ))}
      </div>

      {/* Active Step Deep-Dive Card */}
      <div className="bg-[#12161F] rounded-2xl border border-[#232B3B] p-6 lg:p-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Details (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-editorial font-black text-[#C89D56]">
                {currentStep.step}
              </span>
              <div>
                <h3 className="text-xl font-editorial font-bold text-[#F7F5F0]">
                  {currentStep.title}
                </h3>
                <span className="text-xs font-mono text-[#858E9B]">
                  Dedicated Infrastructure: {currentStep.machinery}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#D1D5DB] leading-relaxed">
              {currentStep.description}
            </p>

            {/* Quality Inspection Gate */}
            <div className="p-3.5 rounded-xl bg-[#161B24] border border-[#232B3B] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-[#10B981] font-technical uppercase block">
                  MANDATORY QUALITY CONTROL GATE:
                </span>
                <span className="text-[#858E9B]">{currentStep.qcGate}</span>
              </div>
            </div>

            {/* Key Engineering Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              {currentStep.specs.map((sp, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-[#F7F5F0] bg-[#161B24] p-2 rounded-lg border border-[#232B3B] font-mono">
                  <CheckCircle2 className="w-3 h-3 text-[#C89D56] shrink-0" />
                  <span className="truncate">{sp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Blueprint (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#161B24] to-[#0A0D12] rounded-xl p-6 border border-[#232B3B] space-y-4">
            <div className="text-xs font-technical text-[#C89D56] font-semibold flex items-center justify-between">
              <span>MANUFACTURING METRICS</span>
              <span>ISO 9001:2015 AUDITED</span>
            </div>

            <div className="space-y-3 font-mono text-xs text-[#858E9B]">
              <div className="flex justify-between border-b border-[#232B3B] pb-2">
                <span>Active Tolerances:</span>
                <span className="text-white font-bold">±0.05 mm Cut Register</span>
              </div>
              <div className="flex justify-between border-b border-[#232B3B] pb-2">
                <span>Ink Pigment Density:</span>
                <span className="text-white font-bold">1.80 D (Black) / 1.45 D (CMY)</span>
              </div>
              <div className="flex justify-between border-b border-[#232B3B] pb-2">
                <span>Environmental Compliance:</span>
                <span className="text-[#10B981] font-bold">FSC Mixed Sources</span>
              </div>
              <div className="flex justify-between">
                <span>Average Line Throughput:</span>
                <span className="text-[#C89D56] font-bold">100% Scheduled Delivery</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#rfq-section"
                className="w-full block text-center py-2.5 rounded-xl bg-[#232B3B] hover:bg-[#C89D56] hover:text-[#0E1116] text-[#F7F5F0] font-technical text-xs font-semibold transition-all"
              >
                Inquire About Factory Capacity & Lead Times &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
