import React, { useState } from 'react';
import TerminalWindow from '../components/TerminalWindow';
import { auth } from '../utils/api';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await auth.login({ username, password });
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TerminalWindow title="$W3J - Admin Login">
      <div className="login-container">
        <div className="ascii-art">
          <pre>{`
 ███████╗██╗    ██╗██████╗      ██╗
 ██╔════╝██║    ██║╚════██╗     ██║
 ███████╗██║ █╗ ██║ █████╔╝     ██║
 ╚════██║██║███╗██║ ╚═══██╗██   ██║
 ███████║╚███╔███╔╝██████╔╝╚█████╔╝
 ╚══════╝ ╚══╝╚══╝ ╚═════╝  ╚════╝ 
          `}</pre>
        </div>
        
        <div className="login-prompt">
          <p className="glow-text">Web3 Jobs Aggregator - Admin Panel</p>
          <p className="terminal-hint">Enter your credentials to access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <span className="prompt">username@w3j:~$ </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="terminal-input"
              required
              autoFocus
            />
          </div>

          <div className="input-group">
            <span className="prompt">password@w3j:~$ </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="terminal-input"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span> {error}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span>⏳ Authenticating<span className="cursor">_</span></span>
            ) : (
              <span>🚀 Login to Admin Panel</span>
            )}
          </button>
        </form>

        <div className="terminal-footer">
          <p>💡 Tip: Press ENTER to submit</p>
        </div>
      </div>
    </TerminalWindow>
  );
};

export default Login;
