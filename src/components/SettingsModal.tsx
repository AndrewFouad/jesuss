import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Clock, 
  Bell, 
  Moon, 
  Sun, 
  Vibrate, 
  Globe, 
  BookOpen, 
  Sparkles, 
  Check, 
  Plus,
  Compass
} from 'lucide-react';
import { 
  AppSettings, 
  FontSizeOption, 
  FontFamilyOption, 
  LanguageOption, 
  PrayerItem 
} from '../types/christianPrayer';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  personalPrayers: PrayerItem[];
  onAddPersonalPrayer: (text: string) => void;
  onDeletePersonalPrayer: (id: string) => void;
  onStartQuietTimer: (minutes: number) => void;
  onStopQuietTimer: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  personalPrayers,
  onAddPersonalPrayer,
  onDeletePersonalPrayer,
  onStartQuietTimer,
  onStopQuietTimer
}) => {
  const [newPrayerText, setNewPrayerText] = useState('');
  const [customMinutes, setCustomMinutes] = useState('30');
  const [showCustomTimerInput, setShowCustomTimerInput] = useState(false);

  if (!isOpen) return null;

  const isEn = settings.language === 'en';

  const handleSavePrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrayerText.trim()) {
      onAddPersonalPrayer(newPrayerText.trim());
      setNewPrayerText('');
    }
  };

  const handleCustomTimerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customMinutes, 10);
    if (mins > 0) {
      onStartQuietTimer(mins);
      setShowCustomTimerInput(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className={`w-full max-w-lg max-h-[90vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden border font-cairo ${
          settings.darkMode 
            ? 'bg-[#0B1120] border-slate-800 text-slate-100' 
            : 'bg-white border-amber-200 text-slate-900'
        }`}
        dir={isEn ? 'ltr' : 'rtl'}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 shrink-0">
          <h2 className="text-lg font-bold text-[#F59E0B] tracking-wide">
            {isEn ? 'App Settings' : 'إعدادات التطبيق'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body in Exact Sequence */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* 1. Counter Disable / Focus Mode Toggle */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-200">
              {isEn ? 'Disable Counter / Focus Mode' : 'إلغاء العداد / نظام التركيز'}
            </span>

            <button
              onClick={() => onUpdateSettings({ focusMode: !settings.focusMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                settings.focusMode ? 'bg-[#F59E0B]' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.focusMode 
                    ? (isEn ? 'translate-x-6' : '-translate-x-6') 
                    : (isEn ? 'translate-x-1' : '-translate-x-1')
                }`}
              />
            </button>
          </div>

          {/* 2. Add Personal Prayers */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#F59E0B]">
              <span>{isEn ? `Add Personal Prayers (${personalPrayers.length})` : `إضافة طلبات شخصية (${personalPrayers.length})`}</span>
            </div>

            <form onSubmit={handleSavePrayer} className="flex gap-2">
              <input
                type="text"
                value={newPrayerText}
                onChange={(e) => setNewPrayerText(e.target.value)}
                placeholder={isEn ? 'Write your personal prayer here...' : 'اكتب صلاتك هنا...'}
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-[#F59E0B] placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all active:scale-95 shrink-0"
              >
                {isEn ? 'Save' : 'حفظ'}
              </button>
            </form>

            {/* List of personal prayers with delete button */}
            {personalPrayers.length > 0 && (
              <div className="max-h-36 overflow-y-auto space-y-1.5 pt-1 pr-1">
                {personalPrayers.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300"
                  >
                    <span className="truncate flex-1 pl-2">{isEn ? p.textEn : p.textAr}</span>
                    <button
                      onClick={() => onDeletePersonalPrayer(p.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      title={isEn ? 'Delete' : 'حذف'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Font Size */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              {isEn ? 'Font Size:' : 'حجم الخط:'}
            </span>

            <div className="grid grid-cols-3 gap-2">
              {(['small', 'medium', 'large'] as FontSizeOption[]).map((size) => {
                const isSelected = settings.fontSize === size;
                const label = {
                  small: isEn ? 'Small' : 'صغير',
                  medium: isEn ? 'Medium' : 'متوسط',
                  large: isEn ? 'Large' : 'كبير'
                }[size];

                return (
                  <button
                    key={size}
                    onClick={() => onUpdateSettings({ fontSize: size })}
                    className={`py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#F59E0B] text-slate-950 shadow-md font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Font Family */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              {isEn ? 'Font Family:' : 'نوع الخط:'}
            </span>

            <div className="grid grid-cols-3 gap-2">
              {(['amiri', 'cairo', 'scheherazade'] as FontFamilyOption[]).map((fam) => {
                const isSelected = settings.fontFamily === fam;
                const label = {
                  amiri: isEn ? 'Amiri' : 'أميري',
                  cairo: isEn ? 'Cairo' : 'كايرو',
                  scheherazade: isEn ? 'Scheherazade' : 'شهرزاد'
                }[fam];

                return (
                  <button
                    key={fam}
                    onClick={() => onUpdateSettings({ fontFamily: fam })}
                    className={`py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#F59E0B] text-slate-950 shadow-md font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Quiet Time & Prayer Timer */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span>{isEn ? 'Quiet Time & Prayer Timer' : 'مؤقت الخلوة والصلوات'}</span>
                <span>⏳</span>
              </span>

              {settings.quietTimeActive && (
                <button
                  onClick={onStopQuietTimer}
                  className="text-[11px] text-rose-400 hover:underline"
                >
                  {isEn ? 'Cancel Timer' : 'إلغاء المؤقت'}
                </button>
              )}
            </div>

            {/* Quick buttons: 5, 10, 15, 20 mins */}
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((mins) => {
                const isCurrentActive = settings.quietTimeActive && settings.quietTimeMinutes === mins;
                return (
                  <button
                    key={mins}
                    onClick={() => onStartQuietTimer(mins)}
                    className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                      isCurrentActive
                        ? 'bg-[#F59E0B] text-slate-950 shadow-md font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {mins} {isEn ? 'm' : 'د'}
                  </button>
                );
              })}
            </div>

            {/* Custom Time Option */}
            <div>
              {!showCustomTimerInput ? (
                <button
                  onClick={() => setShowCustomTimerInput(true)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-[#F59E0B] hover:border-amber-500/50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>⏱️</span>
                  <span>{isEn ? 'Set Custom Duration' : 'تحديد وقت خاص'}</span>
                </button>
              ) : (
                <form onSubmit={handleCustomTimerSubmit} className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-center text-white"
                  />
                  <span className="text-xs text-slate-400 flex items-center">{isEn ? 'minutes' : 'دقيقة'}</span>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#F59E0B] text-slate-950 font-bold rounded-xl text-xs"
                  >
                    {isEn ? 'Start' : 'بدء'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomTimerInput(false)}
                    className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    {isEn ? 'Cancel' : 'إلغاء'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* 6. Daily Quiet Time Reminder */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <span>⏰</span>
              <span>{isEn ? 'Daily Quiet Time Reminder' : 'التذكير اليومي بالخلوة'}</span>
            </span>

            <div className="flex items-center gap-2">
              <input
                type="time"
                value={settings.dailyReminderTime}
                onChange={(e) => onUpdateSettings({ dailyReminderTime: e.target.value })}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-2 py-1 rounded-lg focus:outline-none"
              />

              <button
                onClick={() => onUpdateSettings({ dailyReminderEnabled: !settings.dailyReminderEnabled })}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  settings.dailyReminderEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {settings.dailyReminderEnabled 
                  ? (isEn ? 'Enabled ✅' : 'مفعل ✅') 
                  : (isEn ? 'Disabled ✕' : 'تعطيل ✕')}
              </button>
            </div>
          </div>

          {/* 7. Appearance & Haptics */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 space-y-3.5">
            <span className="text-xs font-semibold text-slate-400 block">
              {isEn ? 'Appearance & Haptics' : 'المظهر والاهتزاز'}
            </span>

            {/* Dark Mode */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-200 flex items-center gap-1.5">
                <span>🌙</span>
                <span>{isEn ? 'Dark Mode' : 'الوضع الداكن (Dark Mode)'}</span>
              </span>

              <button
                onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                  settings.darkMode ? 'bg-[#F59E0B]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    settings.darkMode 
                      ? (isEn ? 'translate-x-5' : '-translate-x-5') 
                      : (isEn ? 'translate-x-1' : '-translate-x-1')
                  }`}
                />
              </button>
            </div>

            {/* Haptics */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-xs text-slate-200 flex items-center gap-1.5">
                <span>📳</span>
                <span>{isEn ? 'Touch Vibration for Counting & Switching' : 'اهتزاز اللمس عند العد والتغير'}</span>
              </span>

              <button
                onClick={() => onUpdateSettings({ hapticFeedback: !settings.hapticFeedback })}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  settings.hapticFeedback
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {settings.hapticFeedback 
                  ? (isEn ? 'Enabled ✅' : 'مفعل ✅') 
                  : (isEn ? 'Disabled' : 'معطل')}
              </button>
            </div>
          </div>

          {/* 8. Language */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>{isEn ? 'Language / اللغة' : 'اللغة (Language)'}</span>
            </span>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => onUpdateSettings({ language: 'ar' })}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  settings.language === 'ar'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => onUpdateSettings({ language: 'en' })}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  settings.language === 'en'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* 9. Future Features Section (Coming Soon) */}
          <div className="bg-gradient-to-br from-[#0F172A] to-[#131F37] border border-amber-500/20 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F59E0B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'Coming Soon in Future Updates' : 'ميزات قادمة في التحديث القادم (قريباً):'}</span>
            </div>

            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-center gap-2">
                <span className="text-sm">📖</span>
                <span>{isEn ? 'Liturgical Hours (Agpeya) and Seven Prayers' : 'صلوات السواعي والأجبية والمزامير السبعة'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sm">🕊️</span>
                <span>{isEn ? 'Reflections and Sayings of the Desert Fathers' : 'تأملات وأقوال الآباء القديسين وشيوخ البرية'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sm">📜</span>
                <span>{isEn ? 'Daily Psalms Quiet Time & Readings' : 'خلوة المزامير اليومية والقراءات الإنجيلية'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md"
          >
            {isEn ? 'Done' : 'تم وحفظ'}
          </button>
        </div>
      </div>
    </div>
  );
};
