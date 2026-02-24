require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const sourceRoutes = require('./routes/sources');
const scraperRoutes = require('./routes/scraper');

// Import services
const scrapingService = require('./utils/scrapingService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/scraper', scraperRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '$W3J API - Web3 Jobs Aggregator',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      sources: '/api/sources',
      scraper: '/api/scraper'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Setup cron job for automatic scraping
const scrapeInterval = process.env.SCRAPE_INTERVAL_MINUTES || 30;
const cronExpression = `*/${scrapeInterval} * * * *`;

console.log(`Setting up cron job to run every ${scrapeInterval} minutes`);

cron.schedule(cronExpression, async () => {
  console.log('🤖 Running scheduled scrape...');
  try {
    const results = await scrapingService.scrapeAll();
    console.log('✅ Scheduled scrape completed:', results);
  } catch (error) {
    console.error('❌ Scheduled scrape error:', error);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║         $W3J - Web3 Jobs API              ║
║                                           ║
║  🚀 Server running on port ${PORT}         ║
║  📊 Auto-scrape every ${scrapeInterval} minutes       ║
║  🔗 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}                  ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received, closing server gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = app;
