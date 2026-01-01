import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarOutlined, EnvironmentOutlined, ArrowRightOutlined } from '@ant-design/icons';
import '../styles/NewsEventsPreview.css';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function NewsEventsPreview() {
  const sectionRef = useScrollAnimation();
  const [newsEvents, setNewsEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsEvents();
  }, []);

  const fetchNewsEvents = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/news-events');
      const data = await response.json();
      if (data.newsEvents) {
        // Filter to show only active news & events, take latest 3
        const activeNewsEvents = data.newsEvents
          .filter(item => item.status === 'active')
          .slice(0, 3);
        setNewsEvents(activeNewsEvents);
      }
    } catch (err) {
      console.error('Failed to fetch news & events:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="news-events-preview-section loading">Loading news & events...</div>;
  }

  return (
    <section className="news-events-preview-section" ref={sectionRef}>
      <div className="section-wrapper">
        <div className="section-header">
          <h2>News & Events</h2>
          <Link to="/news-events" className="view-all-link">
            View All <ArrowRightOutlined />
          </Link>
        </div>

        {newsEvents.length === 0 ? (
          <div className="no-content">
            <p>No active news or events at this time.</p>
          </div>
        ) : (
          <div className="news-events-grid">
            {newsEvents.map((item, index) => (
              <div key={item.id} className="news-event-preview-card" style={{
                animation: `slideInUp 0.5s ease ${index * 0.1}s backwards`
              }}>
                {item.image_path && (
                  <div className="preview-image">
                    <img 
                      src={`http://localhost:4000${item.image_path}`} 
                      alt={item.headline}
                    />
                    <div className="preview-type-badge">{item.event_type.toUpperCase()}</div>
                  </div>
                )}

                <div className="preview-content">
                  <span className="preview-category">{item.event_type}</span>

                  {item.event_time && (
                    <div className="preview-meta">
                      <CalendarOutlined />
                      {new Date(item.event_time).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}

                  <h3 className="preview-headline">{item.headline}</h3>

                  <p className="preview-description">{item.description.substring(0, 120)}...</p>

                  <div className="preview-footer">
                    {item.location && (
                      <span className="preview-location">
                        <EnvironmentOutlined /> {item.location}
                      </span>
                    )}
                    <span className="preview-author">{item.author_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
