import React, { useState } from 'react';
import './Header.css';

function Header({ onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNavClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-top">
          <div className="container">
            <div className="header-content">
              <div className="logo" onClick={() => handleNavClick('home')}>
                <img src="/logo512.png" alt="ETUSL Logo" className="logo-image" />
                <div className="logo-text">
                  <h1>ETUSL</h1>
                  <p>Eastern Technical University of Sierra Leone</p>
                </div>
              </div>
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        <nav className={`navbar ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="container">
            <ul className="nav-menu">
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#programs">Programs</a></li>
              <li><a href="#admissions">Admissions</a></li>
              <li><a href="#students">Student Life</a></li>
              <li><a href="#faculty">Faculty</a></li>
              <li className="dropdown">
                <a href="#" onClick={(e) => { e.preventDefault(); setDropdownOpen(!dropdownOpen); }}>
                  Quick Links
                  <span className={`arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
                </a>
                <ul className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
                  <li><a href="/staff-login">Staff Login</a></li>
                  <li><a href="/student-login">Student Login</a></li>
                  <li><a href="/jobs">Jobs At ETUSL</a></li>
                  <li><a href="/assets">ETUSL Assets Register</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
