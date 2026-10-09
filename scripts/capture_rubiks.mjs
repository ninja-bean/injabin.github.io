import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = process.env.TEST_URL || 'http://localhost:3000';
const out = path.join(process.cwd(), 'proof', 'hero-rubiks');
fs.mkdirSync(out, { recursive: true });

console.log(`Starting specialized Rubik's Cube proof capture against ${BASE}...`);

const sizes = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

// 1. Capture Dev 50-Cycle Test (?cubeTest=1)
{
  console.log('Testing dev 50-cycle verification with ?cubeTest=1...');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: sizes.desktop });
  const logs = [];
  page.on('console', (msg) => logs.push(msg.text()));

  await page.goto(`${BASE}?cubeTest=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const passedLog = logs.find((l) => l.includes('50/50 test cycles PASSED'));
  console.log('Dev test log check:', passedLog ? 'PASSED: ' + passedLog : 'NOT FOUND in logs: ' + logs.join(' | '));
  await page.screenshot({ path: path.join(out, 'desktop-dev-test-50-cycles.png') });
  await browser.close();
}

// 2. Capture States across Viewports and Schemes
const browser = await chromium.launch();

for (const [viewportName, viewport] of Object.entries(sizes)) {
  for (const scheme of ['light', 'dark']) {
    console.log(`Capturing ${viewportName} - ${scheme}...`);
    const ctx = await browser.newContext({
      viewport,
      colorScheme: scheme,
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    if (scheme === 'dark') {
      await page.evaluate(() => document.documentElement.classList.add('dark'));
      await page.waitForTimeout(300);
    }

    // State 1: Scrambled on load
    await page.screenshot({ path: path.join(out, `${viewportName}-${scheme}-scrambled.png`) });

    // Trigger solve:
    // Cube wrapper button has role="button" aria-label="Solve the Rubik's cube"
    const cubeButton = page.locator('div[role="button"][aria-label*="Solve the Rubik"]');
    const box = await cubeButton.boundingBox();
    if (box) {
      // Hover at center of the 3D cube
      const targetX = box.x + box.width * 0.5;
      const targetY = box.y + box.height * 0.5;
      await page.mouse.move(targetX, targetY);

      // State 2: Mid-solve (~50%, after ~1.6s of solve animation)
      await page.waitForTimeout(1600);
      await page.screenshot({ path: path.join(out, `${viewportName}-${scheme}-mid-solve.png`) });

      // State 3: Fully solved (wait another 3.0s for all moves to finish)
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(out, `${viewportName}-${scheme}-solved.png`) });

      // Move mouse away to trigger un-hover
      await page.mouse.move(10, 10);
      await page.waitForTimeout(500);
    }

    await ctx.close();
  }
}

// 3. Reduced Motion Capture
{
  console.log('Capturing reduced motion...');
  const ctx = await browser.newContext({
    viewport: sizes.desktop,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scrambled
  await page.screenshot({ path: path.join(out, 'desktop-reduced-motion-scrambled.png') });

  // Instant solve via keyboard Space/Enter
  const cubeButton = page.locator('div[role="button"][aria-label*="Solve the Rubik"]');
  await cubeButton.focus();
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);

  // Solved
  await page.screenshot({ path: path.join(out, 'desktop-reduced-motion-solved.png') });
  await ctx.close();
}

// 4. Video Recording (15 seconds: idle rotation, hover-to-solve, un-hover-to-scramble)
{
  console.log('Recording 15-second screen recording...');
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: out, size: { width: 1280, height: 720 } },
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Initial mouse away (0 - 3s: idle rotation scrambled)
  await page.mouse.move(50, 50);
  console.log('- (0-3s): idle rotation while scrambled...');
  await page.waitForTimeout(3000);

  // Hover over cube center (3s - 8s: solving animation)
  const cubeButton = page.locator('div[role="button"][aria-label*="Solve the Rubik"]');
  const box = await cubeButton.boundingBox();
  if (box) {
    const cx = box.x + box.width * 0.5;
    const cy = box.y + box.height * 0.5;
    console.log('- (3-8s): hover to solve, moves animate...');
    await page.mouse.move(cx, cy);
    await page.waitForTimeout(5000);

    // Solved cube stays in view for 2s (8s - 10s: idle rotation resumes)
    console.log('- (8-10s): fully solved, idle rotation resumes...');
    await page.waitForTimeout(2000);

    // Un-hover: move mouse away (10s - 15s: 1.2s delay then scrambling animation)
    console.log('- (10-15s): un-hover, 1.2s pause, fresh re-scramble...');
    await page.mouse.move(50, 50);
    await page.waitForTimeout(5000);
  }

  await ctx.close();
}

await browser.close();

// 5. WebGL Disabled Run
{
  console.log('Running WebGL-disabled fallback check...');
  const noGpuBrowser = await chromium.launch({
    args: ['--disable-webgl', '--disable-3d-apis', '--disable-gpu'],
  });
  const noGpuCtx = await noGpuBrowser.newContext({ viewport: sizes.desktop });
  const noGpuPage = await noGpuCtx.newPage();
  await noGpuPage.goto(BASE, { waitUntil: 'networkidle' });
  await noGpuPage.waitForTimeout(1000);
  await noGpuPage.screenshot({ path: path.join(out, 'desktop-webgl-disabled.png') });
  await noGpuCtx.close();
  await noGpuBrowser.close();
}

// 6. Standardize Video File Name
const files = fs.readdirSync(out);
const webmFile = files.find((f) => f.endsWith('.webm') && f !== 'screen-recording.webm');
if (webmFile) {
  fs.renameSync(path.join(out, webmFile), path.join(out, 'screen-recording.webm'));
  console.log(`Video standardized to ${path.join(out, 'screen-recording.webm')}`);
}

console.log('Proof capture finished successfully!');
