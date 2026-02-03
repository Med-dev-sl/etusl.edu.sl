require('dotenv').config();
const { pool } = require('./db');

async function setupStrategicPlan() {
  try {
    // Create strategic_plan table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS strategic_plan (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        content LONGTEXT NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        author_id INT,
        author_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('✅ Strategic Plan table created');

    // Insert sample data
    const sampleData = [
      {
        title: 'Academic Excellence',
        slug: 'academic-excellence',
        content: 'ETUSL is committed to providing world-class education through innovative teaching methods, cutting-edge technology integration, and continuous curriculum development. Our goal is to produce graduates who are competent, competitive, and globally recognized.'
      },
      {
        title: 'Technology Integration',
        slug: 'technology-integration',
        content: 'We aim to leverage technology to enhance learning experiences and improve operational efficiency. This includes implementing modern learning management systems, utilizing AI and data analytics, and ensuring digital accessibility for all students.'
      },
      {
        title: 'Community Engagement',
        slug: 'community-engagement',
        content: 'ETUSL seeks to strengthen partnerships with industry, government, and community organizations. Through collaborative research, internship programs, and outreach initiatives, we strive to contribute meaningfully to societal development.'
      },
      {
        title: 'Research & Innovation',
        slug: 'research-innovation',
        content: 'We foster a culture of research and innovation by supporting faculty research projects, encouraging student participation in research activities, and establishing research centers of excellence in emerging technology fields.'
      },
      {
        title: 'Student Development',
        slug: 'student-development',
        content: 'Beyond academics, we are committed to developing well-rounded individuals through extracurricular activities, mentorship programs, career guidance, and personal development workshops.'
      }
    ];

    for (const data of sampleData) {
      await pool.query(
        'INSERT INTO strategic_plan (title, slug, content, status, author_id, author_name) VALUES (?, ?, ?, ?, ?, ?)',
        [data.title, data.slug, data.content, 'active', 1, 'System']
      );
    }

    console.log('✅ Sample strategic plan data inserted');
    console.log('✅ Strategic Plan setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Setup error:', err.message);
    process.exit(1);
  }
}

setupStrategicPlan();
