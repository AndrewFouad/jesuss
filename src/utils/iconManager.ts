import JSZip from 'jszip';

export interface AppIconSet {
  previewUrl: string; // Base64 or URL
  sourceType: 'preset' | 'upload' | 'zip';
  name: string;
}

// Default presets
export const PRESET_ICONS: { id: string; nameAr: string; svg: string; bg: string }[] = [
  {
    id: 'gold-crescent',
    nameAr: 'الهلال والمنارة الذهبية',
    bg: '#020617',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="bgG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="50%" stop-color="#0F172A"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
        <linearGradient id="gld" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#bgG)"/>
      <circle cx="256" cy="256" r="180" fill="none" stroke="url(#gld)" stroke-width="2" stroke-dasharray="6,6" opacity="0.4"/>
      <path d="M280 140 C 200 140, 160 210, 160 270 C 160 340, 215 390, 285 390 C 330 390, 365 370, 385 340 C 345 350, 275 330, 250 270 C 230 220, 260 165, 280 140 Z" fill="url(#gld)"/>
      <polygon points="315,185 322,204 342,204 326,216 332,235 315,223 298,235 304,216 288,204 308,204" fill="#FEF08A"/>
      <path d="M170 390 L170 340 Q210 300 256 300 Q302 300 342 340 L342 390 Z" fill="#059669" opacity="0.85"/>
      <circle cx="256" cy="276" r="6" fill="#FDE047"/>
    </svg>`
  },
  {
    id: 'kaaba-sharif',
    nameAr: 'الكعبة المشرفة بمكة',
    bg: '#0F172A',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="bgK" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <linearGradient id="gldK" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="100%" stop-color="#B45309"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#bgK)"/>
      <circle cx="256" cy="256" r="170" fill="none" stroke="#FDE047" stroke-width="3" opacity="0.3"/>
      <!-- Kaaba Cube -->
      <polygon points="170,220 256,170 342,220 256,270" fill="#18181b"/>
      <polygon points="170,220 256,270 256,380 170,330" fill="#09090b"/>
      <polygon points="256,270 342,220 342,330 256,380" fill="#27272a"/>
      <!-- Kiswa Gold Band -->
      <polygon points="170,240 256,290 256,305 170,255" fill="url(#gldK)"/>
      <polygon points="256,290 342,240 342,255 256,305" fill="url(#gldK)"/>
      <!-- Door of Kaaba -->
      <rect x="280" y="275" width="28" height="48" fill="#FDE047" rx="3" transform="skewY(-15)"/>
    </svg>`
  },
  {
    id: 'dome-mosque',
    nameAr: 'قبة المسجد والمحراب',
    bg: '#042f2e',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="bgM" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#022c22"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="gldM" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34D399"/>
          <stop offset="100%" stop-color="#F59E0B"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#bgM)"/>
      <!-- Grand Mosque Dome -->
      <path d="M156 380 L156 310 Q256 160 356 310 L356 380 Z" fill="#065f46" stroke="#10b981" stroke-width="4"/>
      <path d="M210 380 L210 320 Q256 260 302 320 L302 380 Z" fill="#022c22"/>
      <path d="M256 140 L256 170" stroke="#FBBF24" stroke-width="6" stroke-linecap="round"/>
      <circle cx="256" cy="130" r="14" fill="#FBBF24"/>
      <!-- Minarets -->
      <rect x="110" y="220" width="24" height="160" fill="#047857" rx="4"/>
      <polygon points="110,220 122,170 134,220" fill="#FBBF24"/>
      <rect x="378" y="220" width="24" height="160" fill="#047857" rx="4"/>
      <polygon points="378,220 390,170 402,220" fill="#FBBF24"/>
    </svg>`
  },
  {
    id: 'quran-mushaf',
    nameAr: 'المصحف الشريف والآيات',
    bg: '#1e1b4b',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="bgQ" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#bgQ)"/>
      <!-- Rehal (Quran Stand) -->
      <polygon points="170,390 256,320 342,390 320,400 256,345 192,400" fill="#78350f"/>
      <polygon points="170,310 256,380 342,310 320,300 256,355 192,300" fill="#92400e"/>
      <!-- Open Quran Pages -->
      <path d="M256 310 C 230 260, 160 250, 130 260 L 130 180 C 160 170, 230 180, 256 210 Z" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
      <path d="M256 310 C 282 260, 352 250, 382 260 L 382 180 C 352 170, 282 180, 256 210 Z" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
      <!-- Calligraphic lines on pages -->
      <line x1="150" y1="205" x2="235" y2="215" stroke="#b45309" stroke-width="3" stroke-linecap="round"/>
      <line x1="150" y1="225" x2="235" y2="235" stroke="#b45309" stroke-width="3" stroke-linecap="round"/>
      <line x1="150" y1="245" x2="225" y2="255" stroke="#b45309" stroke-width="3" stroke-linecap="round"/>
      <line x1="277" y1="215" x2="362" y2="205" stroke="#b45309" stroke-width="3" stroke-linecap="round"/>
      <line x1="277" y1="235" x2="362" y2="225" stroke="#b45309" stroke-width="3" stroke-linecap="round"/>
      <line x1="287" y1="255" x2="362" y2="245" stroke="#b45309" stroke-width="3" stroke-linecap="round"/>
    </svg>`
  }
];

export async function svgToPngBlob(svgStr: string, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob from canvas'));
      }, 'image/png');
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };

    img.src = url;
  });
}

export async function imageFileToPngBlob(file: File, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob from canvas'));
      }, 'image/png');
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };

    img.src = url;
  });
}

/**
 * Parses an uploaded icon zip (e.g. from AppIcon.co) and extracts launcher icons
 */
export async function extractIconsFromZip(zipFile: File): Promise<{
  icon48?: Blob;
  icon72?: Blob;
  icon96?: Blob;
  icon144?: Blob;
  icon192?: Blob;
  icon512?: Blob;
  previewUrl?: string;
}> {
  const zip = new JSZip();
  const loaded = await zip.loadAsync(zipFile);
  const result: {
    icon48?: Blob;
    icon72?: Blob;
    icon96?: Blob;
    icon144?: Blob;
    icon192?: Blob;
    icon512?: Blob;
    previewUrl?: string;
  } = {};

  for (const [filename, file] of Object.entries(loaded.files)) {
    if (file.dir) continue;
    const lower = filename.toLowerCase();

    if (lower.includes('48x48') || lower.includes('mdpi')) {
      const buf = await file.async('blob');
      result.icon48 = buf;
    } else if (lower.includes('72x72') || lower.includes('hdpi')) {
      const buf = await file.async('blob');
      result.icon72 = buf;
    } else if (lower.includes('96x96') || lower.includes('xhdpi')) {
      const buf = await file.async('blob');
      result.icon96 = buf;
    } else if (lower.includes('144x144') || lower.includes('xxhdpi')) {
      const buf = await file.async('blob');
      result.icon144 = buf;
    } else if (lower.includes('192x192') || lower.includes('xxxhdpi') || lower.includes('icon-192')) {
      const buf = await file.async('blob');
      result.icon192 = buf;
    } else if (lower.includes('512x512') || lower.includes('1024') || lower.includes('store') || lower.includes('icon-512')) {
      const buf = await file.async('blob');
      result.icon512 = buf;
    }
  }

  // Create preview URL from largest icon found
  const bestIcon = result.icon512 || result.icon192 || result.icon144 || result.icon96 || result.icon72 || result.icon48;
  if (bestIcon) {
    result.previewUrl = URL.createObjectURL(bestIcon);
  }

  return result;
}

/**
 * Repackages the Android Studio Project ZIP with custom launcher icons in all density folders
 */
export async function generateUpdatedAndroidZip(
  baseZipUrl: string,
  icons: {
    icon48: Blob;
    icon72: Blob;
    icon96: Blob;
    icon144: Blob;
    icon192: Blob;
    icon512: Blob;
  }
): Promise<Blob> {
  const response = await fetch(baseZipUrl);
  const arrayBuffer = await response.arrayBuffer();

  const zip = new JSZip();
  const loaded = await zip.loadAsync(arrayBuffer);

  // Helper to convert Blob to ArrayBuffer
  const blobToBuffer = async (b: Blob) => await b.arrayBuffer();

  // Root or PrayerApp folder
  const appRes = loaded.folder("PrayerApp")?.folder("app")?.folder("src")?.folder("main")?.folder("res");
  if (appRes) {
    // Write density folders
    appRes.folder("mipmap-mdpi")?.file("ic_launcher.png", await blobToBuffer(icons.icon48));
    appRes.folder("mipmap-mdpi")?.file("ic_launcher_round.png", await blobToBuffer(icons.icon48));

    appRes.folder("mipmap-hdpi")?.file("ic_launcher.png", await blobToBuffer(icons.icon72));
    appRes.folder("mipmap-hdpi")?.file("ic_launcher_round.png", await blobToBuffer(icons.icon72));

    appRes.folder("mipmap-xhdpi")?.file("ic_launcher.png", await blobToBuffer(icons.icon96));
    appRes.folder("mipmap-xhdpi")?.file("ic_launcher_round.png", await blobToBuffer(icons.icon96));

    appRes.folder("mipmap-xxhdpi")?.file("ic_launcher.png", await blobToBuffer(icons.icon144));
    appRes.folder("mipmap-xxhdpi")?.file("ic_launcher_round.png", await blobToBuffer(icons.icon144));

    appRes.folder("mipmap-xxxhdpi")?.file("ic_launcher.png", await blobToBuffer(icons.icon192));
    appRes.folder("mipmap-xxxhdpi")?.file("ic_launcher_round.png", await blobToBuffer(icons.icon192));

    // Store root icon
    loaded.folder("PrayerApp")?.file("playstore-icon.png", await blobToBuffer(icons.icon512));
  }

  return await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}
