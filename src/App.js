import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/ScrollAnimations.css';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutPreview from './components/AboutPreview';
import AnnouncementsPreview from './components/AnnouncementsPreview';
import NewsEventsPreview from './components/NewsEventsPreview';
import FacultiesPreview from './components/FacultiesPreview';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import Login from './pages/admin/login';
import StudentLogin from './pages/StudentLogin';
import StaffLogin from './pages/StaffLogin';
import About from './pages/about/About';
import Leadership from './pages/leadership/Leadership';
import Partners from './pages/partners/Partners';
import Policies from './pages/policies/Policies';
import StrategicPlan from './pages/strategicplan/StrategicPlan';
import StaffDashboard from './pages/staff/StaffDashboard';
import Announcements from './pages/announcements/Announcements';
import NewsEvents from './pages/newsevents/NewsEvents';
import Faculties from './pages/faculties/Faculties';
import Jobs from './pages/Jobs';
import AssetsRegister from './pages/AssetsRegister';

import FacultiesPublic from './pages/faculties/FacultiesPublic';
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [staffLoggedIn, setStaffLoggedIn] = useState(!!localStorage.getItem('staffToken'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('admin-dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setCurrentPage('home');
  };

  const handleStaffLogout = () => {
    setStaffLoggedIn(false);
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staff');
    localStorage.removeItem('staffId');
  };

  return (
    <Router>
      <Routes>
        {/* Independent Pages */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route 
          path="/staff-dashboard" 
          element={staffLoggedIn ? <StaffDashboard onLogout={handleStaffLogout} /> : <StaffLogin />} 
        />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/news-events" element={<NewsEvents />} />
        <Route path="/faculties" element={<FacultiesPublic />} />
        <Route path="/about" element={<About />} />
        <Route path="/leadership" element={<Leadership />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/strategic-plan" element={<StrategicPlan />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/assets" element={<AssetsRegister />} />

        {/* Main App Routes */}
        <Route
          path="/*"
          element={
            <>
              <Header onNavigate={setCurrentPage} />
              <main className="main-content">
                {renderPage(currentPage, isLoggedIn, handleLoginSuccess, handleLogout, setCurrentPage)}
              </main>
              <footer className="footer">
                <p>&copy; 2026 Educational Technology University. All rights reserved.</p>
              </footer>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

function renderPage(currentPage, isLoggedIn, onLoginSuccess, onLogout, setCurrentPage) {
  if (currentPage === 'admin-login') {
    return <Login onLoginSuccess={onLoginSuccess} />;
  }

  if (!isLoggedIn && (currentPage === 'admin-dashboard' || currentPage === 'admin-users')) {
    return <Login onLoginSuccess={onLoginSuccess} />;
  }

  switch (currentPage) {
    case 'admin-dashboard':
      return <Dashboard onLogout={onLogout} />;
    case 'admin-users':
      return <UserManagement onLogout={onLogout} />;
    default:
      return <HomePage setCurrentPage={setCurrentPage} />;
  }
}

function HomePage({ setCurrentPage }) {
  return (
    <div className="home-page">
      <Hero />
      <AboutPreview />
      <FacultiesPreview />
      <AnnouncementsPreview />
      <NewsEventsPreview />
    </div>
  );
}

export default App;
