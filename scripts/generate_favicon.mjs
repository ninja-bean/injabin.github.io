import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

function pngToIco(pngBuffer, size = 32) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(1, 4); // 1 image

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // Width
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // Height
  entry.writeUInt8(0, 2); // Palette
  entry.writeUInt8(0, 3); // Reserved
  entry.writeUInt16LE(1, 4); // Color planes
  entry.writeUInt16LE(32, 6); // Bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // Image size in bytes
  entry.writeUInt32LE(22, 12); // Offset of image data (6 + 16)

  return Buffer.concat([header, entry, pngBuffer]);
}

async function generateFavicon() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } });

  // The beloved original design: Matte Ink box, inner paper border, Jost 900 IA, red Bauhaus accent
  const html = `
<!DOCTYPE html>
<html>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 512px;
      height: 512px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      overflow: hidden;
    }
    .logo-box {
      width: 480px;
      height: 480px;
      background: #121212;
      border: 24px solid #121212;
      box-shadow: inset 0 0 0 8px #F5F5F0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .text {
      font-family: 'Jost', sans-serif;
      font-weight: 900;
      font-size: 270px;
      color: #F5F5F0;
      line-height: 1;
      letter-spacing: -16px;
      margin-left: -12px;
      user-select: none;
    }
    .accent {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
      background: #E10600;
    }
  </style>
</head>
<body>
  <div class="logo-box">
    <div class="accent"></div>
    <span class="text">IA</span>
  </div>
</body>
</html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(1000); // Wait for Jost font

  const outDir = path.join(process.cwd(), 'public');
  const proofDir = path.join(process.cwd(), 'proof');

  // 1. Generate 512x512 master PNG
  const logoEl = page.locator('.logo-box');
  await logoEl.screenshot({ path: path.join(outDir, 'favicon.png') });
  await logoEl.screenshot({ path: path.join(proofDir, 'favicon_preview.png') });

  // 2. Generate apple-touch-icon.png (180x180)
  const pageApple = await browser.newPage({ viewport: { width: 180, height: 180 } });
  await pageApple.setContent(html
    .replace('480px', '168px')
    .replace('480px', '168px')
    .replace('24px solid', '8px solid')
    .replace('8px #F5F5F0', '3px #F5F5F0')
    .replace('270px', '95px')
    .replace('-16px', '-5px')
    .replace('-12px', '-4px')
    .replace('32px', '12px')
    .replace('32px', '12px')
    .replace('20px', '8px')
    .replace('20px', '8px')
  );
  await pageApple.waitForTimeout(500);
  await pageApple.locator('.logo-box').screenshot({ path: path.join(outDir, 'apple-touch-icon.png') });

  // 3. Generate 32x32 PNG and convert to binary ICO
  const page32 = await browser.newPage({ viewport: { width: 32, height: 32 } });
  await page32.setContent(html
    .replace('480px', '30px')
    .replace('480px', '30px')
    .replace('24px solid', '1px solid')
    .replace('8px #F5F5F0', '1px #F5F5F0')
    .replace('270px', '17px')
    .replace('-16px', '-1px')
    .replace('-12px', '-1px')
    .replace('32px', '3px')
    .replace('32px', '3px')
    .replace('20px', '2px')
    .replace('20px', '2px')
  );
  await page32.waitForTimeout(500);
  const temp32Path = path.join(outDir, 'favicon-32.png');
  await page32.locator('.logo-box').screenshot({ path: temp32Path });

  const png32Buffer = fs.readFileSync(temp32Path);
  const icoBuffer = pngToIco(png32Buffer, 32);
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(process.cwd(), 'app', 'favicon.ico'), icoBuffer);
  fs.unlinkSync(temp32Path);

  // 4. Generate SVG matching the exact approved design with inner white border and red square accent
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" fill="#121212" />
  <rect x="3" y="3" width="58" height="58" fill="none" stroke="#F5F5F0" stroke-width="2" />
  <rect x="52" y="6" width="5" height="5" fill="#E10600" />
  <text x="31" y="44" font-family="'Jost', system-ui, sans-serif" font-weight="900" font-size="34" fill="#F5F5F0" text-anchor="middle" letter-spacing="-2">IA</text>
</svg>`;
  fs.writeFileSync(path.join(outDir, 'favicon.svg'), svgContent, 'utf-8');

  console.log('Original approved Bauhaus IA Favicon generated in all formats!');
  await browser.close();
}

generateFavicon().catch(console.error);
