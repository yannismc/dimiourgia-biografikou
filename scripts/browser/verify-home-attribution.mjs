import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const output = process.env.ARTIFACTS || '../homepage-checks';
const base = process.env.BROWSER_BASE_URL || 'http://127.0.0.1:3211';
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.PLAYWRIGHT_EXECUTABLE_PATH ||
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
await mkdir(output, { recursive: true });
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base);
    await page.locator('#about-us').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    const about = page.locator('#about-us');
    const creators = page.locator('#original-creators');
    assert.match(await about.innerText(), /Ioannis Axaopoulos/);
    assert.doesNotMatch(await about.innerText(), /Sadanand|Gopalakrishnan|Vivek G|Siva K/);
    assert.equal(await about.locator('img[alt="Ioannis Axaopoulos"]').count(), 1);
    await about.scrollIntoViewIfNeeded();
    await about.locator('img[alt="Ioannis Axaopoulos"]').evaluate((image) => image.decode());
    assert.equal(await about.locator('a[href="https://www.linkedin.com/in/axaojon/"]').count(), 1);
    assert.equal(await about.locator('a[href="https://github.com/yannismc"]').count(), 1);
    assert.match(await creators.innerText(), /Αρχικοί δημιουργοί/);
    for (const name of ['Sadanand Pai', 'Gopalakrishnan', 'Vivek G', 'Siva K']) {
      assert.match(await creators.innerText(), new RegExp(name));
    }
    assert.equal(await creators.locator('img:not([src*="icons"])').count(), 0);
    assert.equal(await creators.locator('a[aria-label$="— GitHub"]').count(), 4);
    assert.equal(await creators.locator('a[aria-label$="— LinkedIn"]').count(), 4);
    assert.match(await creators.innerText(), /Διαβάστε την ιστορία σχεδιασμού τους στο Medium ↗/);
    assert.match(await page.locator('nav.sticky').textContent(), /Δημιουργία βιογραφικού/);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      `Horizontal overflow at ${width}`
    );
    await about.screenshot({ path: `${output}/about-el-${width}.png` });
    await creators.screenshot({ path: `${output}/creators-el-${width}.png` });
    await page.locator('nav.sticky').screenshot({ path: `${output}/nav-el-${width}.png` });
    await page.locator('nav.sticky button[aria-label="Γλώσσα"]').click();
    assert.match(await about.innerText(), /What this edition adds/);
    assert.match(await creators.innerText(), /Original creators/);
    assert.match(await page.locator('nav.sticky').textContent(), /Create a resume/);
    assert.deepEqual(errors, []);
    console.log(
      `Verified attribution, social links, original creators, Greek/English and layout at ${width}px`
    );
    await context.close();
  }
} finally {
  await browser.close();
}
