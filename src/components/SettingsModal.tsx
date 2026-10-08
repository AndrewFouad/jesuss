import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Globe, 
  Timer
} from 'lucide-react';
import { 
  AppSettings, 
  PrayerItem 
} from '../types/christianPrayer';
import { spiritualHaptics } from '../utils/haptics';

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
  const [customMinutes, setCustomMinutes] = useState('15');
  const [showCustomTimerInput, setShowCustomTimerInput] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isTestingAlarm, setIsTestingAlarm] = useState(false);

  if (!isOpen) return null;

  const isEn = settings.language === 'en';

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 2500);
  };

  const handleSavePrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrayerText.trim()) {
      onAddPersonalPrayer(newPrayerText.trim());
      setNewPrayerText('');
      showToast(isEn ? 'Prayer saved successfully!' : 'تم حفظ الصلاة الشخصية بنجاح!');
      spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
    }
  };

  const handleCustomTimerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      onUpdateSettings({ quietTimeMinutes: mins });
      onStartQuietTimer(mins);
      setShowCustomTimerInput(false);
      showToast(isEn ? `Quiet time set & started: ${mins} minutes` : `تم ضبط وبدء الخلوة: ${mins} دقيقة`);
      spiritualHaptics.triggerPrayerSwitchFeedback(settings.hapticFeedback);
    }
  };

  const handleSaveCustomDuration = () => {
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      onUpdateSettings({ quietTimeMinutes: mins });
      setShowCustomTimerInput(false);
      showToast(isEn ? `Quiet time duration set to ${mins} minutes` : `تم حفظ مدة الخلوة: ${mins} دقيقة`);
      spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
    }
  };

  const handleQuickTimer = (mins: number) => {
    onUpdateSettings({ quietTimeMinutes: mins });
    onStartQuietTimer(mins);
    showToast(isEn ? `Quiet time set & started: ${mins} minutes` : `تم ضبط وبدء الخلوة: ${mins} دقائق`);
    spiritualHaptics.triggerPrayerSwitchFeedback(settings.hapticFeedback);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-cairo overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-lg max-h-[92vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden border my-auto transition-colors ${
          settings.darkMode 
            ? 'bg-[#0B1120] border-slate-800 text-slate-100' 
            : 'bg-white border-amber-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
        dir={isEn ? 'ltr' : 'rtl'}
      >
        {/* Header: X button on left (in RTL), title on right */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/70 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            title={isEn ? 'Close' : 'إغلاق'}
          >
            <X className="w-5 h-5 pointer-events-none" />
          </button>

          <h2 className="text-lg font-bold text-[#F59E0B] tracking-wide">
            {isEn ? 'App Settings' : 'إعدادات التطبيق'}
          </h2>
        </div>

        {/* Temporary Toast banner */}
        {notificationMsg && (
          <div className="bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30 text-xs py-2 px-4 text-center font-semibold animate-in fade-in">
            {notificationMsg}
          </div>
        )}

        {/* Scrollable Body in exact specified order */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* 
            1. Counter Disable Toggle:
            Requirement: "خلى اسم زرار الغاء العداد إلغاء واحذف كلة نظام التركيز الى جنبها"
          */}
          <div 
            onClick={() => {
              const next = !settings.focusMode;
              onUpdateSettings({ focusMode: next });
              spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
              showToast(next 
                ? (isEn ? 'Counter hidden' : 'تم إلغاء العداد') 
                : (isEn ? 'Counter visible' : 'تم تفعيل العداد'));
            }}
            className="w-full bg-[#0E172A] border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] select-none text-right"
            dir="ltr"
          >
            {/* Toggle switch on left */}
            <div
              className={`w-12 h-6.5 p-0.5 rounded-full transition-colors flex items-center shadow-inner ${
                settings.focusMode ? 'bg-[#F59E0B] justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md transition-all" />
            </div>

            {/* Label on right */}
            <div className="text-right">
              <span className="text-sm font-semibold text-slate-200 block">
                {isEn ? 'Disable Counter' : 'إلغاء العداد'}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {settings.focusMode 
                  ? (isEn ? 'Counter hidden • Next Prayer button active' : 'العداد مخفي • زر الصلاة التالية مفعل') 
                  : (isEn ? 'Counter and reset button visible' : 'العداد وزر التصفير ظاهران')}
              </span>
            </div>
          </div>

          {/* 2. Add Personal Prayers */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">
                {personalPrayers.length > 0 ? (isEn ? `${personalPrayers.length} prayers` : `${personalPrayers.length} طلبات`) : ''}
              </span>
              <span className="text-[#F59E0B] flex items-center gap-1.5">
                <span>✍️</span>
                <span>{isEn ? 'Add Personal Prayers' : 'إضافة طلبات وصلوات شخصية'}</span>
              </span>
            </div>

            <form onSubmit={handleSavePrayer} className="flex items-center gap-2">
              {/* Save/Add button */}
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all active:scale-95 shrink-0 cursor-pointer shadow-md"
              >
                {isEn ? 'Add' : 'إضافة'}
              </button>

              {/* Text input */}
              <input
                type="text"
                value={newPrayerText}
                onChange={(e) => setNewPrayerText(e.target.value)}
                placeholder={isEn ? 'Write your personal prayer here...' : 'اكتب صلاتك أو طلبتك الخاصة هنا...'}
                className="flex-1 bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-[#F59E0B] placeholder:text-slate-500"
              />
            </form>

            {/* List of added personal prayers (Scrollable fixed height container) */}
            {personalPrayers.length > 0 ? (
              <div className="max-h-36 overflow-y-auto space-y-1.5 pt-1 pr-1">
                {personalPrayers.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200"
                  >
                    <span className="truncate flex-1 pl-2">{isEn ? p.textEn : p.textAr}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onDeletePersonalPrayer(p.id);
                        showToast(isEn ? 'Prayer deleted' : 'تم حذف الصلاة الشخصية');
                        spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-slate-900"
                      title={isEn ? 'Delete' : 'حذف'}
                    >
                      <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 text-center py-1">
                {isEn 
                  ? 'No personal prayers added yet. Once added, they will appear in the prayer dropdown.' 
                  : 'لم تقم بإضافة صلوات شخصية بعد. عند إضافتها ستظهر في قائمة الصلوات الرئيسية.'}
              </p>
            )}
          </div>

          {/* 3. Font Size: [كبير] [متوسط] [صغير] */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block text-right">
              {isEn ? 'Font Size:' : 'حجم الخط:'}
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  onUpdateSettings({ fontSize: 'large' });
                  spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
                }}
                className={`py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  settings.fontSize === 'large'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {isEn ? 'Large' : 'كبير'}
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateSettings({ fontSize: 'medium' });
                  spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
                }}
                className={`py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  settings.fontSize === 'medium'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {isEn ? 'Medium' : 'متوسط'}
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateSettings({ fontSize: 'small' });
                  spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
                }}
                className={`py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  settings.fontSize === 'small'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {isEn ? 'Small' : 'صغير'}
              </button>
            </div>
          </div>

          {/* 4. Font Family: [شهرزاد] [كايرو] [أميري] */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block text-right">
              {isEn ? 'Font Family:' : 'نوع الخط:'}
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  onUpdateSettings({ fontFamily: 'scheherazade' });
                  spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
                }}
                className={`py-2 rounded-xl text-xs sm:text-sm font-semibold font-scheherazade transition-all cursor-pointer ${
                  settings.fontFamily === 'scheherazade'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {isEn ? 'Scheherazade' : 'شهرزاد'}
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateSettings({ fontFamily: 'cairo' });
                  spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
                }}
                className={`py-2 rounded-xl text-xs sm:text-sm font-semibold font-cairo transition-all cursor-pointer ${
                  settings.fontFamily === 'cairo'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {isEn ? 'Cairo' : 'كايرو'}
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateSettings({ fontFamily: 'amiri' });
                  spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
                }}
                className={`py-2 rounded-xl text-xs sm:text-sm font-semibold font-amiri transition-all cursor-pointer ${
                  settings.fontFamily === 'amiri'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {isEn ? 'Amiri' : 'أميري'}
              </button>
            </div>
          </div>

          {/* 5. Quiet Time & Prayer Timer ⏳ */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              {settings.quietTimeActive ? (
                <button
                  type="button"
                  onClick={() => {
                    onStopQuietTimer();
                    showToast(isEn ? 'Timer stopped' : 'تم إنهاء المؤقت');
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer underline"
                >
                  {isEn ? 'Stop Timer ✕' : 'إلغاء المؤقت ✕'}
                </button>
              ) : (
                <span className="text-[11px] text-amber-400 font-semibold">
                  {isEn ? `Configured: ${settings.quietTimeMinutes || 15} min` : `المدة المحددة: ${settings.quietTimeMinutes || 15} دقيقة`}
                </span>
              )}

              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span>{isEn ? 'Quiet Time & Prayer Timer' : 'مؤقت الخلوة والصلوات'}</span>
                <span>⏳</span>
              </span>
            </div>

            {/* Quick-set buttons: [20 د] [15 د] [10 د] [5 د] */}
            <div className="grid grid-cols-4 gap-2">
              {[20, 15, 10, 5].map((mins) => {
                const isRunning = settings.quietTimeActive && settings.quietTimeMinutes === mins;
                const isConfigured = (settings.quietTimeMinutes || 15) === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleQuickTimer(mins)}
                    className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                      isRunning
                        ? 'bg-[#F59E0B] text-slate-950 shadow-md font-bold ring-2 ring-amber-400'
                        : isConfigured
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                    title={isEn ? `Set & start ${mins} min timer` : `تحديد وبدء ${mins} دقائق`}
                  >
                    {mins} {isEn ? 'm' : 'د'}
                  </button>
                );
              })}
            </div>

            {/* Custom Duration Input / Button */}
            <div>
              {!showCustomTimerInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomTimerInput(true)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 hover:text-[#F59E0B] hover:border-amber-500/50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">{isEn ? 'Set Custom Duration' : 'تحديد وقت خاص'}</span>
                </button>
              ) : (
                <form onSubmit={handleCustomTimerSubmit} className="flex flex-wrap items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(e.target.value)}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-white"
                    />
                    <span className="text-xs text-slate-400">{isEn ? 'min' : 'دقيقة'}</span>
                  </div>

                  <div className="flex items-center gap-1.5 mr-auto">
                    <button
                      type="button"
                      onClick={handleSaveCustomDuration}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      {isEn ? 'Save' : 'حفظ المدة'}
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#F59E0B] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow"
                    >
                      {isEn ? 'Start' : 'بدء الخلوة'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomTimerInput(false)}
                      className="px-2 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      {isEn ? 'Cancel' : 'إلغاء'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* 
            6. Daily Quiet Time Reminder:
            Requirement:
            - Left: Time input + Toggle switch
            - Right: Text "التذكير اليومي بالخلوة ⏰"
            - Plays mobile alarm sound + Test alarm button
          */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 space-y-3">
            <div 
              className="flex items-center justify-between"
              dir="ltr"
            >
              {/* LEFT (الشمال): الوقت وزرار التوجيل سويتش */}
              <div className="flex items-center gap-3">
                {/* Time Picker */}
                <input
                  type="time"
                  value={settings.dailyReminderTime}
                  onChange={(e) => onUpdateSettings({ dailyReminderTime: e.target.value })}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-[#F59E0B]"
                  title={isEn ? 'Reminder Time' : 'وقت التذكير'}
                />

                {/* Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.dailyReminderEnabled}
                  onClick={() => {
                    const nextState = !settings.dailyReminderEnabled;
                    onUpdateSettings({ dailyReminderEnabled: nextState });
                    spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
                    if (nextState && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
                      Notification.requestPermission().catch(() => {});
                    }
                    showToast(nextState 
                      ? (isEn ? 'Reminder enabled • Alarm active' : 'تم تفعيل التذكير • المنبه جاهز') 
                      : (isEn ? 'Reminder disabled' : 'تم تعطيل التذكير'));
                  }}
                  className={`w-12 h-6.5 p-0.5 rounded-full transition-colors flex items-center cursor-pointer shadow-inner ${
                    settings.dailyReminderEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                  title={isEn ? 'Daily Reminder Toggle' : 'تفعيل التذكير اليومي'}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md transition-all" />
                </button>
              </div>

              {/* RIGHT (اليمين): جملة (التذكير اليومي بالخلوة) */}
              <div className="text-right flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-200">
                  {isEn ? 'Daily Quiet Time Reminder' : 'التذكير اليومي بالخلوة'}
                </span>
                <span>⏰</span>
              </div>
            </div>

            {/* Test Mobile Alarm Sound Row */}
            <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs" dir="ltr">
              <button
                type="button"
                onClick={() => {
                  if (isTestingAlarm) {
                    spiritualHaptics.stopPhoneAlarm();
                    setIsTestingAlarm(false);
                  } else {
                    setIsTestingAlarm(true);
                    spiritualHaptics.playAlarmPreview(() => setIsTestingAlarm(false));
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isTestingAlarm 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' 
                    : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30'
                }`}
              >
                <span>{isTestingAlarm ? '⏹️' : '🔔'}</span>
                <span>{isTestingAlarm ? (isEn ? 'Stop Sound' : 'إيقاف النغمة') : (isEn ? 'Test Alarm Ring' : 'تجربة نغمة المنبه 🔔')}</span>
              </button>

              <span className="text-[11px] text-slate-400 font-medium">
                {isEn ? 'Phone alarm sound 📱' : 'نغمة منبه الموبايل 📱'}
              </span>
            </div>
          </div>

          {/* 
            7. Appearance & Haptics:
            Requirement: "وبرضة زرار الوضع اليلى والاهتزاز عند اللمس يبقى توجيل سوتش"
          */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 space-y-4">
            <span className="text-xs font-semibold text-slate-400 block text-right">
              {isEn ? 'Appearance & Haptics' : 'المظهر والاهتزاز'}
            </span>

            {/* Dark Mode Row: Toggle switch on left, label on right */}
            <div 
              className="w-full flex items-center justify-between pt-0.5 select-none"
              dir="ltr"
            >
              {/* Left: Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={settings.darkMode}
                onClick={() => {
                  const next = !settings.darkMode;
                  onUpdateSettings({ darkMode: next });
                  spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
                }}
                className={`w-12 h-6.5 p-0.5 rounded-full transition-colors flex items-center cursor-pointer shadow-inner ${
                  settings.darkMode ? 'bg-[#F59E0B] justify-end' : 'bg-slate-700 justify-start'
                }`}
                title={isEn ? 'Toggle Dark Mode' : 'الوضع الليلي'}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md transition-all" />
              </button>

              {/* Right: Label + Icon */}
              <div className="flex items-center gap-2 text-right">
                <span className="text-xs text-slate-200 font-semibold">
                  {isEn ? 'Dark Mode' : 'الوضع الليلي'}
                </span>
                <span className="text-base">{settings.darkMode ? '🌙' : '☀️'}</span>
              </div>
            </div>

            {/* Haptics Row: Toggle switch on left, label on right */}
            <div 
              className="w-full flex items-center justify-between pt-3 border-t border-slate-800/80 select-none"
              dir="ltr"
            >
              {/* Left: Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={settings.hapticFeedback}
                onClick={() => {
                  const next = !settings.hapticFeedback;
                  onUpdateSettings({ hapticFeedback: next });
                  spiritualHaptics.triggerCountFeedback(next);
                  showToast(next ? (isEn ? 'Haptics enabled' : 'تم تشغيل الاهتزاز') : (isEn ? 'Haptics disabled' : 'تم تعطيل الاهتزاز'));
                }}
                className={`w-12 h-6.5 p-0.5 rounded-full transition-colors flex items-center cursor-pointer shadow-inner ${
                  settings.hapticFeedback ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
                title={isEn ? 'Toggle Haptic Feedback' : 'الاهتزاز عند اللمس'}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md transition-all" />
              </button>

              {/* Right: Label + Icon */}
              <div className="flex items-center gap-2 text-right">
                <span className="text-xs text-slate-200 font-semibold">
                  {isEn ? 'Haptic feedback on touch' : 'الاهتزاز عند اللمس'}
                </span>
                <span className="text-base">📳</span>
              </div>
            </div>
          </div>

          {/* 8. Language Toggle */}
          <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  onUpdateSettings({ language: 'ar' });
                  spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  settings.language === 'ar'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateSettings({ language: 'en' });
                  spiritualHaptics.triggerCountFeedback(settings.hapticFeedback);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  settings.language === 'en'
                    ? 'bg-[#F59E0B] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <span>{isEn ? 'Language' : 'اللغة (Language)'}</span>
              <Globe className="w-4 h-4 text-sky-400" />
            </span>
          </div>

        </div>

        {/* Footer Close button */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md cursor-pointer active:scale-95"
          >
            {isEn ? 'Save & Close' : 'حفظ وإغلاق الإعدادات'}
          </button>
        </div>

      </div>
    </div>
  );
};
