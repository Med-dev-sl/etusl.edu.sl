const { query } = require('./db');

async function setupAnnouncements() {
  try {
    console.log('Creating announcements table...');
    
    await query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        headline VARCHAR(255) NOT NULL,
        description LONGTEXT NOT NULL,
        author_id INT NOT NULL,
        author_name VARCHAR(100),
        category VARCHAR(50) DEFAULT 'General',
        status ENUM('draft', 'published', 'archived') DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES staff(id)
      )
    `);
    
    console.log('✓ Announcements table created successfully');

    // Insert sample data
    console.log('Inserting sample announcements...');
    
    await query(`
      INSERT INTO announcements (headline, description, author_id, author_name, category) 
      VALUES 
      ('Welcome to ETUSL Portal', 'We are pleased to announce the launch of our new unified university portal system. This platform will serve as the central hub for all staff, student, and university communications.', 1, 'Admin User', 'General'),
      ('Spring 2026 Academic Calendar Released', 'The Academic Affairs Office has released the official academic calendar for Spring 2026. Please visit the portal for important dates including registration, add/drop deadlines, and examination schedules.', 1, 'Admin User', 'Academic'),
      ('Campus Maintenance Update', 'Building maintenance will be conducted from January 15-20, 2026. Some facilities may have limited access during this period. We appreciate your patience and cooperation.', 1, 'Admin User', 'General'),
      ('Faculty Development Workshop', 'Join us for our quarterly Faculty Development Workshop on January 25, 2026 at 2:00 PM in the Conference Center. Topics include: Innovative Teaching Methods and Technology Integration. Registration is required.', 1, 'Admin User', 'Academic')
    `);
    
    console.log('✓ Sample announcements inserted successfully');
    console.log('✓ Announcements setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('✗ Setup error:', err.message);
    process.exit(1);
  }
}

setupAnnouncements();
