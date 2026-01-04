const { query } = require('./db');

async function setupCampuses() {
  try {
    console.log('Creating campuses table...');

    await query(`
      CREATE TABLE IF NOT EXISTS campuses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description LONGTEXT,
        image_path VARCHAR(255),
        location VARCHAR(255),
        author_id INT NOT NULL,
        author_name VARCHAR(100),
        status ENUM('active','inactive') DEFAULT 'inactive',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES staff(id)
      )
    `);

    console.log('✓ Campuses table created successfully');

    const rows = await query('SELECT COUNT(*) as cnt FROM campuses');
    if (rows[0].cnt === 0) {
      console.log('Seeding sample campuses...');

      await query(`INSERT INTO campuses (name, description, image_path, location, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        'Main Campus',
        'The Main Campus houses administration, faculties and central facilities, with landscaped quads and historic buildings.',
        null,
        'Central City, Sierra Leone',
        1,
        'Admin User',
        'active'
      ]);

      await query(`INSERT INTO campuses (name, description, image_path, location, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        'North Campus',
        'Home to science and engineering labs and the technology centre.',
        null,
        'North District, Sierra Leone',
        1,
        'Admin User',
        'active'
      ]);

      await query(`INSERT INTO campuses (name, description, image_path, location, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        'City Campus',
        'A compact urban campus offering professional and continuing education programs.',
        null,
        'Downtown, Sierra Leone',
        1,
        'Admin User',
        'inactive'
      ]);

      console.log('✓ Sample campuses inserted successfully');
    } else {
      console.log('Campuses table already contains data; skipping seeding');
    }

    console.log('Campuses setup complete');
    process.exit(0);
  } catch (err) {
    console.error('Setup failed:', err.message);
    process.exit(1);
  }
}

setupCampuses();
