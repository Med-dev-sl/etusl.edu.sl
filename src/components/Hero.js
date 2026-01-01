import React, { useState, useEffect } from 'react';
import '../styles/Hero.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Welcome to ETUSL",
      subtitle: "Advancing Education Through Technology",
      description: "Shaping the future leaders of tomorrow with innovative learning",
      bgColor: "linear-gradient(135deg, rgba(0, 86, 179, 0.8) 0%, rgba(0, 61, 130, 0.8) 100%)",
      bgImage: "/hero1.jpeg"
    },
    {
      id: 2,
      title: "Excellence in Education",
      subtitle: "World-Class Faculty & Facilities",
      description: "Providing exceptional academic experience in a digital world",
      bgColor: "linear-gradient(135deg, rgba(31, 78, 121, 0.85) 0%, rgba(15, 45, 75, 0.85) 100%)",
      bgImage: "/hero2.jpg"
    },
    {
      id: 3,
      title: "Your Success is Our Mission",
      subtitle: "Join Our Global Community",
      description: "Transform your future with cutting-edge education and mentorship",
      bgColor: "linear-gradient(135deg, rgba(0, 56, 105, 0.85) 0%, rgba(0, 30, 60, 0.85) 100%)",
      bgImage: "/hero3.jpeg"
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const slide = slides[currentSlide];

  return (
    <div className="hero-container">
      <div className="hero-slider-wrapper">
        {/* Background with image */}
        <div 
          className="hero-slide-bg"
          style={{ 
            backgroundImage: `url('${slide.bgImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'normal'
          }}
        >
          {/* Decorative shapes */}
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
          
          {/* Content */}
          <div className="hero-content-wrapper">
            <div className="hero-content">
              <div className="hero-text-container">
                <h1 className="hero-title">{slide.title}</h1>
                <h2 className="hero-subtitle">{slide.subtitle}</h2>
                <p className="hero-description">{slide.description}</p>
                <button className="hero-cta-btn">Explore More</button>
              </div>
            </div>
          </div>

          {/* Overlay accent */}
          <div className="hero-accent-line"></div>
        </div>

        {/* Navigation Arrows */}
        <button 
          className="hero-nav-btn prev-btn"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <LeftOutlined />
        </button>
        <button 
          className="hero-nav-btn next-btn"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <RightOutlined />
        </button>

        {/* Indicator Dots */}
        <div className="hero-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
