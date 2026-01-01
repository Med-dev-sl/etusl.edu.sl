import React, { useEffect, useState } from 'react';
import '../announcements/Announcements.css';
import { BellOutlined, CalendarOutlined, UserOutlined, TagOutlined, EditOutlined, DeleteOutlined, PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [staff, setStaff] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [formData, setFormData] = useState({
    headline: '',
    description: '',
    category: 'General',
    status: 'active'
  });

  useEffect(() => {
    const staffData = localStorage.getItem('staff');
    if (staffData) {
      try {
        const parsedStaff = JSON.parse(staffData);
        setStaff(parsedStaff);
        // All logged-in staff can manage announcements
        const hasAccessToManage = !!parsedStaff;
        console.log('Staff loaded:', parsedStaff.name, 'Role:', parsedStaff.role, 'CanManage:', hasAccessToManage);
        setIsSuperAdmin(hasAccessToManage);
      } catch (e) {
        console.error('Error parsing staff data:', e);
      }
    } else {
      console.log('No staff data found in localStorage');
      setIsSuperAdmin(false);
    }
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/announcements');
      const data = await response.json();
      if (data.announcements) {
        setAnnouncements(data.announcements);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!staff) {
      alert('You must be logged in as admin to create announcements');
      return;
    }
    if (!formData.headline || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: formData.headline,
          description: formData.description,
          category: formData.category,
          author_id: staff.id,
          author_name: staff.name,
          status: formData.status || 'active'
        })
      });

      if (response.ok) {
        alert('Announcement created successfully!');
        setFormData({ headline: '', description: '', category: 'General', status: 'active' });
        setShowAddForm(false);
        fetchAnnouncements();
      } else {
        const errorData = await response.json();
        alert('Failed to create announcement: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
      alert('Error creating announcement: ' + err.message);
    }
  };

  const handleEditAnnouncement = async (id) => {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
      setEditingId(id);
      setFormData({
        headline: announcement.headline,
        description: announcement.description,
        category: announcement.category
      });
      setShowAddForm(true);
    }
  };

  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();
    if (!formData.headline || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/announcements/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: formData.headline,
          description: formData.description,
          category: formData.category,
          status: formData.status || 'active'
        })
      });

      if (response.ok) {
        alert('Announcement updated successfully!');
        setFormData({ headline: '', description: '', category: 'General', status: 'active' });
        setEditingId(null);
        setShowAddForm(false);
        fetchAnnouncements();
      } else {
        const errorData = await response.json();
        alert('Failed to update announcement: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating announcement:', err);
      alert('Error updating announcement: ' + err.message);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/announcements/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Announcement deleted successfully!');
          fetchAnnouncements();
        } else {
          alert('Failed to delete announcement');
        }
      } catch (err) {
        console.error('Error deleting announcement:', err);
        alert('Error deleting announcement');
      }
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ headline: '', description: '', category: 'General', status: 'active' });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const announcement = announcements.find(a => a.id === id);
      const response = await fetch(`http://localhost:4000/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: announcement.headline,
          description: announcement.description,
          category: announcement.category,
          status: newStatus
        })
      });

      if (response.ok) {
        fetchAnnouncements();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  const getCategories = () => {
    const categories = new Set(announcements.map(a => a.category));
    return ['All', ...Array.from(categories)];
  };

  const filteredAnnouncements = selectedCategory === 'All' 
    ? announcements 
    : announcements.filter(a => a.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      'Academic': '#0056b3',
      'General': '#6c757d',
      'Event': '#28a745',
      'Maintenance': '#fd7e14',
      'Policy': '#dc3545'
    };
    return colors[category] || '#0056b3';
  };

  if (loading) {
    return (
      <div className="announcements-container">
        <div className="loading-state">
          <p>Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="announcements-container">
      <div className="announcements-header">
        <div className="header-content">
          <BellOutlined className="header-icon" />
          <div>
            <h1>University Announcements</h1>
            <p>Stay updated with the latest news and announcements from ETUSL</p>
          </div>
        </div>
        {isSuperAdmin && staff && (
          <button className="add-announcement-btn" onClick={() => setShowAddForm(true)}>
            <PlusOutlined /> Add Announcement
          </button>
        )}
        {!staff && (
          <div className="login-prompt">
            <span>Please login to manage announcements</span>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="add-announcement-form-container">
          <div className="form-wrapper">
            <h2>{editingId ? 'Edit Announcement' : 'Add New Announcement'}</h2>
            <form onSubmit={editingId ? handleUpdateAnnouncement : handleAddAnnouncement} className="add-announcement-form">
              <div className="form-group">
                <label>Headline *</label>
                <input
                  type="text"
                  placeholder="Enter announcement headline"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  placeholder="Enter detailed announcement description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="8"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Event">Event</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Policy">Policy</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingId ? 'Update Announcement' : 'Create Announcement'}
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancelForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="announcements-filters">
        <div className="category-filters">
          <span className="filter-label">Filter by Category:</span>
          {getCategories().map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="announcements-grid">
        {filteredAnnouncements.length === 0 ? (
          <div className="empty-state">
            <BellOutlined className="empty-icon" />
            <p>No announcements found in this category</p>
          </div>
        ) : (
          filteredAnnouncements.map(announcement => (
            <div key={announcement.id} className="announcement-card">
              <div className="card-header">
                <div className="header-info">
                  <h2 className="announcement-headline">{announcement.headline}</h2>
                  <span 
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(announcement.category) }}
                  >
                    <TagOutlined /> {announcement.category}
                  </span>
                </div>
              </div>

              <div className="card-body">
                <p className="announcement-description">{announcement.description}</p>
              </div>

              <div className="card-footer">
                <div className="footer-left">
                  <div className="footer-item">
                    <CalendarOutlined />
                    <span className="timestamp">{formatDate(announcement.created_at)}</span>
                  </div>
                  {announcement.author_name && (
                    <div className="footer-item">
                      <UserOutlined />
                      <span className="author">{announcement.author_name}</span>
                    </div>
                  )}
                </div>
                <div className="footer-right">
                  {announcement.status === 'active' ? (
                    <span className="status-badge active">
                      <CheckCircleOutlined /> Active
                    </span>
                  ) : (
                    <span className="status-badge inactive">
                      <CloseCircleOutlined /> Inactive
                    </span>
                  )}
                  {isSuperAdmin && (
                    <div className="action-buttons">
                      <button 
                        className="toggle-btn"
                        onClick={() => handleToggleStatus(announcement.id, announcement.status)}
                        title={announcement.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {announcement.status === 'active' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                      </button>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditAnnouncement(announcement.id)}
                        title="Edit"
                      >
                        <EditOutlined />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        title="Delete"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
