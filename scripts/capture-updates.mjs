import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function captureUpdates() {
  const outDir = path.join(process.cwd(), 'proof', 'updates');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // 1. Ensure Light Mode
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if (isDark) {
    await page.locator('header button[aria-label*="mode" i]').first().click();
    await page.waitForTimeout(400);
  }

  // 1a. About Section Light
  const aboutSection = page.locator('#about');
  await aboutSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await aboutSection.screenshot({ path: path.join(outDir, 'about-section-light.png') });
  console.log('Saved: about-section-light.png');

  // 1b. Footer Section Light
  const footer = page.locator('footer');
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await footer.screenshot({ path: path.join(outDir, 'footer-section-light.png') });
  console.log('Saved: footer-section-light.png');

  // 2. Switch to Dark Mode
  console.log('Switching to Dark Mode ...');
  await page.locator('header button[aria-label*="mode" i]').first().click();
  await page.waitForTimeout(500);

  // 2a. About Section Dark
  await aboutSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await aboutSection.screenshot({ path: path.join(outDir, 'about-section-dark.png') });
  console.log('Saved: about-section-dark.png');

  // 2b. Footer Section Dark
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await footer.screenshot({ path: path.join(outDir, 'footer-section-dark.png') });
  console.log('Saved: footer-section-dark.png');

  await page.close();
  await browser.close();
  console.log('All update proofs captured successfully!');
}

captureUpdates().catch((err) => {
  console.error('Error in captureUpdates:', err);
  process.exit(1);
});
