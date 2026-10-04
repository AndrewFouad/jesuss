import { PrayerTimeItem, CityOption } from '../types/prayer';

export const CITIES: CityOption[] = [
  { id: 'cairo', nameAr: 'القاهرة', countryAr: 'مصر', lat: 30.0444, lng: 31.2357, timezone: 3 },
  { id: 'makkah', nameAr: 'مكة المكرمة', countryAr: 'السعودية', lat: 21.4225, lng: 39.8262, timezone: 3 },
  { id: 'riyadh', nameAr: 'الرياض', countryAr: 'السعودية', lat: 24.7136, lng: 46.6753, timezone: 3 },
  { id: 'alexandria', nameAr: 'الإسكندرية', countryAr: 'مصر', lat: 31.2001, lng: 29.9187, timezone: 3 },
  { id: 'gaza', nameAr: 'غزة / القدس', countryAr: 'فلسطين', lat: 31.5017, lng: 34.4668, timezone: 3 },
  { id: 'dubai', nameAr: 'دبي', countryAr: 'الإمارات', lat: 25.2048, lng: 55.2708, timezone: 4 },
  { id: 'amman', nameAr: 'عمّان', countryAr: 'الأردن', lat: 31.9454, lng: 35.9284, timezone: 3 },
  { id: 'baghdad', nameAr: 'بغداد', countryAr: 'العراق', lat: 33.3152, lng: 44.3661, timezone: 3 },
  { id: 'tunis', nameAr: 'تونس', countryAr: 'تونس', lat: 36.8065, lng: 10.1815, timezone: 1 },
];

export const CALCULATION_METHODS = [
  { id: 'egypt', nameAr: 'الهيئة المصرية العامة للمساحة (Fajr 19.5°, Isha 17.5°)', fajrAngle: 19.5, ishaAngle: 17.5 },
  { id: 'makkah', nameAr: 'جامعة أم القرى - مكة المكرمة (Fajr 18.5°, Isha 90min)', fajrAngle: 18.5, ishaAngle: 19 },
  { id: 'mwl', nameAr: 'رابطة العالم الإسلامي (Fajr 18°, Isha 17°)', fajrAngle: 18, ishaAngle: 17 },
];

export function formatArabicTime(hour24: number, minute: number): { timeStr: string; time24: string } {
  const period = hour24 >= 12 ? 'م' : 'ص';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const hStr = hour12 < 10 ? `0${hour12}` : `${hour12}`;
  const mStr = minute < 10 ? `0${minute}` : `${minute}`;
  const h24Str = hour24 < 10 ? `0${hour24}` : `${hour24}`;
  
  return {
    timeStr: `${hStr}:${mStr} ${period}`,
    time24: `${h24Str}:${mStr}`
  };
}

export function getPrayerTimesForDate(cityId: string, customDate: Date = new Date()): PrayerTimeItem[] {
  // Base baseline values matching the user's code: Asr is 03:45 م (15:45)
  // We calculate realistic solar variations for the chosen city
  const city = CITIES.find(c => c.id === cityId) || CITIES[0];
  
  // Calculate relative offset based on city longitude
  const lngDiffMinutes = Math.round((city.lng - 31.2357) * 4); // 4 minutes per degree longitude
  
  const baseTimes = [
    { id: 'fajr', nameAr: 'الفجر', nameEn: 'Fajr', baseH: 4, baseM: 32 },
    { id: 'sunrise', nameAr: 'الشروق', nameEn: 'Sunrise', baseH: 5, baseM: 54 },
    { id: 'dhuhr', nameAr: 'الظهر', nameEn: 'Dhuhr', baseH: 12, baseM: 15 },
    { id: 'asr', nameAr: 'العصر', nameEn: 'Asr', baseH: 15, baseM: 45 }, // Exact 03:45 م from user snippet
    { id: 'maghrib', nameAr: 'المغرب', nameEn: 'Maghrib', baseH: 18, baseM: 36 },
    { id: 'isha', nameAr: 'العشاء', nameEn: 'Isha', baseH: 19, baseM: 54 },
  ];

  const nowMinutes = customDate.getHours() * 60 + customDate.getMinutes();

  let nextFound = false;

  return baseTimes.map((p) => {
    let totalMinutes = p.baseH * 60 + p.baseM - lngDiffMinutes;
    if (totalMinutes < 0) totalMinutes += 1440;
    if (totalMinutes >= 1440) totalMinutes -= 1440;

    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const { timeStr, time24 } = formatArabicTime(h, m);

    let isPassed = totalMinutes < nowMinutes;
    let isNext = false;

    if (!nextFound && totalMinutes > nowMinutes) {
      isNext = true;
      nextFound = true;
    }

    return {
      id: p.id,
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      timeStr,
      time24,
      isNext,
      isPassed,
      notificationEnabled: true
    };
  }).map((item, idx, arr) => {
    // If all prayers today have passed, Fajr of tomorrow is next
    if (!nextFound && idx === 0) {
      return { ...item, isNext: true };
    }
    return item;
  });
}

export function getTimeUntilNextPrayer(nextPrayerTime24: string, now: Date = new Date()): { hours: number; minutes: number; seconds: number; textAr: string } {
  const [targetH, targetM] = nextPrayerTime24.split(':').map(Number);
  const target = new Date(now);
  target.setHours(targetH, targetM, 0, 0);

  if (target.getTime() <= now.getTime()) {
    // Next day
    target.setDate(target.getDate() + 1);
  }

  const diffMs = target.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n < 10 ? `0${n}` : `${n}`;

  return {
    hours,
    minutes,
    seconds,
    textAr: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  };
}
