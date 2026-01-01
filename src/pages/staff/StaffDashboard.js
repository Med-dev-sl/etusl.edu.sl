import React, { useEffect, useState } from 'react';
import '../staff/StaffDashboard.css';
import 'antd/dist/reset.css';
import Announcements from '../announcements/Announcements';
import NewsEvents from '../newsevents/NewsEvents';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  SettingOutlined,
  CameraOutlined,
  LogoutOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  GlobalOutlined,
  DownOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  FormOutlined,
  BookOutlined,
  NotificationOutlined,
  FileProtectOutlined,
  HistoryOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  CrownOutlined,
  UserAddOutlined,
  BulbOutlined,
  ProjectOutlined,
  DollarOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  LinkOutlined,
  PictureOutlined,
} from '@ant-design/icons';

export default function StaffDashboard({ onLogout }) {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [allStaff, setAllStaff] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [webPortalOpen, setWebPortalOpen] = useState(false);

  useEffect(() => {
    // Get staff data from localStorage
    const staffData = localStorage.getItem('staff');
    if (staffData) {
      const parsedStaff = JSON.parse(staffData);
      console.log('Staff data from localStorage:', parsedStaff);
      setStaff(parsedStaff);
      setIsSuperAdmin(parsedStaff.role === 'SUPERADMIN');
      
      // Fetch all staff if SUPERADMIN
      if (parsedStaff.role === 'SUPERADMIN') {
        fetchAllStaff();
      }
    }
    setLoading(false);
  }, []);

  const fetchAllStaff = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/staff');
      const data = await response.json();
      if (data.staff) {
        setAllStaff(data.staff);
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile || !staff) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('photo', photoFile);

    try {
      const response = await fetch(`http://localhost:4000/api/staff/${staff.id}/upload-photo`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();

      // Update staff with new photo path
      const updatedStaff = { ...staff, profile_photo: data.photoPath };
      setStaff(updatedStaff);
      localStorage.setItem('staff', JSON.stringify(updatedStaff));
      setPhotoFile(null);
      alert('Profile photo updated successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading photo: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staff');
    onLogout();
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (!staff) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>No staff data found</div>;
  }

  return (
    <div className="staff-dashboard-container">
      <div className="dashboard-header">
        <h1>Staff Dashboard</h1>
        <div className="header-actions">
          {isSuperAdmin && <span className="superadmin-badge"><LockOutlined className="badge-icon" /> SUPERADMIN</span>}
          <button className="logout-btn" onClick={handleLogout}>
            <LogoutOutlined className="logout-icon" /> Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <div className="staff-info-card">
            <div className="profile-photo-section">
              <input 
                type="file" 
                id="photo-input"
                accept="image/*"
                onChange={handlePhotoChange}
                className="photo-input"
              />
              {staff.profile_photo ? (
                <label htmlFor="photo-input" className="photo-clickable">
                  <img 
                    src={`http://localhost:4000${staff.profile_photo}`} 
                    alt="Profile" 
                    className="profile-photo"
                    title="Click to change photo"
                  />
                  <div className="photo-overlay">
                    <CameraOutlined className="camera-icon" /> Change Photo
                  </div>
                </label>
              ) : (
                <label htmlFor="photo-input" className="profile-photo-placeholder">
                  <CameraOutlined className="camera-icon-large" /> Click to Upload Photo
                </label>
              )}
              
              {photoFile && (
                <div className="photo-upload-group">
                  <p className="selected-file">Selected: {photoFile.name}</p>
                  <button 
                    className="upload-btn" 
                    onClick={handlePhotoUpload}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                </div>
              )}
            </div>

            <h2>{staff.name}</h2>
            <p><strong>Staff ID:</strong> {staff.staffId}</p>
            <p><strong>Email:</strong> {staff.email}</p>
            <p><strong>Department:</strong> {staff.department}</p>
            {staff.role && (
              <p><strong>Role:</strong> <span className="role-badge">{staff.role}</span></p>
            )}
            {staff.office_location && (
              <p><strong>Office:</strong> {staff.office_location}</p>
            )}
          </div>

          <div className="menu-section">
            <h3>Menu</h3>
            <button 
              className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <DashboardOutlined className="menu-icon" /> Overview
            </button>
            <button 
              className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <UserOutlined className="menu-icon" /> Profile
            </button>
            <button 
              className={`menu-item ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <FileTextOutlined className="menu-icon" /> Courses
            </button>
            <button 
              className={`menu-item ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <TeamOutlined className="menu-icon" /> Students
            </button>
            {isSuperAdmin && (
              <button 
                className={`menu-item ${activeTab === 'staff-management' ? 'active' : ''}`}
                onClick={() => setActiveTab('staff-management')}
              >
                <SettingOutlined className="menu-icon" /> Staff Management
              </button>
            )}

            <div className="menu-divider"></div>

            <button 
              className={`menu-item web-portal-toggle ${webPortalOpen ? 'active' : ''}`}
              onClick={() => setWebPortalOpen(!webPortalOpen)}
            >
              <GlobalOutlined className="menu-icon" /> Web Portal
              <DownOutlined className={`dropdown-arrow ${webPortalOpen ? 'open' : ''}`} />
            </button>

            {webPortalOpen && (
              <div className="web-portal-dropdown">
                <div className="portal-link">
                  <HomeOutlined className="portal-icon" /> Home
                </div>
                <a href="/" className="portal-link">
                  <InfoCircleOutlined className="portal-icon" /> About
                </a>
                <a href="/" className="portal-link">
                  <FormOutlined className="portal-icon" /> Admission
                </a>
                <a href="/" className="portal-link">
                  <BookOutlined className="portal-icon" /> Academics
                </a>
                <a href="/" className="portal-link">
                  <NotificationOutlined className="portal-icon" /> News & Events
                </a>
                
                <div className="portal-section-divider"></div>
                
                <a href="/" className="portal-link">
                  <FileProtectOutlined className="portal-icon" /> ETUSL Policies
                </a>
                <button 
                  className="portal-link"
                  onClick={() => setActiveTab('announcements')}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: '12px 20px' }}
                >
                  <NotificationOutlined className="portal-icon" /> Announcements
                </button>
                <button 
                  className="portal-link"
                  onClick={() => setActiveTab('news-events')}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: '12px 20px' }}
                >
                  <NotificationOutlined className="portal-icon" /> News & Events
                </button>
                <a href="/" className="portal-link">
                  <HistoryOutlined className="portal-icon" /> History
                </a>
                <a href="/" className="portal-link">
                  <BarChartOutlined className="portal-icon" /> ETUSL University Statistics
                </a>
                <a href="/" className="portal-link">
                  <AppstoreOutlined className="portal-icon" /> Programs
                </a>
                <a href="/" className="portal-link">
                  <TeamOutlined className="portal-icon" /> Faculties
                </a>
                <a href="/" className="portal-link">
                  <CrownOutlined className="portal-icon" /> Leaderships & Directorates
                </a>
                <a href="/" className="portal-link">
                  <UserAddOutlined className="portal-icon" /> Jobs
                </a>
                <a href="/" className="portal-link">
                  <BulbOutlined className="portal-icon" /> Mission & Vision
                </a>
                <a href="/" className="portal-link">
                  <ProjectOutlined className="portal-icon" /> Strategic Plans
                </a>
                <a href="/" className="portal-link">
                  <DollarOutlined className="portal-icon" /> School Fees Structure
                </a>
                <a href="/" className="portal-link">
                  <CalendarOutlined className="portal-icon" /> University Calendar
                </a>
                <a href="/" className="portal-link">
                  <BookOutlined className="portal-icon" /> Library
                </a>
                <a href="/" className="portal-link">
                  <ExperimentOutlined className="portal-icon" /> Research
                </a>
                <a href="/" className="portal-link">
                  <LinkOutlined className="portal-icon" /> Partners and Affiliates
                </a>
                <a href="/" className="portal-link">
                  <PictureOutlined className="portal-icon" /> Gallery
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="main-content">
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h2>Welcome, {staff.name}!</h2>
              <div className="empty-state">
                <p>📊 Dashboard statistics coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2>Profile Information</h2>
              <div className="profile-info">
                <div className="info-group">
                  <label>Full Name</label>
                  <p>{staff.name}</p>
                </div>
                <div className="info-group">
                  <label>Staff ID</label>
                  <p>{staff.staffId}</p>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <p>{staff.email}</p>
                </div>
                <div className="info-group">
                  <label>Department</label>
                  <p>{staff.department}</p>
                </div>
                {staff.phone && (
                  <div className="info-group">
                    <label>Phone</label>
                    <p>{staff.phone}</p>
                  </div>
                )}
                {staff.office_location && (
                  <div className="info-group">
                    <label>Office</label>
                    <p>{staff.office_location}</p>
                  </div>
                )}
                {staff.bio && (
                  <div className="info-group">
                    <label>Bio</label>
                    <p>{staff.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="tab-content">
              <h2>My Courses</h2>
              <div className="empty-state">
                <p>📚 No courses assigned yet</p>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="tab-content">
              <h2>Student Management</h2>
              <div className="empty-state">
                <p>👥 No students assigned yet</p>
              </div>
            </div>
          )}

          {activeTab === 'staff-management' && isSuperAdmin && (
            <div className="tab-content">
              <h2>Staff Management</h2>
              <p style={{ marginBottom: '20px', color: '#666' }}>
                Manage all staff members, assign roles, and control access to the university portal
              </p>
              
              <div className="staff-management-table">
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>Staff ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allStaff.map(staffMember => (
                      <tr key={staffMember.id}>
                        <td>{staffMember.staffId}</td>
                        <td>{staffMember.name}</td>
                        <td>{staffMember.email}</td>
                        <td>{staffMember.department}</td>
                        <td>
                          <span className={`role-badge role-${staffMember.role.toLowerCase()}`}>
                            {staffMember.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${staffMember.status}`}>
                            {staffMember.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn edit-btn"><EditOutlined /> Edit</button>
                          <button className="action-btn delete-btn"><DeleteOutlined /> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="add-staff-section">
                <h3>Add New Staff Member</h3>
                <form className="add-staff-form">
                  <input type="text" placeholder="Staff ID (e.g., ETUSL0004)" required />
                  <input type="text" placeholder="Full Name" required />
                  <input type="email" placeholder="Email" required />
                  <input type="password" placeholder="Password" required />
                  <input type="text" placeholder="Department" />
                  <input type="tel" placeholder="Phone" />
                  <select required>
                    <option value="">Select Role</option>
                    <option value="SUPERADMIN">SUPERADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="FACULTY">FACULTY</option>
                    <option value="STAFF">STAFF</option>
                  </select>
                  <input type="text" placeholder="Office Location" />
                  <button type="submit" className="submit-btn">Add Staff Member</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="tab-content announcements-tab">
              <Announcements />
            </div>
          )}

          {activeTab === 'news-events' && (
            <div className="tab-content news-events-tab">
              <NewsEvents />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
