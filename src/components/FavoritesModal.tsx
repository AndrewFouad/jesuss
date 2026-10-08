import React from 'react';
import { X, Heart, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-cairo overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-md max-h-[85vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden border my-auto ${
          isDark ? 'bg-[#0B1120] border-slate-800 text-slate-100' : 'bg-white border-amber-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
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
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            title={isEn ? 'Close' : 'إغلاق'}
          >
            <X className="w-5 h-5 pointer-events-none" />
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
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                {isEn 
                  ? 'Tap the heart icon on any prayer to save it here for quick prayer time.' 
                  : 'اضغط على رمز القلب في أي صلاة لحفظها هنا والرجوع إليها في أي وقت.'}
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

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPrayer(item);
                        onClose();
                      }}
                      className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold cursor-pointer transition-colors active:scale-95"
                    >
                      {isEn ? 'Pray Now' : 'الصلاة بها'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveFavorite(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-slate-800"
                      title={isEn ? 'Remove' : 'إزالة'}
                    >
                      <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            {isEn ? 'Close' : 'إغلاق'}
          </button>
        </div>
      </div>
    </div>
  );
};
