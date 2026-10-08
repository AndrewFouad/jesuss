import React, { useState } from 'react';
import { X, Download, Share2, Check, Copy } from 'lucide-react';
import { LanguageOption } from '../types/christianPrayer';

interface ShareImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  language: LanguageOption;
}

export const ShareImageModal: React.FC<ShareImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  language
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !imageUrl) return null;

  const isEn = language === 'en';

  const handleShare = async () => {
    try {
      if (navigator.share) {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const file = new File([blob], 'jesus-prayer.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: isEn ? 'Jesus Prayer' : 'صلاة يسوع',
            text: isEn ? 'Jesus Prayer Card' : 'بطاقة صلاة يسوع والصلوات السهمية',
            files: [file]
          });
          return;
        }
      }
    } catch {
      // Fallback below
    }

    // Direct download fallback
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'jesus-prayer-card.png';
    link.click();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md font-cairo overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm rounded-[24px] bg-[#0B1120] border border-slate-800 text-slate-100 shadow-2xl flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isEn ? 'ltr' : 'rtl'}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/70 shrink-0">
          <span className="text-sm font-bold text-[#F59E0B]">
            {isEn ? 'Share Prayer Card' : 'بطاقة مشاركة الصلاة'}
          </span>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5 pointer-events-none" />
          </button>
        </div>

        <div className="p-4 flex flex-col items-center justify-center">
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-950">
            <img src={imageUrl} alt="Prayer Card" className="w-full h-auto object-contain" />
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center gap-2 shrink-0">
          <a
            href={imageUrl}
            download="jesus-prayer-card.png"
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 text-center cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isEn ? 'Download Card' : 'تحميل الصورة'}</span>
          </a>

          <button
            type="button"
            onClick={handleShare}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>{isEn ? 'Share' : 'مشاركة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
