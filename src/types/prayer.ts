export interface PrayerTimeItem {
  id: string;
  nameAr: string;
  nameEn: string;
  timeStr: string; // e.g. "03:45 م"
  time24: string;  // e.g. "15:45"
  isNext: boolean;
  isPassed: boolean;
  notificationEnabled: boolean;
}

export interface CityOption {
  id: string;
  nameAr: string;
  countryAr: string;
  lat: number;
  lng: number;
  timezone: number; // UTC offset in hours
}

export interface CalculationMethod {
  id: string;
  nameAr: string;
  fajrAngle: number;
  ishaAngle: number;
}
