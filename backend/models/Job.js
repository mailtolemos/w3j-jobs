const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    default: 'Remote'
  },
  salary: {
    type: String,
    default: 'Not specified'
  },
  description: {
    type: String,
    default: ''
  },
  requirements: {
    type: String,
    default: ''
  },
  applyUrl: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  sourceUrl: {
    type: String,
    required: true
  },
  postedToTelegram: {
    type: Boolean,
    default: false
  },
  telegramMessageId: {
    type: Number,
    default: null
  },
  tags: [{
    type: String
  }],
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Unknown'],
    default: 'Unknown'
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
}, {
  timestamps: true
});

// Index for faster queries
jobSchema.index({ createdAt: -1 });
jobSchema.index({ postedToTelegram: 1 });
jobSchema.index({ source: 1 });

module.exports = mongoose.model('Job', jobSchema);
