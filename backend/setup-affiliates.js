const { query } = require('./db');

async function setupAffiliates() {
  try {
    console.log('Creating affiliates_partners table...');

    await query(`
      CREATE TABLE IF NOT EXISTS affiliates_partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type ENUM('affiliate','partner') DEFAULT 'affiliate',
        description LONGTEXT,
        image_path VARCHAR(255),
        website VARCHAR(255),
        email VARCHAR(255),
        status ENUM('active','inactive') DEFAULT 'inactive',
        author_id INT NOT NULL,
        author_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES staff(id)
      )
    `);

    console.log('✓ affiliates_partners table created successfully');

    const rows = await query('SELECT COUNT(*) as cnt FROM affiliates_partners');
    if (rows[0].cnt === 0) {
      console.log('Seeding sample affiliates and partners...');

      await query(`INSERT INTO affiliates_partners (name, type, description, website, email, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)` , [
        'National Tech Consortium', 'affiliate', 'A national consortium that supports technical education initiatives across the country.', 'https://techconsortium.example', 'info@techconsortium.example', 1, 'Admin User', 'active'
      ]);

      await query(`INSERT INTO affiliates_partners (name, type, description, website, email, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)` , [
        'Global Industry Partner Ltd.', 'partner', 'Industry partner collaborating on research and internships.', 'https://globalindustry.example', 'partnerships@globalindustry.example', 1, 'Admin User', 'active'
      ]);

      console.log('✓ Sample affiliates and partners inserted successfully');
    } else {
      console.log('Affiliates & Partners table already contains data; skipping seeding');
    }

    console.log('Affiliates & Partners setup complete');
    process.exit(0);
  } catch (err) {
    console.error('Setup failed:', err.message || err);
    process.exit(1);
  }
}

setupAffiliates();
