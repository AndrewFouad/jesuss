import React, { useState } from 'react';
import { Heart, Palette, Copy, Check } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);
  const isEn = language === 'en';

  if (!prayer) return null;

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

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(prayerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className={`w-full rounded-[24px] p-5 sm:p-7 relative shadow-2xl transition-all duration-300 border ${
        isDark 
          ? 'bg-[#0E172A] border-slate-800 text-white shadow-black/60' 
          : 'bg-white border-amber-200/90 text-slate-900 shadow-amber-900/10'
      }`}
    >
      {/* Subtle interior gold radiance */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar inside Card: Heart button on one side, reference tag on the other */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <button
          type="button"
          onClick={onToggleFavorite}
          className={`p-2.5 rounded-2xl transition-all duration-200 active:scale-90 cursor-pointer ${
            isFavorite 
              ? 'text-rose-500 bg-rose-500/15 border border-rose-500/30' 
              : 'text-slate-400 hover:text-rose-400 bg-slate-900/50 border border-slate-800 hover:border-slate-700'
          }`}
          title={isFavorite ? (isEn ? 'Remove from favorites' : 'إزالة من المحفوظات') : (isEn ? 'Add to favorites' : 'إضافة إلى المحفوظات')}
        >
          <Heart className={`w-5 h-5 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`} />
        </button>

        {prayerRef && (
          <span className="text-[11px] font-cairo px-3 py-1 rounded-full bg-slate-800/80 text-amber-300/90 border border-slate-700/60 font-medium">
            {prayerRef}
          </span>
        )}
      </div>

      {/* Main Prayer Text */}
      <div className="py-5 sm:py-7 px-2 text-center select-text relative z-10 min-h-[140px] sm:min-h-[160px] flex items-center justify-center">
        <p 
          className={`${familyClass} ${sizeClasses} text-[#F59E0B] tracking-wide transition-all duration-200 drop-shadow`}
          style={{ color: '#F59E0B' }}
        >
          "{prayerText}"
        </p>
      </div>

      {/* Bottom Actions Row: Share as Image & Copy Text */}
      <div className="mt-2 pt-3.5 border-t border-slate-800/80 flex items-center justify-between relative z-10 text-xs">
        <div className="flex items-center gap-2">
          {/* Share as Image (مشاركة كصورة) */}
          <button
            type="button"
            onClick={onShareImage}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-amber-300 bg-slate-900/70 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-cairo">{isEn ? 'Share Image' : 'مشاركة كصورة'}</span>
          </button>

          {/* Copy Text (نسخ النص) */}
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-amber-300 bg-slate-900/70 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-cairo">{isEn ? 'Copied!' : 'تم النسخ!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-cairo">{isEn ? 'Copy' : 'نسخ'}</span>
              </>
            )}
          </button>
        </div>

        <span className="text-[11px] text-slate-500 font-mono tracking-wider">
          ✝ Jesus Prayer
        </span>
      </div>
    </div>
  );
};
