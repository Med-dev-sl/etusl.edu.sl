import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './StrategicPlan.css';

export default function StrategicPlan() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Timeline phases with months/years
  const timelinePhases = [
    { phase: 'Phase 1', period: 'Jan - Mar 2026', color: 'phase-1' },
    { phase: 'Phase 2', period: 'Apr - Jun 2026', color: 'phase-2' },
    { phase: 'Phase 3', period: 'Jul - Sep 2026', color: 'phase-3' },
    { phase: 'Phase 4', period: 'Oct - Dec 2026', color: 'phase-4' },
    { phase: 'Phase 5', period: 'Jan - Mar 2027', color: 'phase-5' }
  ];

  useEffect(() => {
    async function fetchStrategicPlan() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:4000/api/strategic-plan/active');
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        console.error('Failed to load strategic plan', err);
        setError(err.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStrategicPlan();
  }, []);

  return (
    <>
      <Header />
      <div className="strategic-plan-page">
        <div className="strategic-plan-hero">
          <div className="container">
            <h1>ETUSL Strategic Roadmap</h1>
            <p>Our Journey to Excellence: 2026-2027</p>
          </div>
        </div>

        <div className="container strategic-plan-content">
          {loading && (
            <div className="loading-state">
              <p>Loading strategic plan...</p>
            </div>
          )}
          
          {error && (
            <div className="error-state">
              <p>Error: {error}</p>
            </div>
          )}
          
          {!loading && !error && items.length === 0 && (
            <div className="empty-state">
              <p>Strategic plan information will be available soon.</p>
            </div>
          )}
          
          {!loading && !error && items.length > 0 && (
            <div className="timeline-container">
              <div className="timeline-wrapper">
                {/* Timeline line */}
                <div className="timeline-line"></div>

                {/* Milestones */}
                {items.map((item, index) => {
                  const phase = timelinePhases[index % timelinePhases.length];
                  const isEven = index % 2 === 0;
                  
                  return (
                    <div key={item.id} className={`timeline-milestone ${isEven ? 'left' : 'right'}`}>
                      {/* Arrow connecting to next milestone */}
                      {index < items.length - 1 && (
                        <div className={`timeline-arrow ${isEven ? 'down-right' : 'down-left'}`}>
                          <svg viewBox="0 0 40 60" preserveAspectRatio="none">
                            <path d={isEven ? "M 20 0 L 20 40 L 35 45 L 30 50 L 20 50 L 20 60" : "M 20 0 L 20 40 L 5 45 L 10 50 L 20 50 L 20 60"} 
                                  fill="none" stroke="url(#arrowGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <defs>
                              <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#1976d2" />
                                <stop offset="100%" stopColor="#42a5f5" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      )}

                      {/* Milestone dot */}
                      <div className={`timeline-dot ${phase.color}`}>
                        <div className="dot-inner"></div>
                        <div className="dot-ripple"></div>
                      </div>

                      {/* Milestone card */}
                      <div className={`milestone-card ${phase.color}`}>
                        <div className="milestone-header">
                          <span className="milestone-phase">{phase.phase}</span>
                          <span className="milestone-period">{phase.period}</span>
                        </div>
                        
                        <h2 className="milestone-title">{item.title}</h2>
                        
                        <p className="milestone-content">{item.content}</p>
                        
                        <div className="milestone-footer">
                          <button className="milestone-btn">View Details</button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Final milestone indicator */}
                {items.length > 0 && (
                  <div className="timeline-end">
                    <div className="end-dot">
                      <span>✓</span>
                    </div>
                    <p>Strategic Goals Achieved</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
