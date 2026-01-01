import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthLogin.css';

function StaffLogin() {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!staffId || !password) {
        setError('Staff ID and password are required');
        setLoading(false);
        return;
      }

      // Call backend authentication endpoint
      const response = await fetch('http://localhost:4000/api/auth/staff-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ staffId, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Log the received data for debugging
        console.log('Staff data received:', data.staff);
        
        // Store staff data and token in localStorage
        localStorage.setItem('staffToken', 'token_' + Date.now());
        localStorage.setItem('staff', JSON.stringify(data.staff));
        localStorage.setItem('staffId', staffId);
        
        // Verify data was stored
        const storedData = JSON.parse(localStorage.getItem('staff'));
        console.log('Staff data stored in localStorage:', storedData);
        
        // Navigate to staff dashboard
        navigate('/staff-dashboard');
      } else {
        setError(data.error || 'Invalid staff ID or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h1>ETUSL</h1>
          <p>Staff Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="staffId">Staff ID</label>
            <input
              id="staffId"
              type="text"
              placeholder="Enter your staff ID"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
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

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-links">
          <a href="/">Back to Home</a>
        </div>

        <div className="auth-footer">
          <p>© 2026 Educational Technology University</p>
        </div>
      </div>

      <div className="auth-background"></div>
    </div>
  );
}

export default StaffLogin;
