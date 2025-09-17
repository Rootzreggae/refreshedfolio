import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

const screenshotsDir = join(projectRoot, 'screenshots');
if (!existsSync(screenshotsDir)) {
  mkdirSync(screenshotsDir, { recursive: true });
}

async function takeScreenshots() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport for consistent screenshots
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // Screenshot homepage
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: join(screenshotsDir, 'homepage.png'),
      fullPage: true,
    });
    console.log('✓ Homepage screenshot saved');

    // Add more pages as needed
    // await page.goto('http://localhost:4321/work');
    // await page.screenshot({ path: join(screenshotsDir, 'work.png') });
  } catch (error) {
    console.error('Error taking screenshots:', error.message);
    console.log(
      'Make sure your dev server is running on http://localhost:4321'
    );
  } finally {
    await browser.close();
  }
}

takeScreenshots();
