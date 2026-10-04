import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Download, 
  X, 
  Layers, 
  Smartphone, 
  FileArchive,
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  PRESET_ICONS, 
  imageFileToPngBlob, 
  svgToPngBlob, 
  extractIconsFromZip, 
  generateUpdatedAndroidZip 
} from '../utils/iconManager';

interface AppIconModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeIconUrl: string;
  onApplyIcon: (newUrl: string) => void;
}

export const AppIconModal: React.FC<AppIconModalProps> = ({
  isOpen,
  onClose,
  activeIconUrl,
  onApplyIcon
}) => {
  const [selectedPreview, setSelectedPreview] = useState<string>(activeIconUrl);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('PrayerApp-Android-Project.zip');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSelectPreset = async (preset: typeof PRESET_ICONS[0]) => {
    setIsProcessing(true);
    setStatusMessage('جاري تحويل وتطبيق الأيقونة المختارة على كافة أحجام الأندرويد...');
    try {
      const icon48 = await svgToPngBlob(preset.svg, 48);
      const icon72 = await svgToPngBlob(preset.svg, 72);
      const icon96 = await svgToPngBlob(preset.svg, 96);
      const icon144 = await svgToPngBlob(preset.svg, 144);
      const icon192 = await svgToPngBlob(preset.svg, 192);
      const icon512 = await svgToPngBlob(preset.svg, 512);

      const previewUrl = URL.createObjectURL(icon192);
      setSelectedPreview(previewUrl);

      // Repackage zip
      const updatedZip = await generateUpdatedAndroidZip('/PrayerApp-Android-Project.zip', {
        icon48,
        icon72,
        icon96,
        icon144,
        icon192,
        icon512
      });

      setDownloadBlob(updatedZip);
      setDownloadFilename(`PrayerApp-${preset.id}-Project.zip`);
      setStatusMessage('تم دمج الأيقونة بنجاح في كافة مجلدات res/mipmap للأندرويد!');
    } catch (err) {
      console.error(err);
      setStatusMessage('حدث خطأ أثناء معالجة الأيقونة');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMessage('جاري قراءة ومعالجة ملف الأيقونة...');

    try {
      if (file.name.endsWith('.zip')) {
        // Zip file uploaded (e.g. from AppIcon.co with launchericon-*.png)
        setStatusMessage('تم اكتشاف حزمة ZIP، جاري استخراج أيقونات الأندرويد بجميع المقاسات...');
        const extracted = await extractIconsFromZip(file);

        if (!extracted.previewUrl) {
          throw new Error('لم يتم العثور على صور أيقونات أندرويد صالحة داخل ملف الـ ZIP');
        }

        setSelectedPreview(extracted.previewUrl);

        // Fallbacks if some sizes missing
        const fallback192 = extracted.icon192 || extracted.icon512 || extracted.icon144 || extracted.icon96 || extracted.icon72 || extracted.icon48;
        if (!fallback192) throw new Error('لا توجد أيقونة صالحة في الملف');

        const icon48 = extracted.icon48 || fallback192;
        const icon72 = extracted.icon72 || fallback192;
        const icon96 = extracted.icon96 || fallback192;
        const icon144 = extracted.icon144 || fallback192;
        const icon192 = extracted.icon192 || fallback192;
        const icon512 = extracted.icon512 || fallback192;

        const updatedZip = await generateUpdatedAndroidZip('/PrayerApp-Android-Project.zip', {
          icon48,
          icon72,
          icon96,
          icon144,
          icon192,
          icon512
        });

        setDownloadBlob(updatedZip);
        setDownloadFilename('PrayerApp-Custom-Icon-Project.zip');
        setStatusMessage('تم استخراج أيقونات الأندرويد من ملف الـ ZIP ودمجها بالمشروع بنجاح!');
      } else {
        // Direct image (PNG, JPG, SVG)
        setStatusMessage('جاري توليد كافة مقاسات الأندرويد (48x48 إلى 512x512)...');
        const icon48 = await imageFileToPngBlob(file, 48);
        const icon72 = await imageFileToPngBlob(file, 72);
        const icon96 = await imageFileToPngBlob(file, 96);
        const icon144 = await imageFileToPngBlob(file, 144);
        const icon192 = await imageFileToPngBlob(file, 192);
        const icon512 = await imageFileToPngBlob(file, 512);

        const previewUrl = URL.createObjectURL(icon192);
        setSelectedPreview(previewUrl);

        const updatedZip = await generateUpdatedAndroidZip('/PrayerApp-Android-Project.zip', {
          icon48,
          icon72,
          icon96,
          icon144,
          icon192,
          icon512
        });

        setDownloadBlob(updatedZip);
        setDownloadFilename('PrayerApp-Custom-Icon-Project.zip');
        setStatusMessage('تم ضبط الأيقونة وتوليد حزمة المشروع بالكامل!');
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'تعذر قراءة ملف الأيقونة';
      setStatusMessage(`تنبيه: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyToApp = () => {
    onApplyIcon(selectedPreview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-cairo"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                تخصيص أيقونة تطبيق أندرويد (App Icon Studio)
              </h2>
              <p className="text-xs text-slate-400">
                رفع ملفات الأيقونة (PNG / JPG أو ملف ZIP) وتضمينها تلقائياً بجميع مقاسات الأندرويد
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice about text-paste vs file upload */}
        <div className="mx-4 mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>ملاحظة هامة:</strong> عندما تلصق ملف ZIP مباشرة داخل صندوق المحادثة فإنه يتحول إلى نصوص خام مشفرة. هنا يمكنك <strong>اختيار أو سحب ملف الأيقونة</strong> (PNG أو ملف ZIP المصدّر من AppIcon) وسيقوم النظام فوراً بفك ضغطه وتوليد حزمة المشروع الجاهزة للأندرويد!
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Top Section: Upload Box & Live Previews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/40 hover:bg-slate-800/40 transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.zip"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-400 flex items-center justify-center mb-3 transition-colors">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-white mb-1">
                اضغط لاختيار أو سحب ملف الأيقونة
              </span>
              <span className="text-xs text-slate-400">
                يدعم صور PNG أو ملف ZIP الخاص بالأيقونات
              </span>
              <span className="mt-2 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                (48px, 72px, 96px, 144px, 192px, 512px)
              </span>
            </div>

            {/* Live Android Icon Preview Shapes */}
            <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 mb-3">معاينة الأيقونة الحالية في أندرويد:</span>
              
              <div className="flex items-center justify-center gap-4">
                {/* Circle (Google Pixel) */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-full border-2 border-emerald-500/40 shadow-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                    <img src={selectedPreview} alt="Circle Preview" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-slate-400">دائري</span>
                </div>

                {/* Squircle (Samsung Galaxy) */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-[18px] border-2 border-emerald-500/40 shadow-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                    <img src={selectedPreview} alt="Squircle Preview" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-slate-400">سامسونج</span>
                </div>

                {/* Play Store (Square 512px) */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-xl border-2 border-emerald-500/40 shadow-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                    <img src={selectedPreview} alt="Square Preview" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-slate-400">Play Store</span>
                </div>
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div className="mt-3 text-xs text-center text-emerald-400 font-medium animate-pulse">
                  {statusMessage}
                </div>
              )}
            </div>

          </div>

          {/* Preset Islamic Icons Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                أو اختر من تصاميم الأيقونات الإسلامية الجاهزة:
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_ICONS.map((preset) => (
                <button
                  key={preset.id}
                  disabled={isProcessing}
                  onClick={() => handleSelectPreset(preset)}
                  className="flex flex-col items-center p-3 rounded-xl border border-slate-800 hover:border-emerald-500/80 bg-slate-950/40 hover:bg-slate-800/60 transition-all text-center group cursor-pointer"
                >
                  <div 
                    className="w-12 h-12 rounded-xl overflow-hidden mb-2 shadow-md group-hover:scale-105 transition-transform"
                    dangerouslySetInnerHTML={{ __html: preset.svg }}
                  />
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                    {preset.nameAr}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyToApp}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              <span>تطبيق الأيقونة على الشاشة الحالية</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {downloadBlob ? (
              <a
                href={URL.createObjectURL(downloadBlob)}
                download={downloadFilename}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل مشروع APK بالأيقونة الجديدة (.ZIP)</span>
              </a>
            ) : (
              <a
                href="/PrayerApp-Android-Project.zip"
                download="PrayerApp-Android-Project.zip"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل المشروع الافتراضي</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
