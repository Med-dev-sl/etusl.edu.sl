import React, { useEffect, useState } from 'react';

export default function MissionVisionManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ type: 'mission', content: '' });
  const [editingId, setEditingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/mission-vision');
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load items');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.content.trim()) return alert('Content required');
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`http://localhost:4000/api/mission-vision/${editingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: form.content })
        });
        if (!res.ok) throw new Error('Save failed');
        setEditingId(null);
      } else {
        const res = await fetch('http://localhost:4000/api/mission-vision', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
        });
        if (!res.ok) throw new Error('Create failed');
      }
      setForm({ type: 'mission', content: '' });
      await load();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(item) {
    setEditingId(item.id);
    setForm({ type: item.type, content: item.content });
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this entry?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/mission-vision/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await load();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  async function handleToggle(id, makeActive) {
    try {
      const res = await fetch(`http://localhost:4000/api/mission-vision/${id}/toggle`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ makeActive }) });
      if (!res.ok) throw new Error('Toggle failed');
      await load();
    } catch (err) {
      console.error(err);
      alert('Toggle failed');
    }
  }

  return (
    <div>
      <h3>Mission & Vision Manager</h3>
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Type</label>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="mission">Mission</option>
          <option value="vision">Vision</option>
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} style={{ width: '100%' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Add'}</button>
        <button onClick={() => { setForm({ type: 'mission', content: '' }); setEditingId(null); }}>Cancel</button>
        <button onClick={load} style={{ marginLeft: 'auto' }}>{loading ? 'Loading...' : 'Reload'}</button>
      </div>

      <div>
        <h4>Existing Entries</h4>
        {items.length === 0 && <p>No entries yet.</p>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map(it => (
            <li key={it.id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <strong style={{ textTransform: 'capitalize' }}>{it.type}</strong>
                <div style={{ marginLeft: 'auto' }}>
                  <button onClick={() => handleEdit(it)}>Edit</button>
                  <button onClick={() => handleDelete(it.id)} style={{ marginLeft: 8 }}>Delete</button>
                  <button onClick={() => handleToggle(it.id, it.status !== 'active')} style={{ marginLeft: 8 }}>{it.status === 'active' ? 'Deactivate' : 'Activate'}</button>
                </div>
              </div>
              <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{it.content}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
