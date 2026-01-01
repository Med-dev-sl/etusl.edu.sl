import React, { useEffect, useState } from 'react';
import './NewsEvents.css';
import {
  BellOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CloseOutlined,
} from '@ant-design/icons';

export default function NewsEvents() {
  const [newsEvents, setNewsEvents] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    headline: '',
    description: '',
    event_time: '',
    location: '',
    event_type: 'event',
    status: 'active'
  });

  useEffect(() => {
    const staffData = localStorage.getItem('staff');
    if (staffData) {
      setStaff(JSON.parse(staffData));
    }
    fetchNewsEvents();
  }, []);

  const fetchNewsEvents = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/news-events');
      const data = await response.json();
      if (data.newsEvents) {
        setNewsEvents(data.newsEvents);
      }
    } catch (err) {
      console.error('Failed to fetch news & events:', err);
      alert('Error loading news & events');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNewsEvent = async () => {
    if (!formData.headline.trim() || !formData.description.trim()) {
      alert('Headline and description are required');
      return;
    }

    if (formData.event_type === 'event' && !formData.event_time) {
      alert('Event date and time are required for events');
      return;
    }

    const submitData = new FormData();
    submitData.append('headline', formData.headline);
    submitData.append('description', formData.description);
    submitData.append('event_time', formData.event_time || null);
    submitData.append('location', formData.location);
    submitData.append('event_type', formData.event_type);
    submitData.append('author_id', staff.id);
    submitData.append('author_name', staff.name);
    submitData.append('status', formData.status);
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const response = await fetch('http://localhost:4000/api/news-events', {
        method: 'POST',
        body: submitData
      });

      if (!response.ok) throw new Error('Failed to create news/event');

      alert('News/Event created successfully!');
      resetForm();
      fetchNewsEvents();
    } catch (err) {
      console.error('Error creating news/event:', err);
      alert('Error creating news/event: ' + err.message);
    }
  };

  const handleEditNewsEvent = (newsEvent) => {
    setEditingId(newsEvent.id);
    setFormData({
      headline: newsEvent.headline,
      description: newsEvent.description,
      event_time: newsEvent.event_time ? newsEvent.event_time.slice(0, 16) : '',
      location: newsEvent.location || '',
      event_type: newsEvent.event_type,
      status: newsEvent.status
    });
    if (newsEvent.image_path) {
      setImagePreview(`http://localhost:4000${newsEvent.image_path}`);
    }
    setShowAddForm(true);
  };

  const handleUpdateNewsEvent = async () => {
    if (!formData.headline.trim() || !formData.description.trim()) {
      alert('Headline and description are required');
      return;
    }

    const submitData = new FormData();
    submitData.append('headline', formData.headline);
    submitData.append('description', formData.description);
    submitData.append('event_time', formData.event_time || null);
    submitData.append('location', formData.location);
    submitData.append('event_type', formData.event_type);
    submitData.append('status', formData.status);
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const response = await fetch(`http://localhost:4000/api/news-events/${editingId}`, {
        method: 'PUT',
        body: submitData
      });

      if (!response.ok) throw new Error('Failed to update news/event');

      alert('News/Event updated successfully!');
      resetForm();
      fetchNewsEvents();
    } catch (err) {
      console.error('Error updating news/event:', err);
      alert('Error updating news/event: ' + err.message);
    }
  };

  const handleDeleteNewsEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this news/event?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/news-events/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete');

        alert('News/Event deleted successfully!');
        fetchNewsEvents();
      } catch (err) {
        console.error('Error deleting news/event:', err);
        alert('Error deleting news/event: ' + err.message);
      }
    }
  };

  const handleToggleStatus = async (newsEvent) => {
    const newStatus = newsEvent.status === 'active' ? 'inactive' : 'active';
    
    const submitData = new FormData();
    submitData.append('headline', newsEvent.headline);
    submitData.append('description', newsEvent.description);
    submitData.append('event_time', newsEvent.event_time || null);
    submitData.append('location', newsEvent.location);
    submitData.append('event_type', newsEvent.event_type);
    submitData.append('status', newStatus);

    try {
      const response = await fetch(`http://localhost:4000/api/news-events/${newsEvent.id}`, {
        method: 'PUT',
        body: submitData
      });

      if (!response.ok) throw new Error('Failed to toggle status');

      fetchNewsEvents();
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('Error toggling status: ' + err.message);
    }
  };

  const handleCancelForm = () => {
    resetForm();
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      headline: '',
      description: '',
      event_time: '',
      location: '',
      event_type: 'event',
      status: 'active'
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const filteredNewsEvents = selectedType === 'all' 
    ? newsEvents 
    : newsEvents.filter(ne => ne.event_type === selectedType);

  if (loading) {
    return <div className="loading-state">Loading news & events...</div>;
  }

  return (
    <div className="news-events-container">
      <div className="news-events-header">
        <div className="header-title">
          <BellOutlined className="header-icon" />
          <h1>News & Events Management</h1>
        </div>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <PlusOutlined /> {showAddForm ? 'Cancel' : 'Add News/Event'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-form-section">
          <h2>{editingId ? 'Edit News/Event' : 'Create New News/Event'}</h2>
          <form className="news-events-form">
            <div className="form-group">
              <label>Headline *</label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                placeholder="Enter headline"
                maxLength="255"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type *</label>
                <select
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleInputChange}
                >
                  <option value="event">Event</option>
                  <option value="news">News</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {formData.event_type === 'event' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="event_time"
                    value={formData.event_time}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Event location"
                  />
                </div>
              </div>
            )}

            {formData.event_type === 'news' && (
              <div className="form-group">
                <label>Location (Optional)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Location (if relevant)"
                />
              </div>
            )}

            <div className="form-group">
              <label>Upload Image (JPG, PNG, GIF)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview-wrapper">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  {editingId && (
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      <CloseOutlined /> Remove
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter detailed description"
                rows="6"
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="submit-btn"
                onClick={editingId ? handleUpdateNewsEvent : handleAddNewsEvent}
              >
                {editingId ? 'Update' : 'Create'} News/Event
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="type-filters">
        <button
          className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedType('all')}
        >
          All ({newsEvents.length})
        </button>
        <button
          className={`filter-btn ${selectedType === 'event' ? 'active' : ''}`}
          onClick={() => setSelectedType('event')}
        >
          Events ({newsEvents.filter(ne => ne.event_type === 'event').length})
        </button>
        <button
          className={`filter-btn ${selectedType === 'news' ? 'active' : ''}`}
          onClick={() => setSelectedType('news')}
        >
          News ({newsEvents.filter(ne => ne.event_type === 'news').length})
        </button>
      </div>

      <div className="news-events-grid">
        {filteredNewsEvents.length === 0 ? (
          <div className="empty-state">
            <p>No {selectedType === 'all' ? 'news or events' : selectedType + 's'} found</p>
          </div>
        ) : (
          filteredNewsEvents.map(newsEvent => (
            <div key={newsEvent.id} className="news-event-card">
              {newsEvent.image_path && (
                <div className="card-image">
                  <img 
                    src={`http://localhost:4000${newsEvent.image_path}`} 
                    alt={newsEvent.headline}
                  />
                  <div className="event-type-badge">{newsEvent.event_type.toUpperCase()}</div>
                </div>
              )}

              <div className="card-content">
                <h3>{newsEvent.headline}</h3>
                <p className="description">{newsEvent.description.substring(0, 150)}...</p>

                <div className="card-meta">
                  {newsEvent.event_time && (
                    <div className="meta-item">
                      <CalendarOutlined /> {new Date(newsEvent.event_time).toLocaleString()}
                    </div>
                  )}
                  {newsEvent.location && (
                    <div className="meta-item">
                      <EnvironmentOutlined /> {newsEvent.location}
                    </div>
                  )}
                  <div className="meta-item">
                    <UserOutlined /> {newsEvent.author_name}
                  </div>
                </div>

                <div className="card-footer">
                  <span className={`status-badge ${newsEvent.status}`}>
                    {newsEvent.status}
                  </span>
                  <div className="card-actions">
                    <button
                      className="toggle-status-btn"
                      onClick={() => handleToggleStatus(newsEvent)}
                      title={`Toggle to ${newsEvent.status === 'active' ? 'inactive' : 'active'}`}
                    >
                      {newsEvent.status === 'active' ? '● Active' : '● Inactive'}
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditNewsEvent(newsEvent)}
                    >
                      <EditOutlined /> Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteNewsEvent(newsEvent.id)}
                    >
                      <DeleteOutlined /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
