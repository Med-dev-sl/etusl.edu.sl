require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('./db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const staffId = req.body.staffId || 'unknown';
    const ext = path.extname(file.originalname);
    cb(null, `profile_${staffId}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ===== STAFF AUTHENTICATION =====
app.post('/api/auth/staff-login', async (req, res) => {
  const { staffId, password } = req.body;

  if (!staffId || !password) {
    return res.status(400).json({ error: 'Staff ID and password required' });
  }

  try {
    const rows = await query('SELECT id, staffId, name, email, department, password, role, profile_photo, phone, office_location, bio FROM staff WHERE staffId = ?', [staffId]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid staff ID or password' });
    }

    const staff = rows[0];

    // Simple password check (in production, use bcrypt for hashing)
    if (staff.password !== password) {
      return res.status(401).json({ error: 'Invalid staff ID or password' });
    }

    // Return staff data without password
    res.json({
      success: true,
      staff: {
        id: staff.id,
        staffId: staff.staffId,
        name: staff.name,
        email: staff.email,
        department: staff.department,
        role: staff.role,
        profile_photo: staff.profile_photo,
        phone: staff.phone,
        office_location: staff.office_location,
        bio: staff.bio
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

app.get('/api/auth/staff/:staffId', async (req, res) => {
  try {
    const rows = await query('SELECT id, staffId, name, email, department, role, profile_photo, phone, office_location, bio FROM staff WHERE staffId = ?', [req.params.staffId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json({ staff: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ===== USERS API =====
app.get('/api/users', async (req, res) => {
  try {
    const rows = await query('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC');
    res.json({ users: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const rows = await query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email, role = 'user' } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  try {
    await query('INSERT INTO users (name, email, role) VALUES (?, ?, ?)', [name, email, role]);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { name, email, role } = req.body;
  try {
    await query('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?', [name, email, role, req.params.id]);
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ===== PRODUCTS API =====
app.get('/api/products', async (req, res) => {
  try {
    const rows = await query('SELECT id, name, price, stock, created_at FROM products ORDER BY id DESC');
    res.json({ products: rows });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, price, stock = 0 } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'name and price required' });
  try {
    await query('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)', [name, price, stock]);
    res.status(201).json({ message: 'Product created' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { name, price, stock } = req.body;
  try {
    await query('UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?', [name, price, stock, req.params.id]);
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ===== STAFF MANAGEMENT API (SUPERADMIN ONLY) =====
// Get all staff members
app.get('/api/staff', async (req, res) => {
  try {
    const rows = await query('SELECT id, staffId, name, email, department, role, phone, office_location, profile_photo, status FROM staff ORDER BY name');
    res.json({ staff: rows });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Get single staff member
app.get('/api/staff/:id', async (req, res) => {
  try {
    const rows = await query('SELECT id, staffId, name, email, department, role, phone, office_location, profile_photo, bio, status FROM staff WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Staff not found' });
    res.json({ staff: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Add new staff member
app.post('/api/staff', async (req, res) => {
  const { staffId, name, email, password, department, phone, role = 'STAFF', office_location } = req.body;
  
  if (!staffId || !name || !email || !password) {
    return res.status(400).json({ error: 'staffId, name, email, and password required' });
  }

  try {
    await query(
      'INSERT INTO staff (staffId, name, email, password, department, phone, role, office_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [staffId, name, email, password, department, phone, role, office_location]
    );
    res.status(201).json({ message: 'Staff member added successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Staff ID or email already exists' });
    }
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Update staff member
app.put('/api/staff/:id', async (req, res) => {
  const { name, email, department, phone, role, office_location, bio, status } = req.body;
  
  try {
    await query(
      'UPDATE staff SET name = ?, email = ?, department = ?, phone = ?, role = ?, office_location = ?, bio = ?, status = ? WHERE id = ?',
      [name, email, department, phone, role, office_location, bio, status, req.params.id]
    );
    res.json({ message: 'Staff member updated' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Delete staff member
app.delete('/api/staff/:id', async (req, res) => {
  try {
    await query('DELETE FROM staff WHERE id = ?', [req.params.id]);
    res.json({ message: 'Staff member deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Upload profile photo
app.post('/api/staff/:id/upload-photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please select an image file.' });
    }

    console.log('File uploaded:', req.file.filename);

    const photoPath = `/uploads/${req.file.filename}`;
    
    // Update staff record with photo path
    await query('UPDATE staff SET profile_photo = ? WHERE id = ?', [photoPath, req.params.id]);
    
    console.log('Database updated with photo path:', photoPath);

    res.json({ 
      message: 'Photo uploaded successfully', 
      photoPath: photoPath 
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed', detail: err.message });
  }
});

// Update password
app.post('/api/staff/:id/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password required' });
  }

  try {
    const rows = await query('SELECT password FROM staff WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Staff not found' });
    
    const staff = rows[0];
    if (staff.password !== currentPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    await query('UPDATE staff SET password = ? WHERE id = ?', [newPassword, req.params.id]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ===== ANNOUNCEMENTS API =====
// Get all announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const rows = await query(
      'SELECT id, headline, description, author_name, category, status, created_at, updated_at FROM announcements ORDER BY created_at DESC'
    );
    res.json({ announcements: rows });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Get single announcement
app.get('/api/announcements/:id', async (req, res) => {
  try {
    const rows = await query(
      'SELECT id, headline, description, author_name, category, status, created_at, updated_at FROM announcements WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Announcement not found' });
    res.json({ announcement: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Create new announcement (SUPERADMIN/ADMIN only)
app.post('/api/announcements', async (req, res) => {
  const { headline, description, author_id, author_name, category = 'General', status = 'active' } = req.body;
  
  if (!headline || !description || !author_id) {
    return res.status(400).json({ error: 'Headline, description, and author_id required' });
  }

  try {
    const result = await query(
      'INSERT INTO announcements (headline, description, author_id, author_name, category, status) VALUES (?, ?, ?, ?, ?, ?)',
      [headline, description, author_id, author_name, category, status]
    );
    res.status(201).json({ message: 'Announcement created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Update announcement (SUPERADMIN/ADMIN only)
app.put('/api/announcements/:id', async (req, res) => {
  const { headline, description, category, status } = req.body;
  
  try {
    await query(
      'UPDATE announcements SET headline = ?, description = ?, category = ?, status = ? WHERE id = ?',
      [headline, description, category, status, req.params.id]
    );
    res.json({ message: 'Announcement updated' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Delete announcement (SUPERADMIN only)
app.delete('/api/announcements/:id', async (req, res) => {
  try {
    await query('DELETE FROM announcements WHERE id = ?', [req.params.id]);
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ===== NEWS & EVENTS API =====
// Get all news & events
app.get('/api/news-events', async (req, res) => {
  try {
    const rows = await query(
      'SELECT id, headline, description, image_path, event_time, location, event_type, author_name, status, created_at, updated_at FROM news_events ORDER BY event_time DESC, created_at DESC'
    );
    res.json({ newsEvents: rows });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Get single news/event
app.get('/api/news-events/:id', async (req, res) => {
  try {
    const rows = await query(
      'SELECT id, headline, description, image_path, event_time, location, event_type, author_name, status, created_at, updated_at FROM news_events WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'News/Event not found' });
    res.json({ newsEvent: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// File upload for news/events
const newsEventsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const newsEventsDir = path.join(__dirname, 'uploads', 'news-events');
    if (!fs.existsSync(newsEventsDir)) {
      fs.mkdirSync(newsEventsDir, { recursive: true });
    }
    cb(null, newsEventsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `news_${Date.now()}${ext}`);
  }
});

const newsEventsUpload = multer({
  storage: newsEventsStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Create new news/event
app.post('/api/news-events', newsEventsUpload.single('image'), async (req, res) => {
  const { headline, description, event_time, location, event_type = 'event', author_id, author_name, status = 'active' } = req.body;
  
  if (!headline || !description || !author_id) {
    return res.status(400).json({ error: 'Headline, description, and author_id required' });
  }

  const imagePath = req.file ? `/uploads/news-events/${req.file.filename}` : null;

  try {
    const result = await query(
      'INSERT INTO news_events (headline, description, image_path, event_time, location, event_type, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [headline, description, imagePath, event_time, location, event_type, author_id, author_name, status]
    );
    res.status(201).json({ 
      message: 'News/Event created', 
      id: result.insertId,
      imagePath: imagePath
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Update news/event
app.put('/api/news-events/:id', newsEventsUpload.single('image'), async (req, res) => {
  const { headline, description, event_time, location, event_type, status } = req.body;
  
  try {
    if (req.file) {
      const imagePath = `/uploads/news-events/${req.file.filename}`;
      await query(
        'UPDATE news_events SET headline = ?, description = ?, image_path = ?, event_time = ?, location = ?, event_type = ?, status = ? WHERE id = ?',
        [headline, description, imagePath, event_time, location, event_type, status, req.params.id]
      );
    } else {
      await query(
        'UPDATE news_events SET headline = ?, description = ?, event_time = ?, location = ?, event_type = ?, status = ? WHERE id = ?',
        [headline, description, event_time, location, event_type, status, req.params.id]
      );
    }
    res.json({ message: 'News/Event updated' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Delete news/event
app.delete('/api/news-events/:id', async (req, res) => {
  try {
    // Get image path to delete file
    const rows = await query('SELECT image_path FROM news_events WHERE id = ?', [req.params.id]);
    if (rows.length > 0 && rows[0].image_path) {
      const filePath = path.join(__dirname, rows[0].image_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await query('DELETE FROM news_events WHERE id = ?', [req.params.id]);
    res.json({ message: 'News/Event deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ===== FACULTIES API =====
// Get all faculties
app.get('/api/faculties', async (req, res) => {
  try {
    const rows = await query(
      'SELECT id, name, description, image_path, dean_name, contact_email, phone, location, established_year, author_name, status, created_at, updated_at FROM faculties ORDER BY name'
    );
    res.json({ faculties: rows });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Get single faculty
app.get('/api/faculties/:id', async (req, res) => {
  try {
    const rows = await query(
      'SELECT id, name, description, image_path, dean_name, contact_email, phone, location, established_year, author_name, status, created_at, updated_at FROM faculties WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Faculty not found' });
    res.json({ faculty: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// File upload for faculties (reuse newsEventsUpload config)
const facultiesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const facultiesDir = path.join(__dirname, 'uploads', 'faculties');
    if (!fs.existsSync(facultiesDir)) {
      fs.mkdirSync(facultiesDir, { recursive: true });
    }
    cb(null, facultiesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `faculty_${Date.now()}${ext}`);
  }
});

const facultiesUpload = multer({
  storage: facultiesStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Create new faculty
app.post('/api/faculties', facultiesUpload.single('image'), async (req, res) => {
  const { name, description, dean_name, contact_email, phone, location, established_year, author_id, author_name, status = 'active' } = req.body;
  
  if (!name || !description || !author_id) {
    return res.status(400).json({ error: 'Name, description, and author_id required' });
  }

  const imagePath = req.file ? `/uploads/faculties/${req.file.filename}` : null;

  try {
    const result = await query(
      'INSERT INTO faculties (name, description, image_path, dean_name, contact_email, phone, location, established_year, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, imagePath, dean_name, contact_email, phone, location, established_year, author_id, author_name, status]
    );
    res.status(201).json({ 
      message: 'Faculty created', 
      id: result.insertId,
      imagePath: imagePath
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Update faculty
app.put('/api/faculties/:id', facultiesUpload.single('image'), async (req, res) => {
  const { name, description, dean_name, contact_email, phone, location, established_year, status } = req.body;
  
  try {
    if (req.file) {
      const imagePath = `/uploads/faculties/${req.file.filename}`;
      await query(
        'UPDATE faculties SET name = ?, description = ?, image_path = ?, dean_name = ?, contact_email = ?, phone = ?, location = ?, established_year = ?, status = ? WHERE id = ?',
        [name, description, imagePath, dean_name, contact_email, phone, location, established_year, status, req.params.id]
      );
    } else {
      await query(
        'UPDATE faculties SET name = ?, description = ?, dean_name = ?, contact_email = ?, phone = ?, location = ?, established_year = ?, status = ? WHERE id = ?',
        [name, description, dean_name, contact_email, phone, location, established_year, status, req.params.id]
      );
    }
    res.json({ message: 'Faculty updated' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Delete faculty
app.delete('/api/faculties/:id', async (req, res) => {
  try {
    // Get image path to delete file
    const rows = await query('SELECT image_path FROM faculties WHERE id = ?', [req.params.id]);
    if (rows.length > 0 && rows[0].image_path) {
      const filePath = path.join(__dirname, rows[0].image_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await query('DELETE FROM faculties WHERE id = ?', [req.params.id]);
    res.json({ message: 'Faculty deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
