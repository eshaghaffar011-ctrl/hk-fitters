const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Apex Runner Jacket',
    description: 'Performance outerwear engineered for elite training and export-ready retail presentation.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    ],
    price: 180,
    oldPrice: 220,
    category: 'Men',
    size: ['S', 'M', 'L', 'XL'],
    color: 'Black',
    colors: ['#111111', '#e10600', '#f4f4f4'],
    rating: 4.8,
    reviews: 126,
    badge: 'New',
    stock: 'In Stock'
  },
  {
    id: 2,
    name: 'Elite Compression Tee',
    description: 'Premium moisture-controlled performance tee built for modern sportswear buyers.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    ],
    price: 95,
    oldPrice: 120,
    category: 'Women',
    size: ['XS', 'S', 'M'],
    color: 'Red',
    colors: ['#e10600', '#111111', '#ffffff'],
    rating: 4.7,
    reviews: 98,
    badge: 'Best Seller',
    stock: 'In Stock'
  },
  {
    id: 3,
    name: 'Velocity Shorts',
    description: 'Lightweight sports shorts with polished finishing and strong export appeal.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    ],
    price: 78,
    oldPrice: 95,
    category: 'Accessories',
    size: ['S', 'M', 'L'],
    color: 'White',
    colors: ['#f8f8f8', '#111111', '#e10600'],
    rating: 4.6,
    reviews: 74,
    badge: 'Limited',
    stock: 'Low Stock'
  },
  {
    id: 4,
    name: 'Storm Pro Hoodie',
    description: 'Luxury training layer with a structured silhouette and premium finishing.',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    ],
    price: 140,
    oldPrice: 175,
    category: 'Men',
    size: ['M', 'L', 'XL'],
    color: 'Grey',
    colors: ['#6b7280', '#111111', '#e10600'],
    rating: 4.9,
    reviews: 154,
    badge: 'Premium',
    stock: 'In Stock'
  }
];

export const PRODUCT_STORAGE_KEY = 'hkfitters_products';

const parseArrayValue = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== 'string') return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
};

export const normalizeProduct = (product = {}, index = 0) => {
  const normalizedSizes = parseArrayValue(product.size ?? product.sizes ?? []);
  const normalizedColors = parseArrayValue(product.colors ?? product.colorList ?? (product.color ? [product.color] : []));
  const galleryImages = Array.isArray(product.gallery) ? product.gallery : Array.isArray(product.galleryImages) ? product.galleryImages : [];
  const productId = Number(product.id ?? index + 1);
  const category = ['Men', 'Women', 'Accessories'].includes(product.category) ? product.category : 'Men';
  const cleanedName = product.name?.trim() || `Product ${productId}`;

  return {
    id: productId,
    name: cleanedName,
    description: product.description || '',
    image: product.image || galleryImages[0] || '',
    gallery: galleryImages.length ? galleryImages : [product.image || ''],
    galleryImages: galleryImages.length ? galleryImages : [product.image || ''],
    category,
    price: Number(product.price) || 0,
    oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
    size: normalizedSizes.length ? normalizedSizes : ['M'],
    sizes: normalizedSizes.length ? normalizedSizes : ['M'],
    color: product.color || (normalizedColors[0] ? normalizedColors[0] : 'Black'),
    colors: normalizedColors.length ? normalizedColors : ['#111111'],
    rating: Number(product.rating) || 4.5,
    reviews: Number(product.reviews) || 0,
    badge: product.badge || 'New',
    stock: product.stock || 'In Stock'
  };
};

export const saveProducts = (nextProducts) => {
  const normalized = Array.isArray(nextProducts)
    ? nextProducts.map((product, index) => normalizeProduct(product, index))
    : DEFAULT_PRODUCTS.map((product, index) => normalizeProduct(product, index));

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
};

export const getProducts = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_PRODUCTS.map((product, index) => normalizeProduct(product, index));
  }

  const stored = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
  if (!stored) {
    return saveProducts(DEFAULT_PRODUCTS);
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return saveProducts(DEFAULT_PRODUCTS);
    }
    return parsed.map((product, index) => normalizeProduct(product, index));
  } catch (error) {
    return saveProducts(DEFAULT_PRODUCTS);
  }
};

export const products = getProducts();

export default products;



const PRODUCTS_API_URL = 'http://localhost:5000/api/products';

export const fetchProductsFromAPI = async () => {
  const response = await fetch(PRODUCTS_API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch products from backend');
  }

  const data = await response.json();

  return Array.isArray(data)
    ? data.map((product, index) =>
        normalizeProduct(product, index)
      )
    : [];
};

export const createProductAPI = async (product) => {
  const response = await fetch(PRODUCTS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  return await response.json();
};

export const updateProductAPI = async (productId, product) => {
  const response = await fetch(
    `${PRODUCTS_API_URL}/${productId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return await response.json();
};

export const deleteProductAPI = async (productId) => {
  const response = await fetch(
    `${PRODUCTS_API_URL}/${productId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }

  return await response.json();
};