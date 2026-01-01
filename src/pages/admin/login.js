import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call - replace with real authentication
    try {
      if (!username || !password) {
        setError('Username and password are required');
        setLoading(false);
        return;
      }

      // Simulated authentication (replace with real backend call)
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (username && password.length >= 6) {
        localStorage.setItem('adminToken', 'token_' + Date.now());
        localStorage.setItem('adminUser', username);
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <h1>ETUSL</h1>
          <p>Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 Educational Technology University</p>
        </div>
      </div>

      <div className="login-background"></div>
    </div>
  );
}

export default Login;
