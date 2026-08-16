const express = require('express');
const db = require('./database');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

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
    const result = await db.query(`
      SELECT *
      FROM products
      ORDER BY id DESC
    `);

    const products = result.rows;

    const formatted = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      image: product.image || '',
      gallery: product.gallery
        ? JSON.parse(product.gallery)
        : [],
      galleryImages: product.gallery
        ? JSON.parse(product.gallery)
        : [],
      category: product.category || 'Men',
      size: product.sizes
        ? JSON.parse(product.sizes)
        : ['M'],
      sizes: product.sizes
        ? JSON.parse(product.sizes)
        : ['M'],
      color: product.color || 'Black',
      colors: product.colors
        ? JSON.parse(product.colors)
        : ['#111111'],
      stock: product.stock || 'In Stock',
      badge: product.badge || 'New',
      featured: Boolean(product.featured),
      rating: Number(product.rating) || 4.5,
      reviews: Number(product.reviews) || 0,
    }));

    res.json(formatted);

  } catch (error) {
    console.error('Get products error:', error);

    res.status(500).json({
      message: 'Failed to get products',
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

app.listen(PORT, '0.0.0.0',() => {
  console.log(`HK FITTERS backend running on port ${PORT}`);
});