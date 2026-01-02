const { query } = require('./db');

async function setup() {
  try {
    console.log('Creating mission_vision table...');
    await query(`
      CREATE TABLE IF NOT EXISTS mission_vision (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('mission','vision') NOT NULL,
        content LONGTEXT NOT NULL,
        status ENUM('active','inactive') DEFAULT 'inactive',
        author_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const rows = await query("SELECT COUNT(*) as cnt FROM mission_vision");
    if (rows[0].cnt === 0) {
      console.log('Seeding default mission and vision...');
      await query('INSERT INTO mission_vision (type, content, status, author_name) VALUES (?, ?, ?, ?)', ['mission', 'To provide accessible, high-quality technical and professional education that equips students with the knowledge, skills, and values necessary to excel in their careers and contribute meaningfully to society.', 'active', 'System']);
      await query('INSERT INTO mission_vision (type, content, status, author_name) VALUES (?, ?, ?, ?)', ['vision', 'To be a leading institution of technical excellence recognized nationally and internationally for our commitment to innovation, quality education, and sustainable development.', 'active', 'System']);
      console.log('Seeded');
    }

    console.log('mission_vision setup complete');
    process.exit(0);
  } catch (err) {
    console.error('Setup failed:', err.message);
    process.exit(1);
  }
}

setup();
