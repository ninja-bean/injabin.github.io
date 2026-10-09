import { chromium } from 'playwright';

async function verifyFullFlow() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('--- Full User Flow Scroll Verification ---');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Initial position
  console.log('1. Starting at top:', await page.evaluate(() => window.scrollY));

  // 2. Continuous wheel scrolling from hero to projects
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(200);
  }
  const midScrollY = await page.evaluate(() => window.scrollY);
  console.log('2. Scrolled midway down:', midScrollY);
  if (midScrollY < 1000) throw new Error('Scroll failed to move down to mid page');

  // 3. Scroll directly into projects section
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const projectsScrollY = await page.evaluate(() => window.scrollY);
  console.log('3. Arrived at Projects section, scrollY =', projectsScrollY);

  // 4. Open Case Study modal
  const firstCaseStudyBtn = page.locator('#projects article button:has-text("Case Study")').first();
  await firstCaseStudyBtn.dispatchEvent('click');
  const modal = page.locator('div[role="dialog"]');
  await modal.waitFor({ state: 'visible', timeout: 5000 });
  const isModalOpen = await modal.isVisible();
  console.log('4. Modal is open:', isModalOpen);

  // 5. Scroll inside modal
  const panel = page.locator('div[role="dialog"] > div');
  await panel.evaluate((el) => { el.scrollTop = 250; });
  await page.waitForTimeout(300);
  const panelScrollTop = await panel.evaluate((el) => el.scrollTop);
  console.log('5. Inside modal scrolled to:', panelScrollTop);

  // 6. Close modal with ESC
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const scrollYAfterModal = await page.evaluate(() => window.scrollY);
  console.log('6. Modal closed, page scrollY restored to:', scrollYAfterModal);

  if (Math.abs(scrollYAfterModal - projectsScrollY) > 50) {
    throw new Error(`Scroll position jumped! Expected ~${projectsScrollY}, got ${scrollYAfterModal}`);
  }

  // 7. Continue scrolling past Projects to Skills and Contact
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(200);
  }
  const skillsScrollY = await page.evaluate(() => window.scrollY);
  console.log('7. Scrolled past Projects toward bottom:', skillsScrollY);
  if (skillsScrollY <= scrollYAfterModal) {
    throw new Error('Scroll did not progress past Projects after modal close');
  }

  // 8. Scroll to footer / contact
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const contactScrollY = await page.evaluate(() => window.scrollY);
  console.log('8. Reached Contact section at bottom:', contactScrollY);

  console.log('>>> ALL SCROLL CHECKS COMPLETED WITH 100% SUCCESS! <<<');
  await browser.close();
}

verifyFullFlow().catch(err => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
