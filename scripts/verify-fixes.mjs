import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
console.log('Testing fixes against', BASE);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// 1. Verify Links on page
console.log('--- Verifying Links ---');
const expectedLinks = [
  'https://algo-arena-sim.vercel.app/',
  'https://github.com/xrayian/AlgoArena',
  'https://github.com/ninja-bean/Gov_Connect-DhakaGird-',
  'https://nexus-stock-ai.vercel.app/dashboard',
  'https://github.com/ninja-bean/fintech-ai-swe-proj-next-js',
  'https://github.com/ninja-bean/ML-Model-Comparison-Assignment',
  'https://www.life-global.org/certificate/0b1d3e49-91ab-4dcc-a26d-05802eb87ce4',
  'https://www.life-global.org/certificate/ad9340ec-597d-4fe6-aefa-2aba6d14a017',
  'https://github.com/xrayian/UPC2025_951B',
  'https://www.hackerrank.com/profile/malam2330344',
];

for (const href of expectedLinks) {
  const count = await page.locator(`a[href="${href}"]`).count();
  if (count > 0) {
    console.log(`[PASS] Found link: ${href} (count: ${count})`);
  } else {
    console.error(`[FAIL] Missing link: ${href}`);
  }
}

// 2. Test Modal Scroll Isolation
console.log('--- Testing Modal Scroll Isolation ---');

// Click first case study button (AlgoArena)
const caseStudyBtn = page.locator('#projects article button:has-text("Case Study")').first();
await caseStudyBtn.dispatchEvent('click');
await page.waitForTimeout(800);

// Verify modal is open
const modal = page.locator('div[role="dialog"]');
const isModalVisible = await modal.isVisible();
console.log('Is modal open:', isModalVisible);

// Locate scrollable modal panel
const scrollablePanel = page.locator('div[role="dialog"] > div');
const initialModalScrollTop = await scrollablePanel.evaluate((el) => el.scrollTop);
console.log('Initial modal.scrollTop:', initialModalScrollTop);

// Get page position (should be locked)
const lockedPosBefore = await page.evaluate(() => {
  return document.body.style.position === 'fixed' && document.body.style.top;
});
console.log('Body lock position:', lockedPosBefore);

// Scroll the modal down
await scrollablePanel.evaluate((el) => {
  el.scrollTop = 320;
});
await page.waitForTimeout(400);

const scrolledModalTop = await scrollablePanel.evaluate((el) => el.scrollTop);
const lockedPosAfter = await page.evaluate(() => {
  return document.body.style.position === 'fixed' && document.body.style.top;
});

console.log('Modal scrollTop after scroll:', scrolledModalTop);
console.log('Body lock position after scroll:', lockedPosAfter);

if (scrolledModalTop > 0 && lockedPosBefore === lockedPosAfter && lockedPosAfter) {
  console.log('[PASS] Modal scroll is isolated! Modal scrolled to', scrolledModalTop, 'and body remained fixed at', lockedPosAfter);
} else {
  console.error('[FAIL] Modal scroll lock failed.');
}

await page.screenshot({ path: 'proof/phase-h/modal-scroll-isolated.png' });

// Close with Esc
await page.keyboard.press('Escape');
await page.waitForTimeout(500);

const bodyPosAfterClose = await page.evaluate(() => document.body.style.position);
const scrollYAfterClose = await page.evaluate(() => window.scrollY);
console.log('Body position after modal close (should be empty):', bodyPosAfterClose === '' ? '[PASS] Restored' : '[FAIL]');
console.log('ScrollY after modal close (should be preserved):', scrollYAfterClose);

// 3. Test scrolling after modal closed
console.log('--- Testing Wheel Scroll After Modal Closed ---');
await page.mouse.move(720, 450);
await page.mouse.wheel(0, 500);
await page.waitForTimeout(500);
const scrollYPostClose = await page.evaluate(() => window.scrollY);
console.log('ScrollY after subsequent wheel 500:', scrollYPostClose);

if (scrollYPostClose > scrollYAfterClose) {
  console.log('[PASS] Page scroll continues smoothly after modal closed! (from', scrollYAfterClose, 'to', scrollYPostClose, ')');
} else {
  console.error('[FAIL] Page scroll stuck or broken after modal closed.');
}

await browser.close();
console.log('Verification successfully finished.');
