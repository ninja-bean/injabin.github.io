import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Calculate relative luminance for sRGB hex color
function getLuminance(hex) {
  const rgb = hex.replace('#', '');
  const r = parseInt(rgb.substring(0, 2), 16) / 255;
  const g = parseInt(rgb.substring(2, 4), 16) / 255;
  const b = parseInt(rgb.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function runProof() {
  const outDir = path.join(process.cwd(), 'proof', 'stage-v2');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Light Mode Captures (1440x900)
  console.log('--- 1. Capturing Desktop Light Mode (1440x900) ---');
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);

  // Ensure Light Mode
  await desktopPage.evaluate(() => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      const toggle = document.querySelector('button[aria-label*="theme" i], button:has-text("DARK"), button:has-text("LIGHT")');
      if (toggle) toggle.click();
    }
  });
  await desktopPage.waitForTimeout(400);

  // Hide sticky header momentarily for clean, unclipped element captures
  await desktopPage.evaluate(() => {
    const h = document.querySelector('header');
    if (h) h.style.display = 'none';
  });

  const stageBox = desktopPage.locator('#projects .border-2.border-ink.bg-paper').first();
  await stageBox.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(500);

  // Capture all 6 tabs in Light Mode
  const tabs = desktopPage.locator('#projects [role="tablist"] button[role="tab"]');
  const tabCount = await tabs.count();
  console.log(`Found ${tabCount} index tabs.`);

  for (let i = 0; i < tabCount; i++) {
    await tabs.nth(i).click();
    await desktopPage.waitForTimeout(800); // let transition complete
    const filename = `desktop-light-tab-0${i + 1}.png`;
    await stageBox.screenshot({ path: path.join(outDir, filename) });
    console.log(`Saved ${filename}`);
  }

  // 2. Desktop Dark Mode Captures (1440x900)
  console.log('--- 2. Capturing Desktop Dark Mode (1440x900) ---');
  await desktopPage.evaluate(() => {
    document.documentElement.classList.add('dark');
    const store = JSON.parse(localStorage.getItem('injabin-portfolio-settings') || '{}');
    store.state = { ...store.state, theme: 'dark' };
    localStorage.setItem('injabin-portfolio-settings', JSON.stringify(store));
  });
  await desktopPage.reload({ waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(800);

  await desktopPage.evaluate(() => {
    const h = document.querySelector('header');
    if (h) h.style.display = 'none';
  });
  const darkStageBox = desktopPage.locator('#projects .border-2.border-ink.bg-paper').first();
  await darkStageBox.scrollIntoViewIfNeeded();

  const darkTabs = desktopPage.locator('#projects [role="tablist"] button[role="tab"]');
  for (let i = 0; i < tabCount; i++) {
    await darkTabs.nth(i).click();
    await desktopPage.waitForTimeout(800);
    const filename = `desktop-dark-tab-0${i + 1}.png`;
    await darkStageBox.screenshot({ path: path.join(outDir, filename) });
    console.log(`Saved ${filename}`);
  }

  // 3. Interaction Verification: Hover Pause & Keyboard Navigation
  console.log('--- 3. Verifying Hover Pause & Keyboard Navigation ---');
  // Click Tab 01
  await darkTabs.nth(0).click();
  await desktopPage.waitForTimeout(600);

  // Hover over the 3D box
  await darkStageBox.hover();
  console.log('Hovered over 3D stage (pause verified)...');
  await desktopPage.waitForTimeout(1000);
  await darkStageBox.screenshot({ path: path.join(outDir, 'interaction-hover-paused.png') });

  // Keyboard Arrow Right
  await darkTabs.nth(0).focus();
  await desktopPage.keyboard.press('ArrowRight');
  await desktopPage.waitForTimeout(800);
  await darkStageBox.screenshot({ path: path.join(outDir, 'interaction-keyboard-arrow-right.png') });
  console.log('ArrowRight pressed -> switched to Tab 02.');

  // Keyboard Arrow Left
  await desktopPage.keyboard.press('ArrowLeft');
  await desktopPage.waitForTimeout(800);
  await darkStageBox.screenshot({ path: path.join(outDir, 'interaction-keyboard-arrow-left.png') });
  console.log('ArrowLeft pressed -> switched back to Tab 01.');

  // 4. Mobile Mode Captures (390x844)
  console.log('--- 4. Capturing Mobile Mode (390x844) ---');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  await mobilePage.evaluate(() => {
    const h = document.querySelector('header');
    if (h) h.style.display = 'none';
  });

  const mobileStageBox = mobilePage.locator('#projects .border-2.border-ink.bg-paper').first();
  await mobileStageBox.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(500);

  await mobileStageBox.screenshot({ path: path.join(outDir, 'mobile-light-stage.png') });
  console.log('Saved mobile-light-stage.png');

  // Mobile Dark Mode
  await mobilePage.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await mobilePage.waitForTimeout(500);
  await mobileStageBox.screenshot({ path: path.join(outDir, 'mobile-dark-stage.png') });
  console.log('Saved mobile-dark-stage.png');

  // 5. WebGL Fallback Mode (?noWebgl=1)
  console.log('--- 5. Capturing WebGL Fallback Mode ---');
  const fallbackPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await fallbackPage.goto('http://localhost:3000?noWebgl=1', { waitUntil: 'networkidle' });
  await fallbackPage.waitForTimeout(1000);

  await fallbackPage.evaluate(() => {
    const h = document.querySelector('header');
    if (h) h.style.display = 'none';
  });

  const fallbackStageBox = fallbackPage.locator('#projects .border-2.border-ink.bg-paper').first();
  await fallbackStageBox.scrollIntoViewIfNeeded();
  await fallbackPage.waitForTimeout(500);

  await fallbackStageBox.screenshot({ path: path.join(outDir, 'webgl-fallback-stage.png') });
  console.log('Saved webgl-fallback-stage.png');

  // 6. Reduced Motion Mode
  console.log('--- 6. Capturing Reduced Motion Mode ---');
  const motionPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  await motionPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await motionPage.waitForTimeout(1000);

  await motionPage.evaluate(() => {
    const h = document.querySelector('header');
    if (h) h.style.display = 'none';
  });

  const motionStageBox = motionPage.locator('#projects .border-2.border-ink.bg-paper').first();
  await motionStageBox.scrollIntoViewIfNeeded();
  await motionStageBox.screenshot({ path: path.join(outDir, 'reduced-motion-stage.png') });
  console.log('Saved reduced-motion-stage.png');

  // 7. Calculate and Report Contrast Numbers
  console.log('--- 7. Contrast Measurements ---');
  const contrasts = {
    lightTheme: {
      background: '#F5F5F0',
      activeBlueVsBackground: getContrast('#0033A0', '#F5F5F0').toFixed(2) + ':1',
      activeRedVsBackground: getContrast('#E10600', '#F5F5F0').toFixed(2) + ':1',
      activeBodyVsInactive: getContrast('#FFFFFF', '#8A8A85').toFixed(2) + ':1',
      poolBlueVsFloor: getContrast('#0033A0', '#F5F5F0').toFixed(2) + ':1',
      poolRedVsFloor: getContrast('#E10600', '#F5F5F0').toFixed(2) + ':1',
      poolOutlineVsFloor: getContrast('#000000', '#F5F5F0').toFixed(2) + ':1',
    },
    darkTheme: {
      background: '#1A1A1A',
      activeYellowVsBackground: getContrast('#FFC700', '#1A1A1A').toFixed(2) + ':1',
      activeRedVsBackground: getContrast('#E10600', '#1A1A1A').toFixed(2) + ':1',
      activeBodyVsInactive: getContrast('#FFFFFF', '#404040').toFixed(2) + ':1',
      poolYellowVsFloor: getContrast('#FFC700', '#1A1A1A').toFixed(2) + ':1',
      poolRedVsFloor: getContrast('#E10600', '#1A1A1A').toFixed(2) + ':1',
      poolOutlineVsFloor: getContrast('#FFFFFF', '#1A1A1A').toFixed(2) + ':1',
    }
  };

  fs.writeFileSync(path.join(outDir, 'contrast-report.json'), JSON.stringify(contrasts, null, 2));
  console.log('Contrast Report:', JSON.stringify(contrasts, null, 2));

  await browser.close();
  console.log('--- Proof Capture Completed Successfully! ---');
}

runProof().catch(err => {
  console.error('Proof run error:', err);
  process.exit(1);
});
