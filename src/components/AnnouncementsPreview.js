import React, { useEffect, useState } from 'react';
import '../styles/AnnouncementsPreview.css';
import { BellOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default function AnnouncementsPreview() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/announcements');
      const data = await response.json();
      if (data.announcements) {
        // Filter only active announcements and get the first 3
        const activeAnnouncements = data.announcements
          .filter(announcement => announcement.status === 'active')
          .slice(0, 3);
        setAnnouncements(activeAnnouncements);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

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

  return (
    <section className="announcements-preview-section">
      <div className="announcements-preview-container">
        {/* Header */}
        <div className="announcements-preview-header">
          <div className="header-left">
            <BellOutlined className="header-bell-icon" />
            <div>
              <h2 className="announcements-preview-title">Latest Announcements</h2>
              <p className="announcements-preview-subtitle">Stay informed with the latest updates from ETUSL</p>
            </div>
          </div>
          <Link to="/announcements" className="view-all-btn">
            View All <ArrowRightOutlined />
          </Link>
        </div>

        {/* Announcements Grid */}
        {loading ? (
          <div className="announcements-loading">
            <p>Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="announcements-empty">
            <p>No announcements at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="announcements-preview-grid">
            {announcements.map((announcement, index) => (
              <div key={announcement.id} className="announcement-preview-card" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="card-top">
                  <div className="announcement-meta">
                    <span 
                      className="announcement-category"
                      style={{ backgroundColor: getCategoryColor(announcement.category) }}
                    >
                      {announcement.category}
                    </span>
                    <span className="announcement-date">{formatDate(announcement.created_at)}</span>
                  </div>
                  <h3 className="announcement-preview-title">{announcement.headline}</h3>
                </div>

                <div className="card-middle">
                  <p className="announcement-preview-description">{announcement.description}</p>
                </div>

                <div className="card-bottom">
                  {announcement.author_name && (
                    <span className="announcement-author">By {announcement.author_name}</span>
                  )}
                  <span 
                    className={`announcement-status ${announcement.status}`}
                  >
                    {announcement.status === 'active' ? '● Active' : '● Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
