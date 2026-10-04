export async function generatePrayerCardImage(
  text: string,
  categoryLabel: string,
  reference?: string,
  fontFamily: string = 'Amiri'
): Promise<string> {
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1350; // 4:5 Instagram / Mobile sharing aspect ratio
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  // Background Gradient (Deep Slate / Dark Navy)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#040714');
  bgGrad.addColorStop(0.5, '#0B132B');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle golden atmospheric glow in center
  const glow = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 450);
  glow.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
  glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Elegant golden border with rounded corners
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(74, 74, width - 148, height - 148);

  // Top Christian Cross Motif
  const cx = width / 2;
  const cy = 210;
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 6;
  ctx.beginPath();
  // Vertical
  ctx.moveTo(cx, cy - 45);
  ctx.lineTo(cx, cy + 45);
  // Horizontal
  ctx.moveTo(cx - 28, cy - 15);
  ctx.lineTo(cx + 28, cy - 15);
  ctx.stroke();

  // Category Tag
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 32px Cairo, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`✝ ${categoryLabel}`, cx, 310);

  // Prayer Text
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

  const startY = height / 2 - (lines.length * 45);
  lines.forEach((line, index) => {
    ctx.fillText(`"${line}"`, cx, startY + (index * 90));
  });

  // Reference / Source if available
  if (reference) {
    ctx.fillStyle = '#F59E0B';
    ctx.font = '400 28px Cairo, sans-serif';
    ctx.fillText(`— ${reference} —`, cx, startY + (lines.length * 90) + 50);
  }

  // Footer branding
  ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
  ctx.font = '400 24px Cairo, sans-serif';
  ctx.fillText('صلوات يسوع والصلوات السهمية • Jesus Prayer App', cx, height - 100);

  return canvas.toDataURL('image/png');
}
