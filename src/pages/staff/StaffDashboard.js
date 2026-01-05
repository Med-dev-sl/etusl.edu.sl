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
  const [campuses, setCampuses] = useState([]);
  const [leadershipItems, setLeadershipItems] = useState([]);
  const [affiliatesItems, setAffiliatesItems] = useState([]);
  const [campusUploading, setCampusUploading] = useState(false);
  const [affiliateName, setAffiliateName] = useState('');
  const [affiliateType, setAffiliateType] = useState('affiliate');
  const [affiliateWebsite, setAffiliateWebsite] = useState('');
  const [affiliateEmail, setAffiliateEmail] = useState('');
  const [affiliateDescription, setAffiliateDescription] = useState('');
  const [affiliateImageFile, setAffiliateImageFile] = useState(null);
  const [editingAffiliateId, setEditingAffiliateId] = useState(null);
  const [campusName, setCampusName] = useState('');
  const [campusLocationField, setCampusLocationField] = useState('');
  const [campusDescriptionField, setCampusDescriptionField] = useState('');
  const [campusImageFile, setCampusImageFile] = useState(null);
  const [editingCampusId, setEditingCampusId] = useState(null);

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

  const loadCampuses = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/campuses');
      if (!res.ok) return;
      const data = await res.json();
      setCampuses(data.items || []);
    } catch (err) {
      console.error('Failed to load campuses', err);
    }
  };

  const loadLeadership = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/leadership');
      if (!res.ok) {
        console.error('Leadership fetch failed', res.status);
        setLeadershipItems([]);
        return;
      }
      const data = await res.json();
      const items = data.items || [];
      setLeadershipItems(items);
    } catch (err) { console.error('Failed to load leadership list', err); setLeadershipItems([]); }
  };

  const handleDeleteLeadership = async (id) => {
    if (!window.confirm('Delete entry?')) return;
    try {
      const dres = await fetch(`http://localhost:4000/api/leadership/${id}`, { method: 'DELETE' });
      if (!dres.ok) throw new Error('Delete failed');
      alert('Deleted');
      await loadLeadership();
    } catch (err) { console.error(err); alert('Delete failed'); }
  };

  const handleEditLeadership = async (id) => {
    try {
      const r = await fetch(`http://localhost:4000/api/leadership/${id}`);
      if (!r.ok) throw new Error('Failed to load');
      const dd = await r.json();
      const it = dd.item;
      sessionStorage.setItem('lead_edit_id', it.id);
      document.getElementById('lead-name').value = it.name || '';
      document.getElementById('lead-title').value = it.title || '';
      document.getElementById('lead-location').value = it.location || '';
      document.getElementById('lead-description').value = it.description || '';
      document.getElementById('lead-type').value = it.type || 'leader';
      const el = document.getElementById('leadership-table-container');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } catch (err) { console.error(err); alert('Load failed'); }
  };

  const loadAffiliates = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/affiliates');
      if (!res.ok) return setAffiliatesItems([]);
      const data = await res.json();
      setAffiliatesItems(data.items || []);
    } catch (err) {
      console.error('Failed to load affiliates', err);
      setAffiliatesItems([]);
    }
  };

  const handleEditAffiliate = async (id) => {
    try {
      const r = await fetch(`http://localhost:4000/api/affiliates/${id}`);
      if (!r.ok) throw new Error('Failed to load');
      const dd = await r.json();
      const it = dd.item;
      setEditingAffiliateId(it.id);
      setAffiliateName(it.name || '');
      setAffiliateType(it.type || 'affiliate');
      setAffiliateWebsite(it.website || '');
      setAffiliateEmail(it.email || '');
      setAffiliateDescription(it.description || '');
      const el = document.getElementById('affiliates-table-container'); if (el) el.scrollIntoView({ behavior: 'smooth' });
    } catch (err) { console.error(err); alert('Load failed'); }
  };

  const handleDeleteAffiliate = async (id) => {
    if (!window.confirm('Delete affiliate/partner?')) return;
    try {
      const dres = await fetch(`http://localhost:4000/api/affiliates/${id}`, { method: 'DELETE' });
      if (!dres.ok) throw new Error('Delete failed');
      alert('Deleted');
      await loadAffiliates();
    } catch (err) { console.error(err); alert('Delete failed'); }
  };

  useEffect(() => {
    if (isSuperAdmin) loadLeadership();
    if (isSuperAdmin) loadAffiliates();
  }, [isSuperAdmin]);

  useEffect(() => {
    if (isSuperAdmin) loadCampuses();
  }, [isSuperAdmin]);

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
              {isSuperAdmin && (
                <button
                  className={`menu-item ${activeTab === 'campuses-mgmt' ? 'active' : ''}`}
                  onClick={() => setActiveTab('campuses-mgmt')}
                >
                  <PictureOutlined className="menu-icon" /> Campuses Mgmt
                </button>
              )}
              {isSuperAdmin && (
                <button
                  className={`menu-item ${activeTab === 'leadership-mgmt' ? 'active' : ''}`}
                  onClick={() => setActiveTab('leadership-mgmt')}
                >
                  <CrownOutlined className="menu-icon" /> Leadership Mgmt
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
                
                <a href="/policies" className="portal-link" onClick={() => setWebPortalOpen(false)}>
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
                {isSuperAdmin ? (
                  <button
                    className="portal-link"
                    onClick={() => { setActiveTab('campuses-mgmt'); setWebPortalOpen(false); }}
                    style={{ border: 'none', background: 'none', textAlign: 'left', padding: '12px 20px', width: '100%', cursor: 'pointer' }}
                  >
                    <PictureOutlined className="portal-icon" /> Campuses
                  </button>
                ) : (
                  <a href="/about#campuses" className="portal-link">
                    <PictureOutlined className="portal-icon" /> Campuses
                  </a>
                )}
                {isSuperAdmin ? (
                  <button
                    className="portal-link"
                    onClick={() => { setActiveTab('affiliates-mgmt'); setWebPortalOpen(false); }}
                    style={{ border: 'none', background: 'none', textAlign: 'left', padding: '12px 20px', width: '100%', cursor: 'pointer' }}
                  >
                    <LinkOutlined className="portal-icon" /> Affiliates & Partners
                  </button>
                ) : (
                  <a href="/partners" className="portal-link">
                    <LinkOutlined className="portal-icon" /> Affiliates & Partners
                  </a>
                )}
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
          {activeTab === 'affiliates-mgmt' && isSuperAdmin && (
            <div className="tab-content affiliates-mgmt-tab">
              <h2>Affiliates & Partners Management</h2>
              <p style={{ color: '#666' }}>Add, edit, or remove affiliates and partners visible on the public Affiliates & Partners page.</p>

              <div className="affiliate-form" style={{ marginTop: 16, marginBottom: 24 }}>
                <h3>Add / Edit</h3>
                <input type="text" value={affiliateName} onChange={e => setAffiliateName(e.target.value)} placeholder="Name" style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }} />
                <select value={affiliateType} onChange={e => setAffiliateType(e.target.value)} style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }}>
                  <option value="affiliate">Affiliate</option>
                  <option value="partner">Partner</option>
                </select>
                <input type="text" value={affiliateWebsite} onChange={e => setAffiliateWebsite(e.target.value)} placeholder="Website (optional)" style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }} />
                <input type="email" value={affiliateEmail} onChange={e => setAffiliateEmail(e.target.value)} placeholder="Email (optional)" style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }} />
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Brief Info / Biography</label>
                <textarea value={affiliateDescription} onChange={e => setAffiliateDescription(e.target.value)} placeholder="Brief information about the affiliate or partner" rows={6} style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }} />
                <input type="file" onChange={e => setAffiliateImageFile(e.target.files && e.target.files[0])} accept="image/*" style={{ display: 'block', marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={async () => {
                    if (!affiliateName) return alert('Please provide a name');
                    try {
                      const fd = new FormData();
                      fd.append('name', affiliateName);
                      fd.append('type', affiliateType);
                      fd.append('website', affiliateWebsite);
                      fd.append('email', affiliateEmail);
                      fd.append('description', affiliateDescription);
                      fd.append('status', 'active');
                      if (affiliateImageFile) fd.append('image', affiliateImageFile);

                      if (editingAffiliateId) {
                        const res = await fetch(`http://localhost:4000/api/affiliates/${editingAffiliateId}`, { method: 'PUT', body: fd });
                        if (!res.ok) throw new Error('Update failed');
                        alert('Updated');
                        setEditingAffiliateId(null);
                      } else {
                        const res = await fetch('http://localhost:4000/api/affiliates', { method: 'POST', body: fd });
                        if (!res.ok) throw new Error('Create failed');
                        alert('Created');
                      }
                      // reset
                      setAffiliateName(''); setAffiliateType('affiliate'); setAffiliateWebsite(''); setAffiliateEmail(''); setAffiliateDescription(''); setAffiliateImageFile(null);
                      await loadAffiliates();
                    } catch (err) { console.error(err); alert('Save failed'); }
                  }} className="submit-btn">{editingAffiliateId ? 'Save Changes' : 'Add'}</button>

                  {editingAffiliateId && (
                    <button onClick={() => { setEditingAffiliateId(null); setAffiliateName(''); setAffiliateType('affiliate'); setAffiliateWebsite(''); setAffiliateEmail(''); setAffiliateDescription(''); setAffiliateImageFile(null); }}>Cancel</button>
                  )}
                </div>
              </div>

              <div className="affiliate-list">
                <h3>Existing Affiliates & Partners</h3>
                <div id="affiliates-table-container" style={{ marginTop: 12 }}>
                  {affiliatesItems.length === 0 ? (
                    <p>No affiliates or partners yet.</p>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                          <th style={{ textAlign: 'left', padding: 8 }}>Type</th>
                          <th style={{ textAlign: 'left', padding: 8 }}>Website</th>
                          <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {affiliatesItems.map(a => (
                          <tr key={a.id}>
                            <td style={{ padding: 8 }}>{a.name}</td>
                            <td style={{ padding: 8 }}>{a.type}</td>
                            <td style={{ padding: 8 }}>{a.website ? <a href={a.website} target="_blank" rel="noreferrer">Link</a> : ''}</td>
                            <td style={{ padding: 8 }}>
                              <button onClick={() => handleEditAffiliate(a.id)} style={{ marginRight: 8 }}>Edit</button>
                              <button onClick={() => handleDeleteAffiliate(a.id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
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
          {activeTab === 'campuses-mgmt' && isSuperAdmin && (
            <div className="tab-content campuses-mgmt-tab">
              <h2>Campuses Management</h2>
              <p style={{ color: '#666' }}>Add, edit, or remove campus entries visible on the public About page.</p>

              <div className="campus-form" style={{ marginTop: 16, marginBottom: 24 }}>
                <h3>{editingCampusId ? 'Edit Campus' : 'Add New Campus'}</h3>
                <input type="text" value={campusName} onChange={e => setCampusName(e.target.value)} placeholder="Campus name" style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }} />
                <input type="text" value={campusLocationField} onChange={e => setCampusLocationField(e.target.value)} placeholder="Location" style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }} />
                <textarea value={campusDescriptionField} onChange={e => setCampusDescriptionField(e.target.value)} placeholder="Description" rows={4} style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }} />
                <input type="file" onChange={e => { if (e.target.files && e.target.files[0]) setCampusImageFile(e.target.files[0]); }} accept="image/*" style={{ display: 'block', marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={async () => {
                    if (!campusName.trim()) return alert('Please provide a campus name');
                    setCampusUploading(true);
                    try {
                      const fd = new FormData();
                      fd.append('name', campusName.trim());
                      fd.append('location', campusLocationField.trim());
                      fd.append('description', campusDescriptionField.trim());
                      fd.append('status', 'active');
                      if (campusImageFile) fd.append('image', campusImageFile);

                      if (editingCampusId) {
                        const res = await fetch(`http://localhost:4000/api/campuses/${editingCampusId}`, { method: 'PUT', body: fd });
                        if (!res.ok) throw new Error('Failed to update campus');
                        alert('Campus updated');
                      } else {
                        const res = await fetch('http://localhost:4000/api/campuses', { method: 'POST', body: fd });
                        if (!res.ok) throw new Error('Failed to add campus');
                        alert('Campus added');
                      }

                      await loadCampuses();
                      // reset form
                      setCampusName('');
                      setCampusLocationField('');
                      setCampusDescriptionField('');
                      setCampusImageFile(null);
                      setEditingCampusId(null);
                      // reset file input visually
                      const inp = document.querySelector('.campus-form input[type=file]');
                      if (inp) inp.value = '';
                    } catch (err) {
                      console.error(err);
                      alert(editingCampusId ? 'Update failed' : 'Add campus failed');
                    } finally {
                      setCampusUploading(false);
                    }
                  }} disabled={campusUploading} className="submit-btn">{campusUploading ? 'Saving...' : (editingCampusId ? 'Save Changes' : 'Add Campus')}</button>

                  {editingCampusId && (
                    <button onClick={() => {
                      setEditingCampusId(null);
                      setCampusName('');
                      setCampusLocationField('');
                      setCampusDescriptionField('');
                      setCampusImageFile(null);
                      const inp = document.querySelector('.campus-form input[type=file]');
                      if (inp) inp.value = '';
                    }}>Cancel</button>
                  )}
                </div>
              </div>

              <div className="campus-list">
                <h3>Existing Campuses</h3>
                <div style={{ marginTop: 12 }}>
                  {campuses.length === 0 ? (
                    <p>No campuses yet.</p>
                  ) : (
                    <table className="management-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                          <th style={{ textAlign: 'left', padding: 8 }}>Location</th>
                          <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campuses.map(c => (
                          <tr key={c.id}>
                            <td style={{ padding: 8 }}>{c.name}</td>
                            <td style={{ padding: 8 }}>{c.location}</td>
                            <td style={{ padding: 8 }}>
                              <button onClick={async () => {
                                // populate edit form
                                try {
                                  const res = await fetch(`http://localhost:4000/api/campuses/${c.id}`);
                                  if (!res.ok) throw new Error('Failed to load campus');
                                  const data = await res.json();
                                  const campus = data.campus;
                                  setEditingCampusId(campus.id);
                                  setCampusName(campus.name || '');
                                  setCampusLocationField(campus.location || '');
                                  setCampusDescriptionField(campus.description || '');
                                  setCampusImageFile(null);
                                  // scroll to form
                                  const el = document.querySelector('.campus-form');
                                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                } catch (err) { console.error(err); alert('Failed to load campus for edit'); }
                              }} style={{ marginRight: 8 }}>Edit</button>

                              <button onClick={async () => {
                                if (!window.confirm('Delete campus?')) return;
                                try {
                                  const dres = await fetch(`http://localhost:4000/api/campuses/${c.id}`, { method: 'DELETE' });
                                  if (!dres.ok) throw new Error('Delete failed');
                                  alert('Deleted');
                                  await loadCampuses();
                                } catch (err) { console.error(err); alert('Delete failed'); }
                              }} style={{ marginRight: 8 }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'leadership-mgmt' && isSuperAdmin && (
            <div className="tab-content leadership-mgmt-tab">
              <h2>Leadership & Directorates Management</h2>
              <p style={{ color: '#666' }}>Add, edit, or remove leadership and directorate entries visible on the public Leadership page.</p>

              <div className="leadership-form" style={{ marginTop: 16, marginBottom: 24 }}>
                <h3>{/* dynamic title set below */}Add / Edit Entry</h3>
                <select value={/* type select */ (editingCampusId && 'leader') || 'leader'} disabled style={{ display: 'none' }} />
                <input type="text" id="lead-name" placeholder="Name or Directorate" style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }} />
                <input type="text" id="lead-title" placeholder="Title (leave blank for directorates)" style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }} />
                <input type="text" id="lead-location" placeholder="Location" style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }} />
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Biography</label>
                <textarea id="lead-description" placeholder="Biography (full details)" rows={8} style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }} />
                <select id="lead-type" style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }}>
                  <option value="leader">Leader</option>
                  <option value="directorate">Directorate</option>
                </select>
                <input type="file" id="lead-image" accept="image/*" style={{ display: 'block', marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={async () => {
                    const name = document.getElementById('lead-name').value.trim();
                    const title = document.getElementById('lead-title').value.trim();
                    const location = document.getElementById('lead-location').value.trim();
                    const description = document.getElementById('lead-description').value.trim();
                    const type = document.getElementById('lead-type').value;
                    const fileInput = document.getElementById('lead-image');
                    if (!name) return alert('Please provide a name');
                    try {
                      const fd = new FormData();
                      fd.append('name', name);
                      fd.append('title', title);
                      fd.append('location', location);
                      fd.append('description', description);
                      fd.append('type', type);
                      fd.append('status', 'active');
                      if (fileInput.files && fileInput.files[0]) fd.append('image', fileInput.files[0]);

                      // If editing, use selected id stored in sessionStorage
                      const editingId = sessionStorage.getItem('lead_edit_id');
                      if (editingId) {
                        const res = await fetch(`http://localhost:4000/api/leadership/${editingId}`, { method: 'PUT', body: fd });
                        if (!res.ok) throw new Error('Update failed');
                        alert('Updated');
                        sessionStorage.removeItem('lead_edit_id');
                      } else {
                        const res = await fetch('http://localhost:4000/api/leadership', { method: 'POST', body: fd });
                        if (!res.ok) throw new Error('Create failed');
                        alert('Created');
                      }
                      // reset
                      document.getElementById('lead-name').value = '';
                      document.getElementById('lead-title').value = '';
                      document.getElementById('lead-location').value = '';
                      document.getElementById('lead-description').value = '';
                      document.getElementById('lead-type').value = 'leader';
                      if (fileInput) fileInput.value = '';
                      await loadLeadership();
                    } catch (err) { console.error(err); alert('Save failed'); }
                  }} className="submit-btn">Save</button>

                  <button onClick={() => {
                    sessionStorage.removeItem('lead_edit_id');
                    document.getElementById('lead-name').value = '';
                    document.getElementById('lead-title').value = '';
                    document.getElementById('lead-location').value = '';
                    document.getElementById('lead-description').value = '';
                    document.getElementById('lead-type').value = 'leader';
                    const fi = document.getElementById('lead-image'); if (fi) fi.value = '';
                  }}>Clear</button>
                </div>
              </div>

              <div className="leadership-list">
                <h3>Existing Entries</h3>
                <div style={{ marginTop: 12 }}>
                  <div id="leadership-table-container">
                    {leadershipItems && leadershipItems.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>Type</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>Location</th>
                            <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leadershipItems.map(it => (
                            <tr key={it.id}>
                              <td style={{ padding: 8 }}>{it.name}</td>
                              <td style={{ padding: 8 }}>{it.type}</td>
                              <td style={{ padding: 8 }}>{it.location || ''}</td>
                              <td style={{ padding: 8 }}>
                                <button onClick={() => handleEditLeadership(it.id)} style={{ marginRight: 8 }}>Edit</button>
                                <button onClick={() => handleDeleteLeadership(it.id)}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No entries yet.</p>
                    )}
                  </div>
                </div>
              </div>
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
