// Run this script to add test jobs to your database
// Usage: node add-test-jobs.js

require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/Job');

const testJobs = [
  {
    title: 'Senior Solidity Developer',
    company: 'Web3 Foundation',
    location: 'Remote',
    salary: '$120k-180k',
    description: 'Looking for an experienced Solidity developer to work on cutting-edge DeFi protocols.',
    applyUrl: 'https://web3.foundation/careers',
    source: 'Manual Test',
    sourceUrl: 'https://web3.foundation',
    uniqueId: 'test-job-1-' + Date.now()
  },
  {
    title: 'Smart Contract Engineer',
    company: 'Ethereum Foundation',
    location: 'Remote - Global',
    salary: '$150k-200k',
    description: 'Join our team building the future of decentralized applications.',
    applyUrl: 'https://ethereum.org/careers',
    source: 'Manual Test',
    sourceUrl: 'https://ethereum.org',
    uniqueId: 'test-job-2-' + Date.now()
  },
  {
    title: 'Web3 Frontend Developer',
    company: 'Uniswap Labs',
    location: 'Remote',
    salary: '$100k-150k',
    description: 'Build beautiful user interfaces for DeFi applications.',
    applyUrl: 'https://uniswap.org/jobs',
    source: 'Manual Test',
    sourceUrl: 'https://uniswap.org',
    uniqueId: 'test-job-3-' + Date.now()
  },
  {
    title: 'Blockchain Developer',
    company: 'Polygon',
    location: 'Remote',
    salary: '$130k-170k',
    description: 'Work on scaling Ethereum with Layer 2 solutions.',
    applyUrl: 'https://polygon.technology/careers',
    source: 'Manual Test',
    sourceUrl: 'https://polygon.technology',
    uniqueId: 'test-job-4-' + Date.now()
  },
  {
    title: 'DeFi Protocol Engineer',
    company: 'Aave',
    location: 'Remote - Europe',
    salary: '$140k-190k',
    description: 'Help build and maintain decentralized lending protocols.',
    applyUrl: 'https://aave.com/careers',
    source: 'Manual Test',
    sourceUrl: 'https://aave.com',
    uniqueId: 'test-job-5-' + Date.now()
  }
];

async function addTestJobs() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log(`\nAdding ${testJobs.length} test jobs...`);
    
    for (const jobData of testJobs) {
      const job = new Job(jobData);
      await job.save();
      console.log(`✅ Added: ${job.title} at ${job.company}`);
    }

    console.log(`\n🎉 Successfully added ${testJobs.length} test jobs!`);
    console.log('Refresh your admin dashboard to see them.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding test jobs:', error.message);
    process.exit(1);
  }
}

addTestJobs();
