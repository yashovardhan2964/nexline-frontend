import React, { useState, useEffect, useCallback } from 'react';
import { login, getCounters, callNextToken, completeToken } from '../api/api';
import CounterPanel from '../components/CounterPanel';

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('nexline_token'));
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogout = useCallback(() => {
    localStorage.removeItem('nexline_token');
    setIsLoggedIn(false);
  }, []);

  const fetchCounters = useCallback(async () => {
    try {
      const res = await getCounters();
      setCounters(res.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        handleLogout();
      }
    }
  }, [handleLogout]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCounters();
    }
  }, [isLoggedIn, fetchCounters]);

  const handleLogin = async () => {
    if (!phone || !password) {
      setAuthError('Please enter phone and password');
      return;
    }
    try {
      const res = await login(phone, password);
      localStorage.setItem('nexline_token', res.data.token);
      setIsLoggedIn(true);
      setAuthError('');
    } catch (err) {
      setAuthError('Invalid credentials');
    }
  };

  const handleCallNext = async (counterId) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await callNextToken(counterId);
      setMessage('Now serving: ' + res.data.displayToken);
      fetchCounters();
    } catch (err) {
      setMessage(err.response && err.response.data ? err.response.data.message : 'No waiting tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (tokenId) => {
    setLoading(true);
    setMessage('');
    try {
      await completeToken(tokenId);
      setMessage('Token completed');
      fetchCounters();
    } catch (err) {
      setMessage(err.response && err.response.data ? err.response.data.message : 'Error completing token');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="app">
        <nav className="navbar">
          <h1>NexLine</h1>
          <span style={{ color: '#00d4ff', fontSize: '0.9rem' }}>Admin Portal</span>
        </nav>
        <div className="page-container" style={{ maxWidth: '400px' }}>
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', color: '#1a1a2e' }}>Admin Login</h2>
            {authError && <div className="alert alert-error">{authError}</div>}
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter admin phone"
                value={phone}
                onChange={function(e) { setPhone(e.target.value); }}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={function(e) { setPassword(e.target.value); }}
              />
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem' }}
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h1>NexLine Admin</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: '#00d4ff', fontSize: '0.9rem' }}>Dashboard</span>
          <button
            className="btn btn-danger"
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="page-container">
        {message && (
          <div className="alert alert-success">{message}</div>
        )}
        <h2 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Counter Management</h2>
        {counters.length === 0 ? (
          <div className="card">
            <p style={{ color: '#666', textAlign: 'center' }}>No counters found.</p>
          </div>
        ) : (
          <div className="grid-2">
            {counters.map(function(counter) {
              return (
                <CounterPanel
                  key={counter.id}
                  counter={counter}
                  onCallNext={handleCallNext}
                  onComplete={handleComplete}
                  loading={loading}
                />
              );
            })}
          </div>
        )}
        <button
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
          onClick={fetchCounters}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default AdminPage;