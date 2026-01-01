const { query } = require('./db');

async function setupNewsEvents() {
  try {
    console.log('Creating news_events table...');
    
    await query(`
      CREATE TABLE IF NOT EXISTS news_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        headline VARCHAR(255) NOT NULL,
        description LONGTEXT NOT NULL,
        image_path VARCHAR(255),
        event_time DATETIME,
        location VARCHAR(255),
        event_type ENUM('news', 'event') DEFAULT 'event',
        author_id INT NOT NULL,
        author_name VARCHAR(100),
        status ENUM('active', 'inactive', 'draft') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES staff(id)
      )
    `);
    
    console.log('✓ News & Events table created successfully');

    // Insert sample data
    console.log('Inserting sample news & events...');
    
    await query(`
      INSERT INTO news_events (headline, description, event_type, author_id, author_name, event_time, location) 
      VALUES 
      ('New Faculty Recruitment Drive', 'ETUSL is hiring talented educators and researchers across multiple departments. Join our growing academic community and make an impact on student education.', 'news', 1, 'Admin User', NOW(), 'ETUSL Main Campus'),
      ('Annual Technology Innovation Summit', 'Join us for our flagship technology summit featuring keynote speakers, workshops, and networking opportunities. This year explores AI and Digital Transformation in Higher Education.', 'event', 1, 'Admin User', DATE_ADD(NOW(), INTERVAL 14 DAY), 'Conference Hall, Building A'),
      ('Student Research Showcase 2026', 'Celebrate student achievements and innovative research projects. Open to all staff, students, and the public. Refreshments will be served.', 'event', 1, 'Admin User', DATE_ADD(NOW(), INTERVAL 21 DAY), 'University Auditorium')
    `);
    
    console.log('✓ Sample news & events inserted successfully');
    console.log('✓ News & Events setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('✗ Setup error:', err.message);
    process.exit(1);
  }
}

setupNewsEvents();
