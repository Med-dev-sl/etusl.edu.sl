import React, { useState } from 'react';
import './PageTemplate.css';

function AssetsRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    assetType: '',
    assetDescription: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).every(val => val)) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', department: '', assetType: '', assetDescription: '' });
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>ETUSL Assets Register</h1>
        <p>Register Your Assets</p>
      </div>

      <div className="page-content">
        <div className="form-wrapper">
          {submitted && (
            <div className="success-message">
              ✓ Asset registered successfully! Thank you.
            </div>
          )}

          <form onSubmit={handleSubmit} className="assets-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                placeholder="Enter your department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Asset Type</label>
              <select
                name="assetType"
                value={formData.assetType}
                onChange={handleChange}
                required
              >
                <option value="">Select Asset Type</option>
                <option value="Computer">Computer</option>
                <option value="Laptop">Laptop</option>
                <option value="Printer">Printer</option>
                <option value="Server">Server</option>
                <option value="Software">Software License</option>
                <option value="Equipment">Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Asset Description</label>
              <textarea
                name="assetDescription"
                placeholder="Describe the asset (model, specifications, etc.)"
                value={formData.assetDescription}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">Register Asset</button>
          </form>
        </div>
      </div>

      <div className="page-footer">
        <a href="/">← Back to Home</a>
        <p>© 2026 Educational Technology University</p>
      </div>
    </div>
  );
}

export default AssetsRegister;
