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
// ===== AFFILIATES & PARTNERS API =====
// Storage for affiliates images
const affiliatesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads', 'affiliates');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `affiliate_${Date.now()}${ext}`);
  }
});

const affiliatesUpload = multer({
  storage: affiliatesStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// List all affiliates/partners
app.get('/api/affiliates', async (req, res) => {
  try {
    const rows = await query('SELECT id, name, type, description, image_path, website, email, status, author_name, created_at FROM affiliates_partners ORDER BY id DESC');
    res.json({ items: rows });
  } catch (err) {
    console.error('Error listing affiliates:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Public: active affiliates/partners
app.get('/api/affiliates/active', async (req, res) => {
  try {
    const rows = await query("SELECT id, name, type, description, image_path, website FROM affiliates_partners WHERE status = 'active' ORDER BY id DESC");
    res.json({ items: rows });
  } catch (err) {
    console.error('Error fetching active affiliates:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Get single affiliate
app.get('/api/affiliates/:id', async (req, res) => {
  try {
    const rows = await query('SELECT id, name, type, description, image_path, website, email, status, author_id, author_name FROM affiliates_partners WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ item: rows[0] });
  } catch (err) {
    console.error('Error fetching affiliate:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Create affiliate/partner
app.post('/api/affiliates', affiliatesUpload.single('image'), async (req, res) => {
  const { name, type = 'affiliate', description = '', website = '', email = '', author_id = 1, author_name = 'System', status = 'inactive' } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const imagePath = req.file ? `/uploads/affiliates/${req.file.filename}` : null;
  try {
    const result = await query('INSERT INTO affiliates_partners (name, type, description, image_path, website, email, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, type, description, imagePath, website, email, author_id, author_name, status]);
    res.status(201).json({ message: 'Affiliate created', id: result.insertId, imagePath });
  } catch (err) {
    console.error('Error creating affiliate:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Update affiliate/partner
app.put('/api/affiliates/:id', affiliatesUpload.single('image'), async (req, res) => {
  const { name, type = 'affiliate', description = '', website = '', email = '', status = 'inactive' } = req.body;
  try {
    if (req.file) {
      const imagePath = `/uploads/affiliates/${req.file.filename}`;
      const rows = await query('SELECT image_path FROM affiliates_partners WHERE id = ?', [req.params.id]);
      if (rows.length > 0 && rows[0].image_path) {
        const oldPath = path.join(__dirname, rows[0].image_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      await query('UPDATE affiliates_partners SET name = ?, type = ?, description = ?, image_path = ?, website = ?, email = ?, status = ? WHERE id = ?', [name, type, description, imagePath, website, email, status, req.params.id]);
    } else {
      await query('UPDATE affiliates_partners SET name = ?, type = ?, description = ?, website = ?, email = ?, status = ? WHERE id = ?', [name, type, description, website, email, status, req.params.id]);
    }
    res.json({ message: 'Affiliate updated' });
  } catch (err) {
    console.error('Error updating affiliate:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Delete affiliate
app.delete('/api/affiliates/:id', async (req, res) => {
  try {
    const rows = await query('SELECT image_path FROM affiliates_partners WHERE id = ?', [req.params.id]);
    if (rows.length > 0 && rows[0].image_path) {
      const filePath = path.join(__dirname, rows[0].image_path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await query('DELETE FROM affiliates_partners WHERE id = ?', [req.params.id]);
    res.json({ message: 'Affiliate deleted' });
  } catch (err) {
    console.error('Error deleting affiliate:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ===== POLICIES API =====
// Public: list of active policies
app.get('/api/policies/active', async (req, res) => {
  try {
    const rows = await query("SELECT id, title, slug, content FROM policies WHERE status = 'active' ORDER BY id DESC");
    res.json({ items: rows });
  } catch (err) {
    console.error('Error fetching active policies:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Admin: list all policies
app.get('/api/policies', async (req, res) => {
  try {
    const rows = await query('SELECT id, title, slug, status, author_name, created_at FROM policies ORDER BY id DESC');
    res.json({ items: rows });
  } catch (err) {
    console.error('Error listing policies:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Get single policy by id
app.get('/api/policies/:id', async (req, res) => {
  try {
    const rows = await query('SELECT id, title, slug, content, status, author_id, author_name FROM policies WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ item: rows[0] });
  } catch (err) {
    console.error('Error fetching policy:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Create policy
app.post('/api/policies', async (req, res) => {
  const { title, slug, content = '', status = 'inactive', author_id = 1, author_name = 'System' } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  try {
    const result = await query('INSERT INTO policies (title, slug, content, status, author_id, author_name) VALUES (?, ?, ?, ?, ?, ?)', [title, slug, content, status, author_id, author_name]);
    res.status(201).json({ message: 'Policy created', id: result.insertId });
  } catch (err) {
    console.error('Error creating policy:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Update policy
app.put('/api/policies/:id', async (req, res) => {
  const { title, slug, content = '', status = 'inactive' } = req.body;
  try {
    await query('UPDATE policies SET title = ?, slug = ?, content = ?, status = ? WHERE id = ?', [title, slug, content, status, req.params.id]);
    res.json({ message: 'Policy updated' });
  } catch (err) {
    console.error('Error updating policy:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Delete policy
app.delete('/api/policies/:id', async (req, res) => {
  try {
    await query('DELETE FROM policies WHERE id = ?', [req.params.id]);
    res.json({ message: 'Policy deleted' });
  } catch (err) {
    console.error('Error deleting policy:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ===== CAMPUSES API =====
// Storage for campus images
const campusesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const campusesDir = path.join(__dirname, 'uploads', 'campuses');
    if (!fs.existsSync(campusesDir)) {
      fs.mkdirSync(campusesDir, { recursive: true });
    }
    cb(null, campusesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `campus_${Date.now()}${ext}`);
  }
});

const campusesUpload = multer({
  storage: campusesStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// Get all campuses
app.get('/api/campuses', async (req, res) => {
  try {
    const rows = await query('SELECT id, name, description, image_path, location, status, author_name, created_at FROM campuses ORDER BY id DESC');
    res.json({ items: rows });
  } catch (err) {
    console.error('Error listing campuses:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Get active campuses for About page
app.get('/api/campuses/active', async (req, res) => {
  try {
    const rows = await query("SELECT id, name, description, image_path, location FROM campuses WHERE status = 'active' ORDER BY id DESC");
    res.json({ items: rows });
  } catch (err) {
    console.error('Error fetching active campuses:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Create new campus (SUPERADMIN only in production)
app.post('/api/campuses', campusesUpload.single('image'), async (req, res) => {
  const { name, description, location, author_id = 1, author_name = 'System', status = 'inactive' } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const imagePath = req.file ? `/uploads/campuses/${req.file.filename}` : null;
  try {
    const result = await query('INSERT INTO campuses (name, description, image_path, location, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, description, imagePath, location, author_id, author_name, status]);
    res.status(201).json({ message: 'Campus created', id: result.insertId, imagePath });
  } catch (err) {
    console.error('Error creating campus:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Delete campus
app.delete('/api/campuses/:id', async (req, res) => {
  try {
    const rows = await query('SELECT image_path FROM campuses WHERE id = ?', [req.params.id]);
    if (rows.length > 0 && rows[0].image_path) {
      const filePath = path.join(__dirname, rows[0].image_path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await query('DELETE FROM campuses WHERE id = ?', [req.params.id]);
    res.json({ message: 'Campus deleted' });
  } catch (err) {
    console.error('Error deleting campus:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});
 
// ===== LEADERSHIP API =====
// Storage for leadership images
const leadershipStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads', 'leadership');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `leadership_${Date.now()}${ext}`);
  }
});

const leadershipUpload = multer({
  storage: leadershipStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// List all leadership entries
app.get('/api/leadership', async (req, res) => {
  try {
    const rows = await query('SELECT id, name, title, type, description, image_path, location, status, author_name, created_at FROM leadership ORDER BY id DESC');
    res.json({ items: rows });
  } catch (err) {
    console.error('Error listing leadership:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Get active leadership entries (for public page)
app.get('/api/leadership/active', async (req, res) => {
  try {
    const rows = await query("SELECT id, name, title, type, description, image_path, location FROM leadership WHERE status = 'active' ORDER BY id DESC");
    res.json({ items: rows });
  } catch (err) {
    console.error('Error fetching active leadership:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Create leadership entry
app.post('/api/leadership', leadershipUpload.single('image'), async (req, res) => {
  const { name, title = '', type = 'leader', description = '', location = '', author_id = 1, author_name = 'System', status = 'inactive' } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const imagePath = req.file ? `/uploads/leadership/${req.file.filename}` : null;
  try {
    const result = await query('INSERT INTO leadership (name, title, type, description, image_path, location, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, title, type, description, imagePath, location, author_id, author_name, status]);
    res.status(201).json({ message: 'Created', id: result.insertId, imagePath });
  } catch (err) {
    console.error('Error creating leadership entry:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Get single leadership entry
app.get('/api/leadership/:id', async (req, res) => {
  try {
    const rows = await query('SELECT id, name, title, type, description, image_path, location, status FROM leadership WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ item: rows[0] });
  } catch (err) {
    console.error('Error fetching leadership:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Update leadership entry
app.put('/api/leadership/:id', leadershipUpload.single('image'), async (req, res) => {
  const { name, title = '', type = 'leader', description = '', location = '', status = 'inactive' } = req.body;
  try {
    if (req.file) {
      const imagePath = `/uploads/leadership/${req.file.filename}`;
      const rows = await query('SELECT image_path FROM leadership WHERE id = ?', [req.params.id]);
      if (rows.length > 0 && rows[0].image_path) {
        const oldPath = path.join(__dirname, rows[0].image_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      await query('UPDATE leadership SET name = ?, title = ?, type = ?, description = ?, image_path = ?, location = ?, status = ? WHERE id = ?', [name, title, type, description, imagePath, location, status, req.params.id]);
    } else {
      await query('UPDATE leadership SET name = ?, title = ?, type = ?, description = ?, location = ?, status = ? WHERE id = ?', [name, title, type, description, location, status, req.params.id]);
    }
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error('Error updating leadership:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Delete leadership entry
app.delete('/api/leadership/:id', async (req, res) => {
  try {
    const rows = await query('SELECT image_path FROM leadership WHERE id = ?', [req.params.id]);
    if (rows.length > 0 && rows[0].image_path) {
      const filePath = path.join(__dirname, rows[0].image_path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await query('DELETE FROM leadership WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting leadership:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Get single campus
app.get('/api/campuses/:id', async (req, res) => {
  try {
    const rows = await query('SELECT id, name, description, image_path, location, status, author_name, created_at FROM campuses WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Campus not found' });
    res.json({ campus: rows[0] });
  } catch (err) {
    console.error('Error fetching campus:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Update campus
app.put('/api/campuses/:id', campusesUpload.single('image'), async (req, res) => {
  const { name, description, location, status } = req.body;
  try {
    if (req.file) {
      const imagePath = `/uploads/campuses/${req.file.filename}`;
      // remove old image if exists
      const rows = await query('SELECT image_path FROM campuses WHERE id = ?', [req.params.id]);
      if (rows.length > 0 && rows[0].image_path) {
        const oldPath = path.join(__dirname, rows[0].image_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      await query('UPDATE campuses SET name = ?, description = ?, image_path = ?, location = ?, status = ? WHERE id = ?', [name, description, imagePath, location, status, req.params.id]);
    } else {
      await query('UPDATE campuses SET name = ?, description = ?, location = ?, status = ? WHERE id = ?', [name, description, location, status, req.params.id]);
    }
    res.json({ message: 'Campus updated' });
  } catch (err) {
    console.error('Error updating campus:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ===== ABOUT CONTENT API =====
// Get mission & vision
app.get('/api/about', async (req, res) => {
  try {
    const rows = await query('SELECT mission, vision, updated_at FROM about WHERE id = 1');
    if (rows.length === 0) {
      return res.json({ mission: '', vision: '' });
    }
    res.json({ mission: rows[0].mission, vision: rows[0].vision, updated_at: rows[0].updated_at });
  } catch (err) {
    console.error('Error fetching about content:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Update mission & vision (requires authenticated staff in production)
app.put('/api/about', async (req, res) => {
  const { mission, vision } = req.body;
  if (mission == null || vision == null) return res.status(400).json({ error: 'mission and vision required' });
  try {
    // Upsert row with id=1
    await query('INSERT INTO about (id, mission, vision) VALUES (1, ?, ?) ON DUPLICATE KEY UPDATE mission = VALUES(mission), vision = VALUES(vision)', [mission, vision]);
    res.json({ message: 'About content updated' });
  } catch (err) {
    console.error('Error updating about content:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

// ===== MISSION & VISION API (CRUD + toggle active) =====
// List all mission/vision entries
app.get('/api/mission-vision', async (req, res) => {
  try {
    const rows = await query('SELECT id, type, content, status, author_name, created_at, updated_at FROM mission_vision ORDER BY created_at DESC');
    res.json({ items: rows });
  } catch (err) {
    console.error('Error listing mission_vision:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Get active mission and vision separately
app.get('/api/mission-vision/active', async (req, res) => {
  try {
    const rows = await query("SELECT id, type, content FROM mission_vision WHERE status = 'active'");
    const result = { mission: null, vision: null };
    rows.forEach(r => { result[r.type] = { id: r.id, content: r.content }; });
    res.json(result);
  } catch (err) {
    console.error('Error fetching active mission_vision:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Create new entry
app.post('/api/mission-vision', async (req, res) => {
  const { type, content, author_name = null, status = 'inactive' } = req.body;
  if (!type || !content) return res.status(400).json({ error: 'type and content required' });
  if (!['mission','vision'].includes(type)) return res.status(400).json({ error: 'invalid type' });
  try {
    const result = await query('INSERT INTO mission_vision (type, content, status, author_name) VALUES (?, ?, ?, ?)', [type, content, status, author_name]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Error creating mission_vision:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Update entry
app.put('/api/mission-vision/:id', async (req, res) => {
  const { content, author_name } = req.body;
  try {
    await query('UPDATE mission_vision SET content = ?, author_name = ? WHERE id = ?', [content, author_name, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error('Error updating mission_vision:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Delete entry
app.delete('/api/mission-vision/:id', async (req, res) => {
  try {
    await query('DELETE FROM mission_vision WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting mission_vision:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Toggle active/inactive (when activating, ensure only one active per type)
app.put('/api/mission-vision/:id/toggle', async (req, res) => {
  const { makeActive } = req.body;
  try {
    const rows = await query('SELECT id, type FROM mission_vision WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const type = rows[0].type;
    if (makeActive) {
      // set others inactive
      await query("UPDATE mission_vision SET status = 'inactive' WHERE type = ?", [type]);
      await query("UPDATE mission_vision SET status = 'active' WHERE id = ?", [req.params.id]);
    } else {
      await query("UPDATE mission_vision SET status = 'inactive' WHERE id = ?", [req.params.id]);
    }
    res.json({ message: 'Toggled' });
  } catch (err) {
    console.error('Error toggling mission_vision:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// ===== HISTORY API (CRUD + toggle active) =====
// List all history
app.get('/api/history', async (req, res) => {
  try {
    const rows = await query('SELECT id, year, title, description, status, author_name, created_at, updated_at FROM history ORDER BY year ASC, created_at ASC');
    res.json({ items: rows });
  } catch (err) {
    console.error('Error listing history:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Get active history entries (for About page timeline)
app.get('/api/history/active', async (req, res) => {
  try {
    const rows = await query("SELECT id, year, title, description FROM history WHERE status = 'active' ORDER BY year ASC, created_at ASC");
    res.json({ items: rows });
  } catch (err) {
    console.error('Error fetching active history:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Create history entry
app.post('/api/history', async (req, res) => {
  const { year, title, description, status = 'inactive', author_name = null } = req.body;
  if (!year || !title || !description) return res.status(400).json({ error: 'year, title, description required' });
  try {
    const result = await query('INSERT INTO history (year, title, description, status, author_name) VALUES (?, ?, ?, ?, ?)', [year, title, description, status, author_name]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Error creating history:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Update history
app.put('/api/history/:id', async (req, res) => {
  const { year, title, description } = req.body;
  try {
    await query('UPDATE history SET year = ?, title = ?, description = ? WHERE id = ?', [year, title, description, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error('Error updating history:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Delete history
app.delete('/api/history/:id', async (req, res) => {
  try {
    await query('DELETE FROM history WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting history:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

// Toggle active/inactive (when activating, can have multiple active entries)
app.put('/api/history/:id/toggle', async (req, res) => {
  const { makeActive } = req.body;
  try {
    const status = makeActive ? 'active' : 'inactive';
    await query('UPDATE history SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Toggled' });
  } catch (err) {
    console.error('Error toggling history:', err);
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});
