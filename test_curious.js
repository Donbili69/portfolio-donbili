const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });

  // Wait for a curiosity button
  await page.waitForSelector('.code-curiosity-btn', { timeout: 5000 });
  const btns = await page.$$('.code-curiosity-btn');
  if (btns.length === 0) {
    console.error('No curiosity buttons found');
    await browser.close();
    process.exit(2);
  }

  // Click the first one
  await btns[0].click();

  // Wait a moment for modal
  await page.waitForTimeout(500);

  // Check modal visibility and learn-more button
  const modalDisplay = await page.$eval('#code-modal', el => window.getComputedStyle(el).display);
  const learnHref = await page.$eval('#learn-more-btn', el => el.getAttribute('href'));
  const learnTitle = await page.$eval('#learn-more-btn', el => el.getAttribute('title'));

  console.log('modalDisplay=' + modalDisplay);
  console.log('learnHref=' + learnHref);
  console.log('learnTitle=' + learnTitle);

  // simple assertions
  if (!modalDisplay || modalDisplay === 'none') {
    console.error('Modal did not open (display=' + modalDisplay + ')');
    await browser.close();
    process.exit(3);
  }

  if (!learnHref) {
    console.error('Learn More href not set');
    await browser.close();
    process.exit(4);
  }

  console.log('SUCCESS: Curious modal opened and Learn More link set');
  await browser.close();
  process.exit(0);
})();
