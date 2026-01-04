import React, { useEffect, useState } from 'react';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import Header from '../../components/Header';
import './About.css';
import { TeamOutlined, AimOutlined, BulbOutlined, TrophyOutlined, HeartOutlined, GlobalOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

export default function About() {
  const missionRef = useScrollAnimation();
  const visionRef = useScrollAnimation();
  const valuesRef = useScrollAnimation();
  const historyRef = useScrollAnimation();
 

  const location = useLocation();
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [historyItems, setHistoryItems] = useState([]);
  const [campuses, setCampuses] = useState([]);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch('http://localhost:4000/api/mission-vision/active');
        if (!res.ok) return;
        const data = await res.json();
        setMission((data.mission && data.mission.content) || '');
        setVision((data.vision && data.vision.content) || '');
      } catch (err) {
        console.error('Failed to load about content', err);
      }
    }
    fetchAbout();
    async function fetchHistory() {
      try {
        const hres = await fetch('http://localhost:4000/api/history/active');
        if (!hres.ok) return;
        const hdata = await hres.json();
        setHistoryItems(hdata.items || []);
      } catch (err) {
        console.error('Failed to load history', err);
      }
    }
    fetchHistory();
    async function fetchCampuses() {
      try {
        const cres = await fetch('http://localhost:4000/api/campuses/active');
        if (!cres.ok) return;
        const cdata = await cres.json();
        setCampuses(cdata.items || []);
      } catch (err) {
        console.error('Failed to load campuses', err);
      }
    }
    fetchCampuses();
  }, []);
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location]);

  return (
    <>
      <Header />
      <div className="about-page">
      {/* Page Header */}
      <section className="about-header">
        <div className="about-header-content">
          <h1>About ETUSL</h1>
          <p>Empowering the future through innovation, excellence, and education</p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="about-overview">
        <div className="about-container">
          <div className="overview-content">
            <h2>Who We Are</h2>
            <p>
              The Eastern Technical University of Sierra Leone (ETUSL) stands as a beacon of educational excellence 
              in West Africa. Since our establishment, we have been committed to providing world-class technical and 
              professional education that transforms lives and drives economic development.
            </p>
            <p>
              With a diverse student body from across the region, cutting-edge facilities, and distinguished faculty 
              members, ETUSL is shaping the leaders, innovators, and changemakers of tomorrow.
            </p>
          </div>
          <div className="overview-image">
            <img src="/hero1.jpeg" alt="ETUSL Campus" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="about-mission" ref={missionRef}>
        <div className="about-container">
          <div className="section-card mission-card">
            <div className="card-icon">
              <AimOutlined />
            </div>
            <h3>Our Mission</h3>
            <p>{mission || 'Our mission text is not set yet.'}</p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="about-vision" ref={visionRef}>
        <div className="about-container">
          <div className="section-card vision-card">
            <div className="card-icon">
              <BulbOutlined />
            </div>
            <h3>Our Vision</h3>
            <p>{vision || 'Our vision text is not set yet.'}</p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="about-values" ref={valuesRef}>
        <div className="about-container">
          <h2 className="section-title">Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <TrophyOutlined />
              </div>
              <h4>Excellence</h4>
              <p>Pursuing the highest standards in education, research, and service</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <BulbOutlined />
              </div>
              <h4>Innovation</h4>
              <p>Fostering creativity and embracing cutting-edge technologies</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <TeamOutlined />
              </div>
              <h4>Collaboration</h4>
              <p>Building strong partnerships within and beyond the university</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <HeartOutlined />
              </div>
              <h4>Integrity</h4>
              <p>Maintaining highest ethical standards in all endeavors</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <GlobalOutlined />
              </div>
              <h4>Diversity</h4>
              <p>Celebrating and embracing diversity in all forms</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <AimOutlined />
              </div>
              <h4>Sustainability</h4>
              <p>Committed to environmental and social responsibility</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section removed per request */}

      {/* History Section */}
      <section className="about-history" ref={historyRef}>
        <div className="about-container">
          <h2 className="section-title">Our History</h2>
          <div className="history-timeline">
            {historyItems.length === 0 ? (
              <p>Our historical timeline is being prepared.</p>
            ) : (
              historyItems.map(item => (
                <div className="timeline-item" key={item.id}>
                  <div className="timeline-year">{item.year}</div>
                  <div className="timeline-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Campuses Section (Harvard-style large headings) */}
      <section id="campuses" className="about-campuses" style={{ padding: '48px 0' }}>
        <div className="about-container">
          <h2 className="section-title" style={{ fontSize: 36, marginBottom: 16 }}>Our Campuses</h2>
          {campuses.length === 0 ? (
            <p style={{ fontSize: 18 }}>Campus information is being prepared.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              {campuses.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: 24 }}>
                  <div style={{ flex: '0 0 40%', maxWidth: '40%' }}>
                    <img src={c.image_path ? `http://localhost:4000${c.image_path}` : '/campus-placeholder.jpg'} alt={c.name || 'Campus'} style={{ width: '100%', height: 'auto', borderRadius: 6 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 28, margin: '0 0 8px' }}>{c.name}</h3>
                    <p style={{ fontSize: 18, lineHeight: 1.6, color: '#333', marginBottom: 12, whiteSpace: 'pre-wrap' }}>{c.description}</p>
                    <p style={{ fontSize: 16, color: '#666', margin: 0 }}><strong>Location:</strong> {c.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      

      {/* Call to Action */}
      <section className="about-cta">
        <div className="about-container">
          <h2>Join Us on This Journey</h2>
          <p>
            Whether you're a prospective student, partner, or supporter, we invite you to be part of the ETUSL community 
            and experience the transformative power of education.
          </p>
          <div className="cta-buttons">
            <a href="/student-login" className="cta-btn primary">Apply Now</a>
            <a href="/" className="cta-btn secondary">Learn More</a>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
