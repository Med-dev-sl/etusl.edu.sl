import React from 'react';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import Header from '../../components/Header';
import './About.css';
import { TeamOutlined, AimOutlined, BulbOutlined, TrophyOutlined, HeartOutlined, GlobalOutlined } from '@ant-design/icons';

export default function About() {
  const missionRef = useScrollAnimation();
  const visionRef = useScrollAnimation();
  const valuesRef = useScrollAnimation();
  const historyRef = useScrollAnimation();
  const statsRef = useScrollAnimation();

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
      <section className="about-mission" ref={missionRef}>
        <div className="about-container">
          <div className="section-card mission-card">
            <div className="card-icon">
              <AimOutlined />
            </div>
            <h3>Our Mission</h3>
            <p>
              To provide accessible, high-quality technical and professional education that equips students with 
              the knowledge, skills, and values necessary to excel in their careers and contribute meaningfully to 
              society. We are committed to fostering innovation, promoting critical thinking, and developing responsible 
              global citizens.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="about-vision" ref={visionRef}>
        <div className="about-container">
          <div className="section-card vision-card">
            <div className="card-icon">
              <BulbOutlined />
            </div>
            <h3>Our Vision</h3>
            <p>
              To be a leading institution of technical excellence recognized nationally and internationally for our 
              commitment to innovation, quality education, and sustainable development. We aspire to graduate 
              competent professionals who will drive technological advancement and economic growth in Africa.
            </p>
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

      {/* Statistics Section */}
      <section className="about-statistics" ref={statsRef}>
        <div className="about-container">
          <h2 className="section-title">By The Numbers</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>5000+</h4>
              <p>Active Students</p>
            </div>

            <div className="stat-card">
              <h4>150+</h4>
              <p>Faculty Members</p>
            </div>

            <div className="stat-card">
              <h4>25+</h4>
              <p>Academic Programs</p>
            </div>

            <div className="stat-card">
              <h4>15</h4>
              <p>Faculties & Schools</p>
            </div>

            <div className="stat-card">
              <h4>98%</h4>
              <p>Graduate Employment Rate</p>
            </div>

            <div className="stat-card">
              <h4>20+</h4>
              <p>Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="about-history" ref={historyRef}>
        <div className="about-container">
          <h2 className="section-title">Our History</h2>
          <div className="history-timeline">
            <div className="timeline-item">
              <div className="timeline-year">2004</div>
              <div className="timeline-content">
                <h4>Foundation</h4>
                <p>ETUSL was established with a vision to provide quality technical education in Sierra Leone</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2008</div>
              <div className="timeline-content">
                <h4>First Graduation</h4>
                <p>The first cohort of graduates successfully completed their programs</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2012</div>
              <div className="timeline-content">
                <h4>Campus Expansion</h4>
                <p>New facilities and academic buildings were constructed to support growth</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2016</div>
              <div className="timeline-content">
                <h4>International Recognition</h4>
                <p>ETUSL gained international accreditation for several academic programs</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2020</div>
              <div className="timeline-content">
                <h4>Digital Transformation</h4>
                <p>Implementation of cutting-edge learning management systems and online platforms</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2026</div>
              <div className="timeline-content">
                <h4>Present Day</h4>
                <p>Continuing to lead in technical education with over 5000 active students</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculties Section */}
      <section className="about-faculties">
        <div className="about-container">
          <h2 className="section-title">Our Faculties</h2>
          <p className="section-subtitle">Organized into 15 faculties, offering diverse academic programs</p>
          <div className="faculties-list">
            <div className="faculty-item">
              <h4>Faculty of Science</h4>
              <p>Advanced studies in mathematics, physics, chemistry, and biology</p>
            </div>
            <div className="faculty-item">
              <h4>Faculty of Engineering</h4>
              <p>Civil, mechanical, electrical, and software engineering programs</p>
            </div>
            <div className="faculty-item">
              <h4>Faculty of Technology</h4>
              <p>Information technology, computer science, and digital innovation</p>
            </div>
            <div className="faculty-item">
              <h4>Faculty of Business</h4>
              <p>Commerce, management, and entrepreneurship programs</p>
            </div>
            <div className="faculty-item">
              <h4>Faculty of Liberal Arts</h4>
              <p>Humanities, social sciences, and professional development</p>
            </div>
            <div className="faculty-item">
              <h4>Faculty of Health Sciences</h4>
              <p>Healthcare, nursing, and public health programs</p>
            </div>
          </div>
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
