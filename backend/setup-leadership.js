const { query } = require('./db');

async function setupLeadership() {
  try {
    console.log('Creating leadership table...');

    await query(`
      CREATE TABLE IF NOT EXISTS leadership (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        type ENUM('leader','directorate') DEFAULT 'leader',
        description LONGTEXT,
        image_path VARCHAR(255),
        location VARCHAR(255),
        status ENUM('active','inactive') DEFAULT 'inactive',
        author_id INT NOT NULL,
        author_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES staff(id)
      )
    `);

    console.log('✓ leadership table created successfully');

    const rows = await query('SELECT COUNT(*) as cnt FROM leadership');
    if (rows[0].cnt === 0) {
      console.log('Seeding sample leadership entries...');

      await query(`INSERT INTO leadership (name, title, type, description, location, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)` , [
        'Prof. A. Johnson', 'Vice-Chancellor', 'leader', 'Leads academic strategy and university governance.', 'Main Campus', 1, 'Admin User', 'active'
      ]);

      await query(`INSERT INTO leadership (name, title, type, description, location, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)` , [
        'Dr. M. Conteh', 'Registrar', 'leader', 'Oversees student records, admissions and examinations.', 'Main Campus', 1, 'Admin User', 'active'
      ]);

      await query(`INSERT INTO leadership (name, title, type, description, location, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)` , [
        'Directorate of Research & Innovation', '', 'directorate', 'Promotes research, grants and industry partnerships.', 'Head Office', 1, 'Admin User', 'active'
      ]);

      console.log('✓ Sample leadership entries inserted successfully');
    } else {
      console.log('Leadership table already contains data; skipping seeding');
    }

    console.log('Leadership setup complete');
    process.exit(0);
  } catch (err) {
    console.error('Setup failed:', err.message);
    process.exit(1);
  }
}

setupLeadership();
