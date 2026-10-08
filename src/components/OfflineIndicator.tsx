import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC<{ language?: 'ar' | 'en' }> = ({ language = 'ar' }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  const isEn = language === 'en';

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-xl bg-amber-500/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-slate-950 shadow-xl border border-amber-400 font-cairo">
      <WifiOff className="w-4 h-4 text-slate-950 animate-pulse" />
      <span>
        {isEn 
          ? 'Offline Mode: Jesus Prayer and personal prayers are fully accessible' 
          : 'وضع العمل دون اتصال: صلوات يسوع والطلبات الشخصية تعمل بالكامل دون إنترنت'}
      </span>
    </div>
  );
};
