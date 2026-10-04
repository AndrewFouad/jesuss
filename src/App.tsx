import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  Heart, 
  ChevronDown, 
  BookOpen, 
  Clock, 
  Sparkles,
  Download,
  Share2
} from 'lucide-react';
import { 
  PrayerItem, 
  PrayerCategory, 
  AppSettings, 
  LanguageOption 
} from './types/christianPrayer';
import { INITIAL_PRAYERS, CATEGORY_LABELS } from './data/prayersData';
import { PrayerCardDisplay } from './components/PrayerCardDisplay';
import { RosaryCounter } from './components/RosaryCounter';
import { SettingsModal } from './components/SettingsModal';
import { FavoritesModal } from './components/FavoritesModal';
import { ShareImageModal } from './components/ShareImageModal';
import { QuietTimerBar } from './components/QuietTimerBar';
import { spiritualHaptics } from './utils/haptics';
import { generatePrayerCardImage } from './utils/shareImage';
import { OfflineIndicator } from './components/OfflineIndicator';

const DEFAULT_SETTINGS: AppSettings = {
  focusMode: false,
  fontSize: 'medium',
  fontFamily: 'amiri',
  quietTimeMinutes: 0,
  quietTimeActive: false,
  quietTimeRemainingSeconds: 0,
  dailyReminderEnabled: true,
  dailyReminderTime: '07:00',
  darkMode: true,
  hapticFeedback: true,
  language: 'ar'
};

export default function App() {
  // Prayers State
  const [prayers, setPrayers] = useState<PrayerItem[]>(() => {
    const saved = localStorage.getItem('jesus_prayer_custom_list');
    if (saved) {
      try {
        const customItems: PrayerItem[] = JSON.parse(saved);
        return [...INITIAL_PRAYERS, ...customItems];
      } catch {
        return INITIAL_PRAYERS;
      }
    }
    return INITIAL_PRAYERS;
  });

  // Selected Category
  const [selectedCategory, setSelectedCategory] = useState<PrayerCategory>('arrow');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Current Prayer Index within the active category
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(0);

  // Counter
  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem('jesus_prayer_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('jesus_prayer_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('jesus_prayer_settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);

  // Timer Ref
  const timerRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isEn = settings.language === 'en';

  // Filter prayers based on selected category
  const categoryPrayers = prayers.filter((p) => {
    if (selectedCategory === 'personal') return p.category === 'personal';
    return p.category === selectedCategory;
  });

  // Fallback if category has no prayers
  const activePrayers = categoryPrayers.length > 0 ? categoryPrayers : prayers;
  const currentPrayer = activePrayers[currentPrayerIndex % activePrayers.length] || activePrayers[0];

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('jesus_prayer_count', count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem('jesus_prayer_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    localStorage.setItem('jesus_prayer_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle Quiet Time countdown
  useEffect(() => {
    if (settings.quietTimeActive && settings.quietTimeRemainingSeconds > 0) {
      timerRef.current = window.setInterval(() => {
        setSettings((prev) => {
          if (prev.quietTimeRemainingSeconds <= 1) {
            spiritualHaptics.triggerTimerCompleteChime();
            return {
              ...prev,
              quietTimeActive: false,
              quietTimeRemainingSeconds: 0
            };
          }
          return {
            ...prev,
            quietTimeRemainingSeconds: prev.quietTimeRemainingSeconds - 1
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [settings.quietTimeActive]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Actions
  const handleIncrement = () => {
    spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
    setCount((prev) => prev + 1);
  };

  const handleResetCount = () => {
    spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
    setCount(0);
  };

  const handleNextPrayer = () => {
    spiritualHaptics.triggerPrayerSwitchFeedback(settings.hapticFeedback);
    setCurrentPrayerIndex((prev) => (prev + 1) % activePrayers.length);
  };

  const handleToggleFavorite = () => {
    spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
    setFavoriteIds((prev) => {
      if (prev.includes(currentPrayer.id)) {
        return prev.filter((id) => id !== currentPrayer.id);
      } else {
        return [...prev, currentPrayer.id];
      }
    });
  };

  const handleSelectCategory = (cat: PrayerCategory) => {
    setSelectedCategory(cat);
    setCurrentPrayerIndex(0);
    setIsCategoryDropdownOpen(false);

    // If personal selected but empty, gently prompt to add one
    if (cat === 'personal') {
      const personalCount = prayers.filter((p) => p.category === 'personal').length;
      if (personalCount === 0) {
        setIsSettingsOpen(true);
      }
    }
  };

  const handleAddPersonalPrayer = (text: string) => {
    const newPrayer: PrayerItem = {
      id: `personal-${Date.now()}`,
      category: 'personal',
      textAr: text,
      textEn: text,
      referenceAr: 'طلبة شخصية',
      referenceEn: 'Personal Prayer',
      isCustom: true
    };

    const updated = [...prayers, newPrayer];
    setPrayers(updated);

    const customItems = updated.filter((p) => p.isCustom);
    localStorage.setItem('jesus_prayer_custom_list', JSON.stringify(customItems));

    // Automatically select personal category to show user's new prayer
    setSelectedCategory('personal');
    setCurrentPrayerIndex(customItems.length - 1);
  };

  const handleDeletePersonalPrayer = (id: string) => {
    const updated = prayers.filter((p) => p.id !== id);
    setPrayers(updated);
    const customItems = updated.filter((p) => p.isCustom);
    localStorage.setItem('jesus_prayer_custom_list', JSON.stringify(customItems));

    // If active was deleted
    if (currentPrayer.id === id) {
      setCurrentPrayerIndex(0);
    }
  };

  const handleStartQuietTimer = (minutes: number) => {
    setSettings((prev) => ({
      ...prev,
      quietTimeMinutes: minutes,
      quietTimeActive: true,
      quietTimeRemainingSeconds: minutes * 60
    }));
  };

  const handleStopQuietTimer = () => {
    setSettings((prev) => ({
      ...prev,
      quietTimeActive: false,
      quietTimeRemainingSeconds: 0
    }));
  };

  const handleShareCardImage = async () => {
    const prayerText = isEn ? currentPrayer.textEn : currentPrayer.textAr;
    const catLabel = CATEGORY_LABELS[settings.language][currentPrayer.category];
    const ref = isEn ? currentPrayer.referenceEn : currentPrayer.referenceAr;

    try {
      const dataUrl = await generatePrayerCardImage(
        prayerText,
        catLabel,
        ref,
        settings.fontFamily
      );
      setShareImageUrl(dataUrl);
    } catch (e) {
      console.error(e);
    }
  };

  const personalPrayers = prayers.filter((p) => p.category === 'personal');
  const favoritePrayers = prayers.filter((p) => favoriteIds.includes(p.id));
  const isCurrentFavorite = favoriteIds.includes(currentPrayer.id);

  // Active Category Label
  const currentCategoryLabel = CATEGORY_LABELS[settings.language][selectedCategory];

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-between transition-colors duration-300 font-cairo ${
        settings.darkMode 
          ? 'bg-[#080D1A] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200' 
          : 'bg-[#F8FAFC] text-slate-900 selection:bg-amber-500/30 selection:text-amber-900'
      }`}
      dir={isEn ? 'ltr' : 'rtl'}
    >
      <OfflineIndicator />

      {/* Main Container - Mobile-First centered viewport */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col justify-between p-4 sm:p-5 relative select-none">
        
        {/* Soft Background Radial Light */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* 1. TOP BAR (Favorites ❤️ on left, Settings ⚙️ on right, No app title in center) */}
        <header className="w-full flex items-center justify-between pt-2 pb-4 z-20">
          
          {/* Favorites Button: ❤️ المحفوظات (X) */}
          <button
            onClick={() => setIsFavoritesOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all duration-200 shadow-md active:scale-95 ${
              settings.darkMode 
                ? 'bg-[#0E172A] border-slate-800 text-slate-200 hover:border-rose-500/50' 
                : 'bg-white border-amber-200 text-slate-800 hover:border-rose-400'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-current" />
            <span className="text-xs font-bold tracking-wide">
              {isEn ? `Saved (${favoriteIds.length})` : `المحفوظات (${favoriteIds.length})`}
            </span>
          </button>

          {/* Center: Quiet Time Active Indicator if running */}
          {settings.quietTimeActive ? (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold animate-pulse"
              title={isEn ? 'Quiet Time Active' : 'مؤقت الخلوة مفعل'}
            >
              <span>⏳</span>
              <span>
                {Math.floor(settings.quietTimeRemainingSeconds / 60)}:
                {String(settings.quietTimeRemainingSeconds % 60).padStart(2, '0')}
              </span>
            </button>
          ) : (
            <div className="w-6" /> /* Spacing stabilizer */
          )}

          {/* Settings Button: ⚙️ with dark rounded square background */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`p-2.5 rounded-2xl border transition-all duration-200 shadow-md active:scale-95 ${
              settings.darkMode 
                ? 'bg-[#0E172A] border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/50' 
                : 'bg-white border-amber-200 text-slate-700 hover:text-slate-900 hover:border-amber-400'
            }`}
            title={isEn ? 'Settings' : 'إعدادات التطبيق'}
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </header>

        {/* Quiet Time Banner (when active) */}
        {settings.quietTimeActive && (
          <div className="mb-3 z-10">
            <QuietTimerBar
              remainingSeconds={settings.quietTimeRemainingSeconds}
              totalSeconds={settings.quietTimeMinutes * 60}
              onStop={handleStopQuietTimer}
              language={settings.language}
            />
          </div>
        )}

        {/* 2. MAIN PRAYER SECTION */}
        <div className="flex-1 flex flex-col justify-center space-y-4 my-auto z-10">
          
          {/* Category Dropdown Button (📖 الطلبات: [الفئة]) */}
          <div className="relative w-full" ref={dropdownRef}>
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-between shadow-lg transition-all duration-200 active:scale-[0.99] ${
                settings.darkMode 
                  ? 'bg-[#0E172A] border-slate-800/90 text-slate-200 hover:border-slate-700' 
                  : 'bg-white border-amber-200 text-slate-800 hover:border-amber-300'
              }`}
            >
              {/* Category Title with Icon */}
              <div className="flex items-center gap-2.5">
                <span className="text-base text-amber-400">📖</span>
                <span className="text-sm font-bold text-[#F59E0B] tracking-wide">
                  {isEn ? `Requests: ${currentCategoryLabel}` : `الطلبات: ${currentCategoryLabel}`}
                </span>
              </div>

              {/* Dropdown Chevron */}
              <ChevronDown 
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isCategoryDropdownOpen ? 'rotate-180 text-amber-400' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu Items */}
            {isCategoryDropdownOpen && (
              <div 
                className={`absolute top-full mt-2 inset-x-0 rounded-2xl border shadow-2xl p-2 z-30 space-y-1 backdrop-blur-xl animate-in fade-in zoom-in-95 ${
                  settings.darkMode 
                    ? 'bg-[#0E172A]/95 border-slate-800 text-slate-200' 
                    : 'bg-white/95 border-amber-200 text-slate-900'
                }`}
              >
                {/* 1. Arrow Prayers */}
                <button
                  onClick={() => handleSelectCategory('arrow')}
                  className={`w-full text-right p-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === 'arrow' 
                      ? 'bg-amber-500/20 text-[#F59E0B] font-bold' 
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                  style={{ textAlign: isEn ? 'left' : 'right' }}
                >
                  <span className="flex items-center gap-2">
                    <span>⚡</span>
                    <span>{isEn ? 'Arrow Prayer (Jesus Prayer)' : 'الصلاة السهمية (صلوات يسوع)'}</span>
                  </span>
                  {selectedCategory === 'arrow' && <span className="text-amber-400 text-xs">✓</span>}
                </button>

                {/* 2. Mercy & Repentance */}
                <button
                  onClick={() => handleSelectCategory('repentance')}
                  className={`w-full text-right p-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === 'repentance' 
                      ? 'bg-amber-500/20 text-[#F59E0B] font-bold' 
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                  style={{ textAlign: isEn ? 'left' : 'right' }}
                >
                  <span className="flex items-center gap-2">
                    <span>🕊️</span>
                    <span>{isEn ? 'Prayers for Mercy & Repentance' : 'صلوات المراحم والتوبة'}</span>
                  </span>
                  {selectedCategory === 'repentance' && <span className="text-amber-400 text-xs">✓</span>}
                </button>

                {/* 3. Blessing & Strength */}
                <button
                  onClick={() => handleSelectCategory('blessing')}
                  className={`w-full text-right p-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === 'blessing' 
                      ? 'bg-amber-500/20 text-[#F59E0B] font-bold' 
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                  style={{ textAlign: isEn ? 'left' : 'right' }}
                >
                  <span className="flex items-center gap-2">
                    <span>🛡️</span>
                    <span>{isEn ? 'Prayers for Blessing & Strength' : 'صلوات البركة والمعونة والقوة'}</span>
                  </span>
                  {selectedCategory === 'blessing' && <span className="text-amber-400 text-xs">✓</span>}
                </button>

                {/* 4. Personal Prayers */}
                <button
                  onClick={() => handleSelectCategory('personal')}
                  className={`w-full text-right p-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === 'personal' 
                      ? 'bg-amber-500/20 text-[#F59E0B] font-bold' 
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                  style={{ textAlign: isEn ? 'left' : 'right' }}
                >
                  <span className="flex items-center gap-2">
                    <span>✍️</span>
                    <span>{isEn ? `Personal Prayers (${personalPrayers.length})` : `طلبات وصلوات شخصية (${personalPrayers.length})`}</span>
                  </span>
                  {selectedCategory === 'personal' && <span className="text-amber-400 text-xs">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Main Prayer Display Card */}
          <PrayerCardDisplay
            prayer={currentPrayer}
            isFavorite={isCurrentFavorite}
            onToggleFavorite={handleToggleFavorite}
            onShareImage={handleShareCardImage}
            fontSize={settings.fontSize}
            fontFamily={settings.fontFamily}
            language={settings.language}
            isDark={settings.darkMode}
          />
        </div>

        {/* 3. CIRCULAR ROSARY COUNTER & BOTTOM CONTROLS */}
        <div className="w-full pb-2 z-10">
          <RosaryCounter
            count={count}
            onIncrement={handleIncrement}
            onReset={handleResetCount}
            onNextPrayer={handleNextPrayer}
            focusMode={settings.focusMode}
            language={settings.language}
          />
        </div>

      </div>

      {/* MODALS */}
      {/* 1. Settings Modal (Matching Screenshots 2026-10-04 184807.png & 184840.png in exact order!) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
        personalPrayers={personalPrayers}
        onAddPersonalPrayer={handleAddPersonalPrayer}
        onDeletePersonalPrayer={handleDeletePersonalPrayer}
        onStartQuietTimer={handleStartQuietTimer}
        onStopQuietTimer={handleStopQuietTimer}
      />

      {/* 2. Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoritePrayers}
        onSelectPrayer={(p) => {
          setSelectedCategory(p.category);
          const index = prayers.findIndex((item) => item.id === p.id);
          if (index !== -1) setCurrentPrayerIndex(index);
        }}
        onRemoveFavorite={(id) => setFavoriteIds((prev) => prev.filter((fId) => fId !== id))}
        language={settings.language}
        isDark={settings.darkMode}
      />

      {/* 3. Share Image Card Modal */}
      <ShareImageModal
        isOpen={!!shareImageUrl}
        onClose={() => setShareImageUrl(null)}
        imageUrl={shareImageUrl}
        language={settings.language}
      />

    </div>
  );
}
