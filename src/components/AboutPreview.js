import React from 'react';
import '../styles/AboutPreview.css';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function AboutPreview() {
  const sectionRef = useScrollAnimation();

  return (
    <section className="about-preview-section" ref={sectionRef}>
      <div className="about-preview-container">
        {/* Left - Image */}
        <div className="about-image-wrapper">
          <div className="about-image-container">
            <img 
              src="/hero1.jpeg" 
              alt="Eastern Technical University Campus" 
              className="about-image"
            />
            <div className="image-accent-shape"></div>
          </div>
        </div>

        {/* Right - Content */}
        <div className="about-content-wrapper">
          <div className="about-content">
            <h2 className="about-title">About Eastern Technical University of Sierra Leone</h2>
            <p className="about-description">
              Eastern Technical University of Sierra Leone (ETUSL) is a leading institution dedicated to advancing 
              education through cutting-edge technology and innovation. Our mission is to empower students with the 
              knowledge and skills required to excel in an increasingly digital and interconnected world.
            </p>
            <p className="about-description">
              With world-class faculty, state-of-the-art facilities, and a commitment to academic excellence, we 
              foster an environment where learning transcends traditional boundaries. Our programs are designed to 
              develop critical thinkers, innovative leaders, and responsible global citizens.
            </p>
            <button className="about-cta-btn">Learn More</button>
          </div>
        </div>
      </div>
    </section>
  );
}
