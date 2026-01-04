import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './Leadership.css';

export default function Leadership() {
  const [leaders, setLeaders] = useState([]);
  const [directorates, setDirectorates] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    async function fetchLeadership() {
      try {
        const res = await fetch('http://localhost:4000/api/leadership/active');
        if (!res.ok) return;
        const data = await res.json();
        const items = data.items || [];
        setLeaders(items.filter(i => i.type === 'leader'));
        setDirectorates(items.filter(i => i.type === 'directorate'));
      } catch (err) {
        console.error('Failed to load leadership data', err);
      }
    }
    fetchLeadership();
  }, []);

  return (
    <>
      <Header />
      {selectedPerson && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000 }} onClick={() => setSelectedPerson(null)}>
          <div style={{ width: '90%', maxWidth: 800, background: '#fff', borderRadius: 8, padding: 20 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{selectedPerson.name}</h2>
              <button onClick={() => setSelectedPerson(null)} style={{ all: 'unset', cursor: 'pointer', fontSize: 20 }}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <div style={{ width: 200, height: 200, overflow: 'hidden', borderRadius: 6, background: '#f6f6f6' }}>
                {selectedPerson.image_path ? (
                  <img src={selectedPerson.image_path.startsWith('http') ? selectedPerson.image_path : `http://localhost:4000${selectedPerson.image_path}`} alt={selectedPerson.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>{selectedPerson.name ? selectedPerson.name.split(' ').map(n => n[0]).join('') : '—'}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: '#666' }}>{selectedPerson.title || selectedPerson.type || ''}</p>
                <p style={{ marginTop: 8, color: '#333', whiteSpace: 'pre-wrap' }}>{selectedPerson.description || selectedPerson.bio || ''}</p>
                {selectedPerson.location && <p style={{ marginTop: 8, color: '#555' }}><strong>Location:</strong> {selectedPerson.location}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="leadership-page" style={{ padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <header style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 44, margin: 0, fontWeight: 700 }}>Leadership & Directorates</h1>
            <p style={{ fontSize: 18, color: '#555' }}>Meet the senior leadership team and the directorates driving ETUSL forward.</p>
          </header>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, marginBottom: 16 }}>Senior Leadership</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
              {leaders.map(l => (
                <div key={l.id} style={{ padding: 20, border: '1px solid #eee', borderRadius: 6 }}>
                  <div style={{ height: 160, borderRadius: 4, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#f6f6f6' }}>
                    {l.image_path ? (
                      <img src={l.image_path.startsWith('http') ? l.image_path : `http://localhost:4000${l.image_path}`} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', textAlign: 'center', color: '#999' }}>{l.name ? l.name.split(' ').map(n => n[0]).join('') : '—'}</div>
                    )}
                  </div>
                  <h3 style={{ margin: '8px 0' }}>
                    <button onClick={() => setSelectedPerson(l)} style={{ all: 'unset', cursor: 'pointer', color: '#111', fontSize: 18, fontWeight: 700 }}>{l.name}</button>
                  </h3>
                  <p style={{ margin: '0 0 8px', color: '#777' }}>{l.title}</p>
                  <p style={{ margin: 0, color: '#333', whiteSpace: 'pre-wrap' }}>{l.description || l.bio || ''}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: 32, marginBottom: 16 }}>Directorates</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
              {directorates.map(d => (
                <div key={d.id} style={{ padding: 20, border: '1px solid #eee', borderRadius: 6 }}>
                  <h3 style={{ margin: '0 0 8px' }}>
                    <button onClick={() => setSelectedPerson(d)} style={{ all: 'unset', cursor: 'pointer', color: '#111', fontSize: 18, fontWeight: 700 }}>{d.name}</button>
                  </h3>
                  <p style={{ margin: '0 0 8px', color: '#666' }}><strong>Lead:</strong> {d.title || d.lead || ''}</p>
                  <p style={{ margin: 0, color: '#333' }}>{d.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
