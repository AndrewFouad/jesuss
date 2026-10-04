import React from 'react';
import { Volume2, Sparkles, Clock } from 'lucide-react';
import { adhanAudio } from '../utils/audioAdhan';

interface PrayerCardProps {
  nextPrayerName?: string;
  nextPrayerTime?: string;
  countdownText?: string;
}

export const PrayerCard: React.FC<PrayerCardProps> = ({
  nextPrayerName = 'العصر',
  nextPrayerTime = '03:45 م',
  countdownText = '01:14:22'
}) => {
  const handlePlayAdhan = () => {
    adhanAudio.playAdhanChime();
  };

  return (
    <div className="relative group transition-all duration-300">
      {/* Jetpack Compose Card container: Color(0xFF0F172A), RoundedCornerShape(16.dp) */}
      <div 
        className="w-full bg-[#0F172A] rounded-[16px] border border-slate-800/80 shadow-2xl p-6 sm:p-7 text-center relative overflow-hidden transition-all duration-300 hover:border-slate-700"
        style={{ backgroundColor: '#0F172A' }}
      >
        {/* Subtle background ambient light */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-4 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top Badges: Compose Badge & Live Countdown */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60 font-cairo">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Jetpack Compose UI
          </span>

          <button
            onClick={handlePlayAdhan}
            title="استماع لتكبيرات الأذان"
            className="flex items-center gap-1.5 text-xs text-amber-300/90 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-2.5 py-1 rounded-full transition-colors active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="font-cairo">الأذان</span>
          </button>
        </div>

        {/* Column from Jetpack Compose: Next Prayer Title */}
        <p 
          className="font-cairo text-[20px] text-[#94A3B8] font-medium tracking-normal mb-2"
          style={{ color: '#94A3B8' }}
        >
          الصلاة القادمة: {nextPrayerName}
        </p>

        {/* Next Prayer Time: 40sp, Bold, Color.White */}
        <h1 
          className="font-cairo text-[40px] leading-tight font-bold text-white tracking-wide my-1 drop-shadow-md"
          style={{ color: '#FFFFFF' }}
        >
          {nextPrayerTime}
        </h1>

        {/* Countdown Pill */}
        {countdownText && (
          <div className="inline-flex items-center gap-1.5 mt-2 mb-4 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-emerald-400">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>متبقي: {countdownText}</span>
          </div>
        )}

        {/* Quranic Verse: Amiri font, 18sp, Color(0xFFCBD5E1) */}
        <div className="mt-2 pt-4 border-t border-slate-800/80">
          <p 
            className="font-amiri text-[19px] leading-relaxed text-[#CBD5E1] font-normal"
            style={{ color: '#CBD5E1' }}
          >
            ﴿ إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا ﴾
          </p>
        </div>
      </div>
    </div>
  );
};
