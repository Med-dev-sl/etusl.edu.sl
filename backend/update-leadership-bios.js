const { query } = require('./db');

async function updateBios() {
  try {
    console.log('Updating leadership biographies...');

    // Update sample entries by name — adjust names if your data differs
    await query('UPDATE leadership SET description = ? WHERE name = ?', [
      'Prof. A. Johnson has served as Vice-Chancellor since 2022. He leads the university\'s academic strategy, external partnerships, and institutional governance. With over 25 years in higher education, Prof. Johnson focuses on research excellence and student success.',
      'Prof. A. Johnson'
    ]);

    await query('UPDATE leadership SET description = ? WHERE name = ?', [
      'Dr. M. Conteh is the Registrar, responsible for student records, admissions, examinations and academic administration. Dr. Conteh has implemented several process improvements to streamline student services and records management.',
      'Dr. M. Conteh'
    ]);

    await query('UPDATE leadership SET description = ? WHERE name = ?', [
      'Directorate of Research & Innovation promotes research, grant acquisition, and industry collaboration. The directorate supports faculty and student research initiatives, technology transfer, and capacity building.',
      'Directorate of Research & Innovation'
    ]);

    console.log('Biographies updated successfully');
    process.exit(0);
  } catch (err) {
    console.error('Failed to update biographies:', err.message || err);
    process.exit(1);
  }
}

updateBios();
