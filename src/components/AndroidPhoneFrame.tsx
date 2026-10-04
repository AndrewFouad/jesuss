import React from 'react';
import { Wifi, BatteryMedium, Signal, ChevronRight, Circle, Square } from 'lucide-react';

interface AndroidPhoneFrameProps {
  children: React.ReactNode;
  currentTimeStr?: string;
  isSimulatorActive?: boolean;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({
  children,
  currentTimeStr = '03:45',
  isSimulatorActive = true
}) => {
  if (!isSimulatorActive) {
    // Return clean full view container
    return (
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#020617] text-white flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className="relative mx-auto my-4 sm:my-8 transition-all duration-300">
      {/* Outer Phone Shell */}
      <div className="relative w-[360px] sm:w-[390px] h-[780px] sm:h-[830px] bg-[#0c1322] rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_12px_#1e293b,0_0_0_14px_#334155] border-2 border-slate-700/50 flex flex-col overflow-hidden">
        
        {/* Hardware side buttons simulation */}
        <div className="absolute -left-[16px] top-28 w-[4px] h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-[16px] top-44 w-[4px] h-20 bg-slate-700 rounded-l-md" />
        <div className="absolute -right-[16px] top-32 w-[4px] h-16 bg-slate-700 rounded-r-md" />

        {/* Android Display Screen */}
        <div className="relative w-full h-full bg-[#020617] rounded-[38px] overflow-hidden flex flex-col border border-slate-900">
          
          {/* Android Status Bar */}
          <div className="h-10 bg-[#020617] px-6 flex items-center justify-between text-[11px] text-slate-300 font-mono select-none z-30 shrink-0">
            {/* Clock (Left) */}
            <span className="font-semibold tracking-wide text-white">{currentTimeStr}</span>

            {/* Front Camera Cutout (Center) */}
            <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900/80" />
            </div>

            {/* Status Icons (Right: RTL Layout means icons left/right) */}
            <div className="flex items-center gap-2 text-slate-400">
              <Signal className="w-3 h-3 text-slate-300" />
              <Wifi className="w-3.5 h-3.5 text-slate-300" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">98%</span>
                <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* App Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>

          {/* Android Navigation Bar (Bottom) */}
          <div className="h-10 bg-[#020617] border-t border-slate-900/80 flex items-center justify-around px-12 text-slate-500 shrink-0 select-none">
            <button className="p-1 hover:text-slate-300 transition-colors" title="رجوع">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="p-1 hover:text-slate-300 transition-colors" title="الرئيسية">
              <Circle className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 hover:text-slate-300 transition-colors" title="التطبيقات">
              <Square className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
