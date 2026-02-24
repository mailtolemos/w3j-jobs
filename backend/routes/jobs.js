const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authMiddleware = require('../middleware/auth');

// Get all jobs (with pagination) - ADMIN ONLY
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = {};
    
    if (req.query.source) {
      filter.source = req.query.source;
    }
    
    if (req.query.posted !== undefined) {
      filter.postedToTelegram = req.query.posted === 'true';
    }

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// Get recent jobs (for public view) - NO AUTH REQUIRED
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    // FIXED: Show ALL jobs, not just ones posted to Telegram
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v');

    res.json({ jobs });
  } catch (error) {
    console.error('Error fetching recent jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// Get job stats - ADMIN ONLY
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const total = await Job.countDocuments();
    const posted = await Job.countDocuments({ postedToTelegram: true });
    const today = await Job.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    const bySource = await Job.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      total,
      posted,
      today,
      bySource
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Delete a job - ADMIN ONLY
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Error deleting job' });
  }
});

// Delete all jobs - ADMIN ONLY
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const result = await Job.deleteMany({});
    res.json({ message: `Deleted ${result.deletedCount} jobs` });
  } catch (error) {
    console.error('Error deleting jobs:', error);
    res.status(500).json({ message: 'Error deleting jobs' });
  }
});

module.exports = router;
