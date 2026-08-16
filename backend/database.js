const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL error:', error);
});

console.log('HK FITTERS PostgreSQL database connected.');

module.exports = pool;