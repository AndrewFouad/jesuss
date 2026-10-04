import React from 'react';
import { RotateCcw, RefreshCw } from 'lucide-react';
import { LanguageOption } from '../types/christianPrayer';

interface RosaryCounterProps {
  count: number;
  onIncrement: () => void;
  onReset: () => void;
  onNextPrayer: () => void;
  focusMode: boolean;
  language: LanguageOption;
}

export const RosaryCounter: React.FC<RosaryCounterProps> = ({
  count,
  onIncrement,
  onReset,
  onNextPrayer,
  focusMode,
  language
}) => {
  const isEn = language === 'en';

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 space-y-5 font-cairo">
      
      {/* Big Circular Rosary Button */}
      {!focusMode ? (
        // Normal Mode: Touch to count
        <button
          onClick={onIncrement}
          className="group relative w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-b from-[#F59E0B] via-[#EAB308] to-[#D97706] shadow-[0_15px_40px_-10px_rgba(245,158,11,0.5)] border-4 border-amber-300/40 active:scale-95 transition-all duration-150 flex flex-col items-center justify-center cursor-pointer select-none"
        >
          {/* Subtle inner ring */}
          <div className="absolute inset-1.5 rounded-full border border-amber-200/40 group-hover:border-white/50 transition-colors pointer-events-none" />

          {/* Number */}
          <span className="text-5xl sm:text-6xl font-extrabold text-slate-950 font-mono tracking-tight drop-shadow-sm">
            {count}
          </span>

          {/* Subtitle */}
          <span className="text-xs sm:text-sm font-bold text-slate-900 mt-1 tracking-wide">
            {isEn ? 'Tap to count' : 'اضغط للعد'}
          </span>
        </button>
      ) : (
        // Focus Mode / Counter Disabled: Button becomes "Next Prayer"
        <button
          onClick={onNextPrayer}
          className="group relative w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-amber-500/50 hover:border-amber-400 active:scale-95 transition-all duration-150 flex flex-col items-center justify-center cursor-pointer shadow-2xl select-none"
        >
          <div className="absolute inset-1.5 rounded-full border border-amber-500/20 group-hover:border-amber-400/40 pointer-events-none" />
          <RefreshCw className="w-12 h-12 text-amber-400 mb-2 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-base sm:text-lg font-bold text-amber-300">
            {isEn ? 'Next Prayer 🔄' : 'الصلاة التالية 🔄'}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            {isEn ? 'Focus Mode Active' : 'نظام التركيز مفعل'}
          </span>
        </button>
      )}

      {/* Bottom Controls Row */}
      {!focusMode && (
        <div className="w-full max-w-xs flex items-center justify-between px-2 pt-1 text-sm">
          {/* Reset Counter Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-800/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Reset Counter' : 'تصفير العداد'}</span>
          </button>

          {/* Next Prayer Pill Button */}
          <button
            onClick={onNextPrayer}
            className="flex items-center gap-2 text-xs font-bold text-slate-100 bg-[#16233B] hover:bg-[#1E2E4E] border border-slate-700/80 py-2 px-4 rounded-xl shadow-md transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            <span>{isEn ? 'Next Prayer' : 'الصلاة التالية'}</span>
          </button>
        </div>
      )}

    </div>
  );
};
