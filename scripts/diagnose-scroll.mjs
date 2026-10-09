import { chromium } from 'playwright';

async function diagnose() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => console.log(`[BROWSER CONSOLE ${msg.type()}]:`, msg.text()));
  page.on('pageerror', err => console.error('[BROWSER ERROR]:', err));

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const initialScrollY = await page.evaluate(() => window.scrollY);
  console.log('Initial window.scrollY:', initialScrollY);

  // Check document dimensions
  const dims = await page.evaluate(() => ({
    bodyScrollHeight: document.body.scrollHeight,
    docScrollHeight: document.documentElement.scrollHeight,
    windowHeight: window.innerHeight,
    bodyOverflow: document.body.style.overflow,
    docOverflow: document.documentElement.style.overflow,
    bodyPosition: document.body.style.position,
  }));
  console.log('Page dimensions:', dims);

  // Test mouse wheel scroll down in middle of viewport
  console.log('\n--- Simulating mouse wheel down at (720, 450) ---');
  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(600);
  let scrollY1 = await page.evaluate(() => window.scrollY);
  console.log('scrollY after first wheel 500:', scrollY1);

  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(600);
  let scrollY2 = await page.evaluate(() => window.scrollY);
  console.log('scrollY after second wheel 500:', scrollY2);

  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(600);
  let scrollY3 = await page.evaluate(() => window.scrollY);
  console.log('scrollY after third wheel 500:', scrollY3);

  // Test mouse wheel over different areas:
  // e.g. over the Rubik's cube area (approx right side: x=1100, y=400)
  console.log('\n--- Simulating mouse wheel over Hero Rubiks Cube area (1100, 400) ---');
  await page.mouse.move(1100, 400);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(600);
  let scrollYCube = await page.evaluate(() => window.scrollY);
  console.log('scrollY after wheel over Rubiks cube:', scrollYCube);

  // Test wheel over canvas sections further down (e.g. skills or plinths)
  console.log('\n--- Scrolling to Projects section and testing wheel ---');
  await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(800);
  let scrollYProj = await page.evaluate(() => window.scrollY);
  console.log('scrollY at Projects:', scrollYProj);

  // Wheel down while on Projects
  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(600);
  let scrollYAfterProjWheel = await page.evaluate(() => window.scrollY);
  console.log('scrollY after wheel on Projects:', scrollYAfterProjWheel);

  // Check what element is at (1100, 400) on hero
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const elementAtCube = await page.evaluate(() => {
    const el = document.elementFromPoint(1100, 400);
    return el ? { tagName: el.tagName, className: el.className, id: el.id } : null;
  });
  console.log('Element at (1100, 400):', elementAtCube);

  await browser.close();
}

diagnose().catch(console.error);
