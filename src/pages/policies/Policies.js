import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './Policies.css';

export default function Policies() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchPolicies() {
      try {
        const res = await fetch('http://localhost:4000/api/policies/active');
        if (!res.ok) return;
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        console.error('Failed to load policies', err);
      }
    }
    fetchPolicies();
  }, []);

  return (
    <>
      <Header />
      <div className="policies-page" style={{ padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
          <header style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 40, margin: 0, fontWeight: 700 }}>University Policies</h1>
            <p style={{ color: '#666' }}>Official ETUSL policies and guidelines.</p>
          </header>

          <section>
            {items.length === 0 ? (
              <p>No policies available.</p>
            ) : (
              <div style={{ display: 'grid', gap: 18 }}>
                {items.map(p => (
                  <article key={p.id} style={{ borderBottom: '1px solid #eee', paddingBottom: 12 }}>
                    <h2 style={{ margin: '6px 0', fontSize: 24 }}>{p.title}</h2>
                    <div style={{ color: '#333', whiteSpace: 'pre-wrap' }}>{p.content}</div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
