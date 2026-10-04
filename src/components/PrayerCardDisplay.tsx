import React from 'react';
import { Heart, Share2, Palette } from 'lucide-react';
import { PrayerItem, FontSizeOption, FontFamilyOption, LanguageOption } from '../types/christianPrayer';

interface PrayerCardDisplayProps {
  prayer: PrayerItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShareImage: () => void;
  fontSize: FontSizeOption;
  fontFamily: FontFamilyOption;
  language: LanguageOption;
  isDark?: boolean;
}

export const PrayerCardDisplay: React.FC<PrayerCardDisplayProps> = ({
  prayer,
  isFavorite,
  onToggleFavorite,
  onShareImage,
  fontSize,
  fontFamily,
  language,
  isDark = true
}) => {
  const isEn = language === 'en';
  const prayerText = isEn ? prayer.textEn : prayer.textAr;
  const prayerRef = isEn ? prayer.referenceEn : prayer.referenceAr;

  // Font size classes
  const sizeClasses = {
    small: 'text-lg sm:text-xl leading-relaxed',
    medium: 'text-2xl sm:text-3xl leading-relaxed sm:leading-loose',
    large: 'text-3xl sm:text-4xl leading-relaxed sm:leading-loose font-bold'
  }[fontSize];

  // Font family classes
  const familyClass = {
    amiri: 'font-amiri',
    cairo: 'font-cairo',
    scheherazade: 'font-scheherazade'
  }[fontFamily];

  return (
    <div 
      className={`w-full rounded-[24px] p-6 sm:p-8 relative shadow-2xl transition-all duration-300 border ${
        isDark 
          ? 'bg-[#0E172A] border-slate-800 text-white shadow-black/60' 
          : 'bg-white border-amber-200/80 text-slate-900 shadow-amber-900/10'
      }`}
    >
      {/* Subtle interior gold radiance */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar inside Card: Heart button (Top left in RTL, top right in LTR) */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onToggleFavorite}
          className={`p-2.5 rounded-full transition-all duration-200 active:scale-90 ${
            isFavorite 
              ? 'text-rose-500 bg-rose-500/15' 
              : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800/60'
          }`}
          title={isFavorite ? (isEn ? 'Remove from favorites' : 'إزالة من المحفوظات') : (isEn ? 'Add to favorites' : 'إضافة إلى المحفوظات')}
        >
          <Heart className={`w-6 h-6 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`} />
        </button>

        {prayerRef && (
          <span className="text-[11px] font-cairo px-2.5 py-1 rounded-full bg-slate-800/80 text-amber-300/80 border border-slate-700/60">
            {prayerRef}
          </span>
        )}
      </div>

      {/* Main Prayer Text */}
      <div className="py-6 px-2 text-center select-text">
        <p 
          className={`${familyClass} ${sizeClasses} text-[#F59E0B] tracking-wide transition-all duration-200 drop-shadow`}
          style={{ color: '#F59E0B' }}
        >
          "{prayerText}"
        </p>
      </div>

      {/* Bottom Action: Share as Image (مشاركة كصورة) */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <button
          onClick={onShareImage}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/80 transition-all active:scale-95"
        >
          <span className="text-sm">🎨</span>
          <span className="font-cairo">{isEn ? 'Share as Image' : 'مشاركة كصورة'}</span>
        </button>

        <span className="text-[11px] text-slate-500 font-mono">
          ✝ Jesus Prayer
        </span>
      </div>
    </div>
  );
};
