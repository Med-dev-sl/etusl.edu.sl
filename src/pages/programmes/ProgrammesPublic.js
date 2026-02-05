import React, { useEffect, useState, useMemo } from 'react';
import './ProgrammesPublic.css';
import Header from '../../components/Header';

export default function ProgrammesPublic() {
  const [programmes, setProgrammes] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, fRes] = await Promise.all([
        fetch('http://localhost:4000/api/programs/active'),
        fetch('http://localhost:4000/api/faculties/active')
      ]);

      if (pRes.ok) {
        const pd = await pRes.json();
        setProgrammes(pd.programmes || pd.items || []);
      }

      if (fRes.ok) {
        const fd = await fRes.json();
        setFaculties(fd.items || fd.faculties || []);
      }
    } catch (err) {
      console.error('Failed to fetch programmes or faculties:', err.message || err);
      setProgrammes([]);
      setFaculties([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = programmes.slice();

    if (levelFilter !== 'all') items = items.filter(i => (i.level || '').toLowerCase() === levelFilter);
    if (facultyFilter !== 'all') items = items.filter(i => (i.faculty_name || '').toLowerCase() === facultyFilter);
    if (q) items = items.filter(i => ((i.title || '').toLowerCase().includes(q) || (i.code || '').toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q)));

    if (sortBy === 'title') items.sort((a,b)=> (a.title||'').localeCompare(b.title||''));
    if (sortBy === 'duration') items.sort((a,b)=> (a.duration||'').localeCompare(b.duration||''));

    return items;
  }, [programmes, query, levelFilter, facultyFilter, sortBy]);

  if (loading) return (
    <>
      <Header />
      <div className="programmes-loading">Loading programmes...</div>
    </>
  );

  return (
    <>
      <Header />
      <div className="programmes-page">
        <div className="programmes-hero">
          <div className="hero-inner">
            <h1>Programmes</h1>
            <p>Explore ETUSL undergraduate, postgraduate and certificate programmes.</p>
          </div>
        </div>

        <main className="programmes-content">
          <div className="programmes-controls">
            <input className="programmes-search" placeholder="Search programmes by title or code" value={query} onChange={e=>setQuery(e.target.value)} />
            <select value={levelFilter} onChange={e=>setLevelFilter(e.target.value)}>
              <option value="all">All levels</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="certificate">Certificate</option>
            </select>
            <select value={facultyFilter} onChange={e=>setFacultyFilter(e.target.value)}>
              <option value="all">All faculties</option>
              {faculties.map(f=> <option key={f.id} value={(f.name||'').toLowerCase()}>{f.name}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
              <option value="title">Sort: Title</option>
              <option value="duration">Sort: Duration</option>
            </select>
          </div>

          <div className="programmes-grid">
            {filtered.map(p => (
              <article key={p.id} className="programme-card">
                <div className="programme-head">
                  <div className="programme-code">{p.code || ''}</div>
                  <h3 className="programme-title">{p.title}</h3>
                  <div className="programme-meta">{p.level ? p.level.charAt(0).toUpperCase()+p.level.slice(1) : ''} • {p.faculty_name || ''} • {p.duration || ''}</div>
                </div>
                <p className="programme-desc">{p.description}</p>
                <div className="programme-actions">
                  <a className="learn-link" href={`/programmes/${p.id}`}>Learn More</a>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
