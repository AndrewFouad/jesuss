import React, { useState, useEffect } from 'react';
import { Compass, Navigation } from 'lucide-react';

interface QiblaCompassProps {
  cityId: string;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({ cityId }) => {
  // Approximate Qibla angle from Cairo is ~136 degrees (SE)
  // We can vary slightly depending on city
  const qiblaAngles: Record<string, number> = {
    cairo: 136,
    alexandria: 135,
    makkah: 0,
    riyadh: 245,
    dubai: 258,
    amman: 161,
    baghdad: 198,
    tunis: 114,
    gaza: 156
  };

  const qiblaAngle = qiblaAngles[cityId] ?? 136;
  const [deviceHeading, setDeviceHeading] = useState<number>(0);

  // In supported mobile devices, we can use device orientation
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setDeviceHeading(360 - e.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const relativeQibla = (qiblaAngle - deviceHeading + 360) % 360;

  return (
    <div className="w-full bg-[#0F172A] rounded-[16px] border border-slate-800/80 p-5 text-center relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-400 font-cairo">اتجاه القبلة الشريفة</span>
        <span className="text-xs text-amber-400 font-mono font-medium">{qiblaAngle}° نحو مكة</span>
      </div>

      <div className="my-4 flex items-center justify-center">
        <div className="relative w-44 h-44 rounded-full border-2 border-slate-700/80 bg-slate-900/90 flex items-center justify-center shadow-inner">
          {/* Compass Rose Markings */}
          <span className="absolute top-2 text-[10px] font-bold text-rose-400">N (شمال)</span>
          <span className="absolute bottom-2 text-[10px] text-slate-500">S (جنوب)</span>
          <span className="absolute left-2 text-[10px] text-slate-500">W (غرب)</span>
          <span className="absolute right-2 text-[10px] text-slate-500">E (شرق)</span>

          {/* Rotating Kaaba Arrow Pointer */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
            style={{ transform: `rotate(${relativeQibla}deg)` }}
          >
            <div className="flex flex-col items-center -translate-y-8">
              <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950 font-bold text-[10px] shadow-lg shadow-amber-500/30">
                🕋
              </div>
              <div className="w-0.5 h-12 bg-gradient-to-t from-transparent via-amber-400 to-amber-500" />
            </div>
          </div>

          <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-amber-400 z-10" />
        </div>
      </div>

      <p className="text-xs text-slate-400 font-cairo mt-2">
        قم بمحاذاة السهم الذهبي مع أيقونة الكعبة المشرفة لتحديد القبلة.
      </p>
    </div>
  );
};
