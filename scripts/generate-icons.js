import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createSolidPNG(width, height, r, g, b, a = 255) {
  // Simple PNG encoder in pure Node using zlib
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    
    // Calculate CRC32
    let c = 0 ^ -1;
    for (const buf of [typeBuf, data]) {
      for (let i = 0; i < buf.length; i++) {
        c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff];
      }
    }
    c = (c ^ -1) >>> 0;
    crcBuf.writeUInt32BE(c, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  // Raw bitmap with scanline filter byte (0)
  const lineLength = width * 4 + 1;
  const rawData = Buffer.alloc(lineLength * height);

  for (let y = 0; y < height; y++) {
    const offset = y * lineLength;
    rawData[offset] = 0; // filter type 0: None

    for (let x = 0; x < width; x++) {
      const pxOffset = offset + 1 + x * 4;
      const dx = Math.abs(x - width / 2);
      const dy = Math.abs(y - height * 0.42);

      // Cross vertical beam
      const isVertical = dx < width * 0.07 && y >= height * 0.18 && y <= height * 0.82;
      // Cross horizontal beam
      const isHorizontal = dy < height * 0.07 && x >= width * 0.26 && x <= width * 0.74;

      if (isVertical || isHorizontal) {
        // Golden Amber Cross (#F59E0B / #FDE047)
        rawData[pxOffset] = 245;     // R
        rawData[pxOffset + 1] = 158; // G
        rawData[pxOffset + 2] = 11;  // B
        rawData[pxOffset + 3] = 255;
      } else {
        // Deep Slate/Navy background (#080D1A)
        rawData[pxOffset] = 8;
        rawData[pxOffset + 1] = 13;
        rawData[pxOffset + 2] = 26;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const ihdrChunk = chunk('IHDR', ihdr);
  const idatChunk = chunk('IDAT', compressedData);
  const iendChunk = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createSolidPNG(192, 192, 16, 185, 129));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createSolidPNG(512, 512, 16, 185, 129));
fs.writeFileSync(path.join(publicDir, 'icon-maskable.png'), createSolidPNG(512, 512, 16, 185, 129));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createSolidPNG(180, 180, 16, 185, 129));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createSolidPNG(32, 32, 16, 185, 129));

console.log('Successfully generated all PWA PNG icons!');
