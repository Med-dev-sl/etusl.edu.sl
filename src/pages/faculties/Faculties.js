import React, { useEffect, useState } from 'react';
import './Faculties.css';
import {
  BankOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CloseOutlined,
} from '@ant-design/icons';

export default function Faculties() {
  const [faculties, setFaculties] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dean_name: '',
    contact_email: '',
    phone: '',
    location: '',
    established_year: new Date().getFullYear(),
    status: 'active'
  });

  useEffect(() => {
    const staffData = localStorage.getItem('staff');
    if (staffData) {
      setStaff(JSON.parse(staffData));
    }
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/faculties');
      const data = await response.json();
      if (data.faculties) {
        setFaculties(data.faculties);
      }
    } catch (err) {
      console.error('Failed to fetch faculties:', err);
      alert('Error loading faculties');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
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
      [name]: name === 'established_year' ? parseInt(value) : value
    }));
  };

  const handleAddFaculty = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Faculty name and description are required');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('dean_name', formData.dean_name);
    submitData.append('contact_email', formData.contact_email);
    submitData.append('phone', formData.phone);
    submitData.append('location', formData.location);
    submitData.append('established_year', formData.established_year);
    submitData.append('author_id', staff.id);
    submitData.append('author_name', staff.name);
    submitData.append('status', formData.status);
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const response = await fetch('http://localhost:4000/api/faculties', {
        method: 'POST',
        body: submitData
      });

      if (!response.ok) throw new Error('Failed to create faculty');

      alert('Faculty created successfully!');
      resetForm();
      fetchFaculties();
    } catch (err) {
      console.error('Error creating faculty:', err);
      alert('Error creating faculty: ' + err.message);
    }
  };

  const handleEditFaculty = (faculty) => {
    setEditingId(faculty.id);
    setFormData({
      name: faculty.name,
      description: faculty.description,
      dean_name: faculty.dean_name || '',
      contact_email: faculty.contact_email || '',
      phone: faculty.phone || '',
      location: faculty.location || '',
      established_year: faculty.established_year || new Date().getFullYear(),
      status: faculty.status
    });
    if (faculty.image_path) {
      setImagePreview(`http://localhost:4000${faculty.image_path}`);
    }
    setShowAddForm(true);
  };

  const handleUpdateFaculty = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Faculty name and description are required');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('dean_name', formData.dean_name);
    submitData.append('contact_email', formData.contact_email);
    submitData.append('phone', formData.phone);
    submitData.append('location', formData.location);
    submitData.append('established_year', formData.established_year);
    submitData.append('status', formData.status);
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const response = await fetch(`http://localhost:4000/api/faculties/${editingId}`, {
        method: 'PUT',
        body: submitData
      });

      if (!response.ok) throw new Error('Failed to update faculty');

      alert('Faculty updated successfully!');
      resetForm();
      fetchFaculties();
    } catch (err) {
      console.error('Error updating faculty:', err);
      alert('Error updating faculty: ' + err.message);
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/faculties/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete');

        alert('Faculty deleted successfully!');
        fetchFaculties();
      } catch (err) {
        console.error('Error deleting faculty:', err);
        alert('Error deleting faculty: ' + err.message);
      }
    }
  };

  const handleToggleStatus = async (faculty) => {
    const newStatus = faculty.status === 'active' ? 'inactive' : 'active';
    
    const submitData = new FormData();
    submitData.append('name', faculty.name);
    submitData.append('description', faculty.description);
    submitData.append('dean_name', faculty.dean_name);
    submitData.append('contact_email', faculty.contact_email);
    submitData.append('phone', faculty.phone);
    submitData.append('location', faculty.location);
    submitData.append('established_year', faculty.established_year);
    submitData.append('status', newStatus);

    try {
      const response = await fetch(`http://localhost:4000/api/faculties/${faculty.id}`, {
        method: 'PUT',
        body: submitData
      });

      if (!response.ok) throw new Error('Failed to toggle status');

      fetchFaculties();
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
      name: '',
      description: '',
      dean_name: '',
      contact_email: '',
      phone: '',
      location: '',
      established_year: new Date().getFullYear(),
      status: 'active'
    });
    setImageFile(null);
    setImagePreview(null);
  };

  if (loading) {
    return <div className="loading-state">Loading faculties...</div>;
  }

  return (
    <div className="faculties-container">
      <div className="faculties-header">
        <div className="header-title">
          <BankOutlined className="header-icon" />
          <h1>Faculties Management</h1>
        </div>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <PlusOutlined /> {showAddForm ? 'Cancel' : 'Add Faculty'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-form-section">
          <h2>{editingId ? 'Edit Faculty' : 'Create New Faculty'}</h2>
          <form className="faculties-form">
            <div className="form-group">
              <label>Faculty Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter faculty name"
                maxLength="255"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Dean Name</label>
                <input
                  type="text"
                  name="dean_name"
                  value={formData.dean_name}
                  onChange={handleInputChange}
                  placeholder="Dean/Head name"
                />
              </div>

              <div className="form-group">
                <label>Year Established</label>
                <input
                  type="number"
                  name="established_year"
                  value={formData.established_year}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  placeholder="faculty@etusl.edu.sl"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+249 XXX XXX XXX"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Faculty location/building"
              />
            </div>

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
                placeholder="Enter detailed faculty description"
                rows="6"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="submit-btn"
                onClick={editingId ? handleUpdateFaculty : handleAddFaculty}
              >
                {editingId ? 'Update' : 'Create'} Faculty
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

      <div className="faculties-grid">
        {faculties.length === 0 ? (
          <div className="empty-state">
            <p>No faculties found</p>
          </div>
        ) : (
          faculties.map(faculty => (
            <div key={faculty.id} className="faculty-card">
              {faculty.image_path && (
                <div className="card-image">
                  <img 
                    src={`http://localhost:4000${faculty.image_path}`} 
                    alt={faculty.name}
                  />
                </div>
              )}

              <div className="card-content">
                <h3>{faculty.name}</h3>
                <p className="description">{faculty.description.substring(0, 150)}...</p>

                <div className="card-meta">
                  {faculty.dean_name && (
                    <div className="meta-item">
                      <UserOutlined /> {faculty.dean_name}
                    </div>
                  )}
                  {faculty.contact_email && (
                    <div className="meta-item">
                      <MailOutlined /> {faculty.contact_email}
                    </div>
                  )}
                  {faculty.phone && (
                    <div className="meta-item">
                      <PhoneOutlined /> {faculty.phone}
                    </div>
                  )}
                  {faculty.location && (
                    <div className="meta-item">
                      <EnvironmentOutlined /> {faculty.location}
                    </div>
                  )}
                  {faculty.established_year && (
                    <div className="meta-item">
                      Est. {faculty.established_year}
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <span className={`status-badge ${faculty.status}`}>
                    {faculty.status}
                  </span>
                  <div className="card-actions">
                    <button
                      className="toggle-status-btn"
                      onClick={() => handleToggleStatus(faculty)}
                      title={`Toggle to ${faculty.status === 'active' ? 'inactive' : 'active'}`}
                    >
                      {faculty.status === 'active' ? '● Active' : '● Inactive'}
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditFaculty(faculty)}
                    >
                      <EditOutlined /> Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteFaculty(faculty.id)}
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
