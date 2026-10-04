import React from 'react';
import { Clock, BellOff, X } from 'lucide-react';
import { LanguageOption } from '../types/christianPrayer';

interface QuietTimerBarProps {
  remainingSeconds: number;
  totalSeconds: number;
  onStop: () => void;
  language: LanguageOption;
}

export const QuietTimerBar: React.FC<QuietTimerBarProps> = ({
  remainingSeconds,
  totalSeconds,
  onStop,
  language
}) => {
  const isEn = language === 'en';
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  return (
    <div className="w-full bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/15 border border-amber-500/30 rounded-2xl p-3 shadow-lg relative overflow-hidden font-cairo">
      {/* Top countdown progress line */}
      <div 
        className="absolute top-0 inset-x-0 h-1 bg-amber-500 transition-all duration-1000"
        style={{ width: `${100 - progressPercent}%` }}
      />

      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-base animate-pulse">⏳</span>
          <span className="text-base sm:text-lg font-bold font-mono text-amber-400">
            {timeFormatted}
          </span>
          <span className="hidden sm:inline-block text-slate-400">•</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-300">
            <BellOff className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'Quiet Time Active (Do Not Disturb recommended)' : 'وقت الخلوة مفعل (يُفضل تشغيل وضع عدم الإزعاج)'}</span>
          </span>
        </div>

        <button
          onClick={onStop}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>{isEn ? 'End' : 'إنهاء'}</span>
        </button>
      </div>
    </div>
  );
};
