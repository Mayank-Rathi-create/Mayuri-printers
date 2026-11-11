import React from 'react';
import { Shield, Globe, Mail, Phone, CheckCircle, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="footer-contact" className="bg-[#090B10] border-t border-[#292F3B] text-[#A1A8B5] text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#292F3B]">
          {/* Col 1: Brand & 35-Year Heritage */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A202B] to-[#141821] border border-[#D6AD61]/30 flex items-center justify-center font-editorial text-2xl font-bold text-[#D6AD61]">
                M
              </div>
              <div>
                <span className="font-editorial text-lg font-bold text-[#F5F3ED]">
                  MAYURI PRINTERS
                </span>
                <span className="block text-[11px] font-technical text-[#D6AD61] font-semibold">
                  ★ 35 YEARS OF PRINTING EXCELLENCE (EST. 1991)
                </span>
              </div>
            </div>
            <p className="text-xs text-[#A1A8B5] max-w-sm leading-relaxed">
              Trusted by educational institutions, corporate enterprises, and international paper traders for 35 continuous years. Specialized in custom bill books, curriculum textbooks, executive visiting cards, and bulk export paper reels.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141821] border border-[#292F3B] text-[11px] text-[#10B981]">
                <Shield className="w-3.5 h-3.5" />
                <span>ISO 9001:2015 Certified</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141821] border border-[#292F3B] text-[11px] text-[#D6AD61]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>FSC Certified Paper Stocks</span>
              </div>
            </div>
          </div>

          {/* Col 2: Core Offerings */}
          <div className="space-y-3">
            <h4 className="text-xs font-technical font-semibold uppercase text-[#F5F3ED] tracking-wider">
              Core Products
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#products" className="hover:text-[#D6AD61] transition-colors">
                  Custom Carbonless Bill Books
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#D6AD61] transition-colors">
                  Curriculum Textbooks & Booklets
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#D6AD61] transition-colors">
                  Executive Visiting Cards (600–700 GSM)
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#D6AD61] transition-colors">
                  Account Ledgers & Registers
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#D6AD61] transition-colors">
                  Certificates
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Major Clients & Supply Network */}
          <div className="space-y-3">
            <h4 className="text-xs font-technical font-semibold uppercase text-[#F5F3ED] tracking-wider">
              Clients & Supply Network
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#D6AD61] shrink-0" />
                <span className="text-[#F5F3ED] font-medium">Reliance Spinning Mills</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#D6AD61] shrink-0" />
                <span className="text-[#F5F3ED] font-medium">Local Shops & Companies</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#D6AD61] shrink-0" />
                <span className="text-[#F5F3ED] font-medium">Export to Banaras</span>
              </li>
              <li className="text-[11px] text-[#A1A8B5] pt-1 leading-relaxed">
                Trusted regional distribution partner supplying commercial printing & paper products across industrial enterprises, local retail, and cross-border exports.
              </li>
            </ul>
          </div>

          {/* Col 4: Owner Direct Contact Details (Exclusively here) */}
          <div className="space-y-3">
            <h4 className="text-xs font-technical font-semibold uppercase text-[#D6AD61] tracking-wider">
              Factory Leadership
            </h4>
            <div className="p-4 bg-[#141821] rounded-2xl border border-[#292F3B] space-y-2.5 text-xs">
              <div>
                <div className="font-semibold text-[#F5F3ED]">Binay Rathi</div>
                <div className="text-[11px] text-[#A1A8B5]">Founder & Managing Director</div>
              </div>

              <div className="pt-1 space-y-2 border-t border-[#292F3B]">
                <a
                  href="tel:+9779852020708"
                  className="flex items-center gap-2 text-[#F5F3ED] hover:text-[#D6AD61] font-technical transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>+977 9852020708</span>
                </a>

                <a
                  href="https://wa.me/9779852020708"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#10B981] hover:underline font-technical"
                >
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href="mailto:binayrathi@gmail.com"
                  className="flex items-center gap-2 text-[#A1A8B5] hover:text-[#D6AD61] font-technical transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D6AD61] shrink-0" />
                  <span>binayrathi@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#A1A8B5]">
          <div>
            &copy; {new Date().getFullYear()} Mayuri Printers. 35 Years of Printing Trust. Owner: Binay Rathi.
          </div>
          <div className="flex items-center gap-6 font-technical">
            <a href="tel:+9779852020708" className="hover:text-[#D6AD61] transition-colors">
              +977 9852020708
            </a>
            <a href="mailto:binayrathi@gmail.com" className="hover:text-[#D6AD61] transition-colors">
              binayrathi@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
