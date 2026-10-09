import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function recordVideo() {
  const videoDir = path.join(process.cwd(), 'proof', 'stage-v3', 'video');
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

  // Hide fixed header
  await page.evaluate(() => {
    const h = document.querySelector('header');
    if (h) h.style.display = 'none';
  });

  const stageBox = page.locator('#projects .border-2.border-ink.bg-paper').first();
  await stageBox.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Jump to tab 03 (AquaSweep) to demonstrate its 10-second dwell & paddle wheel animations
  const tabs = page.locator('#projects [role="tablist"] button[role="tab"]');
  await tabs.nth(2).click();
  console.log('Watching AquaSweep dwell (10s) ...');
  await page.waitForTimeout(11500); // 10s dwell + 1.4s transition to NextNest

  // Jump to tab 06 (VTOL Drone) to demonstrate CAD UAV model
  await tabs.nth(5).click();
  console.log('Watching VTOL Drone dwell (10s) ...');
  await page.waitForTimeout(11500); // 10s dwell + 1.4s transition to AlgoArena

  console.log('Closing page to finalize video...');
  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(videoDir);
  const webmFile = files.find(f => f.endsWith('.webm') && f !== 'stage-v3-10s-demo.webm');
  if (webmFile) {
    const origPath = path.join(videoDir, webmFile);
    const targetPath = path.join(videoDir, 'stage-v3-10s-demo.webm');
    if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
    fs.renameSync(origPath, targetPath);
    console.log(`Video saved to: ${targetPath}`);
  }
}

recordVideo().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
