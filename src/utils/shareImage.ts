import { PrayerItem } from '../types/christianPrayer';

export interface GeneratePrayerCardOptions {
  text: string;
  categoryLabel?: string;
  reference?: string;
  fontFamily?: string;
  prayer?: PrayerItem;
  language?: 'ar' | 'en';
}

export async function generatePrayerCardImage(
  optionsOrText: string | GeneratePrayerCardOptions,
  legacyCategoryLabel?: string,
  legacyReference?: string,
  legacyFontFamily: string = 'Amiri'
): Promise<string> {
  let text = '';
  let reference = '';
  let fontFamily = 'Amiri';
  let prayer: PrayerItem | undefined;
  let language: 'ar' | 'en' = 'ar';

  if (typeof optionsOrText === 'string') {
    text = optionsOrText;
    reference = legacyReference || '';
    fontFamily = legacyFontFamily || 'Amiri';
  } else {
    text = optionsOrText.text;
    reference = optionsOrText.reference || '';
    fontFamily = optionsOrText.fontFamily || 'Amiri';
    prayer = optionsOrText.prayer;
    language = optionsOrText.language || 'ar';
  }

  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1350; // 4:5 aspect ratio optimized for high-res mobile sharing
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  // Background Gradient (Deep Spiritual Slate / Dark Navy)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#040714');
  bgGrad.addColorStop(0.5, '#0B132B');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle golden atmospheric radial glow in center
  const glow = ctx.createRadialGradient(width / 2, height / 2, 60, width / 2, height / 2, 500);
  glow.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
  glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Elegant outer golden border with rounded corners
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  // Inner fine gold accent border
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(74, 74, width - 148, height - 148);

  const cx = width / 2;

  // Top Christian Cross Motif
  const cy = 220;
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 6;
  ctx.beginPath();
  // Vertical beam
  ctx.moveTo(cx, cy - 50);
  ctx.lineTo(cx, cy + 50);
  // Horizontal beam
  ctx.moveTo(cx - 32, cy - 14);
  ctx.lineTo(cx + 32, cy - 14);
  ctx.stroke();

  // Cross center jewel accent
  ctx.fillStyle = '#FBBF24';
  ctx.beginPath();
  ctx.arc(cx, cy - 14, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // (No extra text below cross per user specification)

  // Prayer / Quote Main Text
  ctx.fillStyle = '#FBBF24';
  const fontName = fontFamily === 'cairo' ? 'Cairo' : fontFamily === 'scheherazade' ? 'Scheherazade New' : 'Amiri';
  ctx.font = `bold 56px '${fontName}', serif`;
  ctx.textAlign = 'center';

  // Multi-line wrap
  const maxLineWidth = width - 260;
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = `${currentLine} ${word}`;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxLineWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Compute vertical centering for main prayer text
  const lineHeight = 95;
  const textTotalHeight = lines.length * lineHeight;
  // Position text nicely in the middle section (between y=350 and y=900)
  const textCenterY = 580;
  const startY = textCenterY - (textTotalHeight / 2) + 40;

  lines.forEach((line, index) => {
    ctx.fillText(`"${line}"`, cx, startY + (index * lineHeight));
  });

  // Calculate position right below the prayer text
  const belowPrayerY = startY + (lines.length * lineHeight) + 30;

  // ========================================================
  // Sub-text directly below prayer text:
  // "لو آيه يكون الشاهد بتاعها موجود تحتيها ولو اقوال اباء يكون مكتوب تحتيها اقوال الاب فلان(فلان=اسم الاب)"
  // ========================================================
  const isEn = language === 'en';
  const isPatristic = 
    prayer?.sourceType === 'patristic' || 
    Boolean(prayer?.fatherNameAr) ||
    (!isEn && (prayer?.referenceAr?.includes('أقوال') || prayer?.referenceAr?.includes('الأب')));

  const isVerse = 
    prayer?.sourceType === 'verse' || 
    (!isPatristic && (
      prayer?.referenceAr?.includes('مزمور') ||
      prayer?.referenceAr?.includes('يوحنا') ||
      prayer?.referenceAr?.includes('فيلبي') ||
      prayer?.referenceAr?.includes('متى') ||
      prayer?.referenceAr?.includes('لوقا') ||
      prayer?.referenceEn?.includes('Psalm') ||
      prayer?.referenceEn?.includes('John') ||
      prayer?.referenceEn?.includes('Philippians') ||
      prayer?.referenceEn?.includes('Matthew')
    ));

  let subText = '';

  if (isVerse) {
    // 1. Verse: Display the biblical witness (الشاهد)
    const ref = (isEn ? prayer?.referenceEn : prayer?.referenceAr) || reference;
    if (ref) {
      subText = isEn ? `— ${ref} —` : `— ${ref} —`;
    }
  } else if (isPatristic) {
    // 2. Church Fathers sayings: "أقوال الأب فلان"
    const rawFatherName = (isEn ? prayer?.fatherNameEn : prayer?.fatherNameAr) || '';
    if (isEn) {
      const cleanFatherEn = rawFatherName.replace(/^(Sayings of\s+|Father\s+)/i, '');
      subText = `— Sayings of Father ${cleanFatherEn || 'the Desert Fathers'} —`;
    } else {
      // Remove any duplicate "أقوال" or "الأب" if already present in the father's name
      const cleanFatherAr = rawFatherName
        .replace(/^أقوال\s+/, '')
        .replace(/^الأب\s+/, '')
        .trim();
      subText = `— أقوال الأب ${cleanFatherAr || 'أحد الآباء القديسين'} —`;
    }
  } else if (reference) {
    // Fallback for custom or arrow prayers with reference
    subText = `— ${reference} —`;
  }

  if (subText) {
    // Draw decorative pill badge or elegant gold text
    ctx.font = `600 32px 'Cairo', 'Amiri', sans-serif`;
    const textWidth = ctx.measureText(subText).width;
    
    // Subtle background for the reference pill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    const pillHeight = 54;
    const pillPadding = 36;
    const pillY = belowPrayerY - 36;
    ctx.beginPath();
    ctx.roundRect(
      cx - (textWidth / 2) - pillPadding,
      pillY,
      textWidth + (pillPadding * 2),
      pillHeight,
      27
    );
    ctx.fill();

    // Subtle golden border on pill
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pill text
    ctx.fillStyle = '#FCD34D';
    ctx.textAlign = 'center';
    ctx.fillText(subText, cx, belowPrayerY);
  }

  // ========================================================
  // Bottom Branding (من تحت خالص / أسفل الصورة):
  // "ومن تحت خالص(اسفل الصورة) زي ما كان في الاول اسم البرنامج بال english Jesus Prayer وبالعربي صلاه يسوع"
  // ========================================================
  const footerDividerY = height - 170;
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 140, footerDividerY);
  ctx.lineTo(cx + 140, footerDividerY);
  ctx.stroke();

  // Small diamond center accent on the divider line
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(cx, footerDividerY, 3, 0, Math.PI * 2);
  ctx.fill();

  // Line 1: Arabic App Name
  ctx.fillStyle = '#FBBF24';
  ctx.font = `bold 32px 'Cairo', 'Amiri', sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('صلاة يسوع', cx, height - 120);

  // Line 2: English App Name
  ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
  ctx.font = `600 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
  ctx.fillText('Jesus Prayer', cx, height - 90);

  return canvas.toDataURL('image/png');
}
