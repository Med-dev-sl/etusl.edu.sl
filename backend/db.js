require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'etusl_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ Successfully connected to MySQL!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
    console.error('Host:', process.env.DB_HOST);
    console.error('Database:', process.env.DB_NAME);
  });

async function query(sql, params) {
  try {
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (err) {
    console.error('Database query error:', err.message);
    throw err;
  }
}

module.exports = { pool, query };
