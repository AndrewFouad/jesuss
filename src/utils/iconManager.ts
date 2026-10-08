import JSZip from 'jszip';

export interface AppIconSet {
  previewUrl: string; // Base64 or URL
  sourceType: 'preset' | 'upload' | 'zip';
  name: string;
}

// Preset Icons fitting the Christian Faith and Jesus Prayer App (صلاة يسوع والصلوات السهمية)
export const PRESET_ICONS: { id: string; nameAr: string; nameEn: string; svg: string; bg: string }[] = [
  {
    id: 'glorious-golden-cross',
    nameAr: 'الصليب الذهبي المجيد',
    nameEn: 'Glorious Golden Cross',
    bg: '#020617',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="bgCross" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="50%" stop-color="#0B132B"/>
          <stop offset="100%" stop-color="#1E1B4B"/>
        </linearGradient>
        <linearGradient id="gldCross" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="35%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#B45309"/>
        </linearGradient>
        <filter id="glowCross" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#bgCross)"/>
      <rect width="504" height="504" x="4" y="4" rx="108" fill="none" stroke="rgba(245, 158, 11, 0.25)" stroke-width="2"/>
      <!-- Halo of Divine Light -->
      <circle cx="256" cy="225" r="140" fill="none" stroke="url(#gldCross)" stroke-width="3" stroke-dasharray="6,6" opacity="0.45"/>
      <circle cx="256" cy="225" r="110" fill="none" stroke="#F59E0B" stroke-width="1.5" opacity="0.3"/>
      <!-- Vertical Beam of the Holy Cross -->
      <rect x="238" y="105" width="36" height="280" rx="10" fill="url(#gldCross)" filter="url(#glowCross)"/>
      <!-- Horizontal Beam of the Holy Cross -->
      <rect x="156" y="185" width="200" height="36" rx="10" fill="url(#gldCross)" filter="url(#glowCross)"/>
      <!-- Center Radiant Jewel -->
      <circle cx="256" cy="203" r="16" fill="#FEF08A"/>
      <circle cx="256" cy="203" r="8" fill="#F59E0B"/>
    </svg>`
  },
  {
    id: 'jesus-prayer-rosary',
    nameAr: 'مسبحة صلاة يسوع والصليب',
    nameEn: 'Jesus Prayer Chotki & Cross',
    bg: '#0F172A',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="bgRosary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="100%" stop-color="#1E293B"/>
        </linearGradient>
        <linearGradient id="beadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="50%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#78350F"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#bgRosary)"/>
      <!-- Rosary Bead Ring -->
      <circle cx="256" cy="210" r="130" fill="none" stroke="rgba(245, 158, 11, 0.2)" stroke-width="2"/>
      <!-- Beads along the circle (33 prayer knots representation) -->
      <circle cx="256" cy="80" r="11" fill="url(#beadGrad)"/>
      <circle cx="282" cy="83" r="9" fill="url(#beadGrad)"/>
      <circle cx="307" cy="92" r="9" fill="url(#beadGrad)"/>
      <circle cx="330" cy="107" r="9" fill="url(#beadGrad)"/>
      <circle cx="350" cy="126" r="9" fill="url(#beadGrad)"/>
      <circle cx="366" cy="150" r="9" fill="url(#beadGrad)"/>
      <circle cx="377" cy="177" r="9" fill="url(#beadGrad)"/>
      <circle cx="382" cy="205" r="9" fill="url(#beadGrad)"/>
      <circle cx="380" cy="233" r="9" fill="url(#beadGrad)"/>
      <circle cx="371" cy="260" r="9" fill="url(#beadGrad)"/>
      <circle cx="356" cy="284" r="9" fill="url(#beadGrad)"/>
      <circle cx="336" cy="304" r="9" fill="url(#beadGrad)"/>
      <circle cx="312" cy="319" r="9" fill="url(#beadGrad)"/>
      <circle cx="285" cy="328" r="9" fill="url(#beadGrad)"/>
      <circle cx="256" cy="331" r="12" fill="url(#beadGrad)"/>
      <circle cx="227" cy="328" r="9" fill="url(#beadGrad)"/>
      <circle cx="200" cy="319" r="9" fill="url(#beadGrad)"/>
      <circle cx="176" cy="304" r="9" fill="url(#beadGrad)"/>
      <circle cx="156" cy="284" r="9" fill="url(#beadGrad)"/>
      <circle cx="141" cy="260" r="9" fill="url(#beadGrad)"/>
      <circle cx="132" cy="233" r="9" fill="url(#beadGrad)"/>
      <circle cx="130" cy="205" r="9" fill="url(#beadGrad)"/>
      <circle cx="135" cy="177" r="9" fill="url(#beadGrad)"/>
      <circle cx="146" cy="150" r="9" fill="url(#beadGrad)"/>
      <circle cx="162" cy="126" r="9" fill="url(#beadGrad)"/>
      <circle cx="182" cy="107" r="9" fill="url(#beadGrad)"/>
      <circle cx="205" cy="92" r="9" fill="url(#beadGrad)"/>
      <circle cx="230" cy="83" r="9" fill="url(#beadGrad)"/>
      <!-- Pendant Cross hanging from the Rosary -->
      <rect x="251" y="345" width="10" height="90" rx="3" fill="url(#beadGrad)"/>
      <rect x="231" y="368" width="50" height="10" rx="3" fill="url(#beadGrad)"/>
    </svg>`
  },
  {
    id: 'coptic-cross',
    nameAr: 'الصليب القبطي المنير',
    nameEn: 'Radiant Coptic Cross',
    bg: '#030712',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="bgCopt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="50%" stop-color="#1E1B4B"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
        <linearGradient id="gldCopt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="50%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#bgCopt)"/>
      <!-- Outer Decorative Halo -->
      <circle cx="256" cy="256" r="150" fill="none" stroke="url(#gldCopt)" stroke-width="2.5" stroke-dasharray="8,6" opacity="0.4"/>
      <!-- Central Coptic Cross Core -->
      <rect x="240" y="116" width="32" height="280" rx="6" fill="url(#gldCopt)"/>
      <rect x="116" y="240" width="280" height="32" rx="6" fill="url(#gldCopt)"/>
      <!-- Coptic 3-Point Finials (12 Apostles) -->
      <!-- Top finials -->
      <circle cx="240" cy="110" r="7" fill="#FEF08A"/>
      <circle cx="256" cy="98" r="9" fill="#FEF08A"/>
      <circle cx="272" cy="110" r="7" fill="#FEF08A"/>
      <!-- Bottom finials -->
      <circle cx="240" cy="402" r="7" fill="#FEF08A"/>
      <circle cx="256" cy="414" r="9" fill="#FEF08A"/>
      <circle cx="272" cy="402" r="7" fill="#FEF08A"/>
      <!-- Left finials -->
      <circle cx="110" cy="240" r="7" fill="#FEF08A"/>
      <circle cx="98" cy="256" r="9" fill="#FEF08A"/>
      <circle cx="110" cy="272" r="7" fill="#FEF08A"/>
      <!-- Right finials -->
      <circle cx="402" cy="240" r="7" fill="#FEF08A"/>
      <circle cx="414" cy="256" r="9" fill="#FEF08A"/>
      <circle cx="402" cy="272" r="7" fill="#FEF08A"/>
      <!-- Center Rosette -->
      <circle cx="256" cy="256" r="28" fill="#1E1B4B" stroke="url(#gldCopt)" stroke-width="3"/>
      <circle cx="256" cy="256" r="14" fill="#FEF08A"/>
    </svg>`
  },
  {
    id: 'holy-bible',
    nameAr: 'الكتاب المقدس والإنجيل الشريف',
    nameEn: 'Holy Bible & Gospel',
    bg: '#1E1B4B',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="bgBible" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="100%" stop-color="#1E1B4B"/>
        </linearGradient>
        <linearGradient id="gldBible" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="100%" stop-color="#B45309"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#bgBible)"/>
      <!-- Bible Cover (Deep Burgundy / Gold) -->
      <rect x="130" y="120" width="252" height="300" rx="20" fill="#450A0A" stroke="url(#gldBible)" stroke-width="4"/>
      <!-- Bible Spine -->
      <rect x="130" y="120" width="30" height="300" rx="10" fill="#292524"/>
      <!-- Gold Embossed Holy Cross on Cover -->
      <rect x="260" y="190" width="20" height="150" rx="4" fill="url(#gldBible)"/>
      <rect x="220" y="235" width="100" height="20" rx="4" fill="url(#gldBible)"/>
      <!-- Gold Corner Ornaments -->
      <circle cx="180" cy="150" r="5" fill="url(#gldBible)"/>
      <circle cx="360" cy="150" r="5" fill="url(#gldBible)"/>
      <circle cx="180" cy="390" r="5" fill="url(#gldBible)"/>
      <circle cx="360" cy="390" r="5" fill="url(#gldBible)"/>
      <!-- Silk Bookmark Ribbon -->
      <path d="M265 420 L265 455 L275 445 L285 455 L285 420 Z" fill="#DC2626"/>
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

  // Root or JesusPrayerApp folder
  const appFolder = loaded.folder("JesusPrayerApp") || loaded.folder("JesusPrayer") || loaded.folder("PrayerApp") || loaded;
  const appRes = appFolder?.folder("app")?.folder("src")?.folder("main")?.folder("res");
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
    appFolder?.file("playstore-icon.png", await blobToBuffer(icons.icon512));
  }

  return await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}
