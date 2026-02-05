require('dotenv').config();
const { query } = require('./db');

async function setupLibrary() {
  try {
    // Create library table
    console.log('Creating library table...');
    
    await query(`
      CREATE TABLE IF NOT EXISTS library (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type ENUM('books', 'past-papers') NOT NULL DEFAULT 'books',
        author VARCHAR(255),
        isbn VARCHAR(20),
        year INT,
        course VARCHAR(255),
        subject VARCHAR(255),
        faculty_id INT,
        faculty_name VARCHAR(255),
        level ENUM('Undergraduate', 'Postgraduate', 'Certificate') NOT NULL,
        description TEXT,
        file_path VARCHAR(500),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by VARCHAR(255),
        FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE SET NULL
      )
    `);

    console.log('✅ Library table created successfully!');

    // Sample data for books
    const booksData = [
      {
        title: 'Introduction to Computer Science',
        type: 'books',
        author: 'David Evans',
        isbn: '978-0134685991',
        year: 2023,
        faculty_id: 1,
        faculty_name: 'Faculty of Engineering',
        level: 'Undergraduate',
        description: 'Comprehensive introduction to computer science fundamentals and programming concepts.',
        status: 'active',
        created_by: 'Library Admin'
      },
      {
        title: 'Advanced Database Systems',
        type: 'books',
        author: 'Ramakrishnan & Gehrke',
        isbn: '978-0072465631',
        year: 2022,
        faculty_id: 1,
        faculty_name: 'Faculty of Engineering',
        level: 'Postgraduate',
        description: 'Deep dive into modern database architecture and design patterns.',
        status: 'active',
        created_by: 'Library Admin'
      },
      {
        title: 'Business Management Essentials',
        type: 'books',
        author: 'John Smith',
        isbn: '978-0134685995',
        year: 2023,
        faculty_id: 2,
        faculty_name: 'Faculty of Business',
        level: 'Undergraduate',
        description: 'Essential principles and practices of modern business management.',
        status: 'active',
        created_by: 'Library Admin'
      },
      {
        title: 'Marketing Strategy & Implementation',
        type: 'books',
        author: 'Philip Kotler',
        isbn: '978-0134685996',
        year: 2023,
        faculty_id: 2,
        faculty_name: 'Faculty of Business',
        level: 'Postgraduate',
        description: 'Strategic approach to marketing in the digital age.',
        status: 'active',
        created_by: 'Library Admin'
      },
      {
        title: 'Organic Chemistry Fundamentals',
        type: 'books',
        author: 'Paula Bruice',
        isbn: '978-0134145006',
        year: 2022,
        faculty_id: 3,
        faculty_name: 'Faculty of Science',
        level: 'Undergraduate',
        description: 'Core concepts and reactions in organic chemistry.',
        status: 'active',
        created_by: 'Library Admin'
      },
      {
        title: 'Advanced Organic Synthesis',
        type: 'books',
        author: 'Michael Smith',
        isbn: '978-0134145007',
        year: 2023,
        faculty_id: 3,
        faculty_name: 'Faculty of Science',
        level: 'Postgraduate',
        description: 'Advanced techniques in organic synthesis and analysis.',
        status: 'active',
        created_by: 'Library Admin'
      }
    ];

    // Sample data for past papers
    const pastPapersData = [
      {
        title: 'Data Structures and Algorithms - Final Exam 2023',
        type: 'past-papers',
        year: 2023,
        course: 'CS301',
        subject: 'Data Structures',
        faculty_id: 1,
        faculty_name: 'Faculty of Engineering',
        level: 'Undergraduate',
        description: 'Final examination paper for Data Structures and Algorithms course.',
        status: 'active',
        created_by: 'Library Admin'
      },
      {
        title: 'Database Systems - Midterm Exam 2023',
        type: 'past-papers',
        year: 2023,
        course: 'CS401',
        subject: 'Database Systems',
        faculty_id: 1,
        faculty_name: 'Faculty of Engineering',
        level: 'Postgraduate',
        description: 'Midterm examination for advanced Database Systems.',
        status: 'active',
        created_by: 'Library Admin'
      },
      {
        title: 'Business Management - Final Exam 2023',
        type: 'past-papers',
        year: 2023,
        course: 'BUS201',
        subject: 'Business Management',
        faculty_id: 2,
        faculty_name: 'Faculty of Business',
        level: 'Undergraduate',
        description: 'Final examination for Business Management fundamentals.',
        status: 'active',
        created_by: 'Library Admin'
      },
      {
        title: 'Finance & Investment - Final Exam 2023',
        type: 'past-papers',
        year: 2023,
        course: 'FIN301',
        subject: 'Finance',
        faculty_id: 2,
        faculty_name: 'Faculty of Business',
        level: 'Postgraduate',
        description: 'Advanced Finance and Investment portfolio examination.',
        status: 'active',
        created_by: 'Library Admin'
      },
      {
        title: 'General Chemistry - Final Exam 2023',
        type: 'past-papers',
        year: 2023,
        course: 'CHEM101',
        subject: 'Chemistry',
        faculty_id: 3,
        faculty_name: 'Faculty of Science',
        level: 'Undergraduate',
        description: 'Final examination for General Chemistry course.',
        status: 'active',
        created_by: 'Library Admin'
      },
      {
        title: 'Analytical Chemistry - Practical Exam 2023',
        type: 'past-papers',
        year: 2023,
        course: 'CHEM401',
        subject: 'Analytical Chemistry',
        faculty_id: 3,
        faculty_name: 'Faculty of Science',
        level: 'Postgraduate',
        description: 'Practical examination for Advanced Analytical Chemistry.',
        status: 'active',
        created_by: 'Library Admin'
      },
      {
        title: 'Web Development Certificate - Final Project 2023',
        type: 'past-papers',
        year: 2023,
        course: 'CERT-WEB',
        subject: 'Web Development',
        faculty_id: 1,
        faculty_name: 'Faculty of Engineering',
        level: 'Certificate',
        description: 'Final project requirements and evaluation criteria.',
        status: 'active',
        created_by: 'Library Admin'
      },
      {
        title: 'Accounting Certificate - Exam 2023',
        type: 'past-papers',
        year: 2023,
        course: 'CERT-ACC',
        subject: 'Accounting',
        faculty_id: 2,
        faculty_name: 'Faculty of Business',
        level: 'Certificate',
        description: 'Certificate level accounting examination.',
        status: 'active',
        created_by: 'Library Admin'
      }
    ];

    // Insert books
    console.log('Inserting sample books...');
    for (const book of booksData) {
      await query(
        `INSERT INTO library (title, type, author, isbn, year, faculty_id, faculty_name, level, description, status, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [book.title, book.type, book.author, book.isbn, book.year, book.faculty_id, book.faculty_name, book.level, book.description, book.status, book.created_by]
      );
    }
    console.log(`✅ Inserted ${booksData.length} books`);

    // Insert past papers
    console.log('Inserting sample past papers...');
    for (const paper of pastPapersData) {
      await query(
        `INSERT INTO library (title, type, year, course, subject, faculty_id, faculty_name, level, description, status, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [paper.title, paper.type, paper.year, paper.course, paper.subject, paper.faculty_id, paper.faculty_name, paper.level, paper.description, paper.status, paper.created_by]
      );
    }
    console.log(`✅ Inserted ${pastPapersData.length} past papers`);

    console.log('✅ Library setup completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error setting up library:', err.message);
    process.exit(1);
  }
}

setupLibrary();
