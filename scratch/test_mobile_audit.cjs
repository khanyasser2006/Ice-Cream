const { chromium } = require('playwright');
const path = require('path');

async function testMobile() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  const brainDir = 'C:\\Users\\123\\.gemini\\antigravity\\brain\\6166f743-e5ff-4077-bea6-b90221a6ce78';

  // 1. Flavors
  console.log('1. Flavors');
  await page.goto('http://localhost:5173/#/flavors', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(brainDir, 'mobile_02_flavors.png') });

  // Open Hamburger on Flavors page
  const menuBtn = page.locator('button[aria-label="Toggle Menu"]');
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(brainDir, 'mobile_03_menu_drawer.png') });
    await menuBtn.click();
    await page.waitForTimeout(300);
  }

  // 2. Open Tasting Flight Drawer
  console.log('2. Tasting Box');
  const flightBtn = page.locator('button:has-text("Tasting Box")').first();
  if (await flightBtn.isVisible()) {
    await flightBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(brainDir, 'mobile_04_flight_drawer.png') });
    const closeDrawerBtn = page.locator('button:has(svg.lucide-x)').first();
    if (await closeDrawerBtn.isVisible()) await closeDrawerBtn.click();
    await page.waitForTimeout(300);
  }

  // 3. Flavor Preview
  console.log('3. Flavor Preview');
  const flavorHeading = page.locator('h3.font-serif').first();
  if (await flavorHeading.isVisible()) {
    await flavorHeading.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(brainDir, 'mobile_05_flavor_detail.png') });
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(brainDir, 'mobile_06_flavor_detail_bottom.png') });
    const closePreviewBtn = page.locator('button[title="Close (Esc)"]');
    if (await closePreviewBtn.isVisible()) await closePreviewBtn.click();
    await page.waitForTimeout(300);
  }

  // 4. How It's Made
  console.log('4. How Its Made');
  await page.goto('http://localhost:5173/#/how-its-made', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(brainDir, 'mobile_07_how_its_made.png') });

  // 5. Shops
  console.log('5. Shops');
  await page.goto('http://localhost:5173/#/shops', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(brainDir, 'mobile_08_shops.png') });

  // 6. Photos
  console.log('6. Photos');
  await page.goto('http://localhost:5173/#/photos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(brainDir, 'mobile_09_photos.png') });

  // 7. Account Auth
  console.log('7. Account Auth');
  await page.goto('http://localhost:5173/#/account', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(brainDir, 'mobile_10_account.png') });

  await browser.close();
  console.log('Done screenshots!');
}

testMobile().catch(console.error);
