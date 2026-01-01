const { query } = require('./db');

async function updateAnnouncementStatus() {
  try {
    console.log('Updating announcement statuses to active...');
    
    await query(`
      UPDATE announcements SET status = 'active' WHERE status = 'published'
    `);
    
    console.log('✓ Announcement statuses updated to active!');
    process.exit(0);
  } catch (err) {
    console.error('✗ Update error:', err.message);
    process.exit(1);
  }
}

updateAnnouncementStatus();
