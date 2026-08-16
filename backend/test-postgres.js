const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function checkData() {
  try {
    await client.connect();

    const products = await client.query(
      'SELECT COUNT(*) FROM products'
    );

    const subscribers = await client.query(
      'SELECT COUNT(*) FROM subscribers'
    );

    const inquiries = await client.query(
      'SELECT COUNT(*) FROM inquiries'
    );

    console.log('✅ PostgreSQL data check');
    console.log('Products:', products.rows[0].count);
    console.log('Subscribers:', subscribers.rows[0].count);
    console.log('Inquiries:', inquiries.rows[0].count);

  } catch (error) {
    console.error('❌ Check failed:', error.message);
  } finally {
    await client.end();
  }
}

checkData();