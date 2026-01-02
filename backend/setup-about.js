const { query } = require('./db');

async function setupAbout() {
  try {
    console.log('Creating about table...');
    await query(`
      CREATE TABLE IF NOT EXISTS about (
        id INT PRIMARY KEY,
        mission LONGTEXT,
        vision LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insert default row if not exists
    const rows = await query('SELECT COUNT(*) as cnt FROM about');
    if (rows[0].cnt === 0) {
      console.log('Inserting default mission and vision...');
      await query('INSERT INTO about (id, mission, vision) VALUES (1, ?, ?)', [
        'To provide accessible, high-quality technical and professional education that equips students with the knowledge, skills, and values necessary to excel in their careers and contribute meaningfully to society.',
        'To be a leading institution of technical excellence recognized nationally and internationally for our commitment to innovation, quality education, and sustainable development.'
      ]);
      console.log('Default content inserted');
    }

    console.log('About setup complete');
    process.exit(0);
  } catch (err) {
    console.error('Setup failed:', err.message);
    process.exit(1);
  }
}

setupAbout();
