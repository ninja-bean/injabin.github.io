import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function captureRubiksProof() {
  const outDir = path.join(process.cwd(), 'proof', 'rubiks_color_accurate');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Capture Light Mode Hero Cube
  const heroCube = page.locator('#hero canvas').first();
  await heroCube.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '01-hero-cube-light.png') });
  console.log('Saved: 01-hero-cube-light.png');

  // 2. Switch to Dark Mode and capture Hero Cube
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    const store = JSON.parse(localStorage.getItem('injabin-portfolio-settings') || '{}');
    store.state = { ...store.state, theme: 'dark' };
    localStorage.setItem('injabin-portfolio-settings', JSON.stringify(store));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const darkCube = page.locator('#hero canvas').first();
  await darkCube.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '02-hero-cube-dark.png') });
  console.log('Saved: 02-hero-cube-dark.png');

  await browser.close();
  console.log('Rubiks proof completed.');
}

captureRubiksProof().catch(console.error);
