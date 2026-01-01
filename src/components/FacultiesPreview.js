import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BuildOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import '../styles/FacultiesPreview.css';
import useScrollAnimation from '../hooks/useScrollAnimation';

const FacultiesPreview = () => {
  const sectionRef = useScrollAnimation();
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/faculties');
      const data = await response.json();

      // Filter only active faculties
      const activeFaculties = data.faculties
        .filter((faculty) => faculty.status === 'active')
        .slice(0, 3);

      setFaculties(activeFaculties);
      setError(null);
    } catch (err) {
      console.error('Error fetching faculties:', err);
      setError('Unable to load faculties');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="faculties-preview-section">
        <div className="faculties-preview-container">
          <p className="loading-text">Loading faculties...</p>
        </div>
      </section>
    );
  }

  if (faculties.length === 0) {
    return null;
  }

  return (
    <section className="faculties-preview-section" ref={sectionRef}>
      <div className="faculties-preview-container">
        <div className="faculties-header-preview">
          <div className="faculties-title-wrapper">
            <BuildOutlined className="faculties-icon" />
            <h2 className="faculties-main-title">Our Faculties</h2>
          </div>
          <div className="faculties-divider"></div>
        </div>

        <div className="faculties-preview-grid">
          {faculties.map((faculty, index) => (
            <article key={faculty.id} className="faculty-preview-card" style={{ animationDelay: `${index * 0.1}s` }}>
              {faculty.image_path && (
                <div className="faculty-preview-image">
                  <img src={faculty.image_path} alt={faculty.name} />
                </div>
              )}

              <div className="faculty-preview-content">
                <h3 className="faculty-preview-name">{faculty.name}</h3>

                {faculty.dean_name && (
                  <p className="faculty-dean">
                    <span className="dean-label">Dean:</span> {faculty.dean_name}
                  </p>
                )}

                {faculty.description && (
                  <p className="faculty-description">{faculty.description}</p>
                )}

                <div className="faculty-metadata">
                  {faculty.contact_email && (
                    <div className="metadata-item">
                      <MailOutlined className="metadata-icon" />
                      <a href={`mailto:${faculty.contact_email}`}>{faculty.contact_email}</a>
                    </div>
                  )}

                  {faculty.phone && (
                    <div className="metadata-item">
                      <PhoneOutlined className="metadata-icon" />
                      <a href={`tel:${faculty.phone}`}>{faculty.phone}</a>
                    </div>
                  )}

                  {faculty.location && (
                    <div className="metadata-item">
                      <EnvironmentOutlined className="metadata-icon" />
                      <span>{faculty.location}</span>
                    </div>
                  )}

                  {faculty.established_year && (
                    <div className="metadata-item">
                      <span className="established-year">Est. {faculty.established_year}</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="faculties-footer-preview">
          <Link to="/faculties" className="view-all-faculties-btn">
            View All Faculties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FacultiesPreview;
