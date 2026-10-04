import React from 'react';
import { X, Heart, Trash2, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { PrayerItem, LanguageOption } from '../types/christianPrayer';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: PrayerItem[];
  onSelectPrayer: (prayer: PrayerItem) => void;
  onRemoveFavorite: (prayerId: string) => void;
  language: LanguageOption;
  isDark?: boolean;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectPrayer,
  onRemoveFavorite,
  language,
  isDark = true
}) => {
  if (!isOpen) return null;

  const isEn = language === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in font-cairo">
      <div 
        className={`w-full max-w-md max-h-[85vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden border ${
          isDark ? 'bg-[#0B1120] border-slate-800 text-slate-100' : 'bg-white border-amber-200 text-slate-900'
        }`}
        dir={isEn ? 'ltr' : 'rtl'}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <h2 className="text-base font-bold text-white">
              {isEn ? `Saved Prayers (${favorites.length})` : `المحفوظات (${favorites.length})`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <span className="text-4xl block">🤍</span>
              <p className="text-sm font-semibold">
                {isEn ? 'No saved prayers yet' : 'لا توجد صلوات محفوظة بعد'}
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {isEn ? 'Tap the heart icon on any prayer to save it here for quick prayer time.' : 'اضغط على رمز القلب في أي صلاة لحفظها هنا لسهولة الرجوع إليها في صلواتك.'}
              </p>
            </div>
          ) : (
            favorites.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col gap-2 group"
              >
                <p 
                  onClick={() => {
                    onSelectPrayer(item);
                    onClose();
                  }}
                  className="font-amiri text-lg text-amber-300 hover:text-amber-200 cursor-pointer transition-colors leading-relaxed"
                >
                  "{isEn ? item.textEn : item.textAr}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <span className="text-[11px] text-slate-400">
                    {item.referenceAr || 'صلاة سهمية'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onSelectPrayer(item);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[11px] font-semibold"
                    >
                      {isEn ? 'Pray Now' : 'الصلاة بها الآن'}
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(item.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title={isEn ? 'Remove' : 'إزالة'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
          >
            {isEn ? 'Close' : 'إغلاق'}
          </button>
        </div>
      </div>
    </div>
  );
};
