export type PrayerCategory = 'arrow' | 'repentance' | 'blessing' | 'personal';

export interface PrayerItem {
  id: string;
  category: PrayerCategory;
  textAr: string;
  textEn: string;
  referenceAr?: string;
  referenceEn?: string;
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
