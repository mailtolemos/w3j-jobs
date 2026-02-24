// API-based scraper for RemoteOK
// This scraper uses RemoteOK's public API instead of HTML scraping
// Place this in: backend/scrapers/remoteok.js

const axios = require('axios');
const crypto = require('crypto');

async function scrapeRemoteOK() {
  try {
    console.log('Fetching jobs from RemoteOK API...');
    
    const response = await axios.get('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });

    const data = response.data;
    
    // RemoteOK API returns array, first item is metadata, skip it
    const jobsData = Array.isArray(data) ? data.slice(1) : [];
    
    const jobs = [];

    for (const item of jobsData) {
      // Filter for Web3/Blockchain/Crypto jobs
      const tags = item.tags || [];
      const position = (item.position || '').toLowerCase();
      const company = item.company || '';
      
      const isWeb3 = tags.some(tag => 
        ['web3', 'blockchain', 'crypto', 'ethereum', 'solidity', 'defi', 'nft'].includes(tag.toLowerCase())
      ) || position.includes('web3') || position.includes('blockchain') || position.includes('crypto');

      if (isWeb3 && item.position && item.url) {
        const title = item.position;
        const applyUrl = item.url.startsWith('http') ? item.url : `https://remoteok.com${item.url}`;
        const uniqueId = crypto.createHash('md5').update(`${title}-${company}-${applyUrl}`).digest('hex');

        jobs.push({
          title: title,
          company: company || 'Unknown',
          location: item.location || 'Remote',
          salary: item.salary_min && item.salary_max 
            ? `$${item.salary_min}-${item.salary_max}` 
            : 'Not specified',
          description: item.description || '',
          applyUrl: applyUrl,
          source: 'RemoteOK',
          sourceUrl: 'https://remoteok.com',
          uniqueId: uniqueId,
          tags: tags.filter(tag => tag) // Remove empty tags
        });
      }
    }

    console.log(`Found ${jobs.length} Web3 jobs from RemoteOK`);
    return jobs;

  } catch (error) {
    console.error('Error scraping RemoteOK:', error.message);
    return [];
  }
}

module.exports = scrapeRemoteOK;
