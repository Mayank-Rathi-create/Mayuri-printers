import React from 'react';
import { Zap, Factory } from 'lucide-react';

export const LiveMachineryTelemetry: React.FC = () => {
  const machinery = [
    {
      name: 'Heidelberg Speedmaster CD 102',
      type: '4-Color Sheetfed Offset Press',
      speed: '15,000 Sheets / Hr',
      capacity: 'Up to 1.0 mm (700 GSM) Board',
      status: 'ONLINE // ACTIVE BATCH',
    },
    {
      name: 'Harris Graphics Web Offset Press',
      type: 'Continuous Roll Fed Book Publishing',
      speed: '45,000 Signatures / Hr',
      capacity: 'Lightweight 45–80 GSM Stocks',
      status: 'ONLINE // TEXTBOOK RUN',
    },
    {
      name: 'Welbound Diamond 12-Clamp',
      type: 'Automated PUR Perfect Binder',
      speed: '4,000 Books / Hr',
      capacity: 'Square spine up to 60 mm',
      status: 'ONLINE // RUNNING',
    },
    {
      name: 'Polar 115 High-Speed Autocut',
      type: 'Programmable Micro-Cut Guillotine',
      speed: 'Precision ±0.05 mm',
      capacity: 'Air-cushioned hydraulic bed',
      status: 'CALIBRATED',
    },
  ];

  const metrics = [
    { label: 'DAILY PRESS OUTPUT', value: '1,200,000+', unit: 'Sheets / Day' },
    { label: 'CALIPER & WEIGHT RANGE', value: '45 – 450', unit: 'GSM Material' },
    { label: 'EXPORT DESTINATIONS', value: '28+', unit: 'Countries Served' },
    { label: 'AVERAGE PRE-PRESS SLA', value: '< 24', unit: 'Hours Turnaround' },
  ];

  return (
    <div className="my-16 bg-[#0E1116] border-y border-[#232B3B] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-technical text-[#C89D56] font-semibold mb-1">
              <Factory className="w-4 h-4" />
              <span>FACTORY FLOOR TELEMETRY & PRESS FLEET</span>
            </div>
            <h3 className="text-2xl font-editorial font-bold text-[#F7F5F0]">
              Heavy Industrial Infrastructure & Automated Finishing
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-xs font-technical text-[#10B981] font-semibold">
              PRESS FLOOR STATUS: 100% OPERATIONAL
            </span>
          </div>
        </div>

        {/* 4 Big Metrics Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-[#12161F] p-5 rounded-xl border border-[#232B3B] relative overflow-hidden"
            >
              <div className="text-[11px] font-technical text-[#858E9B] tracking-wider mb-1">
                {m.label}
              </div>
              <div className="text-3xl font-bold font-editorial text-white flex items-baseline gap-2">
                <span>{m.value}</span>
                <span className="text-xs font-mono font-normal text-[#C89D56]">{m.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Machinery Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {machinery.map((mac, i) => (
            <div
              key={i}
              className="bg-[#161B24] p-4 rounded-xl border border-[#232B3B] hover:border-[#384358] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-technical text-[#10B981] mb-2">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#10B981]" />
                    {mac.status}
                  </span>
                  <span className="text-[#858E9B]">LINE #{i + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-[#F7F5F0]">{mac.name}</h4>
                <p className="text-xs text-[#858E9B] mt-0.5">{mac.type}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#232B3B] space-y-1 text-xs font-mono">
                <div className="flex justify-between text-[#A3AAB5]">
                  <span>Speed:</span>
                  <span className="text-white font-semibold">{mac.speed}</span>
                </div>
                <div className="flex justify-between text-[#858E9B]">
                  <span>Rating:</span>
                  <span className="text-[#C89D56]">{mac.capacity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
