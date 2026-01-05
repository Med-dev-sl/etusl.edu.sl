const { query } = require('./db');

async function setupPolicies() {
  try {
    console.log('Creating policies table...');

    await query(`
      CREATE TABLE IF NOT EXISTS policies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        content LONGTEXT,
        status ENUM('active','inactive') DEFAULT 'inactive',
        author_id INT,
        author_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✓ policies table created');

    const rows = await query('SELECT COUNT(*) as cnt FROM policies');
    if (rows[0].cnt === 0) {
      console.log('Seeding sample policies...');
      await query(`INSERT INTO policies (title, slug, content, status, author_id, author_name) VALUES (?, ?, ?, ?, ?, ?)` , [
        'Academic Integrity Policy', 'academic-integrity', 'This policy outlines expectations for academic honesty and integrity at ETUSL.', 'active', 1, 'Admin'
      ]);

      await query(`INSERT INTO policies (title, slug, content, status, author_id, author_name) VALUES (?, ?, ?, ?, ?, ?)` , [
        'Student Conduct Policy', 'student-conduct', 'Standards of conduct for students of ETUSL.', 'active', 1, 'Admin'
      ]);

      console.log('✓ Sample policies inserted');
    } else {
      console.log('Policies table already has data; skipping seeding');
    }

    console.log('Policies setup complete');
    process.exit(0);
  } catch (err) {
    console.error('Setup failed:', err.message || err);
    process.exit(1);
  }
}

setupPolicies();
