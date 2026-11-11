import React from 'react';
import type { AudienceType } from '../../types';
import { Building2, GraduationCap, Store, Globe2, ArrowRight } from 'lucide-react';

interface AudienceSelectorProps {
  selectedAudience: AudienceType;
  onSelectAudience: (aud: AudienceType) => void;
}

export const AudienceSelector: React.FC<AudienceSelectorProps> = ({
  selectedAudience,
  onSelectAudience,
}) => {
  const audiences = [
    {
      id: 'corporate' as AudienceType,
      title: 'Corporations & Enterprises',
      subtitle: 'Executive Visiting Cards, Security Registers & Audit Books',
      icon: Building2,
      badge: 'B2B Corporate Identity',
      targetAnchor: '#visiting-cards',
    },
    {
      id: 'academic' as AudienceType,
      title: 'Educational Institutions',
      subtitle: 'Smyth-Sewn Textbooks, Examination Pads & Fee Challans',
      icon: GraduationCap,
      badge: 'Academic Publishing',
      targetAnchor: '#textbooks',
    },
    {
      id: 'retail' as AudienceType,
      title: 'Retail & Commercial Trade',
      subtitle: 'Multi-Part Carbonless Bill Books & Custom Order Pads',
      icon: Store,
      badge: 'Commercial NCR Books',
      targetAnchor: '#billbooks',
    },
    {
      id: 'export' as AudienceType,
      title: 'Paper Importers & Exporters',
      subtitle: 'Bulk Reels, Virgin Woodfree, Kraft Liner & Duplex Boards',
      icon: Globe2,
      badge: 'FCL Ocean Cargo',
      targetAnchor: '#paper-export',
    },
  ];

  return (
    <div className="w-full my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-technical text-[#858E9B] uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C89D56]" />
          <span>FILTER TAILORED PRINT CAPABILITIES BY YOUR SECTOR:</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {audiences.map((aud) => {
          const Icon = aud.icon;
          const isSelected = selectedAudience === aud.id;

          return (
            <button
              key={aud.id}
              onClick={() => onSelectAudience(aud.id)}
              className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1E2535] to-[#12161F] border-[#C89D56] shadow-lg shadow-[#C89D56]/10'
                  : 'bg-[#12161F]/70 border-[#232B3B] hover:border-[#384358] hover:bg-[#161B24]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#C89D56]/10 rounded-bl-full pointer-events-none" />
              )}

              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#C89D56] text-[#0E1116]'
                      : 'bg-[#18202F] text-[#858E9B] group-hover:text-[#F7F5F0]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-technical uppercase px-2 py-0.5 rounded font-semibold ${
                    isSelected
                      ? 'bg-[#C89D56]/20 text-[#C89D56] border border-[#C89D56]/40'
                      : 'bg-[#18202F] text-[#7A828A]'
                  }`}
                >
                  {aud.badge}
                </span>
              </div>

              <h4
                className={`text-sm font-bold font-editorial leading-snug ${
                  isSelected ? 'text-[#F7F5F0]' : 'text-[#D1D5DB]'
                }`}
              >
                {aud.title}
              </h4>
              <p className="text-xs text-[#858E9B] mt-1 line-clamp-2 leading-relaxed">
                {aud.subtitle}
              </p>

              <div className="mt-3 flex items-center gap-1 text-[11px] font-technical font-medium text-[#C89D56] opacity-90 group-hover:translate-x-1 transition-transform">
                <span>Explore Solutions</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
