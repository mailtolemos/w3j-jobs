const mongoose = require('mongoose');

const websiteSourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  active: {
    type: Boolean,
    default: true
  },
  scraperType: {
    type: String,
    enum: ['generic', 'custom'],
    default: 'generic'
  },
  selectors: {
    jobContainer: String,
    title: String,
    company: String,
    location: String,
    salary: String,
    link: String,
    description: String
  },
  customScraperName: {
    type: String,
    default: null
  },
  lastScraped: {
    type: Date,
    default: null
  },
  jobsFound: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WebsiteSource', websiteSourceSchema);
