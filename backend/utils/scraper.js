const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');

class GenericScraper {
  constructor() {
    this.browser = null;
  }

  generateUniqueId(title, company, url) {
    const data = `${title}-${company}-${url}`;
    return crypto.createHash('md5').update(data).digest('hex');
  }

  cleanText(text) {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
  }

  async scrapeWithCheerio(source) {
    try {
      const response = await axios.get(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      const jobs = [];

      if (!source.selectors || !source.selectors.jobContainer) {
        console.log('No selectors configured for', source.name);
        return jobs;
      }

      $(source.selectors.jobContainer).each((index, element) => {
        try {
          const $el = $(element);
          
          const title = this.cleanText($el.find(source.selectors.title).text());
          const company = this.cleanText($el.find(source.selectors.company).text()) || 'Unknown';
          const location = this.cleanText($el.find(source.selectors.location).text()) || 'Remote';
          const salary = this.cleanText($el.find(source.selectors.salary).text()) || 'Not specified';
          
          let link = $el.find(source.selectors.link).attr('href');
          if (link && !link.startsWith('http')) {
            const baseUrl = new URL(source.url);
            link = new URL(link, baseUrl.origin).href;
          }

          const description = this.cleanText($el.find(source.selectors.description).text());

          if (title && link) {
            jobs.push({
              title,
              company,
              location,
              salary,
              description,
              applyUrl: link,
              source: source.name,
              sourceUrl: source.url,
              uniqueId: this.generateUniqueId(title, company, link)
            });
          }
        } catch (err) {
          console.error('Error parsing job element:', err.message);
        }
      });

      return jobs;
    } catch (error) {
      console.error(`Error scraping ${source.name} with Cheerio:`, error.message);
      return [];
    }
  }

  async scrape(source) {
    console.log(`Starting scrape for ${source.name}...`);
    
    // Only use Cheerio (Puppeteer disabled for macOS compatibility)
    let jobs = await this.scrapeWithCheerio(source);
    
    // PUPPETEER DISABLED - If you need it, install proper macOS compatible version
    // if (jobs.length === 0) {
    //   console.log(`Cheerio found 0 jobs, trying Puppeteer for ${source.name}...`);
    //   jobs = await this.scrapeWithPuppeteer(source);
    // }

    if (jobs.length === 0) {
      console.log(`⚠️ No jobs found for ${source.name}. Check your CSS selectors or try a different source.`);
    }

    console.log(`Found ${jobs.length} jobs from ${source.name}`);
    return jobs;
  }

  async closeBrowser() {
    // Puppeteer disabled
    return;
  }
}

module.exports = new GenericScraper();
