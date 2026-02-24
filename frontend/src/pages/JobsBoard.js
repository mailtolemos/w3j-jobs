import React, { useState, useEffect } from 'react';
import TerminalWindow from '../components/TerminalWindow';
import { jobs } from '../utils/api';
import './JobsBoard.css';

const JobsBoard = () => {
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await jobs.getRecent(100);
      setJobsList(response.data.jobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobsList.filter(job => {
    if (!filter) return true;
    const searchStr = filter.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchStr) ||
      job.company.toLowerCase().includes(searchStr) ||
      job.location.toLowerCase().includes(searchStr) ||
      (job.tags && job.tags.some(tag => tag.toLowerCase().includes(searchStr)))
    );
  });

  return (
    <TerminalWindow title="$W3J - Web3 Jobs Board">
      <div className="jobs-board">
        {/* Header */}
        <div className="jobs-header">
          <div className="ascii-logo">
            <pre>{`
 ███████╗██╗    ██╗██████╗      ██╗
 ██╔════╝██║    ██║╚════██╗     ██║
 ███████╗██║ █╗ ██║ █████╔╝     ██║
 ╚════██║██║███╗██║ ╚═══██╗██   ██║
 ███████║╚███╔███╔╝██████╔╝╚█████╔╝
 ╚══════╝ ╚══╝╚══╝ ╚═════╝  ╚════╝ 
            `}</pre>
          </div>
          <h1 className="board-title glow-text">Web3 Jobs Aggregator</h1>
          <p className="board-subtitle">Latest opportunities in Web3, Blockchain & Crypto</p>
        </div>

        {/* Search */}
        <div className="search-bar">
          <span className="search-prompt">search@w3j:~$ </span>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by title, company, location, or tags..."
            className="search-input"
          />
        </div>

        {/* Stats */}
        <div className="jobs-stats">
          <span>📊 Total Jobs: {filteredJobs.length}</span>
          <span>🔄 Last Updated: {new Date().toLocaleDateString()}</span>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="loading">
            <p>⏳ Loading jobs<span className="cursor">_</span></p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="no-jobs">
            <p>😔 No jobs found matching your search.</p>
            <p className="hint">Try a different search term or check back later!</p>
          </div>
        ) : (
          <div className="jobs-list">
            {filteredJobs.map((job) => (
              <div key={job._id} className="job-card">
                <div className="job-header">
                  <h2 className="job-title">{job.title}</h2>
                  <span className="job-source">via {job.source}</span>
                </div>

                <div className="job-details">
                  <div className="detail-item">
                    <span className="detail-icon">🏢</span>
                    <span className="detail-text">{job.company}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{job.location}</span>
                  </div>

                  {job.salary && job.salary !== 'Not specified' && (
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <span className="detail-text">{job.salary}</span>
                    </div>
                  )}

                  {job.jobType && job.jobType !== 'Unknown' && (
                    <div className="detail-item">
                      <span className="detail-icon">⏰</span>
                      <span className="detail-text">{job.jobType}</span>
                    </div>
                  )}
                </div>

                {job.description && (
                  <p className="job-description">
                    {job.description.substring(0, 200)}
                    {job.description.length > 200 ? '...' : ''}
                  </p>
                )}

                {job.tags && job.tags.length > 0 && (
                  <div className="job-tags">
                    {job.tags.slice(0, 5).map((tag, idx) => (
                      <span key={idx} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="job-footer">
                  <span className="job-date">
                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apply-btn"
                  >
                    🚀 APPLY NOW
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="board-footer">
          <p>💡 Jobs are automatically aggregated from various Web3 job boards</p>
          <p>🔄 Updated every 30 minutes</p>
        </div>
      </div>
    </TerminalWindow>
  );
};

export default JobsBoard;
