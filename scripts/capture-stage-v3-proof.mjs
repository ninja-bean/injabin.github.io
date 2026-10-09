import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runProof() {
  const outDir = path.join(process.cwd(), 'proof', 'stage-v3');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  // 1. Desktop captures
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Ensure Light theme first
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if (isDark) {
    const themeBtn = page.locator('header button[aria-label*="mode" i]').first();
    await themeBtn.click();
    await page.waitForTimeout(400);
  }

  // Scroll to stage
  const stageBox = page.locator('#projects .border-2.border-ink.bg-paper').first();
  await stageBox.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const tabs = page.locator('#projects [role="tablist"] button[role="tab"]');
  const count = await tabs.count();

  // Capture all 6 tabs in Light Mode
  console.log('Capturing all tabs in Light mode...');
  for (let i = 0; i < count; i++) {
    await tabs.nth(i).click();
    await page.waitForTimeout(1000);
    const filename = `desktop-light-tab-0${i + 1}.png`;
    await stageBox.screenshot({ path: path.join(outDir, filename) });
    console.log(`Saved: ${filename}`);
  }

  // Switch to Dark mode by clicking theme button in header before hiding header
  console.log('Switching to Dark mode...');
  const themeToggle = page.locator('header button[aria-label*="mode" i]').first();
  await themeToggle.scrollIntoViewIfNeeded();
  await themeToggle.click();
  await page.waitForTimeout(600);

  await stageBox.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Capture all 6 tabs in Dark Mode
  for (let i = 0; i < count; i++) {
    await tabs.nth(i).click();
    await page.waitForTimeout(1000);
    const filename = `desktop-dark-tab-0${i + 1}.png`;
    await stageBox.screenshot({ path: path.join(outDir, filename) });
    console.log(`Saved: ${filename}`);
  }

  // 2. Mobile Viewport (390x844)
  console.log('Capturing mobile viewports...');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  const mobileStageBox = mobilePage.locator('#projects .border-2.border-ink.bg-paper').first();
  await mobileStageBox.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(500);

  // Tab 03 (AquaSweep) on mobile
  const mTabs = mobilePage.locator('#projects [role="tablist"] button[role="tab"]');
  await mTabs.nth(2).click();
  await mobilePage.waitForTimeout(1000);
  await mobileStageBox.screenshot({ path: path.join(outDir, 'mobile-light-aquasweep.png') });

  // Tab 06 (VTOL Drone) on mobile
  await mTabs.nth(5).click();
  await mobilePage.waitForTimeout(1000);
  await mobileStageBox.screenshot({ path: path.join(outDir, 'mobile-light-vtoldrone.png') });

  console.log('Proof captures completed successfully!');
  await browser.close();
}

runProof().catch(err => {
  console.error('Error during proof captures:', err);
  process.exit(1);
});
