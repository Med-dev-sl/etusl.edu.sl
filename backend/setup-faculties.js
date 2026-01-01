const { query } = require('./db');

async function setupFaculties() {
  try {
    console.log('Creating faculties table...');
    
    await query(`
      CREATE TABLE IF NOT EXISTS faculties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description LONGTEXT NOT NULL,
        image_path VARCHAR(255),
        dean_name VARCHAR(100),
        contact_email VARCHAR(100),
        phone VARCHAR(20),
        location VARCHAR(255),
        established_year INT,
        author_id INT NOT NULL,
        author_name VARCHAR(100),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES staff(id)
      )
    `);
    
    console.log('✓ Faculties table created successfully');

    // Insert sample data
    console.log('Inserting sample faculties...');
    
    await query(`
      INSERT INTO faculties (name, description, dean_name, contact_email, phone, location, established_year, author_id, author_name) 
      VALUES 
      ('Faculty of Science', 'The Faculty of Science is dedicated to advancing knowledge in natural sciences, mathematics, and technology. Our programs combine rigorous academic training with practical research opportunities.', 'Prof. Dr. Ahmed Hassan', 'science@etusl.edu.sl', '+249 183 456789', 'Building A, Campus', 2010, 1, 'Admin User'),
      ('Faculty of Engineering', 'The Faculty of Engineering prepares students for careers in civil, electrical, mechanical, and software engineering. We emphasize innovation, sustainability, and practical problem-solving skills.', 'Prof. Fatima Mohammed', 'engineering@etusl.edu.sl', '+249 183 456790', 'Building B, Campus', 2008, 1, 'Admin User'),
      ('Faculty of Liberal Arts', 'The Faculty of Liberal Arts nurtures critical thinking, cultural understanding, and creative expression. Our interdisciplinary approach fosters well-rounded graduates prepared for diverse careers.', 'Dr. Karim Ibrahim', 'arts@etusl.edu.sl', '+249 183 456791', 'Building C, Campus', 2015, 1, 'Admin User')
    `);
    
    console.log('✓ Sample faculties inserted successfully');
    console.log('✓ Faculties setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('✗ Setup error:', err.message);
    process.exit(1);
  }
}

setupFaculties();
