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

// =========================
// INQUIRY API
// =========================

app.get('/api/inquiries', (req, res) => {
  try {
    const inquiries = db
      .prepare(`
        SELECT *
        FROM inquiries
        ORDER BY created_at DESC
      `)
      .all();

    const formatted = inquiries.map((inquiry) => ({
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

app.post('/api/inquiries', (req, res) => {
  try {
    const inquiry = req.body;

    const id = inquiry.id || `INQ-${Date.now()}`;
    const createdAt =
      inquiry.createdAt || new Date().toISOString();

    const customer = inquiry.customer || {};

    const insert = db.prepare(`
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
        @id,
        @createdAt,
        @status,
        @customerName,
        @country,
        @city,
        @address,
        @postalCode,
        @email,
        @phone,
        @items,
        @subtotal,
        @shipping,
        @total
      )
    `);

    insert.run({
      id,
      createdAt,
      status: inquiry.status || 'New',
      customerName: customer.fullName || '',
      country: customer.country || '',
      city: customer.city || '',
      address: customer.address || '',
      postalCode: customer.postalCode || '',
      email: customer.email || '',
      phone: customer.phone || '',
      items: JSON.stringify(inquiry.items || []),
      subtotal: Number(inquiry.subtotal || 0),
      shipping: Number(inquiry.shipping || 0),
      total: Number(inquiry.total || 0),
    });

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

app.patch('/api/inquiries/:id/status', (req, res) => {
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

    const result = db
      .prepare(`
        UPDATE inquiries
        SET status = ?
        WHERE id = ?
      `)
      .run(status, id);

    if (result.changes === 0) {
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

app.delete('/api/inquiries/:id', (req, res) => {
  try {
    const { id } = req.params;

    const result = db
      .prepare(`
        DELETE FROM inquiries
        WHERE id = ?
      `)
      .run(id);

    if (result.changes === 0) {
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

app.get('/api/products', (req, res) => {
  try {
    const products = db
      .prepare(`
        SELECT *
        FROM products
        ORDER BY id DESC
      `)
      .all();

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


app.post('/api/products', (req, res) => {
  try {
    const product = req.body;

    if (!product.name || !product.description) {
      return res.status(400).json({
        message: 'Product name and description are required',
      });
    }

    const insert = db.prepare(`
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
        @name,
        @description,
        @image,
        @gallery,
        @category,
        @sizes,
        @colors,
        @color,
        @stock,
        @badge,
        @featured,
        @rating,
        @reviews
      )
    `);

    const result = insert.run({
      name: product.name,
      description: product.description || '',
      image: product.image || '',
      gallery: JSON.stringify(product.gallery || []),
      category: product.category || 'Men',
      sizes: JSON.stringify(product.sizes || product.size || []),
      colors: JSON.stringify(product.colors || []),
      color: product.color || '',
      stock: product.stock || 'In Stock',
      badge: product.badge || 'New',
      featured: product.featured ? 1:0,
      rating: Number(product.rating) || 4.5,
      reviews: Number(product.reviews) || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error('Create product error:', error);

    res.status(500).json({
      message: 'Failed to create product',
    });
  }
});


app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = req.body;

    console.log('PUT PRODUCT RECEIVED:',
      product.featured, product
    );

    const result = db.prepare(`
      UPDATE products
      SET
        name = @name,
        description = @description,
        image = @image,
        gallery = @gallery,
        category = @category,
        sizes = @sizes,
        colors = @colors,
        color = @color,
        stock = @stock,
        badge = @badge,
        rating = @rating,
        reviews = @reviews,
        featured = @featured
      WHERE id = @id
    `).run({
      id,
      name: product.name || '',
      description: product.description || '',
      image: product.image || '',
      gallery: JSON.stringify(product.gallery || []),
      category: product.category || 'Men',
      sizes: JSON.stringify(product.sizes || product.size || []),
      colors: JSON.stringify(product.colors || []),
      color: product.color || '',
      stock: product.stock || 'In Stock',
      badge: product.badge || 'New',
      featured: product.featured ? 1:0,
      rating: Number(product.rating) || 4.5,
      reviews: Number(product.reviews) || 0,
    });

    if (result.changes === 0) {
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


app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;

    const result = db
      .prepare(`
        DELETE FROM products
        WHERE id = ?
      `)
      .run(id);

    if (result.changes === 0) {
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

app.listen(PORT, '0.0.0.0',() => {
  console.log(`HK FITTERS backend running on port ${PORT}`);
});