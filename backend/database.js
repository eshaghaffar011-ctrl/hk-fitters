const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'hkfitters.db');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    customer_name TEXT,
    country TEXT,
    city TEXT,
    address TEXT,
    postal_code TEXT,
    email TEXT,
    phone TEXT,
    items TEXT,
    subtotal REAL DEFAULT 0,
    shipping REAL DEFAULT 0,
    total REAL DEFAULT 0
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    gallery TEXT,
    category TEXT,
    sizes TEXT,
    colors TEXT,
    color TEXT,
    stock TEXT,
    badge TEXT,
    rating REAL DEFAULT 4.5,
    reviews INTEGER DEFAULT 0
  )
`);

console.log('HK FITTERS database connected.');



module.exports = db;