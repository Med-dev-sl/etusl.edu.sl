import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './Library.css';

export default function Library() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [faculties, setFaculties] = useState([]);
  const [levels] = useState(['Undergraduate', 'Postgraduate', 'Certificate']);

  useEffect(() => {
    fetchLibraryData();
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/faculties');
      if (!res.ok) throw new Error('No API');
      const data = await res.json();
      setFaculties(data.faculties || []);
    } catch (err) {
      console.error('Failed to load faculties:', err.message || err);
      setFaculties([]);
    }
  };

  const fetchLibraryData = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/library');
      if (!res.ok) throw new Error('No API');
      const data = await res.json();
      setItems(data.items || data.library || []);
    } catch (err) {
      console.error('Failed to load library data:', err.message || err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on active tab, faculty, and level
  const filteredItems = items.filter(item => {
    const typeMatch = item.type === activeTab;
    const facultyMatch = selectedFaculty === 'all' || item.faculty_id === parseInt(selectedFaculty);
    const levelMatch = selectedLevel === 'all' || item.level === selectedLevel;
    return typeMatch && facultyMatch && levelMatch;
  });

  return (
    <>
      <Header />
      <div className="library-hero">
        <div className="library-hero-inner">
          <h1>Library</h1>
          <p>Access our comprehensive collection of books and past papers organized by faculty and level.</p>
        </div>
      </div>

      <main className="library-container">
        {/* Tab Navigation */}
        <div className="library-tabs">
          <button
            className={`tab-btn ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            📚 Books
          </button>
          <button
            className={`tab-btn ${activeTab === 'past-papers' ? 'active' : ''}`}
            onClick={() => setActiveTab('past-papers')}
          >
            📄 Past Papers
          </button>
        </div>

        {/* Filters Section */}
        <div className="library-filters">
          <div className="filter-group">
            <label htmlFor="faculty-filter">Filter by Faculty:</label>
            <select
              id="faculty-filter"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Faculties</option>
              {faculties.map(faculty => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="level-filter">Filter by Level:</label>
            <select
              id="level-filter"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-reset">
            <button
              className="reset-btn"
              onClick={() => {
                setSelectedFaculty('all');
                setSelectedLevel('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="loading">
            <p>Loading {activeTab === 'books' ? 'books' : 'past papers'}...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="no-results">
            <p>No {activeTab === 'books' ? 'books' : 'past papers'} found matching your filters.</p>
          </div>
        ) : (
          <div className="library-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="library-card">
                <div className="card-header">
                  <h3>{item.title}</h3>
                  <span className={`badge badge-${item.type}`}>
                    {item.type === 'books' ? '📚' : '📄'} {item.type}
                  </span>
                </div>

                <div className="card-content">
                  {item.author && (
                    <p><strong>Author:</strong> {item.author}</p>
                  )}
                  {item.isbn && (
                    <p><strong>ISBN:</strong> {item.isbn}</p>
                  )}
                  <p><strong>Faculty:</strong> {item.faculty_name}</p>
                  <p><strong>Level:</strong> {item.level}</p>
                  {item.year && (
                    <p><strong>Year:</strong> {item.year}</p>
                  )}
                  {item.course && (
                    <p><strong>Course:</strong> {item.course}</p>
                  )}
                  {item.subject && (
                    <p><strong>Subject:</strong> {item.subject}</p>
                  )}
                  {item.description && (
                    <p className="description">{item.description}</p>
                  )}
                </div>

                <div className="card-footer">
                  {item.file_path && (
                    <a
                      href={`http://localhost:4000${item.file_path}`}
                      className="download-btn"
                      download
                    >
                      📥 Download
                    </a>
                  )}
                  <span className={`status-badge ${item.status}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
