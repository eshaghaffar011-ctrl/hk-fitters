const PRODUCTS_API_URL =
  'https://hk-fitters-backend.onrender.com/api/products';


/*
  Convert values like:
  "S,M,L" → ["S", "M", "L"]
  ["S","M"] → ["S", "M"]
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
  Convert color data into a consistent structure.

  Supported formats:
  [
    { name: "Black", code: "#111111" }
  ]

  Or:
  "Black:#111111,Red:#a50803"
*/
const parseColorOptions = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((color) => {
        if (typeof color === 'object' && color !== null) {
          return {
            name: color.name || color.label || 'Color',
            code:
              color.code ||
              color.hex ||
              color.value ||
              '#111111',
          };
        }

        const parts = String(color)
          .split(':')
          .map((item) => item.trim());

        return {
          name: parts[0] || 'Color',
          code: parts[1] || '#111111',
        };
      })
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const parts = item.split(':').map((part) => part.trim());

        return {
          name: parts[0] || 'Color',
          code: parts[1] || '#111111',
        };
      });
  }

  return [];
};


/*
  Make sure every product has the same structure
  throughout the website.
*/
export const normalizeProduct = (
  product = {},
  index = 0
) => {
  const sizes = parseArrayValue(
    product.sizes ?? product.size ?? []
  );

  const gallery = parseArrayValue(
    product.gallery ??
    product.galleryImages ??
    []
  );

  const productId = Number(
    product.id ?? index + 1
  );

  const categoryOptions = [
    'Men',
    'Women',
    'Kids',
    'Accessories',
  ];

  const category = categoryOptions.includes(
    product.category
  )
    ? product.category
    : 'Men';

  const image =
    product.image ||
    gallery[0] ||
    '';

  const colorOptions =
    parseColorOptions(
      product.colorOptions ??
      product.colors ??
      []
    );

  const colors = colorOptions.length
    ? colorOptions.map((color) => color.code)
    : parseArrayValue(product.colors);

  return {
    /* =========================
       BASIC PRODUCT DATA
       ========================= */

    id: productId,

    name:
      typeof product.name === 'string' &&
      product.name.trim()
        ? product.name.trim()
        : `Product ${productId}`,

    description:
      product.description || '',

    shortDescription:
      product.shortDescription || '',

    image,

    gallery,

    galleryImages: gallery,

    /* =========================
       CATEGORY
       ========================= */

    category,

    productType:
      product.productType || '',

    subcategory:
      product.subcategory || '',

    collection:
      product.collection || '',

    /* =========================
       SEO
       ========================= */

    seoTitle:
      product.seoTitle ||
      product.name ||
      '',

    seoDescription:
      product.seoDescription ||
      product.description ||
      '',

    seoTags:
      parseArrayValue(
        product.seoTags ??
        product.tags ??
        []
      ),

    slug:
      product.slug ||
      String(
        product.name || `product-${productId}`
      )
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),

    /* =========================
       IMAGE SEO
       ========================= */

    imageAlt:
      product.imageAlt ||
      product.altText ||
      product.name ||
      '',

    galleryAlt:
      parseArrayValue(
        product.galleryAlt ??
        product.galleryAltText ??
        []
      ),

    /* =========================
       SIZES
       ========================= */

    size:
      sizes.length > 0
        ? sizes
        : ['M'],

    sizes:
      sizes.length > 0
        ? sizes
        : ['M'],

    customSizeAvailable:
      Boolean(
        product.customSizeAvailable
      ),

    customSizeInstructions:
      product.customSizeInstructions ||
      '',

    /* =========================
       COLORS
       ========================= */

    color:
      product.color ||
      colors[0] ||
      '#111111',

    colors:
      colors.length > 0
        ? colors
        : ['#111111'],

    colorOptions:
      colorOptions.length > 0
        ? colorOptions
        : [
            {
              name: 'Black',
              code: '#111111',
            },
          ],

    /* =========================
       CUSTOMIZATION
       ========================= */

    customizationAvailable:
      Boolean(
        product.customizationAvailable
      ),

    customLogo:
      Boolean(product.customLogo),

    customDesign:
      Boolean(product.customDesign),

    privateLabel:
      Boolean(product.privateLabel),

    customizationDetails:
      product.customizationDetails ||
      '',

    /* =========================
       MANUFACTURING
       ========================= */

    material:
      product.material || '',

    fabric:
      product.fabric || '',

    features:
      parseArrayValue(
        product.features || []
      ),

    specifications:
      parseArrayValue(
        product.specifications || []
      ),

    careInstructions:
      product.careInstructions || '',

    manufacturingDetails:
      product.manufacturingDetails ||
      '',

    /* =========================
       BUSINESS / BULK
       ========================= */

    moq:
      product.moq || '',

    leadTime:
      product.leadTime || '',

    /* =========================
       INVENTORY
       ========================= */

    stock:
      product.stock ||
      'In Stock',

    badge:
      product.badge ||
      'New',

    /* =========================
       REVIEWS
       ========================= */

    rating:
      Number(product.rating) || 4.5,

    reviews:
      Number(product.reviews) || 0,

    /* =========================
       PUBLISHING
       ========================= */

    featured:
      Number(product.featured) === 1 ||
      product.featured === true,
  };
};


/*
  GET ALL PRODUCTS
*/
export const fetchProductsFromAPI = async (
  signal,
  options = {}
) => {
  const params = new URLSearchParams();

  if (options.includeGallery === false) {
    params.set(
      'includeGallery',
      'false'
    );
  }

  if (options.featuredOnly) {
    params.set(
      'featured',
      'true'
    );
  }

  if (
    Number.isInteger(options.limit) &&
    options.limit > 0
  ) {
    params.set(
      'limit',
      String(options.limit)
    );
  }

  const query =
    params.toString()
      ? `?${params.toString()}`
      : '';

  const response = await fetch(
    `${PRODUCTS_API_URL}${query}`,
    signal
      ? { signal }
      : undefined
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status}`
    );
  }

  const data =
    await response.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(
    (product, index) =>
      normalizeProduct(
        product,
        index
      )
  );
};


/*
  Prepare product data before sending
  it to the backend.
*/
const prepareProductPayload = (
  product = {}
) => {
  const sizes =
    parseArrayValue(
      product.sizes ??
      product.size ??
      []
    );

  const gallery =
    parseArrayValue(
      product.gallery ??
      product.galleryImages ??
      []
    );

  const colorOptions =
    parseColorOptions(
      product.colorOptions ??
      product.colors ??
      []
    );

  const colors =
    colorOptions.length
      ? colorOptions.map(
          (color) => color.code
        )
      : parseArrayValue(
          product.colors
        );

  return {
    /* =========================
       BASIC
       ========================= */

    name:
      product.name || '',

    description:
      product.description || '',

    shortDescription:
      product.shortDescription || '',

    image:
      product.image ||
      gallery[0] ||
      '',

    gallery,

    /* =========================
       CATEGORY
       ========================= */

    category:
      product.category ||
      'Men',

    productType:
      product.productType || '',

    subcategory:
      product.subcategory || '',

    collection:
      product.collection || '',

    /* =========================
       SEO
       ========================= */

    seoTitle:
      product.seoTitle ||
      product.name ||
      '',

    seoDescription:
      product.seoDescription ||
      product.description ||
      '',

    seoTags:
      parseArrayValue(
        product.seoTags ??
        product.tags ??
        []
      ),

    slug:
      product.slug || '',

    /* =========================
       IMAGE SEO
       ========================= */

    imageAlt:
      product.imageAlt ||
      product.altText ||
      product.name ||
      '',

    galleryAlt:
      parseArrayValue(
        product.galleryAlt ??
        product.galleryAltText ??
        []
      ),

    /* =========================
       SIZES
       ========================= */

    sizes,

    size: sizes,

    customSizeAvailable:
      Boolean(
        product.customSizeAvailable
      ),

    customSizeInstructions:
      product.customSizeInstructions ||
      '',

    /* =========================
       COLORS
       ========================= */

    colors,

    color:
      product.color ||
      colors[0] ||
      '#111111',

    colorOptions,

    /* =========================
       CUSTOMIZATION
       ========================= */

    customizationAvailable:
      Boolean(
        product.customizationAvailable
      ),

    customLogo:
      Boolean(product.customLogo),

    customDesign:
      Boolean(product.customDesign),

    privateLabel:
      Boolean(product.privateLabel),

    customizationDetails:
      product.customizationDetails ||
      '',

    /* =========================
       MANUFACTURING
       ========================= */

    material:
      product.material || '',

    fabric:
      product.fabric || '',

    features:
      parseArrayValue(
        product.features || []
      ),

    specifications:
      parseArrayValue(
        product.specifications || []
      ),

    careInstructions:
      product.careInstructions || '',

    manufacturingDetails:
      product.manufacturingDetails ||
      '',

    /* =========================
       BUSINESS / BULK
       ========================= */

    moq:
      product.moq || '',

    leadTime:
      product.leadTime || '',

    /* =========================
       INVENTORY
       ========================= */

    stock:
      product.stock ||
      'In Stock',

    badge:
      product.badge ||
      'New',

    /* =========================
       REVIEWS
       ========================= */

    rating:
      Number(product.rating) || 4.5,

    reviews:
      Number(product.reviews) || 0,

    /* =========================
       FEATURED
       ========================= */

    featured:
      product.featured
        ? 1
        : 0,
  };
};


/*
  CREATE PRODUCT
*/
export const createProductAPI =
  async (product) => {

    const productPayload =
      prepareProductPayload(
        product
      );

    console.log(
      'PRODUCT DATA BEFORE API:',
      productPayload
    );

    const response =
      await fetch(
        PRODUCTS_API_URL,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body:
            JSON.stringify(
              productPayload
            ),
        }
      );

    if (!response.ok) {
      const errorText =
        await response.text();

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
export const updateProductAPI =
  async (
    productId,
    product
  ) => {

    const productPayload =
      prepareProductPayload(
        product
      );

    console.log(
      'UPDATE PRODUCT DATA:',
      productPayload
    );

    const response =
      await fetch(
        `${PRODUCTS_API_URL}/${productId}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',
          },

          body:
            JSON.stringify(
              productPayload
            ),
        }
      );

    if (!response.ok) {
      const errorText =
        await response.text();

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
export const deleteProductAPI =
  async (productId) => {

    const response =
      await fetch(
        `${PRODUCTS_API_URL}/${productId}`,
        {
          method: 'DELETE',
        }
      );

    if (!response.ok) {
      const errorText =
        await response.text();

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
*/
export const getProducts = () => {
  return [];
};

export const saveProducts = () => {
  return [];
};


/*
  Empty initial list.
  Real products come from
  the SQLite backend.
*/
export const products = [];

export default products;