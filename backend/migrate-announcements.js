const { query } = require('./db');

async function migrateAnnouncements() {
  try {
    console.log('Checking announcements table structure...');
    
    // Check if status column exists and has the right type
    const result = await query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'announcements' 
      AND TABLE_SCHEMA = 'etusl_db'
      AND COLUMN_NAME = 'status'
    `);

    if (result.length > 0) {
      console.log('Status column exists. Updating ENUM values...');
      // Update the enum type to include active/inactive
      await query(`
        ALTER TABLE announcements 
        MODIFY COLUMN status ENUM('active', 'inactive', 'draft', 'published', 'archived') DEFAULT 'active'
      `);
      console.log('✓ Status column updated');
    } else {
      console.log('Status column not found. Adding it...');
      await query(`
        ALTER TABLE announcements 
        ADD COLUMN status ENUM('active', 'inactive', 'draft', 'published', 'archived') DEFAULT 'active'
      `);
      console.log('✓ Status column added');
    }

    console.log('✓ Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('✗ Migration error:', err.message);
    process.exit(1);
  }
}

migrateAnnouncements();
