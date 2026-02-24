import React, { useState, useEffect } from 'react';
import TerminalWindow from '../components/TerminalWindow';
import { sources, jobs, scraper, auth } from '../utils/api';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('sources');
  const [sourcesList, setSourcesList] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    url: '',
    active: true,
    selectors: {
      jobContainer: '',
      title: '',
      company: '',
      location: '',
      salary: '',
      link: '',
      description: ''
    }
  });

  useEffect(() => {
    loadSources();
    loadStats();
  }, []);

  const loadSources = async () => {
    try {
      const response = await sources.getAll();
      setSourcesList(response.data.sources);
    } catch (error) {
      showMessage('❌ Error loading sources', 'error');
    }
  };

  const loadStats = async () => {
    try {
      const response = await jobs.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const showMessage = (msg, type = 'success') => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(''), 5000);
  };

  const handleAddSource = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sources.create(newSource);
      showMessage('✅ Source added successfully!');
      setShowAddSource(false);
      setNewSource({
        name: '',
        url: '',
        active: true,
        selectors: {
          jobContainer: '',
          title: '',
          company: '',
          location: '',
          salary: '',
          link: '',
          description: ''
        }
      });
      loadSources();
    } catch (error) {
      showMessage('❌ Error adding source', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSource = async (id) => {
    try {
      await sources.toggle(id);
      showMessage('✅ Source status updated');
      loadSources();
    } catch (error) {
      showMessage('❌ Error updating source', 'error');
    }
  };

  const handleDeleteSource = async (id) => {
    if (window.confirm('Are you sure you want to delete this source?')) {
      try {
        await sources.delete(id);
        showMessage('✅ Source deleted');
        loadSources();
      } catch (error) {
        showMessage('❌ Error deleting source', 'error');
      }
    }
  };

  const handleStartScrape = async () => {
    setLoading(true);
    try {
      await scraper.startScrape();
      showMessage('✅ Scraping started! Check back in a few minutes.');
      setTimeout(loadStats, 3000);
    } catch (error) {
      showMessage('❌ Error starting scrape', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestTelegram = async () => {
    setLoading(true);
    try {
      const response = await scraper.testTelegram();
      showMessage(`✅ Telegram connected: @${response.data.botName}`);
    } catch (error) {
      showMessage(`❌ ${error.response?.data?.error || 'Telegram test failed'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.logout();
    onLogout();
  };

  return (
    <TerminalWindow title={`$W3J - Admin Panel [${user?.username}]`}>
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title glow-text">$W3J Admin Dashboard</h1>
            <p className="header-subtitle">Web3 Jobs Aggregator Control Panel</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>

        {/* Stats Bar */}
        {stats && (
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-label">Total Jobs</div>
                <div className="stat-value">{stats.total}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <div className="stat-label">Posted to Telegram</div>
                <div className="stat-value">{stats.posted}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🆕</div>
              <div className="stat-info">
                <div className="stat-label">Today</div>
                <div className="stat-value">{stats.today}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🌐</div>
              <div className="stat-info">
                <div className="stat-label">Active Sources</div>
                <div className="stat-value">{sourcesList.filter(s => s.active).length}</div>
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'sources' ? 'active' : ''}`}
            onClick={() => setActiveTab('sources')}
          >
            📡 Sources
          </button>
          <button
            className={`tab ${activeTab === 'scraper' ? 'active' : ''}`}
            onClick={() => setActiveTab('scraper')}
          >
            🤖 Scraper
          </button>
        </div>

        {/* Content */}
        <div className="tab-content">
          {activeTab === 'sources' && (
            <div className="sources-section">
              <div className="section-header">
                <h2>📡 Job Sources</h2>
                <button
                  onClick={() => setShowAddSource(!showAddSource)}
                  className="add-btn"
                >
                  {showAddSource ? '❌ Cancel' : '➕ Add Source'}
                </button>
              </div>

              {showAddSource && (
                <form onSubmit={handleAddSource} className="add-source-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Source Name</label>
                      <input
                        type="text"
                        value={newSource.name}
                        onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                        placeholder="e.g., Web3 Jobs Board"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>URL</label>
                      <input
                        type="url"
                        value={newSource.url}
                        onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                        placeholder="https://example.com/jobs"
                        required
                      />
                    </div>
                  </div>

                  <div className="selectors-section">
                    <h4>CSS Selectors (Optional - for custom scraping)</h4>
                    <div className="form-grid">
                      <input
                        type="text"
                        value={newSource.selectors.jobContainer}
                        onChange={(e) => setNewSource({
                          ...newSource,
                          selectors: { ...newSource.selectors, jobContainer: e.target.value }
                        })}
                        placeholder="Job Container (e.g., .job-listing)"
                      />
                      <input
                        type="text"
                        value={newSource.selectors.title}
                        onChange={(e) => setNewSource({
                          ...newSource,
                          selectors: { ...newSource.selectors, title: e.target.value }
                        })}
                        placeholder="Title selector (e.g., .job-title)"
                      />
                      <input
                        type="text"
                        value={newSource.selectors.company}
                        onChange={(e) => setNewSource({
                          ...newSource,
                          selectors: { ...newSource.selectors, company: e.target.value }
                        })}
                        placeholder="Company selector"
                      />
                      <input
                        type="text"
                        value={newSource.selectors.link}
                        onChange={(e) => setNewSource({
                          ...newSource,
                          selectors: { ...newSource.selectors, link: e.target.value }
                        })}
                        placeholder="Link selector (e.g., a.apply-link)"
                      />
                    </div>
                  </div>

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? '⏳ Adding...' : '✅ Add Source'}
                  </button>
                </form>
              )}

              <div className="sources-list">
                {sourcesList.length === 0 ? (
                  <div className="empty-state">
                    <p>No sources configured yet. Add your first source to get started!</p>
                  </div>
                ) : (
                  sourcesList.map((source) => (
                    <div key={source._id} className={`source-card ${source.active ? 'active' : 'inactive'}`}>
                      <div className="source-header">
                        <h3>{source.name}</h3>
                        <div className="source-actions">
                          <button
                            onClick={() => handleToggleSource(source._id)}
                            className={`toggle-btn ${source.active ? 'active' : ''}`}
                          >
                            {source.active ? '✅ Active' : '❌ Inactive'}
                          </button>
                          <button
                            onClick={() => handleDeleteSource(source._id)}
                            className="delete-btn"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="source-details">
                        <p className="source-url">🔗 {source.url}</p>
                        {source.lastScraped && (
                          <p className="source-meta">
                            🕐 Last scraped: {new Date(source.lastScraped).toLocaleString()}
                          </p>
                        )}
                        <p className="source-meta">📊 Jobs found: {source.jobsFound || 0}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'scraper' && (
            <div className="scraper-section">
              <h2>🤖 Scraper Control</h2>
              
              <div className="action-cards">
                <div className="action-card">
                  <h3>🚀 Manual Scrape</h3>
                  <p>Trigger a manual scrape of all active sources</p>
                  <button
                    onClick={handleStartScrape}
                    disabled={loading}
                    className="action-btn primary"
                  >
                    {loading ? '⏳ Scraping...' : '🚀 Start Scrape Now'}
                  </button>
                </div>

                <div className="action-card">
                  <h3>📱 Test Telegram</h3>
                  <p>Test the Telegram bot connection</p>
                  <button
                    onClick={handleTestTelegram}
                    disabled={loading}
                    className="action-btn secondary"
                  >
                    {loading ? '⏳ Testing...' : '📱 Test Telegram Bot'}
                  </button>
                </div>
              </div>

              <div className="info-box">
                <h4>ℹ️ Automatic Scraping</h4>
                <p>The scraper runs automatically every {process.env.REACT_APP_SCRAPE_INTERVAL || 30} minutes.</p>
                <p>New jobs are automatically posted to the configured Telegram group.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </TerminalWindow>
  );
};

export default Dashboard;
