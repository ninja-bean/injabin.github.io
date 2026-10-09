import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function main() {
  const outDir = path.join(process.cwd(), 'proof', 'phase-i');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll to projects section
  const vault = page.locator('#projects .border-2.border-ink.bg-paper').first();
  await vault.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Hide sticky header momentarily for pristine, unclipped element captures
  await page.evaluate(() => {
    const h = document.querySelector('header');
    if (h) h.style.display = 'none';
  });

  // Capture frame 1: initial stage state
  await vault.screenshot({ path: path.join(outDir, 'stage-frame-1.png') });
  console.log('Saved stage-frame-1.png');

  // Hover over the second project card in the grid to see it glide and lock into spotlight with full color
  const secondCard = page.locator('#projects article').nth(1); // Nexus Stock AI
  await secondCard.hover();
  await page.waitForTimeout(1200);
  await vault.screenshot({ path: path.join(outDir, 'stage-hover-lock-color.png') });
  console.log('Saved stage-hover-lock-color.png');

  // Unhover and let conveyor loop run for 4 seconds
  await page.mouse.move(0, 0);
  await page.waitForTimeout(4000);
  await vault.screenshot({ path: path.join(outDir, 'stage-conveyor-gliding.png') });
  console.log('Saved stage-conveyor-gliding.png');

  // Restore header and capture full section
  await page.evaluate(() => {
    const h = document.querySelector('header');
    if (h) h.style.display = '';
  });

  await browser.close();
  console.log('Done captures!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
