import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function captureMatteBlackProof() {
  const outDir = path.join(process.cwd(), 'proof', 'matte_black');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Switch to Dark Mode
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if (!isDark) {
    await page.locator('header button[aria-label*="mode" i]').first().click();
    await page.waitForTimeout(500);
  }

  // 1. Hero Section (Rubik's cube with matte black background & graphite edges)
  const heroSection = page.locator('#hero');
  await heroSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await heroSection.screenshot({ path: path.join(outDir, '01-hero-dark-matte.png') });
  console.log('Saved: 01-hero-dark-matte.png');

  // 2. About Section (Matte background, new heading, new motto)
  const aboutSection = page.locator('#about');
  await aboutSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await aboutSection.screenshot({ path: path.join(outDir, '02-about-dark-matte.png') });
  console.log('Saved: 02-about-dark-matte.png');

  // 3. Featured Projects Stage (Plinths & 3D models with matte shading)
  const projectsSection = page.locator('#projects');
  await projectsSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await projectsSection.screenshot({ path: path.join(outDir, '03-projects-stage-dark-matte.png') });
  console.log('Saved: 03-projects-stage-dark-matte.png');

  // 4. Skills & Disciplines (Exploded blocks with relaxed graphite outlines)
  const skillsSection = page.locator('#skills');
  await skillsSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await skillsSection.screenshot({ path: path.join(outDir, '04-skills-dark-matte.png') });
  console.log('Saved: 04-skills-dark-matte.png');

  // 5. Footer (Matte background, logo buttons, copyright)
  const footer = page.locator('footer');
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await footer.screenshot({ path: path.join(outDir, '05-footer-dark-matte.png') });
  console.log('Saved: 05-footer-dark-matte.png');

  // 6. Verify Light Mode remains perfect
  console.log('Switching to Light Mode to verify ...');
  await page.locator('header button[aria-label*="mode" i]').first().click();
  await page.waitForTimeout(500);
  await heroSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await heroSection.screenshot({ path: path.join(outDir, '06-hero-light-perfect.png') });
  console.log('Saved: 06-hero-light-perfect.png');

  await page.close();
  await browser.close();
  console.log('All matte black proof captures finished successfully!');
}

captureMatteBlackProof().catch((err) => {
  console.error('Error in captureMatteBlackProof:', err);
  process.exit(1);
});
