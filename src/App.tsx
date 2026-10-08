import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  Heart, 
  ChevronDown, 
  Clock, 
  Sparkles,
  Timer
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
  quietTimeMinutes: 15,
  quietTimeActive: false,
  quietTimeRemainingSeconds: 0,
  dailyReminderEnabled: true,
  dailyReminderTime: '07:00',
  darkMode: true,
  hapticFeedback: true,
  language: 'ar'
};

export default function App() {
  // 1. Prayers State (Initial + saved custom)
  const [prayers, setPrayers] = useState<PrayerItem[]>(() => {
    try {
      const saved = localStorage.getItem('jesus_prayer_custom_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return [...INITIAL_PRAYERS, ...parsed];
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_PRAYERS;
  });

  // 2. Selected Category
  const [selectedCategory, setSelectedCategory] = useState<PrayerCategory>('arrow');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // 3. Current Prayer Index within the active category
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(0);

  // 4. Rosary Counter
  const [count, setCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('jesus_prayer_count');
      if (saved) {
        const num = parseInt(saved, 10);
        return isNaN(num) ? 0 : num;
      }
    } catch {
      // Fallback
    }
    return 0;
  });

  // 5. Favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jesus_prayer_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // 6. Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('jesus_prayer_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);

  // Refs
  const timerRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastAlarmTriggerRef = useRef<string | null>(null);

  const isEn = settings.language === 'en';

  // Personal prayers list
  const personalPrayers = prayers.filter((p) => p.category === 'personal');

  // Filter prayers based on selected category
  const categoryPrayers = prayers.filter((p) => {
    if (selectedCategory === 'personal') return p.category === 'personal';
    return p.category === selectedCategory;
  });

  // Fallback if category has no prayers
  const activePrayers = categoryPrayers.length > 0 ? categoryPrayers : prayers.filter((p) => p.category === 'arrow');
  const safeIndex = (currentPrayerIndex % activePrayers.length + activePrayers.length) % activePrayers.length;
  const currentPrayer = activePrayers[safeIndex] || INITIAL_PRAYERS[0];

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('jesus_prayer_count', count.toString());
    } catch {}
  }, [count]);

  useEffect(() => {
    try {
      localStorage.setItem('jesus_prayer_favorites', JSON.stringify(favoriteIds));
    } catch {}
  }, [favoriteIds]);

  useEffect(() => {
    try {
      localStorage.setItem('jesus_prayer_settings', JSON.stringify(settings));
    } catch {}
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

  // Monitor daily quiet time alarm and ring with mobile alarm ringtone
  useEffect(() => {
    if (!settings.dailyReminderEnabled || !settings.dailyReminderTime) {
      return;
    }

    const checkAlarmTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hh}:${mm}`;

      if (currentTimeStr === settings.dailyReminderTime) {
        const triggerKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${currentTimeStr}`;
        if (lastAlarmTriggerRef.current !== triggerKey) {
          lastAlarmTriggerRef.current = triggerKey;

          // Start the phone alarm ringtone!
          spiritualHaptics.startPhoneAlarm();
          setIsAlarmModalOpen(true);

          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification(isEn ? 'Jesus Prayer - Quiet Time' : 'صلاة يسوع - موعد الخلوة الروحية', {
                body: isEn 
                  ? 'It is time for your daily quiet time and prayer with the Lord Jesus.' 
                  : 'حان الآن موعد خلوتك الروحية وصلاتك مع الرب يسوع المسيح.',
                icon: '/icon-192.png'
              });
            } catch {}
          }
        }
      }
    };

    checkAlarmTime();
    const interval = window.setInterval(checkAlarmTime, 2000);
    return () => window.clearInterval(interval);
  }, [settings.dailyReminderEnabled, settings.dailyReminderTime, isEn]);

  // Close dropdown on click outside - use 'click' listener to avoid interfering with mobile touch
  useEffect(() => {
    if (!isCategoryDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isCategoryDropdownOpen]);

  // Actions
  const handleIncrement = () => {
    setCount((prev) => prev + 1);
    spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
  };

  const handleResetCount = () => {
    setCount(0);
    spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
  };

  const handleChangePrayerRandom = () => {
    // Reset the counter automatically when changing the prayer
    setCount(0);

    if (activePrayers.length > 1) {
      setCurrentPrayerIndex((prev) => {
        let next = Math.floor(Math.random() * activePrayers.length);
        if (next === prev) {
          next = (prev + 1) % activePrayers.length;
        }
        return next;
      });
    } else {
      setCurrentPrayerIndex(0);
    }
    // Make the sound of the prayer change button the same as the counter button
    spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
  };

  const handleNextPrayerSequential = () => {
    // Reset the counter automatically when changing the prayer
    setCount(0);

    setCurrentPrayerIndex((prev) => (prev + 1) % activePrayers.length);
    // Make the sound the same as the counter button
    spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
  };

  const handleToggleFavorite = () => {
    if (!currentPrayer) return;
    setFavoriteIds((prev) => {
      if (prev.includes(currentPrayer.id)) {
        return prev.filter((id) => id !== currentPrayer.id);
      } else {
        return [...prev, currentPrayer.id];
      }
    });
    spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
  };

  const handleSelectCategory = (cat: PrayerCategory) => {
    // Reset the counter automatically when changing category
    setCount(0);
    setSelectedCategory(cat);
    setCurrentPrayerIndex(0);
    setIsCategoryDropdownOpen(false);
    spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
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
    try {
      localStorage.setItem('jesus_prayer_custom_list', JSON.stringify(customItems));
    } catch {}

    // Automatically select personal category to show user's newly added prayer
    setSelectedCategory('personal');
    setCurrentPrayerIndex(customItems.length - 1);
  };

  const handleDeletePersonalPrayer = (id: string) => {
    const updated = prayers.filter((p) => p.id !== id);
    setPrayers(updated);
    const customItems = updated.filter((p) => p.isCustom);
    try {
      localStorage.setItem('jesus_prayer_custom_list', JSON.stringify(customItems));
    } catch {}

    // If no personal prayers left and personal was selected, revert to arrow prayers
    if (customItems.length === 0 && selectedCategory === 'personal') {
      setSelectedCategory('arrow');
      setCurrentPrayerIndex(0);
    } else {
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
    if (!currentPrayer) return;
    const prayerText = isEn ? currentPrayer.textEn : currentPrayer.textAr;
    const catLabel = CATEGORY_LABELS[settings.language][currentPrayer.category] || CATEGORY_LABELS[settings.language].arrow;
    const ref = isEn ? currentPrayer.referenceEn : currentPrayer.referenceAr;

    try {
      const dataUrl = await generatePrayerCardImage({
        text: prayerText,
        categoryLabel: catLabel,
        reference: ref,
        fontFamily: settings.fontFamily,
        prayer: currentPrayer,
        language: settings.language
      });
      setShareImageUrl(dataUrl);
    } catch (e) {
      console.error('Failed to generate prayer card image', e);
    }
  };

  const favoritePrayers = prayers.filter((p) => favoriteIds.includes(p.id));
  const isCurrentFavorite = currentPrayer ? favoriteIds.includes(currentPrayer.id) : false;
  const currentCategoryLabel = CATEGORY_LABELS[settings.language][selectedCategory] || CATEGORY_LABELS[settings.language].arrow;

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-between transition-colors duration-300 font-cairo ${
        settings.darkMode 
          ? 'bg-[#080D1A] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200' 
          : 'bg-[#F8FAFC] text-slate-900 selection:bg-amber-500/30 selection:text-amber-900'
      }`}
      dir={isEn ? 'ltr' : 'rtl'}
    >
      <OfflineIndicator language={settings.language} />

      {/* Main Container - Mobile-First centered viewport */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col justify-between p-4 sm:p-5 relative select-none">
        
        {/* Soft Background Radial Light */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* 1. TOP BAR (Favorites ❤️ on left/right, Timer ⏳ in middle, Settings ⚙️ on opposite side, No app title in center) */}
        <header className="w-full flex items-center justify-between pt-2 pb-3 z-20">
          
          {/* Favorites Button: ❤️ المحفوظات (X) */}
          <button
            type="button"
            onClick={() => setIsFavoritesOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all duration-200 shadow-md active:scale-95 cursor-pointer ${
              settings.darkMode 
                ? 'bg-[#0E172A] border-slate-800 text-slate-200 hover:border-rose-500/50' 
                : 'bg-white border-amber-200 text-slate-800 hover:border-rose-400'
            }`}
            title={isEn ? 'Saved Prayers' : 'الصلوات المحفوظة'}
          >
            <Heart className={`w-4 h-4 text-rose-500 ${favoriteIds.length > 0 ? 'fill-current' : ''}`} />
            <span className="text-xs font-bold tracking-wide">
              {isEn ? `Saved (${favoriteIds.length})` : `المحفوظات (${favoriteIds.length})`}
            </span>
          </button>

          {/* Center: Quiet Time Active Indicator if running */}
          {settings.quietTimeActive ? (
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold animate-pulse cursor-pointer hover:bg-amber-500/30 transition-all"
              title={isEn ? 'Quiet Time Active' : 'مؤقت الخلوة مفعل'}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>
                {Math.floor(settings.quietTimeRemainingSeconds / 60)}:
                {String(settings.quietTimeRemainingSeconds % 60).padStart(2, '0')}
              </span>
            </button>
          ) : (
            <div className="w-6" /> /* Spacing stabilizer */
          )}

          {/* Settings Button: ⚙️ */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className={`p-2.5 rounded-2xl border transition-all duration-200 shadow-md active:scale-95 cursor-pointer ${
              settings.darkMode 
                ? 'bg-[#0E172A] border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/50' 
                : 'bg-white border-amber-200 text-slate-700 hover:text-slate-900 hover:border-amber-400'
            }`}
            title={isEn ? 'Settings' : 'إعدادات التطبيق'}
          >
            <SettingsIcon className="w-5 h-5 pointer-events-none" />
          </button>
        </header>

        {/* Quiet Time Banner (when active) */}
        {settings.quietTimeActive && (
          <div className="mb-2 z-10">
            <QuietTimerBar
              remainingSeconds={settings.quietTimeRemainingSeconds}
              totalSeconds={settings.quietTimeMinutes * 60}
              onStop={handleStopQuietTimer}
              language={settings.language}
            />
          </div>
        )}

        {/* 2. MAIN PRAYER SECTION */}
        <div className="flex-1 flex flex-col justify-center space-y-3 sm:space-y-4 my-auto z-10">
          
          {/* Category Dropdown Button (📖 الطلبات: [الفئة]) */}
          <div className="relative w-full" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-between shadow-lg transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                settings.darkMode 
                  ? 'bg-[#0E172A] border-slate-800 text-slate-200 hover:border-slate-700' 
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
                {/* 1. Arrow Prayers (صلاة يسوع) */}
                <button
                  type="button"
                  onClick={() => handleSelectCategory('arrow')}
                  className={`w-full p-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
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
                  type="button"
                  onClick={() => handleSelectCategory('repentance')}
                  className={`w-full p-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
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
                  type="button"
                  onClick={() => handleSelectCategory('blessing')}
                  className={`w-full p-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
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

                {/* 4. Personal Prayers (Visible ONLY when user has added custom prayers!) */}
                {personalPrayers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('personal')}
                    className={`w-full p-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
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
                )}
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
        <div className="w-full pb-1 z-10">
          <RosaryCounter
            count={count}
            onIncrement={handleIncrement}
            onReset={handleResetCount}
            onChangePrayer={handleChangePrayerRandom}
            onNextPrayer={handleNextPrayerSequential}
            focusMode={settings.focusMode}
            language={settings.language}
          />
        </div>

      </div>

      {/* MODALS */}
      {/* 1. Settings Modal */}
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
          setCount(0); // Reset counter automatically when changing prayer
          setSelectedCategory(p.category);
          const index = prayers.findIndex((item) => item.id === p.id);
          if (index !== -1) setCurrentPrayerIndex(index);
          spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
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

      {/* 4. Daily Quiet Time Phone Alarm Ringing Modal */}
      {isAlarmModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in font-cairo"
          dir={isEn ? 'ltr' : 'rtl'}
        >
          <div className="w-full max-w-sm rounded-[28px] bg-[#0E172A] border-2 border-amber-500/80 p-6 shadow-[0_0_60px_rgba(245,158,11,0.5)] text-center space-y-5 animate-in zoom-in-95">
            {/* Pulsing Alarm Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl animate-bounce">
              ⏰
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-[#F59E0B]">
                {isEn ? 'Quiet Time Alarm Ringing' : 'منبه الخلوة الروحية يرن'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed px-2">
                {isEn 
                  ? 'It is time for your spiritual quiet time and communion with the Lord Jesus.' 
                  : 'حان الآن موعد خلوتك الروحية مع الرب يسوع المسيح.'}
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  spiritualHaptics.stopPhoneAlarm();
                  setIsAlarmModalOpen(false);
                  const minutesToStart = (settings.quietTimeMinutes && settings.quietTimeMinutes > 0)
                    ? settings.quietTimeMinutes
                    : 15;
                  handleStartQuietTimer(minutesToStart);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isEn ? 'Start Quiet Time Now ⏳' : 'بدء الخلوة الآن ⏳'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  spiritualHaptics.stopPhoneAlarm();
                  setIsAlarmModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                {isEn ? 'Stop Alarm 🔕' : 'إيقاف المنبه 🔕'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
