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

    console.log('Connected to DB for academic calendar setup');

    const createTable = `
      CREATE TABLE IF NOT EXISTS academic_calendar (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(500) NOT NULL,
        type VARCHAR(120) DEFAULT 'Event',
        start_date DATE DEFAULT NULL,
        end_date DATE DEFAULT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await conn.query(createTable);
    console.log('academic_calendar table created or already exists');

    const [countRows] = await conn.execute('SELECT COUNT(*) as cnt FROM academic_calendar');
    if (countRows[0].cnt === 0) {
      const items = [
        [ 'End of 2024/2025 Second Semester Exams', 'Event', '2025-08-04', null, '' ],
        [ 'Advertise for the 2025/2026 Session Student Admission', 'Announcement', '2025-08-01', '2025-09-20', '' ],
        [ 'Curriculum Review Committee Meeting & validation exercise for Undergraduate & graduate programmes', 'Meeting', '2025-08-18', '2025-09-19', '' ],
        [ 'Conditions of Service Committee Meeting', 'Meeting', '2025-08-22', null, '' ],
        [ 'Advertisement for Staff Promotions Meeting', 'Announcement', '2025-08-01', '2025-09-03', '' ],
        [ 'Conduct of the Second semester 2024/2025 Ref/I grade exams', 'Examination', '2025-09-20', '2025-09-30', '' ],
        [ 'Publication of 2024/2025 Results for final year and all Continuing Students at all Levels', 'Publication', '2025-09-11', '2025-09-12', '' ],
        [ 'Interview for Admission', 'Interview', '2025-09-10', '2025-09-30', '' ],
        [ 'Scoring Committee Meeting', 'Meeting', '2025-09-11', '2025-09-12', '' ],
        [ 'Appointment and Promotion Committee Meeting', 'Meeting', '2025-09-26', '2025-09-27', '' ],
        [ 'Audit Committee Meeting', 'Meeting', '2025-09-30', null, '' ],
        [ 'Finance and General Purpose Committee', 'Meeting', '2025-10-02', null, '' ],
        [ 'Re-opening of University for 2025/2026', 'Event', '2025-10-04', null, '' ],
        [ 'Orientation of First Year Candidates', 'Orientation', '2025-10-09', '2025-10-11', '' ],
        [ 'Faculty Board Meeting', 'Meeting', '2025-10-16', '2025-10-18', '' ],
        [ 'Matriculation Ceremony for First Year Students - Kenema Campus', 'Ceremony', '2025-11-15', '2025-11-22', '' ],
        [ 'First Semester 2025/2026 Student Registration', 'Registration', '2025-10-06', '2025-11-30', '' ],
        [ 'Commencement of Lectures for First Semester 2025/2026', 'Lectures', '2025-10-13', '2026-02-26', '' ],
        [ 'Senate Meeting', 'Meeting', '2025-10-23', null, '' ],
        [ 'Standing Committee - ETU-SL Kenema / Bunumbu Campuses', 'Meeting', '2025-11-06', '2025-11-10', '' ],
        [ 'Campus Coordinating Committee meeting, Kenema/Bunumbu Campuses', 'Meeting', '2025-11-14', '2025-11-16', '' ],
        [ 'ETU-SL General Court Meeting', 'Meeting', '2025-11-29', null, '' ],
        [ 'General Court Meeting', 'Meeting', '2025-12-10', '2025-12-12', '' ],
        [ 'Christmas Recess', 'Recess', '2025-12-20', '2026-01-03', '' ],
        [ 'First Semester Lecturers continue', 'Lectures', '2026-01-05', '2026-02-28', '' ],
        [ 'Chancellor’s Lecture', 'Lecture', '2026-01-16', null, '' ],
        [ 'Congregation Ceremony', 'Ceremony', '2026-01-17', null, '' ],
        [ 'Armed Forces Day', 'Public Holiday', '2026-02-18', null, '' ],
        [ 'First Semester Exams for 2025/2026 (Undergraduate)', 'Examination', '2026-03-03', '2026-03-31', '' ],
        [ 'First Semester Exams for 2025/2026 (Postgraduate)', 'Examination', '2026-04-01', '2026-04-14', '' ],
        [ 'First Semester Break/Recess', 'Recess', '2026-04-01', '2026-04-11', '' ],
        [ 'Eid al-Fitr (Moveable)', 'Public Holiday', '2026-03-20', null, 'Moveable date' ],
        [ 'Start of Second Semester Lectures (Undergraduate)', 'Lectures', '2026-04-13', '2026-07-11', '' ],
        [ 'Start of Second Semester Lectures (Postgraduate)', 'Lectures', '2026-04-24', '2026-07-21', '' ],
        [ 'Advertise for the 2025/2026 Session Staff Promotion/Scoring', 'Announcement', '2026-04-15', '2026-05-16', '' ],
        [ 'Second Semester Students Registration', 'Registration', '2026-04-13', '2026-05-30', '' ],
        [ 'University Sporting Activities', 'Event', '2026-04-20', '2026-04-25', '' ],
        [ 'Independence Day', 'Public Holiday', '2026-04-27', null, '' ],
        [ 'Submission of First Semester Grades to the Examination Office by Deans of Faculty', 'Deadline', '2026-04-30', '2026-05-04', '' ],
        [ 'Publication of First Semester 2025/2026 Results for all Continuing Students at all Levels', 'Publication', '2026-05-25', '2026-05-30', '' ],
        [ 'Scoring Committee - 2025/2026', 'Meeting', '2026-05-26', '2026-05-29', '' ],
        [ 'Resit of First Semester Ref/I Grade Exams', 'Examination', '2026-06-08', '2026-06-20', '' ],
        [ 'Appointment and Promotion Committee Meeting', 'Meeting', '2026-06-04', '2026-06-06', '' ],
        [ 'Seminars for final year Students', 'Seminar', '2026-06-22', '2026-06-30', '' ],
        [ 'Standing Committee Meeting', 'Meeting', '2026-06-10', null, '' ],
        [ 'Start of Final Year Examinations', 'Examination', '2026-07-01', '2026-07-09', '' ],
        [ 'End of Second Semester Lectures for all continuing students', 'Lectures', '2026-07-08', null, '' ],
        [ 'Start of Second Semester Examinations for years 1-3 (Undergraduate)', 'Examination', '2026-07-10', '2026-08-07', '' ],
        [ 'Additional Second Semester Examinations window', 'Examination', '2026-08-18', '2026-08-25', '' ],
        [ 'Advertisement for Sales of 2026/2027 Academic forms for ETU-SL', 'Announcement', '2026-07-27', '2026-09-07', '' ],
        [ 'Audit Committee', 'Meeting', '2026-08-19', null, '' ],
        [ 'Coordinating Committee Meeting', 'Meeting', '2026-08-27', '2026-08-29', '' ],
        [ 'Publication of Second Semester Results', 'Publication', '2026-09-14', '2026-09-19', '' ],
        [ 'Ref/I Grades Resit Examination for Second Semester', 'Examination', '2026-09-22', '2026-10-10', '' ],
        [ 'Faculty Board of Examiners Meeting', 'Meeting', '2026-10-20', '2026-10-21', '' ],
        [ 'Senate Meeting', 'Meeting', '2026-11-02', null, '' ],
        [ 'Reopening of First Semester 2026/2027 Session', 'Event', '2026-10-03', null, '' ],
        [ 'Start of Registration of Students for 2026/2027 Academic year', 'Registration', '2026-10-05', '2026-11-30', '' ],
        [ 'Start of first Semester Lectures (Undergraduate)', 'Lectures', '2026-10-12', null, '' ],
        [ 'Start of first Semester Lectures (Postgraduate)', 'Lectures', '2026-10-19', null, '' ],
        [ 'Finance and General Purposes Committee Meeting', 'Meeting', '2026-09-02', null, '' ],
        [ 'University Court Meeting', 'Meeting', '2026-11-14', null, '' ],
        [ 'Chancellor’s Lecture - Eve of Congregation', 'Lecture', null, null, '' ],
        [ 'University Convocation/Congregation', 'Ceremony', '2026-12-01', '2026-12-31', '' ]
      ];

      for (const it of items) {
        await conn.execute('INSERT INTO academic_calendar (title, type, start_date, end_date, description, status) VALUES (?, ?, ?, ?, ?, ?)', [it[0], it[1], it[2], it[3], it[4], 'active']);
      }
      console.log('Seeded academic calendar items');
    } else {
      console.log('academic_calendar table already has data, skipping seed');
    }

    await conn.end();
    console.log('Academic calendar setup complete');
  } catch (err) {
    console.error('Error setting up academic calendar:', err.message);
    process.exit(1);
  }
})();
