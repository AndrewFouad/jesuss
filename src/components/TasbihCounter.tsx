import React, { useState } from 'react';
import { RotateCcw, Award, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { adhanAudio } from '../utils/audioAdhan';

const DHIKR_LIST = [
  'سُبْحَانَ اللَّهِ',
  'الْحَمْدُ لِلَّهِ',
  'لَا إِلَٰهَ إِلَّا اللَّهُ',
  'اللَّهُ أَكْبَرُ',
  'أَسْتَغْفِرُ اللَّهَ',
  'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ'
];

export const TasbihCounter: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [selectedDhikr, setSelectedDhikr] = useState<string>(DHIKR_LIST[0]);
  const [target, setTarget] = useState<number>(33);
  const [completedRounds, setCompletedRounds] = useState<number>(0);

  const handleIncrement = () => {
    adhanAudio.playTasbihClick();
    const nextCount = count + 1;
    if (target > 0 && nextCount >= target) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
      setCount(0);
      setCompletedRounds((prev) => prev + 1);
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="w-full bg-[#0F172A] rounded-[16px] border border-slate-800/80 p-5 text-center relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-400 font-cairo">السبحة الإلكترونية</span>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <Award className="w-3.5 h-3.5" />
          <span className="font-mono">{completedRounds} دورة مكتملة</span>
        </div>
      </div>

      {/* Dhikr Selector */}
      <div className="mb-4">
        <select
          value={selectedDhikr}
          onChange={(e) => setSelectedDhikr(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-amber-200 font-amiri text-center focus:outline-none focus:ring-1 focus:ring-amber-400/50"
        >
          {DHIKR_LIST.map((dhikr) => (
            <option key={dhikr} value={dhikr} className="bg-slate-900 text-white font-amiri">
              {dhikr}
            </option>
          ))}
        </select>
      </div>

      {/* Big Counter Button */}
      <div className="my-3 flex flex-col items-center justify-center">
        <button
          onClick={handleIncrement}
          className="group relative w-36 h-36 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-emerald-500/30 hover:border-emerald-400 active:scale-95 transition-all shadow-xl flex flex-col items-center justify-center cursor-pointer select-none"
        >
          <div className="absolute inset-1 rounded-full border border-emerald-500/20 group-hover:border-emerald-400/40" />
          <span className="text-3xl font-bold font-mono text-emerald-300 drop-shadow">
            {count}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 font-cairo">
            من {target}
          </span>
        </button>
      </div>

      {/* Target & Reset Controls */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-cairo">الهدف:</span>
          {[33, 100].map((t) => (
            <button
              key={t}
              onClick={() => { setTarget(t); setCount(0); }}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-mono transition-colors ${
                target === t
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors p-1"
          title="تصفير العداد"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="font-cairo">تصفير</span>
        </button>
      </div>
    </div>
  );
};
