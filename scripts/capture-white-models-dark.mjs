import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function captureWhiteModelsProof() {
  const outDir = path.join(process.cwd(), 'proof', 'white_models_dark');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Set Dark Theme in Zustand store & localStorage
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    const store = JSON.parse(localStorage.getItem('injabin-portfolio-settings') || '{}');
    store.state = { ...store.state, theme: 'dark' };
    localStorage.setItem('injabin-portfolio-settings', JSON.stringify(store));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Hide sticky header momentarily for clean, unclipped element captures
  await page.evaluate(() => {
    const h = document.querySelector('header');
    if (h) h.style.display = 'none';
  });

  const stageBox = page.locator('#projects .border-2.border-ink.bg-paper').first();
  await stageBox.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const tabs = page.locator('#projects [role="tablist"] button[role="tab"]');
  const count = await tabs.count();
  console.log(`Found ${count} tabs`);

  for (let i = 0; i < count; i++) {
    await tabs.nth(i).click();
    await page.waitForTimeout(1500); // Wait for transition & render
    const filename = `0${i + 1}-tab-dark-white-model.png`;
    await stageBox.screenshot({ path: path.join(outDir, filename) });
    console.log(`Saved ${filename}`);
  }

  // Also take a screenshot of the entire projects section
  const projectsSection = page.locator('#projects');
  await projectsSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await projectsSection.screenshot({ path: path.join(outDir, '00-full-projects-section-dark.png') });
  console.log('Saved 00-full-projects-section-dark.png');

  await browser.close();
  console.log('Finished capturing all proofs.');
}

captureWhiteModelsProof().catch(console.error);
