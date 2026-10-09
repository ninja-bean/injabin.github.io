import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runContactProof() {
  const outDir = path.join(process.cwd(), 'proof', 'contact');
  const videoDir = path.join(outDir, 'video');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  // Route setup helper for mocking Web3Forms
  const setupMockRoute = async (page, delayMs = 0) => {
    await page.route('https://api.web3forms.com/submit', async (route) => {
      if (delayMs > 0) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Message submitted successfully' }),
      });
    });
  };

  const measureCardHeights = async (page, viewportLabel) => {
    const heights = await page.evaluate(() => {
      const contact = document.getElementById('contact');
      if (!contact) return null;
      // The two cards are the two children of the grid container inside contact
      const grid = contact.querySelector('.grid');
      if (!grid || grid.children.length < 2) return null;
      const leftCard = grid.children[0];
      const rightCard = grid.children[1];
      const leftRect = leftCard.getBoundingClientRect();
      const rightRect = rightCard.getBoundingClientRect();
      return {
        left: { width: Math.round(leftRect.width), height: Math.round(leftRect.height) },
        right: { width: Math.round(rightRect.width), height: Math.round(rightRect.height) },
        diff: Math.abs(Math.round(leftRect.height) - Math.round(rightRect.height)),
      };
    });
    console.log(`[Height Measurement - ${viewportLabel}]:`, JSON.stringify(heights));
    return heights;
  };

  // ---------------------------------------------------------------
  // 1. DESKTOP 1440x900 CAPTURES
  // ---------------------------------------------------------------
  console.log('\n=== 1. Desktop 1440x900 Captures ===');
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await setupMockRoute(page, 1500);
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Ensure Light mode
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (isDark) {
      await page.locator('header button[aria-label*="mode" i]').first().click();
      await page.waitForTimeout(300);
    }

    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    await measureCardHeights(page, 'Desktop 1440 (Light)');

    // 1a. Idle Light
    await contactSection.screenshot({ path: path.join(outDir, 'desktop-1440-light-idle.png') });
    console.log('Saved: desktop-1440-light-idle.png');

    // 1b. Validation Error Light
    await page.locator('#contact form button[type="submit"]').click();
    await page.waitForTimeout(300);
    await contactSection.screenshot({ path: path.join(outDir, 'desktop-1440-light-error.png') });
    console.log('Saved: desktop-1440-light-error.png');

    // 1c. Sending Light
    await page.locator('#contact-name').fill('Grace Hopper');
    await page.locator('#contact-email').fill('grace@navy.mil');
    await page.locator('#contact-message').fill('Testing the systems architecture and contact dispatch flow.');
    
    const submitPromise = page.locator('#contact form button[type="submit"]').click();
    await page.waitForTimeout(200);
    await contactSection.screenshot({ path: path.join(outDir, 'desktop-1440-light-sending.png') });
    console.log('Saved: desktop-1440-light-sending.png');

    // 1d. Success Light
    await submitPromise;
    await page.waitForTimeout(1600);
    await contactSection.screenshot({ path: path.join(outDir, 'desktop-1440-light-success.png') });
    console.log('Saved: desktop-1440-light-success.png');

    await page.close();
  }

  // Desktop Dark Mode
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await setupMockRoute(page, 1500);
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Switch to Dark Mode
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (!isDark) {
      await page.locator('header button[aria-label*="mode" i]').first().click();
      await page.waitForTimeout(400);
    }

    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    await measureCardHeights(page, 'Desktop 1440 (Dark)');

    // Dark Idle
    await contactSection.screenshot({ path: path.join(outDir, 'desktop-1440-dark-idle.png') });
    console.log('Saved: desktop-1440-dark-idle.png');

    // Dark Error
    await page.locator('#contact form button[type="submit"]').click();
    await page.waitForTimeout(300);
    await contactSection.screenshot({ path: path.join(outDir, 'desktop-1440-dark-error.png') });
    console.log('Saved: desktop-1440-dark-error.png');

    // Dark Sending
    await page.locator('#contact-name').fill('Ada Lovelace');
    await page.locator('#contact-email').fill('ada@analytical.engine');
    await page.locator('#contact-message').fill('Computational calculus and algorithmic architectures inquiry.');
    
    const submitPromise = page.locator('#contact form button[type="submit"]').click();
    await page.waitForTimeout(200);
    await contactSection.screenshot({ path: path.join(outDir, 'desktop-1440-dark-sending.png') });
    console.log('Saved: desktop-1440-dark-sending.png');

    // Dark Success
    await submitPromise;
    await page.waitForTimeout(1600);
    await contactSection.screenshot({ path: path.join(outDir, 'desktop-1440-dark-success.png') });
    console.log('Saved: desktop-1440-dark-success.png');

    await page.close();
  }

  // ---------------------------------------------------------------
  // 2. TABLET 820x1180 CAPTURES
  // ---------------------------------------------------------------
  console.log('\n=== 2. Tablet 820x1180 Captures ===');
  {
    const page = await browser.newPage({ viewport: { width: 820, height: 1180 } });
    await setupMockRoute(page, 500);
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Light mode check
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (isDark) {
      await page.locator('header button[aria-label*="mode" i]').first().click();
      await page.waitForTimeout(300);
    }

    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    await measureCardHeights(page, 'Tablet 820 (Light)');

    await contactSection.screenshot({ path: path.join(outDir, 'tablet-820-light-idle.png') });
    console.log('Saved: tablet-820-light-idle.png');

    // Submit for success
    await page.locator('#contact-name').fill('Katherine Johnson');
    await page.locator('#contact-email').fill('katherine@nasa.gov');
    await page.locator('#contact-message').fill('Orbital mechanics calculation verification.');
    await page.locator('#contact form button[type="submit"]').click();
    await page.waitForTimeout(1000);
    await contactSection.screenshot({ path: path.join(outDir, 'tablet-820-light-success.png') });
    console.log('Saved: tablet-820-light-success.png');

    // Dark mode tablet
    await page.locator('header button[aria-label*="mode" i]').first().click();
    await page.waitForTimeout(400);
    await contactSection.scrollIntoViewIfNeeded();
    await contactSection.screenshot({ path: path.join(outDir, 'tablet-820-dark-success.png') });
    console.log('Saved: tablet-820-dark-success.png');

    await page.locator('#contact button:has-text("Send another")').click();
    await page.waitForTimeout(300);
    await contactSection.screenshot({ path: path.join(outDir, 'tablet-820-dark-idle.png') });
    console.log('Saved: tablet-820-dark-idle.png');

    await page.close();
  }

  // ---------------------------------------------------------------
  // 3. MOBILE 390x844 CAPTURES
  // ---------------------------------------------------------------
  console.log('\n=== 3. Mobile 390x844 Captures ===');
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await setupMockRoute(page, 500);
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Light mode check
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (isDark) {
      await page.locator('header button[aria-label*="mode" i]').first().click();
      await page.waitForTimeout(300);
    }

    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    await measureCardHeights(page, 'Mobile 390 (Light)');

    await contactSection.screenshot({ path: path.join(outDir, 'mobile-390-light-idle.png') });
    console.log('Saved: mobile-390-light-idle.png');

    // Submit for success
    await page.locator('#contact-name').fill('Alan Turing');
    await page.locator('#contact-email').fill('alan@bletchley.ac.uk');
    await page.locator('#contact-message').fill('Enigma cryptoanalysis machine design.');
    await page.locator('#contact form button[type="submit"]').click();
    await page.waitForTimeout(1000);
    await contactSection.screenshot({ path: path.join(outDir, 'mobile-390-light-success.png') });
    console.log('Saved: mobile-390-light-success.png');

    // Dark mode mobile
    await page.locator('header button[aria-label*="mode" i]').first().click();
    await page.waitForTimeout(400);
    await contactSection.scrollIntoViewIfNeeded();
    await contactSection.screenshot({ path: path.join(outDir, 'mobile-390-dark-success.png') });
    console.log('Saved: mobile-390-dark-success.png');

    await page.locator('#contact button:has-text("Send another")').click();
    await page.waitForTimeout(300);
    await contactSection.screenshot({ path: path.join(outDir, 'mobile-390-dark-idle.png') });
    console.log('Saved: mobile-390-dark-idle.png');

    await page.close();
  }

  // ---------------------------------------------------------------
  // 4. FEATURED PROJECTS VS SKILLS SIZE COMPARISON
  // ---------------------------------------------------------------
  console.log('\n=== 4. Featured Projects & Skills Size Capture ===');
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const sizes = await page.evaluate(() => {
      const projCanvas = document.querySelector('#projects .border-2.border-ink.bg-paper');
      const skillCanvas = document.querySelector('#skills .border-2.border-ink.bg-paper');
      return {
        projectsStageHeight: projCanvas ? Math.round(projCanvas.getBoundingClientRect().height) : null,
        skillsStageHeight: skillCanvas ? Math.round(skillCanvas.getBoundingClientRect().height) : null,
      };
    });
    console.log('[Stage Size Comparison]:', JSON.stringify(sizes));

    const projectsStage = page.locator('#projects .border-2.border-ink.bg-paper').first();
    await projectsStage.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await projectsStage.screenshot({ path: path.join(outDir, 'featured-projects-stage-matches-skills.png') });
    console.log('Saved: featured-projects-stage-matches-skills.png');

    const skillsStage = page.locator('#skills .border-2.border-ink.bg-paper').first();
    await skillsStage.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await skillsStage.screenshot({ path: path.join(outDir, 'skills-stage-reference.png') });
    console.log('Saved: skills-stage-reference.png');

    await page.close();
  }

  await browser.close();
  console.log('\nAll contact and stage screenshot captures completed successfully!');
}

runContactProof().catch((err) => {
  console.error('Error in proof capture:', err);
  process.exit(1);
});
