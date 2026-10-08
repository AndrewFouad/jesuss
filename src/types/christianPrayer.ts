export type PrayerCategory = 'arrow' | 'repentance' | 'blessing' | 'personal';

export type PrayerSourceType = 'verse' | 'patristic' | 'prayer';

export interface PrayerItem {
  id: string;
  category: PrayerCategory;
  textAr: string;
  textEn: string;
  referenceAr?: string;
  referenceEn?: string;
  sourceType?: PrayerSourceType; // 'verse' for bible verse, 'patristic' for church fathers, 'prayer' for arrow/liturgical
  fatherNameAr?: string; // e.g. "يوحنا ذهبي الفم", "متى المسكين", "أنطونيوس الكبير"
  fatherNameEn?: string; // e.g. "St. John Chrysostom", "Father Matta El Meskeen", "St. Anthony"
  isCustom?: boolean;
}

export type FontSizeOption = 'small' | 'medium' | 'large';
export type FontFamilyOption = 'amiri' | 'cairo' | 'scheherazade';
export type LanguageOption = 'ar' | 'en';

export interface AppSettings {
  focusMode: boolean; // Hide counter and reset button
  fontSize: FontSizeOption;
  fontFamily: FontFamilyOption;
  quietTimeMinutes: number; // 0 if inactive
  quietTimeActive: boolean;
  quietTimeRemainingSeconds: number;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // "07:00"
  darkMode: boolean;
  hapticFeedback: boolean;
  language: LanguageOption;
}
