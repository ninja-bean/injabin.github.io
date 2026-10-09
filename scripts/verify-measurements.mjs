import { chromium } from 'playwright';

async function verifyMeasurements() {
  const browser = await chromium.launch({ headless: true });

  for (const vp of [
    { name: 'Desktop', width: 1440, height: 900 },
    { name: 'Tablet', width: 820, height: 1180 },
    { name: 'Mobile', width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const data = await page.evaluate(() => {
      const contact = document.getElementById('contact');
      if (!contact) return null;
      // Container holding both cards
      const container = contact.querySelector('.items-stretch');
      if (!container) return null;
      const leftCol = container.children[0];
      const rightCol = container.children[1];
      const leftCard = leftCol.firstElementChild;
      const rightCard = rightCol.querySelector('form');

      const leftRect = leftCard ? leftCard.getBoundingClientRect() : null;
      const rightRect = rightCard ? rightCard.getBoundingClientRect() : null;

      // Projects vs Skills canvas heights
      const projectsCanvas = document.querySelector('#projects canvas');
      const skillsCanvas = document.querySelector('#skills canvas');

      return {
        leftCard: leftRect ? { width: Math.round(leftRect.width), height: Math.round(leftRect.height) } : null,
        rightCard: rightRect ? { width: Math.round(rightRect.width), height: Math.round(rightRect.height) } : null,
        projectsCanvasHeight: projectsCanvas ? Math.round(projectsCanvas.getBoundingClientRect().height) : null,
        skillsCanvasHeight: skillsCanvas ? Math.round(skillsCanvas.getBoundingClientRect().height) : null,
      };
    });

    console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) ===`);
    console.log(`Left Card (Direct Coordinates): ${data.leftCard?.width}px x ${data.leftCard?.height}px`);
    console.log(`Right Card (Message Form):     ${data.rightCard?.width}px x ${data.rightCard?.height}px`);
    console.log(`Height Difference:              ${Math.abs((data.leftCard?.height || 0) - (data.rightCard?.height || 0))}px`);
    console.log(`Projects 3D Canvas Height:      ${data.projectsCanvasHeight}px`);
    console.log(`Skills 3D Canvas Height:        ${data.skillsCanvasHeight}px`);

    await page.close();
  }

  await browser.close();
}

verifyMeasurements().catch(console.error);
