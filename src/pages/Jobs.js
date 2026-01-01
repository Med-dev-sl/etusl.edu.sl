import React from 'react';
import './PageTemplate.css';

function Jobs() {
  const jobListings = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      department: 'Technology',
      location: 'Main Campus',
      posted: '2026-01-15'
    },
    {
      id: 2,
      title: 'Research Coordinator',
      department: 'Academic Affairs',
      location: 'Research Building',
      posted: '2026-01-14'
    },
    {
      id: 3,
      title: 'Administrative Assistant',
      department: 'Administration',
      location: 'Main Office',
      posted: '2026-01-13'
    },
    {
      id: 4,
      title: 'Campus Librarian',
      department: 'Library Services',
      location: 'Library',
      posted: '2026-01-12'
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Jobs At ETUSL</h1>
        <p>Career Opportunities</p>
      </div>

      <div className="page-content">
        <div className="jobs-grid">
          {jobListings.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className="job-posted">Posted: {new Date(job.posted).toLocaleDateString()}</span>
              </div>
              <div className="job-details">
                <p><strong>Department:</strong> {job.department}</p>
                <p><strong>Location:</strong> {job.location}</p>
              </div>
              <button className="apply-btn">Apply Now</button>
            </div>
          ))}
        </div>
      </div>

      <div className="page-footer">
        <a href="/">← Back to Home</a>
        <p>© 2026 Educational Technology University</p>
      </div>
    </div>
  );
}

export default Jobs;
