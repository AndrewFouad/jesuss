import React from 'react';
import { RotateCcw, Shuffle, RefreshCw } from 'lucide-react';
import { LanguageOption } from '../types/christianPrayer';

interface RosaryCounterProps {
  count: number;
  onIncrement: () => void;
  onReset: () => void;
  onChangePrayer: () => void;
  onNextPrayer: () => void;
  focusMode: boolean;
  language: LanguageOption;
}

export const RosaryCounter: React.FC<RosaryCounterProps> = ({
  count,
  onIncrement,
  onReset,
  onChangePrayer,
  onNextPrayer,
  focusMode,
  language
}) => {
  const isEn = language === 'en';

  return (
    <div className="w-full flex flex-col items-center justify-center my-2 sm:my-3 space-y-3 font-cairo">
      
      {/* 
        Circular Rosary Button: 
        Slightly resized to w-36 h-36 (sm:w-40 sm:h-40) to give generous space to prayers
      */}
      {!focusMode ? (
        // Normal Mode: Touch to count
        <button
          type="button"
          onClick={onIncrement}
          style={{ touchAction: 'manipulation' }}
          className="group relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-b from-[#F59E0B] via-[#EAB308] to-[#D97706] shadow-[0_10px_30px_-6px_rgba(245,158,11,0.55)] border-4 border-amber-300/40 active:scale-95 transition-all duration-150 flex flex-col items-center justify-center cursor-pointer select-none"
          title={isEn ? 'Tap to count' : 'اضغط للعد'}
        >
          {/* Subtle inner concentric ring */}
          <div className="absolute inset-1 rounded-full border border-amber-200/50 group-hover:border-white/60 pointer-events-none transition-colors" />

          {/* Number */}
          <span className="text-4xl sm:text-5xl font-extrabold text-slate-950 font-mono tracking-tight drop-shadow-sm select-none">
            {count}
          </span>

          {/* Subtitle */}
          <span className="text-[11px] sm:text-xs font-bold text-slate-900 mt-0.5 tracking-wide select-none">
            {isEn ? 'Tap to count' : 'اضغط للعد'}
          </span>
        </button>
      ) : (
        // Cancelled Counter Mode:
        // Displays ONLY "Next Prayer" / "الصلاة التالية"
        <button
          type="button"
          onClick={onNextPrayer}
          style={{ touchAction: 'manipulation' }}
          className="group relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-b from-[#0F172A] to-[#1E293B] border-4 border-amber-500/60 hover:border-amber-400 active:scale-95 transition-all duration-150 flex flex-col items-center justify-center cursor-pointer shadow-xl select-none"
          title={isEn ? 'Next Prayer' : 'الصلاة التالية'}
        >
          <div className="absolute inset-1 rounded-full border border-amber-500/30 group-hover:border-amber-400/50 pointer-events-none" />
          <RefreshCw className="w-8 h-8 text-amber-400 mb-1.5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-sm sm:text-base font-bold text-amber-300 tracking-wide">
            {isEn ? 'Next Prayer' : 'الصلاة التالية'}
          </span>
        </button>
      )}

      {/* 
        Bottom Controls Row (Hidden when counter is cancelled)
        Requirement:
        - Reset Counter (تصفير العداد) is ALWAYS on the LEFT
        - Change Prayer (تغيير الصلاة) is ALWAYS on the RIGHT
        dir="ltr" ensures this exact physical position in all languages.
      */}
      {!focusMode && (
        <div 
          className="w-full max-w-xs flex items-center justify-between px-2" 
          dir="ltr"
        >
          {/* ALWAYS ON THE LEFT (أقصى الشمال): زر تصفير العداد */}
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 active:scale-95 transition-all py-1.5 px-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 cursor-pointer shadow-sm select-none"
            title={isEn ? 'Reset Counter' : 'تصفير العداد'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="font-semibold">{isEn ? 'Reset' : 'تصفير العداد'}</span>
          </button>

          {/* ALWAYS ON THE RIGHT (أقصى اليمين): زر تغيير الصلاة */}
          <button
            type="button"
            onClick={onChangePrayer}
            className="flex items-center gap-2 text-xs font-bold text-amber-300 bg-[#141E33] hover:bg-[#1E2E4E] border border-amber-500/30 py-1.5 px-3.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer select-none"
            title={isEn ? 'Change Prayer (Random)' : 'تغيير الصلاة (عشوائياً)'}
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'Change Prayer' : 'تغيير الصلاة 🔄'}</span>
          </button>
        </div>
      )}

    </div>
  );
};
