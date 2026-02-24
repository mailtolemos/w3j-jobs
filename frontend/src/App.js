import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JobsBoard from './pages/JobsBoard';
import { auth } from './utils/api';
import './styles/index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await auth.verify();
        if (response.data.valid) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: '#33ff33',
        fontSize: '18px',
        fontFamily: '"Fira Code", monospace'
      }}>
        <div>
          <span>⏳ Initializing $W3J</span>
          <span className="cursor">_</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Jobs Board */}
          <Route path="/" element={<JobsBoard />} />
          <Route path="/jobs" element={<JobsBoard />} />
          
          {/* Admin Login */}
          <Route
            path="/login"
            element={
              user ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />
            }
          />
          
          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              user ? (
                <Dashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          {/* Redirect any unknown routes to jobs board */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
