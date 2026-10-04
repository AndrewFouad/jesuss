import React from 'react';
import { X, Download, Share2, Check } from 'lucide-react';
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
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !imageUrl) return null;

  const isEn = language === 'en';

  const handleShare = async () => {
    try {
      if (navigator.share) {
        // Convert data URL to Blob for sharing
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
      // fallback
    }

    // Fallback: download
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'jesus-prayer.png';
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in font-cairo">
      <div 
        className="w-full max-w-sm rounded-[24px] bg-[#0B1120] border border-slate-800 text-slate-100 shadow-2xl flex flex-col overflow-hidden"
        dir={isEn ? 'ltr' : 'rtl'}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
          <span className="text-sm font-bold text-amber-400">
            {isEn ? 'Share Prayer Card' : 'بطاقة مشاركة الصلاة'}
          </span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex flex-col items-center justify-center">
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80">
            <img src={imageUrl} alt="Prayer Card" className="w-full h-auto object-contain" />
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center gap-2">
          <a
            href={imageUrl}
            download="jesus-prayer-card.png"
            className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 text-center"
          >
            <Download className="w-4 h-4" />
            <span>{isEn ? 'Download Image' : 'تحميل الصورة'}</span>
          </a>

          <button
            onClick={handleShare}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>{isEn ? 'Share' : 'مشاركة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
