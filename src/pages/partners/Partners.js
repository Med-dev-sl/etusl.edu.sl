import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './Partners.css';

export default function Partners() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch('http://localhost:4000/api/affiliates/active');
        if (!res.ok) return;
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        console.error('Failed to load affiliates & partners', err);
      }
    }
    fetchItems();
  }, []);

  return (
    <>
      <Header />
      <div className="partners-page" style={{ padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <header style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 56, margin: 0, fontWeight: 700 }}>Affiliates & Partners</h1>
            <p style={{ fontSize: 20, color: '#555' }}>Our collaborators and institutional partners.</p>
          </header>

          <section>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28 }}>
              {items.length === 0 ? (
                <p>No affiliates or partners available.</p>
              ) : (
                items.map(it => (
                  <div key={it.id} style={{ display: 'flex', gap: 20, alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 20 }}>
                      <div style={{ width: 160, height: 100, overflow: 'hidden', borderRadius: 6, background: '#f6f6f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {it.image_path ? (
                          <img src={it.image_path.startsWith('http') ? it.image_path : `http://localhost:4000${it.image_path}`} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <div style={{ color: '#999', fontSize: 28, fontWeight: 600 }}>{it.name ? it.name.split(' ').map(n => n[0]).join('') : '—'}</div>
                        )}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 32 }}>{it.name}</h3>
                        <p style={{ margin: '8px 0', color: '#333', whiteSpace: 'pre-wrap', fontSize: 18 }}>{it.description}</p>
                        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                          {it.website && <a href={it.website} target="_blank" rel="noreferrer" style={{ fontSize: 16 }}>Website</a>}
                          {it.email && <a href={`mailto:${it.email}`} style={{ fontSize: 16 }}>Email</a>}
                        </div>
                      </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
