const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'etusl_db'
    });

    console.log('Connected to DB for programmes setup');

    const createTable = `
      CREATE TABLE IF NOT EXISTS programmes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(80) NOT NULL,
        title VARCHAR(255) NOT NULL,
        level ENUM('undergraduate','postgraduate','certificate') DEFAULT 'undergraduate',
        faculty_id INT NULL,
        faculty_name VARCHAR(255) DEFAULT '',
        duration VARCHAR(100) DEFAULT '',
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        author_id INT DEFAULT 1,
        author_name VARCHAR(255) DEFAULT 'System',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await conn.query(createTable);
    console.log('programmes table created or already exists');

    // seed some sample programmes if none exist
    const [rows] = await conn.execute('SELECT COUNT(*) as cnt FROM programmes');
    if (rows[0].cnt === 0) {
      const seed = [
        ['BScCS','B.Sc. Computer Science','undergraduate', null, 'Faculty of Science & Technology','4 years','Comprehensive computer science program focusing on software engineering, systems, and AI.','active','1','System'],
        ['BEngET','B.Eng. Electrical & Telecoms','undergraduate', null, 'Faculty of Engineering','4 years','Engineering program emphasizing electrical systems and telecommunications.','active','1','System'],
        ['MScCS','M.Sc. Computer Science','postgraduate', null, 'Faculty of Science & Technology','2 years','Advanced study in algorithms, distributed systems, and machine learning.','active','1','System'],
        ['DipIT','Diploma in Information Technology','certificate', null, 'Faculty of Computing & IT','2 years','Practical IT training for industry roles.','active','1','System']
      ];

      for (const p of seed) {
        await conn.execute('INSERT INTO programmes (code, title, level, faculty_id, faculty_name, duration, description, status, author_id, author_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', p);
      }
      console.log('Seeded sample programmes');
    } else {
      console.log('Programmes table already has data, skipping seed');
    }

    await conn.end();
    console.log('Programmes setup complete');
  } catch (err) {
    console.error('Error setting up programmes:', err.message);
    process.exit(1);
  }
})();
