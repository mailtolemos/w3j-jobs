const puppeteer = require('puppeteer');
const crypto = require('crypto');

async function scrapeJumpTrading() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto('https://www.jumptrading.com/hr/experienced-candidates', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for jobs to load
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Extract jobs
    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll('.job-listing, .position, .opening, [class*="job"]');
      const results = [];
      
      jobElements.forEach(element => {
        const titleEl = element.querySelector('h3, h4, .title, [class*="title"]');
        const locationEl = element.querySelector('.location, [class*="location"]');
        const linkEl = element.querySelector('a');
        
        if (titleEl && linkEl) {
          results.push({
            title: titleEl.textContent.trim(),
            company: 'Jump Trading',
            location: locationEl ? locationEl.textContent.trim() : 'Remote',
            applyUrl: linkEl.href,
            source: 'Jump Trading',
            sourceUrl: 'https://www.jumptrading.com/hr/experienced-candidates'
          });
        }
      });
      
      return results;
    });

    // Add unique IDs
    jobs.forEach(job => {
      const data = `${job.title}-${job.company}-${job.applyUrl}`;
      job.uniqueId = crypto.createHash('md5').update(data).digest('hex');
    });

    await browser.close();
    console.log(`Found ${jobs.length} jobs from Jump Trading`);
    return jobs;

  } catch (error) {
    if (browser) await browser.close();
    console.error('Error scraping Jump Trading:', error.message);
    return [];
  }
}

module.exports = scrapeJumpTrading;
