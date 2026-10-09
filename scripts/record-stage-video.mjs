import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function recordVideo() {
  const videoDir = path.join(process.cwd(), 'proof', 'stage-v2', 'video');
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll to stage box and hide fixed header for clean view
  await page.evaluate(() => {
    const h = document.querySelector('header');
    if (h) h.style.display = 'none';
  });

  const stageBox = page.locator('#projects .border-2.border-ink.bg-paper').first();
  await stageBox.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  console.log('Recording Stage Autoplay (12s) ...');
  // Dwell 1 + transition + Dwell 2: ~12s
  await page.waitForTimeout(12000);

  console.log('Interacting: Hovering over stage box to pause autoplay (5s) ...');
  await stageBox.hover({ position: { x: 300, y: 250 } });
  await page.waitForTimeout(5000);

  console.log('Interacting: Moving mouse away to resume (3s) ...');
  await page.mouse.move(50, 50);
  await page.waitForTimeout(3000);

  console.log('Interacting: Clicking Tab 06 (VTOL Drone) ...');
  const tabs = page.locator('#projects [role="tablist"] button[role="tab"]');
  await tabs.nth(5).click();
  await page.waitForTimeout(6000);

  console.log('Interacting: Keyboard navigation (ArrowLeft, ArrowRight) ...');
  await tabs.nth(5).focus();
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(4000);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(4000);

  console.log('Finishing remaining loop time (6s) ...');
  await page.waitForTimeout(6000);

  console.log('Closing page and context to finalize video...');
  await page.close();
  await context.close();
  await browser.close();

  // Find recorded video and rename to standard name
  const files = fs.readdirSync(videoDir);
  const webmFile = files.find(f => f.endsWith('.webm') && f !== 'stage-v2-autoplay-interaction.webm');
  if (webmFile) {
    const originalPath = path.join(videoDir, webmFile);
    const targetPath = path.join(videoDir, 'stage-v2-autoplay-interaction.webm');
    if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
    fs.renameSync(originalPath, targetPath);
    console.log(`Video recorded successfully: ${targetPath}`);
  } else {
    console.log(`Video directory contains:`, files);
  }
}

recordVideo().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
