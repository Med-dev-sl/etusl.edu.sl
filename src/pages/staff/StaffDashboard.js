import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../staff/StaffDashboard.css';
import 'antd/dist/reset.css';
import Announcements from '../announcements/Announcements';
import NewsEvents from '../newsevents/NewsEvents';
import Faculties from '../faculties/Faculties';
import MissionVisionManager from '../../components/MissionVisionManager';
import HistoryManager from '../../components/HistoryManager';
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
  const [missionText, setMissionText] = useState('');
  const [visionText, setVisionText] = useState('');
  const [mvLoading, setMvLoading] = useState(false);
  const [mvSaving, setMvSaving] = useState(false);
  const [showMVModal, setShowMVModal] = useState(false);
  const [mvModalLoading, setMvModalLoading] = useState(false);
  const [mvModalContent, setMvModalContent] = useState({ mission: '', vision: '' });

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
            {isSuperAdmin && (
              <button 
                className={`menu-item ${activeTab === 'mission-vision' ? 'active' : ''}`}
                onClick={() => setActiveTab('mission-vision')}
              >
                <BulbOutlined className="menu-icon" /> Mission & Vision Mgmt
              </button>
            )}
            {isSuperAdmin && (
              <button 
                className={`menu-item ${activeTab === 'history-mgmt' ? 'active' : ''}`}
                onClick={() => setActiveTab('history-mgmt')}
              >
                <HistoryOutlined className="menu-icon" /> History Mgmt
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
                {isSuperAdmin ? (
                  <button
                    className="portal-link"
                    onClick={() => { setActiveTab('history-mgmt'); setWebPortalOpen(false); }}
                    style={{ border: 'none', background: 'none', textAlign: 'left', padding: '12px 20px', width: '100%', cursor: 'pointer' }}
                  >
                    <HistoryOutlined className="portal-icon" /> History
                  </button>
                ) : (
                  <Link to="/about#history" className="portal-link" onClick={() => setWebPortalOpen(false)}>
                    <HistoryOutlined className="portal-icon" /> History
                  </Link>
                )}
                <a href="/" className="portal-link">
                  <BarChartOutlined className="portal-icon" /> ETUSL University Statistics
                </a>
                <a href="/" className="portal-link">
                  <AppstoreOutlined className="portal-icon" /> Programs
                </a>
                <button 
                  className="portal-link"
                  onClick={() => setActiveTab('faculties')}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: '12px 20px' }}
                >
                  <TeamOutlined className="portal-icon" /> Faculties
                </button>
                <a href="/" className="portal-link">
                  <CrownOutlined className="portal-icon" /> Leaderships & Directorates
                </a>
                <a href="/" className="portal-link">
                  <UserAddOutlined className="portal-icon" /> Jobs
                </a>
                <button
                  className="portal-link"
                  onClick={async () => {
                    setMvModalLoading(true);
                    try {
                      const res = await fetch('http://localhost:4000/api/mission-vision/active');
                        const data = await res.json();
                        // data.mission and data.vision are objects { id, content } or null
                        setMvModalContent({ mission: data.mission || null, vision: data.vision || null });
                      setShowMVModal(true);
                    } catch (err) {
                      console.error(err);
                      alert('Failed to load mission & vision');
                    } finally {
                      setMvModalLoading(false);
                    }
                  }}
                  style={{ border: 'none', background: 'none', textAlign: 'left', padding: '12px 20px', width: '100%', cursor: 'pointer' }}
                >
                  <BulbOutlined className="portal-icon" /> Mission & Vision
                </button>
                {isSuperAdmin ? (
                  <button
                    className="portal-link"
                    onClick={() => { setActiveTab('history-mgmt'); setWebPortalOpen(false); }}
                    style={{ border: 'none', background: 'none', textAlign: 'left', padding: '12px 20px', width: '100%', cursor: 'pointer' }}
                  >
                    <HistoryOutlined className="portal-icon" /> History
                  </button>
                ) : (
                  <button
                    className="portal-link"
                    onClick={async () => {
                      try {
                        const res = await fetch('http://localhost:4000/api/history/active');
                        const data = await res.json();
                        sessionStorage.setItem('history_modal', JSON.stringify(data.items || []));
                        setMvModalContent(prev => ({ ...prev, history: data.items || [] }));
                        setShowMVModal(true);
                      } catch (err) {
                        console.error(err);
                        alert('Failed to load history');
                      }
                    }}
                    style={{ border: 'none', background: 'none', textAlign: 'left', padding: '12px 20px', width: '100%', cursor: 'pointer' }}
                  >
                    <HistoryOutlined className="portal-icon" /> History
                  </button>
                )}
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

          {activeTab === 'faculties' && (
            <div className="tab-content faculties-tab">
              <Faculties />
            </div>
          )}

          {activeTab === 'mission-vision' && (
            <div className="tab-content mission-vision-tab">
              <MissionVisionManager />
            </div>
          )}
          {activeTab === 'history-mgmt' && (
            <div className="tab-content history-mgmt-tab">
              <HistoryManager />
            </div>
          )}
        </div>
      </div>
      {showMVModal && (
        <div className="mv-modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4000 }}>
          <div className="mv-modal" style={{ background: '#fff', padding: 24, width: '90%', maxWidth: 900, borderRadius: 8, maxHeight: '90%', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Mission & Vision</h2>
              <button onClick={() => setShowMVModal(false)} style={{ fontSize: 18, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            {/* If history present, render timeline */}
            {mvModalContent.history && mvModalContent.history.length > 0 ? (
              <div style={{ marginTop: 12 }}>
                <h3>History Timeline</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {mvModalContent.history.map(h => (
                    <li key={h.id} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ minWidth: 80, fontWeight: 700 }}>{h.year}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>{h.title}</div>
                          <div style={{ color: '#444', whiteSpace: 'pre-wrap' }}>{h.description}</div>
                        </div>
                        {isSuperAdmin && (
                          <div style={{ marginLeft: 12 }}>
                            <button onClick={() => { sessionStorage.setItem('history_edit', JSON.stringify(h)); setShowMVModal(false); setActiveTab('history-mgmt'); }} style={{ marginRight: 8 }}>Edit</button>
                            <button onClick={async () => { if (!window.confirm('Delete this history entry?')) return; try { const dres = await fetch(`http://localhost:4000/api/history/${h.id}`, { method: 'DELETE' }); if (!dres.ok) throw new Error('Delete failed'); const reload = await fetch('http://localhost:4000/api/history/active'); const newData = await reload.json(); setMvModalContent(prev => ({ ...prev, history: newData.items || [] })); alert('Deleted'); } catch(err){console.error(err); alert('Delete failed');} }}>Delete</button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <div style={{ marginTop: 12 }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>Our Mission
                    {isSuperAdmin && mvModalContent.mission && (
                      <span style={{ marginLeft: 'auto' }}>
                        <button onClick={() => { sessionStorage.setItem('mv_edit', JSON.stringify({ id: mvModalContent.mission.id, type: 'mission', content: mvModalContent.mission.content })); setShowMVModal(false); setActiveTab('mission-vision'); }} style={{ marginRight: 8 }}>Edit</button>
                        <button onClick={async () => { if (!window.confirm('Delete mission?')) return; try { const dres = await fetch(`http://localhost:4000/api/mission-vision/${mvModalContent.mission.id}`, { method: 'DELETE' }); if (!dres.ok) throw new Error('Delete failed'); const reload = await fetch('http://localhost:4000/api/mission-vision/active'); const newData = await reload.json(); setMvModalContent({ mission: newData.mission || null, vision: newData.vision || null }); alert('Deleted'); } catch(err){console.error(err); alert('Delete failed');} }}>Delete</button>
                      </span>
                    )}
                  </h3>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{mvModalLoading ? 'Loading...' : (mvModalContent.mission ? mvModalContent.mission.content : 'Mission not available')}</p>
                </div>

                <div style={{ marginTop: 12 }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>Our Vision
                    {isSuperAdmin && mvModalContent.vision && (
                      <span style={{ marginLeft: 'auto' }}>
                        <button onClick={() => { sessionStorage.setItem('mv_edit', JSON.stringify({ id: mvModalContent.vision.id, type: 'vision', content: mvModalContent.vision.content })); setShowMVModal(false); setActiveTab('mission-vision'); }} style={{ marginRight: 8 }}>Edit</button>
                        <button onClick={async () => { if (!window.confirm('Delete vision?')) return; try { const dres = await fetch(`http://localhost:4000/api/mission-vision/${mvModalContent.vision.id}`, { method: 'DELETE' }); if (!dres.ok) throw new Error('Delete failed'); const reload = await fetch('http://localhost:4000/api/mission-vision/active'); const newData = await reload.json(); setMvModalContent({ mission: newData.mission || null, vision: newData.vision || null }); alert('Deleted'); } catch(err){console.error(err); alert('Delete failed');} }}>Delete</button>
                      </span>
                    )}
                  </h3>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{mvModalLoading ? 'Loading...' : (mvModalContent.vision ? mvModalContent.vision.content : 'Vision not available')}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
