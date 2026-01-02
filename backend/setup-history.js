const { query } = require('./db');

async function setup() {
  try {
    console.log('Creating history table...');
    await query(`
      CREATE TABLE IF NOT EXISTS history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        year VARCHAR(20) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description LONGTEXT NOT NULL,
        status ENUM('active','inactive') DEFAULT 'inactive',
        author_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const rows = await query('SELECT COUNT(*) as cnt FROM history');
    if (rows[0].cnt === 0) {
      console.log('Seeding sample history entries...');
      await query('INSERT INTO history (year, title, description, status, author_name) VALUES (?, ?, ?, ?, ?)', ['2004', 'Foundation', 'ETUSL was established with a vision to provide quality technical education in Sierra Leone', 'active', 'System']);
      await query('INSERT INTO history (year, title, description, status, author_name) VALUES (?, ?, ?, ?, ?)', ['2008', 'First Graduation', 'The first cohort of graduates successfully completed their programs', 'active', 'System']);
      await query('INSERT INTO history (year, title, description, status, author_name) VALUES (?, ?, ?, ?, ?)', ['2012', 'Campus Expansion', 'New facilities and academic buildings were constructed to support growth', 'inactive', 'System']);
      console.log('Seeded history entries');
    }

    console.log('history setup complete');
    process.exit(0);
  } catch (err) {
    console.error('Setup failed:', err.message);
    process.exit(1);
  }
}

setup();
