import React, { useState, useRef } from 'react';
import { Sliders, FileText, Camera } from 'lucide-react';

export const ProofComparisonSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="bg-[#12161F] rounded-2xl border border-[#232B3B] p-6 lg:p-8 shadow-xl my-12">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C89D56]/15 border border-[#C89D56]/30 text-[#C89D56] text-xs font-technical font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>PRECISION COLOR FIDELITY & EMBOSSING VERIFICATION</span>
          </div>
          <h3 className="text-2xl font-editorial font-bold text-[#F7F5F0]">
            Digital Vector PDF vs. Tangible Finished Impression
          </h3>
          <p className="text-sm text-[#858E9B] mt-1 max-w-2xl">
            Drag the comparison slider horizontally. On the left: digital prepress separation proof with 3mm bleed and FOGRA39 calibration. On the right: actual printed 600 GSM card with 24K hot foil stamping and blind debossing.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-[#161B24] px-3.5 py-2 rounded-xl border border-[#232B3B]">
          <span className="text-[#858E9B]">Delta-E (ΔE):</span>
          <span className="text-[#10B981] font-bold">&lt; 1.4 (ISO 12647-2 Certified)</span>
        </div>
      </div>

      {/* Interactive Split Canvas */}
      <div
        ref={containerRef}
        onMouseDown={(e) => handleMove(e.clientX)}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        className="relative h-[380px] sm:h-[440px] rounded-xl overflow-hidden cursor-ew-resize select-none border border-[#232B3B] bg-[#0E1116]"
      >
        {/* Right Side: Physical Tangible Print (Base Layer) */}
        <div className="absolute inset-0 bg-[#0B0E14] flex items-center justify-center p-8">
          <div className="relative w-full max-w-xl aspect-[1.75/1] rounded-lg shadow-2xl overflow-hidden bg-gradient-to-br from-[#121620] to-[#0A0D12] border border-[#C89D56]/40 p-8 flex flex-col justify-between">
            {/* Dynamic Gold Shimmer Effect */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C89D56]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-start">
              <div>
                <div className="w-12 h-12 rounded-full border-2 border-[#C89D56] flex items-center justify-center shadow-lg shadow-[#C89D56]/20 bg-[#161B24]">
                  <span className="font-editorial text-2xl font-bold text-[#C89D56]">M</span>
                </div>
                <div className="mt-3 font-editorial text-xl font-bold foil-gold-text">
                  MAYURI PRESS & EXPORTS
                </div>
                <div className="text-[11px] font-mono text-[#A3AAB5] tracking-wider">
                  HIGH-SECURITY OFFSET GUILD
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded text-[10px] font-technical uppercase font-bold bg-[#C89D56]/20 text-[#C89D56] border border-[#C89D56]/40">
                  REAL 24K HOT FOIL
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <div className="font-editorial text-2xl font-bold text-white tracking-wide">
                  VIKRAMADITYA RAO
                </div>
                <div className="text-xs font-technical text-[#C89D56]">DIRECTOR OF GLOBAL SUPPLY</div>
              </div>
              <div className="text-[10px] font-mono text-[#858E9B] space-y-0.5 text-right">
                <div>600 GSM COTTON BOARD</div>
                <div>DEEP BLIND DEBOSS RELIEF</div>
              </div>
            </div>
          </div>

          {/* Right Label Badge */}
          <div className="absolute top-4 right-4 bg-[#0E1116]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#232B3B] text-xs font-technical text-[#C89D56] flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>FINISHED PHYSICAL PRINT</span>
          </div>
        </div>

        {/* Left Side: Prepress Digital Vector Proof (Clipped Layer) */}
        <div
          className="absolute inset-0 bg-[#F4F1EA] text-[#111827] overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative w-full max-w-xl aspect-[1.75/1] rounded-none border border-dashed border-[#DC2626] bg-[#FFFFFF] p-8 flex flex-col justify-between shadow-md">
              {/* Prepress Registration Marks */}
              <div className="absolute -top-3 -left-3 text-[9px] font-mono text-[#DC2626]">
                + TRIM MARK 3MM BLEED
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00FFFF]" title="Cyan" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF00FF]" title="Magenta" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFFF00]" title="Yellow" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#000000]" title="Key Black" />
              </div>

              <div>
                <div className="w-12 h-12 rounded-full border-2 border-[#111827] flex items-center justify-center">
                  <span className="font-editorial text-2xl font-bold text-[#111827]">M</span>
                </div>
                <div className="mt-3 font-editorial text-xl font-bold text-[#111827]">
                  MAYURI PRESS & EXPORTS
                </div>
                <div className="text-[11px] font-mono text-[#6B7280]">VECTOR CMYK MASTER ARTWORK</div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="font-editorial text-2xl font-bold text-[#111827]">
                    VIKRAMADITYA RAO
                  </div>
                  <div className="text-xs font-technical text-[#4B5563]">SPOT COLOR: PANTONE 871 C (GOLD)</div>
                </div>
                <div className="text-[10px] font-mono text-[#DC2626] text-right">
                  [SAFETY BLEED ZONE 3.0 MM]
                </div>
              </div>
            </div>
          </div>

          {/* Left Label Badge */}
          <div className="absolute top-4 left-4 bg-[#FFFFFF]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#D1D5DB] text-xs font-technical text-[#111827] flex items-center gap-1.5 shadow">
            <FileText className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>PREPRESS VECTOR PDF PROOF</span>
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[#C89D56] shadow-[0_0_15px_rgba(200,157,86,0.8)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#C89D56] text-[#0E1116] flex items-center justify-center shadow-xl border-2 border-[#0E1116]">
            <Sliders className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Caption Footnote */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#858E9B]">
        <span>Drag center handle to inspect registration, foil alignment, and color saturation match.</span>
        <div className="flex items-center gap-4 text-[#C89D56] font-technical">
          <span>SPOT FOIL REGISTRATION: 0.05 MM ACCURACY</span>
        </div>
      </div>
    </div>
  );
};
