import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function recordContactVideo() {
  const videoDir = path.join(process.cwd(), 'proof', 'contact', 'video');
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  // Mock Web3Forms API response
  await page.route('https://api.web3forms.com/submit', async (route) => {
    await new Promise((r) => setTimeout(r, 600));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'Message submitted successfully' }),
    });
  });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Scroll-in entrance animation (2.5s)
  console.log('Scrolling down to Contact section to trigger entrance animation...');
  await page.evaluate(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(2500);

  // 2. Hover row colors snapping (Email red, LinkedIn blue, GitHub ink, HackerRank yellow) (5s)
  console.log('Hovering link rows to demonstrate 150ms flat color snapping...');
  const rows = page.locator('#contact [role="list"] [role="listitem"]');

  // Email row (Red)
  await rows.nth(0).hover();
  await page.waitForTimeout(900);

  // LinkedIn row (Blue)
  await rows.nth(1).hover();
  await page.waitForTimeout(900);

  // GitHub row (Ink)
  await rows.nth(2).hover();
  await page.waitForTimeout(900);

  // HackerRank row (Yellow)
  await rows.nth(3).hover();
  await page.waitForTimeout(900);

  // Location row
  await rows.nth(4).hover();
  await page.waitForTimeout(900);

  // 3. Form fill with validation error then success (7s)
  console.log('Demonstrating Validation Error state...');
  const submitBtn = page.locator('#contact form button[type="submit"]');
  await submitBtn.click();
  await page.waitForTimeout(1500); // Shows red alert and inline errors

  console.log('Filling form fields with valid data...');
  await page.locator('#contact-name').fill('Margaret Hamilton');
  await page.waitForTimeout(400);
  await page.locator('#contact-email').fill('margaret@mit.edu');
  await page.waitForTimeout(400);
  await page.locator('#contact-message').fill('Apollo 11 guidance computer software architecture collaboration.');
  await page.waitForTimeout(600);

  console.log('Submitting message...');
  await submitBtn.click();
  await page.waitForTimeout(2500); // Transition to Success state with Bauhaus shapes

  // Hover the Bauhaus stack and Send another button
  await page.locator('#contact button:has-text("Send another")').hover();
  await page.waitForTimeout(800);

  console.log('Closing page and finalizing video recording...');
  await page.close();
  await context.close();
  await browser.close();

  // Rename recorded video file to contact-demo.webm
  const files = fs.readdirSync(videoDir);
  const webmFile = files.find((f) => f.endsWith('.webm') && f !== 'contact-demo.webm');
  if (webmFile) {
    const origPath = path.join(videoDir, webmFile);
    const targetPath = path.join(videoDir, 'contact-demo.webm');
    if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
    fs.renameSync(origPath, targetPath);
    console.log(`Video recorded successfully: ${targetPath}`);
  }
}

recordContactVideo().catch((err) => {
  console.error('Error recording contact video:', err);
  process.exit(1);
});
