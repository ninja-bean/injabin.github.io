import { chromium } from 'playwright';

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Add script to monitor who calls scrollTo or what modifies scroll
  await page.addInitScript(() => {
    const origScrollTo = window.scrollTo;
    window.scrollTo = function(...args) {
      console.log('>>> [INTERCEPT window.scrollTo]:', JSON.stringify(args), new Error().stack);
      return origScrollTo.apply(this, args);
    };

    const origScroll = window.scroll;
    window.scroll = function(...args) {
      console.log('>>> [INTERCEPT window.scroll]:', JSON.stringify(args), new Error().stack);
      return origScroll.apply(this, args);
    };

    window.addEventListener('scroll', () => {
      console.log('>>> [WINDOW SCROLL EVENT]: scrollY =', window.scrollY);
    }, { passive: true });
  });

  page.on('console', msg => {
    const txt = msg.text();
    if (txt.includes('INTERCEPT') || txt.includes('WINDOW SCROLL') || txt.includes('Scroll')) {
      console.log(txt);
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('Initial scrollY is', await page.evaluate(() => window.scrollY));

  console.log('Wheel 300 down...');
  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(500);

  console.log('Wheel 300 down again...');
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(500);

  console.log('Wheel 300 down third time...');
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(500);

  await browser.close();
}

test().catch(console.error);
