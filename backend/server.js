const express = require('express');
const db = require('./database');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;


/*
  PRODUCT DATABASE MIGRATION
  --------------------------
  Adds the new SEO, image, sizing,
  color, customization and
  manufacturing fields.

  IF NOT EXISTS makes this safe
  for existing products.
*/
const ensureProductColumns = async () => {
  try {
    await db.query(`
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
      'Product SEO/customization database fields are ready.'
    );
  } catch (error) {
    console.error(
      'Product database migration failed:',
      error
    );

    throw error;
  }
};


app.use(cors());
app.use(express.json({limit:'20mb'}));

app.get('/', (req, res) => {
  res.json({
    message: 'HK FITTERS backend is running!',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is healthy',
  });
});

/// =========================
// INQUIRY API
// =========================

app.get('/api/inquiries', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM inquiries
      ORDER BY created_at DESC
    `);

    const formatted = result.rows.map((inquiry) => ({
      id: inquiry.id,
      createdAt: inquiry.created_at,
      status: inquiry.status,
      customer: {
        fullName: inquiry.customer_name,
        country: inquiry.country,
        city: inquiry.city,
        address: inquiry.address,
        postalCode: inquiry.postal_code,
        email: inquiry.email,
        phone: inquiry.phone,
      },
      items: inquiry.items
        ? JSON.parse(inquiry.items)
        : [],
      subtotal: inquiry.subtotal,
      shipping: inquiry.shipping,
      total: inquiry.total,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Get inquiries error:', error);

    res.status(500).json({
      message: 'Failed to get inquiries',
    });
  }
});


app.post('/api/inquiries', async (req, res) => {
  try {
    const inquiry = req.body;

    const id = inquiry.id || `INQ-${Date.now()}`;
    const createdAt =
      inquiry.createdAt || new Date().toISOString();

    const customer = inquiry.customer || {};

    await db.query(
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
      `,
      [
        id,
        createdAt,
        inquiry.status || 'New',
        customer.fullName || '',
        customer.country || '',
        customer.city || '',
        customer.address || '',
        customer.postalCode || '',
        customer.email || '',
        customer.phone || '',
        JSON.stringify(inquiry.items || []),
        Number(inquiry.subtotal || 0),
        Number(inquiry.shipping || 0),
        Number(inquiry.total || 0),
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Inquiry saved successfully',
      id,
    });
  } catch (error) {
    console.error('Create inquiry error:', error);

    res.status(500).json({
      message: 'Failed to save inquiry',
    });
  }
});


// =========================
// UPDATE INQUIRY STATUS
// =========================

app.patch('/api/inquiries/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'New',
      'Contacted',
      'Completed',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
      });
    }

    const result = await db.query(
      `
      UPDATE inquiries
      SET status = $1
      WHERE id = $2
      `,
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Inquiry not found',
      });
    }

    res.json({
      success: true,
      message: 'Inquiry status updated',
    });
  } catch (error) {
    console.error(
      'Update inquiry status error:',
      error
    );

    res.status(500).json({
      message: 'Failed to update inquiry status',
    });
  }
});


// =========================
// DELETE INQUIRY
// =========================

app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM inquiries
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Inquiry not found',
      });
    }

    res.json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    console.error(
      'Delete inquiry error:',
      error
    );

    res.status(500).json({
      message: 'Failed to delete inquiry',
    });
  }
});



// =========================
// PRODUCT API
// =========================
app.get('/api/products', async (req, res) => {
  try {
    const includeGallery =
      req.query.includeGallery !== 'false';

    const featuredOnly =
      req.query.featured === 'true';

    const limit =
      Number.parseInt(req.query.limit, 10);

    const conditions = [];
    const values = [];

    if (featuredOnly) {
      conditions.push('featured = 1');
    }

    const whereClause =
      conditions.length
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    const limitClause =
      Number.isInteger(limit) && limit > 0
        ? `LIMIT ${limit}`
        : '';

    const fields = `
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
    `;

    const result = await db.query(
      `
      SELECT ${fields}
      FROM products
      ${whereClause}
      ORDER BY id DESC
      ${limitClause}
      `,
      values
    );

    const safeParseArray = (value, fallback = []) => {
      if (Array.isArray(value)) {
        return value;
      }

      if (value === null || value === undefined || value === '') {
        return fallback;
      }

      if (typeof value === 'object') {
        return value;
      }

      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);

          return parsed ?? fallback;
        } catch (error) {
          console.error(
            'JSON parse warning:',
            error.message
          );

          return fallback;
        }
      }

      return fallback;
    };

    const formatted = result.rows.map((product) => {
      const gallery =
        safeParseArray(product.gallery, []);

      const sizes =
        safeParseArray(product.sizes, ['M']);

      const colors =
        safeParseArray(product.colors, ['#111111']);

      return {
        id: product.id,

        name:
          product.name || '',

        description:
          product.description || '',

        image:
          product.image || '',

        gallery:
          includeGallery
            ? gallery
            : [],

        galleryImages:
          includeGallery
            ? gallery
            : [],

        category:
          product.category || 'Men',

        size:
          sizes,

        sizes:
          sizes,

        color:
          product.color || 'Black',

        colors:
          colors,

        stock:
          product.stock || 'In Stock',

        badge:
          product.badge || 'New',

        featured:
          Boolean(product.featured),

        rating:
          Number(product.rating) || 4.5,

        reviews:
          Number(product.reviews) || 0,
      };
    });

    res.set(
      'Cache-Control',
      'public, max-age=60, s-maxage=300'
    );

    res.json(formatted);

  } catch (error) {
    console.error(
      'GET /api/products ERROR:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error:
        process.env.NODE_ENV === 'production'
          ? undefined
          : error.message,
    });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;

    if (!product.name || !product.description) {
      return res.status(400).json({
        message: 'Product name and description are required',
      });
    }

    const result = await db.query(
      `
      INSERT INTO products (
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
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      )
      RETURNING id
      `,
      [
        product.name,
        product.description || '',
        product.image || '',
        JSON.stringify(product.gallery || []),
        product.category || 'Men',
        JSON.stringify(product.sizes || product.size || []),
        JSON.stringify(product.colors || []),
        product.color || '',
        product.stock || 'In Stock',
        product.badge || 'New',
        product.featured ? 1 : 0,
        Number(product.rating) || 4.5,
        Number(product.reviews) || 0,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      id: result.rows[0].id,
    });

  } catch (error) {
    console.error('Create product error:', error);

    res.status(500).json({
      message: 'Failed to create product',
    });
  }
});


app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = req.body;

    console.log(
      'PUT PRODUCT RECEIVED:',
      product.featured,
      product
    );

    const result = await db.query(
      `
      UPDATE products
      SET
        name = $1,
        description = $2,
        image = $3,
        gallery = $4,
        category = $5,
        sizes = $6,
        colors = $7,
        color = $8,
        stock = $9,
        badge = $10,
        rating = $11,
        reviews = $12,
        featured = $13
      WHERE id = $14
      `,
      [
        product.name || '',
        product.description || '',
        product.image || '',
        JSON.stringify(product.gallery || []),
        product.category || 'Men',
        JSON.stringify(product.sizes || product.size || []),
        JSON.stringify(product.colors || []),
        product.color || '',
        product.stock || 'In Stock',
        product.badge || 'New',
        Number(product.rating) || 4.5,
        Number(product.reviews) || 0,
        product.featured ? 1 : 0,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
    });

  } catch (error) {
    console.error('Update product error:', error);

    res.status(500).json({
      message: 'Failed to update product',
    });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM products
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });

  } catch (error) {
    console.error('Delete product error:', error);

    res.status(500).json({
      message: 'Failed to delete product',
    });
  }
});

// =========================
// SUBSCRIBERS API
// =========================

app.get('/api/subscribers', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM subscribers
      ORDER BY created_at DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('Get subscribers error:', error);

    res.status(500).json({
      message: 'Failed to get subscribers',
    });
  }
});

app.post('/api/subscribers', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: 'Email is required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await db.query(
      `
      SELECT id
      FROM subscribers
      WHERE email = $1
      `,
      [cleanEmail]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        message: 'Email is already subscribed',
      });
    }

    const result = await db.query(
      `
      INSERT INTO subscribers (
        email,
        created_at
      )
      VALUES ($1, $2)
      RETURNING id
      `,
      [
        cleanEmail,
        new Date().toISOString(),
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Subscribed successfully',
      id: result.rows[0].id,
    });

  } catch (error) {
    console.error('Create subscriber error:', error);

    res.status(500).json({
      message: 'Failed to save subscriber',
    });
  }
});
// =========================
// DELETE SUBSCRIBER
// =========================

app.delete('/api/subscribers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM subscribers
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Subscriber not found',
      });
    }

    res.json({
      success: true,
      message: 'Subscriber deleted successfully',
    });

  } catch (error) {
    console.error('Delete subscriber error:', error);

    res.status(500).json({
      message: 'Failed to delete subscriber',
    });
  }
});

const startServer = async () => {
  try {
    await ensureProductColumns();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(
        `HK FITTERS backend running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      'Backend startup failed:',
      error
    );

    process.exit(1);
  }
};

startServer();