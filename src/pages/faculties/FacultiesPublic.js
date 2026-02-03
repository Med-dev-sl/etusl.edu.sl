import React, { useEffect, useState } from 'react';
import './FacultiesPublic.css';
import {
  BankOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

export default function FacultiesPublic() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/faculties');
      const data = await response.json();
      if (data.faculties) {
        // Only show active faculties
        setFaculties(data.faculties.filter(f => f.status === 'active'));
      }
    } catch (err) {
      console.error('Failed to fetch faculties:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="faculties-public-container">
        <div className="loading-state">
          <p>Loading faculties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="faculties-public-container">
      <div className="faculties-hero">
        <div className="hero-content">
          <h1>Our Faculties</h1>
          <p>Explore the academic divisions and departments at ETUSL</p>
        </div>
      </div>

      <div className="faculties-content">
        {faculties.length === 0 ? (
          <div className="empty-state">
            <p>No faculties available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="faculties-grid">
              {faculties.map((faculty, index) => (
                <div
                  key={faculty.id}
                  className={`faculty-card ${index % 2 === 0 ? 'slide-left' : 'slide-right'}`}
                  onClick={() => setSelectedFaculty(faculty)}
                >
                  {faculty.image_path && (
                    <div className="faculty-image">
                      <img
                        src={`http://localhost:4000${faculty.image_path}`}
                        alt={faculty.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(faculty.name);
                        }}
                      />
                    </div>
                  )}
                  <div className="faculty-card-content">
                    <h3 className="faculty-name">{faculty.name}</h3>
                    <p className="faculty-description">{faculty.description}</p>
                    {faculty.dean_name && (
                      <div className="faculty-detail">
                        <UserOutlined className="detail-icon" />
                        <span><strong>Dean:</strong> {faculty.dean_name}</span>
                      </div>
                    )}
                    {faculty.established_year && (
                      <div className="faculty-detail">
                        <CalendarOutlined className="detail-icon" />
                        <span><strong>Est.:</strong> {faculty.established_year}</span>
                      </div>
                    )}
                    <button className="view-more-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>

            {selectedFaculty && (
              <div className="modal-overlay" onClick={() => setSelectedFaculty(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="close-btn" onClick={() => setSelectedFaculty(null)}>✕</button>
                  
                  {selectedFaculty.image_path && (
                    <img
                      src={`http://localhost:4000${selectedFaculty.image_path}`}
                      alt={selectedFaculty.name}
                      className="modal-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(selectedFaculty.name);
                      }}
                    />
                  )}
                  
                  <div className="modal-body">
                    <h2 className="modal-title">{selectedFaculty.name}</h2>
                    
                    <div className="modal-section">
                      <h4>About</h4>
                      <p className="modal-description">{selectedFaculty.description}</p>
                    </div>

                    {selectedFaculty.dean_name && (
                      <div className="modal-section">
                        <div className="info-item">
                          <UserOutlined className="info-icon" />
                          <div className="info-text">
                            <label>Dean</label>
                            <p>{selectedFaculty.dean_name}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedFaculty.established_year && (
                      <div className="modal-section">
                        <div className="info-item">
                          <CalendarOutlined className="info-icon" />
                          <div className="info-text">
                            <label>Established</label>
                            <p>{selectedFaculty.established_year}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedFaculty.location && (
                      <div className="modal-section">
                        <div className="info-item">
                          <EnvironmentOutlined className="info-icon" />
                          <div className="info-text">
                            <label>Location</label>
                            <p>{selectedFaculty.location}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="modal-section">
                      <h4>Contact Information</h4>
                      {selectedFaculty.contact_email && (
                        <div className="info-item">
                          <MailOutlined className="info-icon" />
                          <div className="info-text">
                            <a href={`mailto:${selectedFaculty.contact_email}`}>
                              {selectedFaculty.contact_email}
                            </a>
                          </div>
                        </div>
                      )}
                      {selectedFaculty.phone && (
                        <div className="info-item">
                          <PhoneOutlined className="info-icon" />
                          <div className="info-text">
                            <a href={`tel:${selectedFaculty.phone}`}>
                              {selectedFaculty.phone}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
