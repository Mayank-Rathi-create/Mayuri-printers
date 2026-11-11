import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  unit: 'metric' | 'imperial';
  setUnit: (u: 'metric' | 'imperial') => void;
  onOpenRfq?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#090B10]/85 backdrop-blur-xl border-b border-[#292F3B]/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Heritage Pill */}
        <a href="#" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1A202B] to-[#141821] border border-[#D6AD61]/30 flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-[1.02] shrink-0">
            <span className="font-editorial text-lg font-bold text-[#D6AD61] leading-none">M</span>
          </div>
          <div className="flex items-center gap-2.5 whitespace-nowrap">
            <span className="font-editorial font-semibold text-lg tracking-tight text-[#F5F3ED] leading-none">
              MAYURI PRINTERS
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-technical uppercase bg-[#D6AD61]/10 text-[#D6AD61] border border-[#D6AD61]/25 font-medium leading-none">
              <Sparkles className="w-2.5 h-2.5 opacity-80" />
              35 YRS
            </span>
          </div>
        </a>

        {/* Admin Login Symbol */}
        <div className="flex items-center">
          <button
            onClick={onOpenAdmin}
            title="Admin Portal Login (Binay Rathi)"
            aria-label="Admin Portal Login"
            className="h-9 w-9 rounded-lg flex items-center justify-center border border-[#292F3B] bg-[#141821] hover:bg-[#1A202B] hover:border-[#D6AD61]/60 text-[#D6AD61] hover:text-[#F5F3ED] transition-all duration-200 cursor-pointer shadow-sm group"
          >
            <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
