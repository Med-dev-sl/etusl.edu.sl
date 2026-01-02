import React, { useEffect, useState } from 'react';
import './HistoryManager.css';

export default function HistoryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ year: '', title: '', description: '', status: 'inactive' });
  const [editingId, setEditingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/history');
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load history');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await load();
      try {
        const token = sessionStorage.getItem('history_edit');
        if (token) {
          const obj = JSON.parse(token);
          if (obj && obj.id) {
            setEditingId(obj.id);
            setForm({ year: obj.year || '', title: obj.title || '', description: obj.description || '', status: obj.status || 'inactive' });
          }
          sessionStorage.removeItem('history_edit');
        }
      } catch (err) { console.error('parse token', err); }
    })();
  }, []);

  async function handleSave() {
    if (!form.year || !form.title || !form.description) return alert('Year, title and description are required');
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`http://localhost:4000/api/history/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        if (!res.ok) throw new Error('Update failed');
        setEditingId(null);
      } else {
        const res = await fetch('http://localhost:4000/api/history', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        if (!res.ok) throw new Error('Create failed');
      }
      setForm({ year: '', title: '', description: '', status: 'inactive' });
      await load();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this history entry?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/history/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await load();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  async function handleToggle(id, makeActive) {
    try {
      const res = await fetch(`http://localhost:4000/api/history/${id}/toggle`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ makeActive }) });
      if (!res.ok) throw new Error('Toggle failed');
      await load();
    } catch (err) {
      console.error(err);
      alert('Toggle failed');
    }
  }

  function startEdit(it) {
    setEditingId(it.id);
    setForm({ year: it.year, title: it.title, description: it.description, status: it.status });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="history-manager">
      <div className="history-manager-header">
        <h3>History Manager</h3>
        <div className="header-actions">
          <button className="btn ghost" onClick={load}>{loading ? 'Loading...' : 'Reload'}</button>
        </div>
      </div>

      <div className="history-grid">
        <form className="history-form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="form-row">
            <input className="input" placeholder="Year (e.g., 2004)" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
            <input className="input" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-row">
            <textarea className="textarea" placeholder="Description" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-row form-actions">
            <div className="status-select">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="actions">
              <button type="submit" className="btn primary" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Add'}</button>
              <button type="button" className="btn" onClick={() => { setForm({ year: '', title: '', description: '', status: 'inactive' }); setEditingId(null); }}>Cancel</button>
            </div>
          </div>
        </form>

        <div className="history-list">
          <h4>All History Entries</h4>
          {items.length === 0 && <p className="muted">No history entries yet.</p>}
          <ul>
            {items.map(it => (
              <li key={it.id} className={`history-card ${it.status === 'active' ? 'active' : ''}`}>
                <div className="card-left">
                  <div className="year">{it.year}</div>
                </div>
                <div className="card-body">
                  <div className="card-title">{it.title}</div>
                  <div className="card-desc">{it.description}</div>
                  <div className="card-meta">
                    <span className={`badge ${it.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>{it.status}</span>
                    <div className="card-actions">
                      <button className="btn small" onClick={() => startEdit(it)}>Edit</button>
                      <button className="btn small danger" onClick={() => handleDelete(it.id)}>Delete</button>
                      <button className="btn small" onClick={() => handleToggle(it.id, it.status !== 'active')}>{it.status === 'active' ? 'Deactivate' : 'Activate'}</button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
