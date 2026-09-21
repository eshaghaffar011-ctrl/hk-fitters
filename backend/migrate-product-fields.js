const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrateProductFields() {
  try {
    await client.connect();

    console.log('Connected to PostgreSQL');

    /*
      Add new product fields.

      IF NOT EXISTS makes this migration safe to run
      more than once.
    */

    await client.query(`
      ALTER TABLE products

      ADD COLUMN IF NOT EXISTS short_description TEXT,

      ADD COLUMN IF NOT EXISTS product_type TEXT,

      ADD COLUMN IF NOT EXISTS subcategory TEXT,

      ADD COLUMN IF NOT EXISTS collection TEXT,

      ADD COLUMN IF NOT EXISTS seo_title TEXT,

      ADD COLUMN IF NOT EXISTS seo_description TEXT,

      ADD COLUMN IF NOT EXISTS seo_tags TEXT,

      ADD COLUMN IF NOT EXISTS slug TEXT,

      ADD COLUMN IF NOT EXISTS image_alt TEXT,

      ADD COLUMN IF NOT EXISTS gallery_alt TEXT,

      ADD COLUMN IF NOT EXISTS custom_size_available BOOLEAN DEFAULT FALSE,

      ADD COLUMN IF NOT EXISTS custom_size_instructions TEXT,

      ADD COLUMN IF NOT EXISTS color_options TEXT,

      ADD COLUMN IF NOT EXISTS customization_available BOOLEAN DEFAULT FALSE,

      ADD COLUMN IF NOT EXISTS custom_logo BOOLEAN DEFAULT FALSE,

      ADD COLUMN IF NOT EXISTS custom_design BOOLEAN DEFAULT FALSE,

      ADD COLUMN IF NOT EXISTS private_label BOOLEAN DEFAULT FALSE,

      ADD COLUMN IF NOT EXISTS customization_details TEXT,

      ADD COLUMN IF NOT EXISTS material TEXT,

      ADD COLUMN IF NOT EXISTS fabric TEXT,

      ADD COLUMN IF NOT EXISTS features TEXT,

      ADD COLUMN IF NOT EXISTS specifications TEXT,

      ADD COLUMN IF NOT EXISTS care_instructions TEXT,

      ADD COLUMN IF NOT EXISTS manufacturing_details TEXT,

      ADD COLUMN IF NOT EXISTS moq TEXT,

      ADD COLUMN IF NOT EXISTS lead_time TEXT
    `);

    console.log(
      'Product SEO and customization fields added successfully.'
    );

    /*
      Show the new columns so we can verify
      the migration.
    */

    const result = await client.query(`
      SELECT
        column_name,
        data_type
      FROM information_schema.columns
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `);

    console.log('\nCurrent products table columns:\n');

    result.rows.forEach((column) => {
      console.log(
        `${column.column_name} → ${column.data_type}`
      );
    });

    console.log('\nMigration completed successfully.');

  } catch (error) {
    console.error(
      'Product field migration failed:',
      error
    );
  } finally {
    await client.end();
  }
}

migrateProductFields();