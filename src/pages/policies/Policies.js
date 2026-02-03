import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './Policies.css';

export default function Policies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPolicies() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:4000/api/policies/active');
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        console.error('Failed to load policies', err);
        setError(err.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPolicies();
  }, []);

  return (
    <>
      <Header />
      <div className="policies-page">
        <div className="policies-hero">
          <div className="container">
            <h1>University Policies</h1>
            <p>Official policies and guidelines governing ETUSL</p>
          </div>
        </div>

        <div className="container policies-content">
          {loading && (
            <div className="loading-state">
              <p>Loading policies...</p>
            </div>
          )}
          
          {error && (
            <div className="error-state">
              <p>Error: {error}</p>
            </div>
          )}
          
          {!loading && !error && items.length === 0 && (
            <div className="empty-state">
              <p>No policies available at this time.</p>
            </div>
          )}
          
          {!loading && !error && items.length > 0 && (
            <div className="policies-grid">
              {items.map((p, index) => (
                <div key={p.id} className="policy-card">
                  <div className="policy-card-content">
                    <span className="policy-badge">Policy {index + 1}</span>
                    <h2 className="policy-title">{p.title}</h2>
                    <div className="policy-separator"></div>
                    <p className="policy-content">{p.content}</p>
                    <div className="policy-footer">
                      <button className="read-more-btn">Read Full Policy</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
