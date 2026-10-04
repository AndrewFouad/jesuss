import React from 'react';
import { PrayerTimeItem } from '../types/prayer';
import { Bell, BellOff, CheckCircle2 } from 'lucide-react';

interface PrayerListProps {
  prayers: PrayerTimeItem[];
  onToggleNotification?: (id: string) => void;
}

export const PrayerList: React.FC<PrayerListProps> = ({
  prayers,
  onToggleNotification
}) => {
  return (
    <div className="w-full bg-[#0F172A]/70 backdrop-blur-md rounded-[16px] border border-slate-800/80 p-3 sm:p-4 divide-y divide-slate-800/70">
      <div className="px-2 py-1.5 flex items-center justify-between text-xs text-slate-400 font-cairo">
        <span>مواقيت اليوم</span>
        <span>الوقت والتنبيه</span>
      </div>

      {prayers.map((prayer) => {
        const isNext = prayer.isNext;

        return (
          <div
            key={prayer.id}
            className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 ${
              isNext
                ? 'bg-slate-800/90 border border-emerald-500/30 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/40'
            }`}
          >
            {/* Prayer Name & Status */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  isNext
                    ? 'bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse'
                    : prayer.isPassed
                    ? 'bg-slate-600'
                    : 'bg-amber-400/70'
                }`}
              />

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={`font-cairo text-base font-semibold ${isNext ? 'text-emerald-300' : 'text-slate-200'}`}>
                    {prayer.nameAr}
                  </span>
                  {isNext && (
                    <span className="text-[10px] font-cairo px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                      القادمة
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {prayer.nameEn}
                </span>
              </div>
            </div>

            {/* Time and Alarm */}
            <div className="flex items-center gap-3">
              <span
                className={`font-cairo text-base tracking-wide ${
                  isNext ? 'text-white font-bold text-lg' : 'text-slate-200'
                }`}
              >
                {prayer.timeStr}
              </span>

              {onToggleNotification && (
                <button
                  type="button"
                  onClick={() => onToggleNotification(prayer.id)}
                  title={prayer.notificationEnabled ? 'إيقاف التنبيه' : 'تفعيل التنبيه'}
                  className={`p-1.5 rounded-lg transition-colors ${
                    prayer.notificationEnabled
                      ? 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-700/50'
                      : 'text-slate-500 hover:text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {prayer.notificationEnabled ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
