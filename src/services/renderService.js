const { chromium } = require('playwright');

async function renderHTML(html) {
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

  await page.setContent(html);

  await page.waitForLoadState('networkidle');

  // Give browser a moment to finish painting
  await page.waitForTimeout(500);

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
