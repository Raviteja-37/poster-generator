const { chromium } = require('playwright');

async function renderHTML(url) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage({
    viewport: {
      width: 1080,
      height: 1080,
    },
  });

  // navigate to a real URL (real https:// origin) instead of
  // page.setContent(), so external stylesheets/fonts load reliably
  await page.goto(url, { waitUntil: 'networkidle' });

  try {
    await page.waitForSelector('body[data-fit-done="true"]', { timeout: 3000 });
  } catch (e) {
    // proceed anyway — better a slightly-off screenshot than a failed request
  }

  const image = await page.screenshot({
    type: 'png',
    fullPage: true,
  });

  await browser.close();

  return image;
}

module.exports = {
  renderHTML,
};
