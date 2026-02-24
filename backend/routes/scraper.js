const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const scrapingService = require('../utils/scrapingService');
const telegramService = require('../utils/telegram');

// Trigger manual scrape
router.post('/scrape', authMiddleware, async (req, res) => {
  try {
    // Start scraping in background
    scrapingService.scrapeAll()
      .then(results => {
        console.log('Background scraping completed:', results);
      })
      .catch(error => {
        console.error('Background scraping error:', error);
      });

    res.json({ 
      message: 'Scraping started in background',
      status: 'running'
    });
  } catch (error) {
    console.error('Error starting scrape:', error);
    res.status(500).json({ message: 'Error starting scrape' });
  }
});

// Get scraping status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    res.json({
      isRunning: scrapingService.isRunning
    });
  } catch (error) {
    console.error('Error getting status:', error);
    res.status(500).json({ message: 'Error getting status' });
  }
});

// Retry failed Telegram posts
router.post('/retry-posts', authMiddleware, async (req, res) => {
  try {
    const result = await scrapingService.retryFailedPosts();
    res.json({
      message: 'Retry completed',
      ...result
    });
  } catch (error) {
    console.error('Error retrying posts:', error);
    res.status(500).json({ message: 'Error retrying posts' });
  }
});

// Test Telegram connection
router.get('/test-telegram', authMiddleware, async (req, res) => {
  try {
    const result = await telegramService.testConnection();
    res.json({
      message: 'Telegram connection successful',
      ...result
    });
  } catch (error) {
    console.error('Telegram test error:', error);
    res.status(500).json({ 
      message: 'Telegram connection failed',
      error: error.message
    });
  }
});

module.exports = router;
