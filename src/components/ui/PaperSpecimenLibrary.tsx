import React, { useState } from 'react';
import { Layers } from 'lucide-react';

interface PaperGradeSpec {
  id: string;
  name: string;
  gsm: number;
  caliperMicrons: number;
  opacityPercent: number;
  brightnessPercent: number;
  finish: string;
  bestFor: string;
  colorSwatch: string;
  category: 'lightweight' | 'academic' | 'board' | 'luxury';
}

export const PaperSpecimenLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'lightweight' | 'academic' | 'board' | 'luxury'>('all');
  const [activeSpecId, setActiveSpecId] = useState<string>('spec-3');

  const paperGrades: PaperGradeSpec[] = [
    {
      id: 'spec-1',
      name: 'Ultra-Lightweight Bible & Legal Paper',
      gsm: 45,
      caliperMicrons: 52,
      opacityPercent: 84,
      brightnessPercent: 88,
      finish: 'Smooth Machine Finished (Titanium Dioxide opacified)',
      bestFor: 'Thick legal volumes, dictionaries, pharmaceutical leaflets',
      colorSwatch: '#FAF8F2',
      category: 'lightweight',
    },
    {
      id: 'spec-2',
      name: 'Carbonless (NCR) Micro-Capsule Paper',
      gsm: 56,
      caliperMicrons: 68,
      opacityPercent: 86,
      brightnessPercent: 92,
      finish: 'CB (Coated Back), CFB (Coated Front/Back), CF (Coated Front)',
      bestFor: 'Commercial bill books, multi-part tax invoices, delivery challans',
      colorSwatch: '#FDFBF7',
      category: 'lightweight',
    },
    {
      id: 'spec-3',
      name: 'Maplitho High-Opacity Book Paper',
      gsm: 70,
      caliperMicrons: 92,
      opacityPercent: 94,
      brightnessPercent: 90,
      finish: 'Natural off-white, glare-free readable surface',
      bestFor: 'School & university textbooks, curriculum syllabus, examination registers',
      colorSwatch: '#FBF9F3',
      category: 'academic',
    },
    {
      id: 'spec-4',
      name: 'Royal Virgin Woodfree Copier',
      gsm: 80,
      caliperMicrons: 104,
      opacityPercent: 96,
      brightnessPercent: 98,
      finish: 'High-whiteness smooth laser/offset sheet',
      bestFor: 'Corporate stationery, executive manuals, global export reels',
      colorSwatch: '#FFFFFF',
      category: 'academic',
    },
    {
      id: 'spec-5',
      name: 'Satin Silk Coated Art Paper',
      gsm: 170,
      caliperMicrons: 155,
      opacityPercent: 99,
      brightnessPercent: 96,
      finish: 'Satin silk matte coated (zero reflection glare)',
      bestFor: 'Textbook inner photo plates, annual reports, brochures',
      colorSwatch: '#F8F9FA',
      category: 'board',
    },
    {
      id: 'spec-6',
      name: 'Grey Back Coated Duplex Board',
      gsm: 300,
      caliperMicrons: 390,
      opacityPercent: 100,
      brightnessPercent: 84,
      finish: 'White pigment coated front with recycled grey kraft back',
      bestFor: 'Textbook rigid book jackets, register outer covers, packaging boxes',
      colorSwatch: '#E5E7EB',
      category: 'board',
    },
    {
      id: 'spec-7',
      name: 'Pure Cotton Double-Thick Board',
      gsm: 600,
      caliperMicrons: 820,
      opacityPercent: 100,
      brightnessPercent: 91,
      finish: 'Tactile cold-pressed felt finish with deep relief capability',
      bestFor: 'Executive visiting cards, blind debossing, foil stamping',
      colorSwatch: '#181C24',
      category: 'luxury',
    },
    {
      id: 'spec-8',
      name: 'Triplex Sandwich Color-Core Board',
      gsm: 700,
      caliperMicrons: 980,
      opacityPercent: 100,
      brightnessPercent: 94,
      finish: '3-ply bonded sandwich with visible metallic gold center core',
      bestFor: 'Ultra-luxury corporate cards, institutional commemorative credentials',
      colorSwatch: '#0E1116',
      category: 'luxury',
    },
  ];

  const filtered = selectedCategory === 'all'
    ? paperGrades
    : paperGrades.filter((p) => p.category === selectedCategory);

  const activeSpec = paperGrades.find((p) => p.id === activeSpecId) || paperGrades[2];

  return (
    <section id="paper-specimen-library" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C89D56]/15 border border-[#C89D56]/30 text-[#C89D56] text-xs font-technical font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>MATERIAL SCIENCE & GSM SUBSTRATE INDEX</span>
          </div>
          <h2 className="text-3xl font-editorial font-bold text-[#F7F5F0]">
            The Mayuri Paper Specimen Library
          </h2>
          <p className="text-xs sm:text-sm text-[#858E9B] mt-1 max-w-xl">
            Compare caliper thickness, opacity ratings, and surface treatments across our complete range of certified paper grades.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-[#12161F] p-1.5 rounded-xl border border-[#232B3B]">
          {[
            { id: 'all', label: 'All Substrates' },
            { id: 'lightweight', label: '45–56 GSM' },
            { id: 'academic', label: '70–80 GSM' },
            { id: 'board', label: '170–300 GSM' },
            { id: 'luxury', label: '600–700 GSM' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#C89D56] text-[#0E1116] font-bold'
                  : 'text-[#858E9B] hover:text-[#F7F5F0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Left List (7 cols) / Right Active Spec Detail (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Specimen Selector Table (7 cols) */}
        <div className="lg:col-span-7 space-y-2.5">
          {filtered.map((grade) => (
            <div
              key={grade.id}
              onClick={() => setActiveSpecId(grade.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                activeSpecId === grade.id
                  ? 'bg-[#1E2535] border-[#C89D56] shadow-lg shadow-[#C89D56]/10'
                  : 'bg-[#12161F] border-[#232B3B] hover:border-[#384358] hover:bg-[#161B24]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border border-[#232B3B] shrink-0 flex items-center justify-center font-mono text-xs font-bold shadow-inner"
                  style={{
                    backgroundColor: grade.colorSwatch,
                    color: grade.gsm >= 600 ? '#C89D56' : '#111827',
                  }}
                >
                  {grade.gsm}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F7F5F0]">{grade.name}</h4>
                  <div className="text-xs text-[#858E9B] mt-0.5 line-clamp-1">{grade.bestFor}</div>
                </div>
              </div>

              <div className="text-right shrink-0 ml-4 font-mono text-xs">
                <span className="text-[#C89D56] font-bold">{grade.gsm} GSM</span>
                <span className="text-[#7A828A] block text-[10px]">{grade.caliperMicrons} µm</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Specimen Deep-Dive Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#12161F] border border-[#232B3B] rounded-2xl p-6 shadow-xl sticky top-28">
          <div className="flex items-center justify-between border-b border-[#232B3B] pb-4 mb-4">
            <div>
              <span className="text-[10px] font-technical uppercase text-[#C89D56] font-semibold tracking-wider">
                ACTIVE LAB SPECIMEN
              </span>
              <h3 className="text-lg font-editorial font-bold text-[#F7F5F0] mt-0.5">
                {activeSpec.name}
              </h3>
            </div>
            <div className="px-3 py-1 rounded-lg bg-[#C89D56] text-[#0E1116] font-mono font-bold text-sm">
              {activeSpec.gsm} GSM
            </div>
          </div>

          {/* Caliper & Opacity Gauges */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-[#161B24] p-3 rounded-xl border border-[#232B3B]">
              <span className="text-[10px] font-technical text-[#858E9B] block">CALIPER THICKNESS</span>
              <span className="text-xl font-mono font-bold text-white">{activeSpec.caliperMicrons} µm</span>
              <span className="text-[10px] text-[#7A828A] block">Microns (±2%)</span>
            </div>
            <div className="bg-[#161B24] p-3 rounded-xl border border-[#232B3B]">
              <span className="text-[10px] font-technical text-[#858E9B] block">OPACITY RATING</span>
              <span className="text-xl font-mono font-bold text-[#10B981]">{activeSpec.opacityPercent}%</span>
              <span className="text-[10px] text-[#7A828A] block">ISO 2471 Standard</span>
            </div>
          </div>

          {/* Description Attributes */}
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#858E9B] font-technical block mb-1">SURFACE TREATMENT & FINISH:</span>
              <p className="text-[#F7F5F0] bg-[#161B24] p-2.5 rounded-lg border border-[#232B3B] leading-relaxed">
                {activeSpec.finish}
              </p>
            </div>

            <div>
              <span className="text-[#858E9B] font-technical block mb-1">RECOMMENDED APPLICATIONS:</span>
              <p className="text-[#D1D5DB] bg-[#161B24] p-2.5 rounded-lg border border-[#232B3B] leading-relaxed">
                {activeSpec.bestFor}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#232B3B] flex items-center justify-between text-xs">
            <span className="text-[#858E9B]">Available in Reels & Cut Sheets</span>
            <a
              href="#rfq-section"
              className="text-[#C89D56] font-bold hover:underline flex items-center gap-1 font-technical"
            >
              Order Sample Swatch &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
