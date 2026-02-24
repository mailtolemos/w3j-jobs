const express = require('express');
const router = express.Router();
const WebsiteSource = require('../models/WebsiteSource');
const authMiddleware = require('../middleware/auth');

// Get all sources
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sources = await WebsiteSource.find().sort({ createdAt: -1 });
    res.json({ sources });
  } catch (error) {
    console.error('Error fetching sources:', error);
    res.status(500).json({ message: 'Error fetching sources' });
  }
});

// Get source by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const source = await WebsiteSource.findById(req.params.id);
    
    if (!source) {
      return res.status(404).json({ message: 'Source not found' });
    }

    res.json({ source });
  } catch (error) {
    console.error('Error fetching source:', error);
    res.status(500).json({ message: 'Error fetching source' });
  }
});

// Create new source
router.post('/', authMiddleware, async (req, res) => {
  try {
    const source = new WebsiteSource(req.body);
    await source.save();
    res.status(201).json({ source, message: 'Source created successfully' });
  } catch (error) {
    console.error('Error creating source:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A source with this URL already exists' });
    }
    
    res.status(500).json({ message: 'Error creating source' });
  }
});

// Update source
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const source = await WebsiteSource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!source) {
      return res.status(404).json({ message: 'Source not found' });
    }

    res.json({ source, message: 'Source updated successfully' });
  } catch (error) {
    console.error('Error updating source:', error);
    res.status(500).json({ message: 'Error updating source' });
  }
});

// Toggle source active status
router.patch('/:id/toggle', authMiddleware, async (req, res) => {
  try {
    const source = await WebsiteSource.findById(req.params.id);
    
    if (!source) {
      return res.status(404).json({ message: 'Source not found' });
    }

    source.active = !source.active;
    await source.save();

    res.json({ source, message: `Source ${source.active ? 'activated' : 'deactivated'}` });
  } catch (error) {
    console.error('Error toggling source:', error);
    res.status(500).json({ message: 'Error toggling source' });
  }
});

// Delete source
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const source = await WebsiteSource.findByIdAndDelete(req.params.id);
    
    if (!source) {
      return res.status(404).json({ message: 'Source not found' });
    }

    res.json({ message: 'Source deleted successfully' });
  } catch (error) {
    console.error('Error deleting source:', error);
    res.status(500).json({ message: 'Error deleting source' });
  }
});

module.exports = router;
