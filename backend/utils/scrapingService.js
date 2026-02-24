const Job = require('../models/Job');
const WebsiteSource = require('../models/WebsiteSource');
const scraper = require('./scraper');
const telegramService = require('./telegram');

class ScrapingService {
  constructor() {
    this.isRunning = false;
  }

  async scrapeAll() {
    if (this.isRunning) {
      console.log('Scraping already in progress, skipping...');
      return { message: 'Scraping already in progress' };
    }

    this.isRunning = true;
    const results = {
      totalScraped: 0,
      newJobs: 0,
      postedToTelegram: 0,
      errors: []
    };

    try {
      const sources = await WebsiteSource.find({ active: true });
      
      if (sources.length === 0) {
        console.log('No active sources configured');
        this.isRunning = false;
        return { message: 'No active sources configured' };
      }

      console.log(`Starting scrape for ${sources.length} sources...`);

      for (const source of sources) {
        try {
          let jobs = [];
          
          // Check if it's RemoteOK - use custom API scraper
          if (source.url.includes('remoteok.com')) {
            try {
              const remoteokScraper = require('../scrapers/remoteok');
              jobs = await remoteokScraper();
            } catch (err) {
              console.log('RemoteOK scraper not found, using default scraper');
              jobs = await scraper.scrape(source);
            }
          } else {
            jobs = await scraper.scrape(source);
          }
          
          results.totalScraped += jobs.length;

          // Save new jobs and post to Telegram
          for (const jobData of jobs) {
            try {
              // Check if job already exists
              const existingJob = await Job.findOne({ uniqueId: jobData.uniqueId });
              
              if (!existingJob) {
                // Create new job
                const job = new Job(jobData);
                await job.save();
                results.newJobs++;

                // Post to Telegram
                try {
                  const messageId = await telegramService.postJob(job);
                  job.postedToTelegram = true;
                  job.telegramMessageId = messageId;
                  await job.save();
                  results.postedToTelegram++;
                  
                  console.log(`✅ Posted to Telegram: ${job.title} at ${job.company}`);
                } catch (telegramError) {
                  console.error(`Failed to post to Telegram: ${telegramError.message}`);
                  results.errors.push({
                    job: job.title,
                    error: telegramError.message
                  });
                }

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            } catch (saveError) {
              console.error(`Error saving job: ${saveError.message}`);
              results.errors.push({
                job: jobData.title,
                error: saveError.message
              });
            }
          }

          // Update source metadata
          source.lastScraped = new Date();
          source.jobsFound += jobs.length;
          await source.save();

        } catch (sourceError) {
          console.error(`Error scraping ${source.name}: ${sourceError.message}`);
          results.errors.push({
            source: source.name,
            error: sourceError.message
          });
        }
      }

      console.log(`Scraping complete! New jobs: ${results.newJobs}, Posted to Telegram: ${results.postedToTelegram}`);
      
    } catch (error) {
      console.error('Scraping service error:', error);
      results.errors.push({ error: error.message });
    } finally {
      this.isRunning = false;
      await scraper.closeBrowser();
    }

    return results;
  }

  async retryFailedPosts() {
    try {
      const failedJobs = await Job.find({ 
        postedToTelegram: false,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      }).limit(20);

      let posted = 0;
      for (const job of failedJobs) {
        try {
          const messageId = await telegramService.postJob(job);
          job.postedToTelegram = true;
          job.telegramMessageId = messageId;
          await job.save();
          posted++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Retry failed for ${job.title}: ${error.message}`);
        }
      }

      return { posted, total: failedJobs.length };
    } catch (error) {
      console.error('Error retrying failed posts:', error);
      throw error;
    }
  }
}

module.exports = new ScrapingService();
