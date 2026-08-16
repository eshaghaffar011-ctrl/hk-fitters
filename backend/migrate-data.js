const Database = require('better-sqlite3');
const { Client } = require('pg');
const path = require('path');
require('dotenv').config();

const sqlitePath = path.join(__dirname, 'hkfitters.db');
const sqlite = new Database(sqlitePath);

const postgres = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrate() {
  try {
    await postgres.connect();

    console.log('✅ Connected to PostgreSQL');

    // =========================
    // PRODUCTS
    // =========================

    const products = sqlite
      .prepare('SELECT * FROM products')
      .all();

    for (const product of products) {
      await postgres.query(
        `
        INSERT INTO products (
          id,
          name,
          description,
          image,
          gallery,
          category,
          sizes,
          colors,
          color,
          stock,
          badge,
          featured,
          rating,
          reviews
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
        )
        ON CONFLICT (id) DO NOTHING
        `,
        [
          product.id,
          product.name,
          product.description || '',
          product.image || '',
          product.gallery || '[]',
          product.category || 'Men',
          product.sizes || '[]',
          product.colors || '[]',
          product.color || '',
          product.stock || 'In Stock',
          product.badge || 'New',
          product.featured || 0,
          product.rating || 4.5,
          product.reviews || 0,
        ]
      );
    }

    console.log(`✅ Products migrated: ${products.length}`);

    // =========================
    // SUBSCRIBERS
    // =========================

    const subscribers = sqlite
      .prepare('SELECT * FROM subscribers')
      .all();

    for (const subscriber of subscribers) {
      await postgres.query(
        `
        INSERT INTO subscribers (
          id,
          email,
          created_at
        )
        VALUES ($1,$2,$3)
        ON CONFLICT (email) DO NOTHING
        `,
        [
          subscriber.id,
          subscriber.email,
          subscriber.created_at,
        ]
      );
    }

    console.log(`✅ Subscribers migrated: ${subscribers.length}`);

    // =========================
    // INQUIRIES
    // =========================

    const inquiries = sqlite
      .prepare('SELECT * FROM inquiries')
      .all();

    for (const inquiry of inquiries) {
      await postgres.query(
        `
        INSERT INTO inquiries (
          id,
          created_at,
          status,
          customer_name,
          country,
          city,
          address,
          postal_code,
          email,
          phone,
          items,
          subtotal,
          shipping,
          total
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
        )
        ON CONFLICT (id) DO NOTHING
        `,
        [
          inquiry.id,
          inquiry.created_at,
          inquiry.status || 'New',
          inquiry.customer_name || '',
          inquiry.country || '',
          inquiry.city || '',
          inquiry.address || '',
          inquiry.postal_code || '',
          inquiry.email || '',
          inquiry.phone || '',
          inquiry.items || '[]',
          inquiry.subtotal || 0,
          inquiry.shipping || 0,
          inquiry.total || 0,
        ]
      );
    }

    console.log(`✅ Inquiries migrated: ${inquiries.length}`);

    // =========================
    // RESET PRODUCT ID SEQUENCE
    // =========================

    await postgres.query(`
      SELECT setval(
        pg_get_serial_sequence('products', 'id'),
        COALESCE((SELECT MAX(id) FROM products), 1),
        true
      );
    `);

    await postgres.query(`
      SELECT setval(
        pg_get_serial_sequence('subscribers', 'id'),
        COALESCE((SELECT MAX(id) FROM subscribers), 1),
        true
      );
    `);

    console.log('✅ ID sequences updated');
    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);

  } finally {
    sqlite.close();
    await postgres.end();
  }
}

migrate();