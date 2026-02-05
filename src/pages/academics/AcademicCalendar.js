import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './AcademicCalendar.css';

export default function AcademicCalendar() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('all');

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/academic-calendar');
      if (!res.ok) throw new Error('No API');
      const data = await res.json();
      setItems(data.items || data.calendar || []);
    } catch (err) {
      console.error('Failed to load academic calendar:', err.message || err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const getYearFromItem = (it) => {
    const dstr = it.start_date || it.end_date || null;
    if (!dstr) return null;
    const d = new Date(dstr);
    if (Number.isNaN(d.getTime())) return null;
    return d.getFullYear();
  };

  const years = Array.from(new Set(items.map(i => getYearFromItem(i)).filter(Boolean))).sort((a,b)=>b-a);
  const filtered = yearFilter === 'all' ? items : items.filter(i => getYearFromItem(i) === Number(yearFilter));

  return (
    <>
      <Header />
      <div className="ac-hero">
        <div className="ac-hero-inner">
          <h1>Academic Calendar</h1>
          <p>Important academic dates, term start/end, exams and enrollment deadlines.</p>
        </div>
      </div>

      <main className="ac-container">
        <div className="ac-controls">
          <label>Filter by year:</label>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            <option value="all">All years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button className="ac-refresh" onClick={fetchCalendar}>Refresh</button>
        </div>

        {loading ? (
          <div className="ac-loading">Loading calendar...</div>
        ) : (
          <div className="ac-list">
            {filtered.length === 0 ? (
              <p className="ac-empty">No calendar items available.</p>
            ) : (
              filtered.map(item => (
                <article key={item.id} className="ac-item">
                  <div className="ac-bullet" />
                  <div className="ac-date">
                    {(() => {
                      const s = item.start_date;
                      const e = item.end_date;
                      const safeFormat = (dStr) => {
                        if (!dStr) return null;
                        const d = new Date(dStr);
                        if (Number.isNaN(d.getTime())) return null;
                        return d.toLocaleDateString();
                      };
                      const sFmt = safeFormat(s);
                      const eFmt = safeFormat(e);
                      if (sFmt && eFmt) return <>{sFmt} — {eFmt}</>;
                      if (sFmt) return sFmt;
                      if (eFmt) return eFmt;
                      // fallback: show hint if moveable or TBA
                      if (item.description && (/moveable/i).test(item.description)) return 'Moveable';
                      return 'TBA';
                    })()}
                  </div>
                  <div className="ac-body">
                    <h3 className="ac-title">{item.title}</h3>
                    <div className="ac-type">{item.type || 'Event'}</div>
                    {item.description && <p className="ac-desc">{item.description}</p>}
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </main>
    </>
  );
}
