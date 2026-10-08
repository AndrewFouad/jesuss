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
  
  // Format reference tag
  let displayReference = isEn ? prayer.referenceEn : prayer.referenceAr;
  if (prayer.sourceType === 'patristic' && prayer.fatherNameAr) {
    if (isEn) {
      displayReference = `Sayings of Father ${prayer.fatherNameEn || prayer.fatherNameAr}`;
    } else {
      const cleanFather = prayer.fatherNameAr.replace(/^أقوال\s+/, '').replace(/^الأب\s+/, '').trim();
      displayReference = `أقوال الأب ${cleanFather}`;
    }
  }

  // Balanced font size classes designed for fixed prayer container
  const sizeClasses = {
    small: 'text-base sm:text-lg leading-relaxed',
    medium: 'text-lg sm:text-xl md:text-2xl leading-relaxed',
    large: 'text-xl sm:text-2xl md:text-3xl leading-snug font-bold'
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className={`w-full h-[235px] sm:h-[255px] rounded-[24px] p-4 sm:p-5 relative shadow-2xl transition-all duration-300 border flex flex-col justify-between ${
        isDark 
          ? 'bg-[#0E172A] border-slate-800 text-white shadow-black/60' 
          : 'bg-white border-amber-200/90 text-slate-900 shadow-amber-900/10'
      }`}
    >
      {/* Subtle interior gold radiance */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar inside Card: Heart button on one side, reference tag on the other */}
      <div className="flex items-center justify-between mb-1.5 relative z-10 shrink-0">
        <button
          type="button"
          onClick={onToggleFavorite}
          className={`p-2 rounded-2xl transition-all duration-200 active:scale-90 cursor-pointer ${
            isFavorite 
              ? 'text-rose-500 bg-rose-500/15 border border-rose-500/30' 
              : 'text-slate-400 hover:text-rose-400 bg-slate-900/50 border border-slate-800 hover:border-slate-700'
          }`}
          title={isFavorite ? (isEn ? 'Remove from favorites' : 'إزالة من المحفوظات') : (isEn ? 'Add to favorites' : 'إضافة إلى المحفوظات')}
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`} />
        </button>

        {displayReference && (
          <span className="text-[11px] font-cairo px-3 py-1 rounded-full bg-slate-800/80 text-amber-300/90 border border-slate-700/60 font-medium max-w-[200px] sm:max-w-xs truncate">
            {displayReference}
          </span>
        )}
      </div>

      {/* 
        Main Prayer Text Area: 
        FIXED height area with smooth internal scrollbar so long prayers 
        NEVER alter or jump card/screen dimensions!
      */}
      <div className="flex-1 overflow-y-auto px-2 py-1 text-center select-text relative z-10 flex items-center justify-center my-auto">
        <p 
          className={`${familyClass} ${sizeClasses} text-[#F59E0B] tracking-wide transition-all duration-200 drop-shadow m-auto`}
          style={{ color: '#F59E0B' }}
        >
          "{prayerText}"
        </p>
      </div>

      {/* 
        Bottom Actions Row:
        - FAR LEFT: Copy prayer button with label "نسخ الصلاة"
        - FAR RIGHT: Share as image button
        dir="ltr" ensures stable left/right placement across languages
      */}
      <div 
        className="mt-auto pt-2.5 border-t border-slate-800/80 flex items-center justify-between w-full relative z-10 text-xs shrink-0" 
        dir="ltr"
      >
        {/* FAR LEFT (أقصى الشمال): زر نسخ الصلاة ومكتوب جنبه كلمة نسخ الصلاة */}
        <button
          type="button"
          onClick={handleCopyText}
          className="flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-amber-300 bg-slate-900/70 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-sky-500/40 transition-all active:scale-95 cursor-pointer shadow-sm select-none"
          title={copied ? (isEn ? 'Copied!' : 'تم النسخ!') : (isEn ? 'Copy Prayer' : 'نسخ الصلاة')}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-sky-400" />
          )}
          <span className="font-cairo">
            {copied ? (isEn ? 'Copied' : 'تم النسخ') : (isEn ? 'Copy Prayer' : 'نسخ الصلاة')}
          </span>
        </button>

        {/* FAR RIGHT (أقصى اليمين): زر مشاركة الصلاة كصورة */}
        <button
          type="button"
          onClick={onShareImage}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-amber-300 bg-slate-900/70 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all active:scale-95 cursor-pointer shadow-sm select-none"
          title={isEn ? 'Share as Image' : 'مشاركة الصلاة كصورة'}
        >
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-cairo">{isEn ? 'Share Image' : 'مشاركة كصورة'}</span>
        </button>
      </div>
    </div>
  );
};
