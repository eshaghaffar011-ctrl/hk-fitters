const PRODUCTS_API_URL = 'https://hk-fitters-backend.onrender.com/api/products';

/*
  Convert values like:
  "S,M,L"  →  ["S", "M", "L"]
  ["S","M"] →  ["S", "M"]
*/
const parseArrayValue = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};


/*
  Make sure every product has the same structure
  throughout the website.
*/
export const normalizeProduct = (product = {}, index = 0) => {
  const sizes = parseArrayValue(
    product.sizes ?? product.size ?? []
  );

  const colors = parseArrayValue(
    product.colors ?? []
  );

  const gallery = parseArrayValue(
    product.gallery ?? product.galleryImages ?? []
  );

  const productId = Number(product.id ?? index + 1);

  const category = [
    'Men',
    'Women',
    'Kids',
    'Accessories',
  ].includes(product.category)
    ? product.category
    : 'Men';

  const image =
    product.image ||
    gallery[0] ||
    '';

  return {
    id: productId,

    name:
      typeof product.name === 'string' &&
      product.name.trim()
        ? product.name.trim()
        : `Product ${productId}`,

    description: product.description || '',
    
    image,

    gallery,

    galleryImages: gallery,

    category,

    size:
      sizes.length > 0
        ? sizes
        : ['M'],

    sizes:
      sizes.length > 0
        ? sizes
        : ['M'],

    color:
      product.color ||
      colors[0] ||
      'Black',

    colors:
      colors.length > 0
        ? colors
        : ['#111111'],

    stock:
      product.stock ||
      'In Stock',

    badge:
      product.badge ||
      'New',

    rating:
      Number(product.rating) || 4.5,

    reviews:
      Number(product.reviews) || 0,
      
      
    featured: 
     Number(product.featured) ===1,
  };
};


/*
  GET ALL PRODUCTS
*/
export const fetchProductsFromAPI = async () => {
  const response = await fetch(
    PRODUCTS_API_URL
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status}`
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((product, index) =>
    normalizeProduct(product, index)
  );
};


/*
  CREATE PRODUCT
*/
export const createProductAPI = async (product) => { 
  console.log('PRODUCT DATA BEFORE API:', product);
  console.log('FEATURED SENT TO API:', product.featured);
  const response = await fetch(
    PRODUCTS_API_URL,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({
        name: product.name || '',
        description: product.description || '',
       
        image: product.image || '',

        gallery:
          Array.isArray(product.gallery)
            ? product.gallery
            : [],

        category:
          product.category || 'Men',

        sizes:
          Array.isArray(product.sizes)
            ? product.sizes
            : Array.isArray(product.size)
              ? product.size
              : [],

        colors:
          Array.isArray(product.colors)
            ? product.colors
            : [],

        color:
          product.color || '',

        stock:
          product.stock || 'In Stock',

        badge:
          product.badge || 'New',

        featured:
          product.featured ? 1:0 ,

        rating:
          Number(product.rating) || 4.5,

        reviews:
          Number(product.reviews) || 0,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      'Create product backend error:',
      errorText
    );

    throw new Error(
      `Failed to create product: ${response.status}`
    );
  }

  return await response.json();
};


/*
  UPDATE PRODUCT
*/
export const updateProductAPI = async (
  productId,
  product
) => {
  console.log('FEATURE SENT TO API:', product.featured);
  const response = await fetch(
    `${PRODUCTS_API_URL}/${productId}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        name: product.name || '',
        description: product.description || '',
        
        image: product.image || '',

        gallery:
          Array.isArray(product.gallery)
            ? product.gallery
            : [],

        category:
          product.category || 'Men',

        sizes:
          Array.isArray(product.sizes)
            ? product.sizes
            : Array.isArray(product.size)
              ? product.size
              : [],

        colors:
          Array.isArray(product.colors)
            ? product.colors
            : [],

        color:
          product.color || '',

        stock:
          product.stock || 'In Stock',

        badge:
          product.badge || 'New',

        featured:
          product.featured ? 1:0,

        rating:
          Number(product.rating) || 4.5,

        reviews:
          Number(product.reviews) || 0,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      'Update product backend error:',
      errorText
    );

    throw new Error(
      `Failed to update product: ${response.status}`
    );
  }

  return await response.json();
};


/*
  DELETE PRODUCT
*/
export const deleteProductAPI = async (
  productId
) => {
  const response = await fetch(
    `${PRODUCTS_API_URL}/${productId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      'Delete product backend error:',
      errorText
    );

    throw new Error(
      `Failed to delete product: ${response.status}`
    );
  }

  return await response.json();
};


/*
  Compatibility helpers
  --------------------------------
  These are kept temporarily so other
  existing files don't break.
*/

export const getProducts = () => {
  return [];
};

export const saveProducts = () => {
  return [];
};


/*
  Empty initial list.
  The real products will now come
  from the SQLite backend.
*/
export const products = [];

export default products;