const PRODUCTS_API_URL =
  'https://hk-fitters-backend.onrender.com/api/products';


/*
  ============================================================
  BASIC HELPERS
  ============================================================
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


const parseColorOptions = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((color) => {
        if (
          typeof color === 'object' &&
          color !== null
        ) {
          return {
            name:
              color.name ||
              color.label ||
              'Color',

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
          name:
            parts[0] ||
            'Color',

          code:
            parts[1] ||
            '#111111',
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
        const parts = item
          .split(':')
          .map((part) => part.trim());

        return {
          name:
            parts[0] ||
            'Color',

          code:
            parts[1] ||
            '#111111',
        };
      });
  }

  return [];
};


/*
  ============================================================
  IMAGE HELPERS
  ============================================================
*/

/*
  Admin currently stores selected images as
  browser data URLs.

  We keep them intact and make sure they are
  always valid strings before sending them.
*/

const cleanImageValue = (value) => {
  if (
    typeof value !== 'string'
  ) {
    return '';
  }

  return value.trim();
};


const cleanGallery = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (image) =>
        typeof image === 'string' &&
        image.trim()
    )
    .map((image) => image.trim());
};


/*
  ============================================================
  NORMALIZE PRODUCT
  ============================================================
*/

export const normalizeProduct = (
  product = {},
  index = 0
) => {
  const sizes =
    parseArrayValue(
      product.sizes ??
      product.size ??
      []
    );

  const gallery =
    cleanGallery(
      product.gallery ??
      product.galleryImages ??
      []
    );

  const productId = Number(
    product.id ??
    index + 1
  );

  const categoryOptions = [
    'Men',
    'Women',
    'Kids',
    'Accessories',
  ];

  const category =
    categoryOptions.includes(
      product.category
    )
      ? product.category
      : 'Men';

  const image =
    cleanImageValue(
      product.image
    ) ||
    gallery[0] ||
    '';

  const colorOptions =
    parseColorOptions(
      product.colorOptions ??
      product.colors ??
      []
    );

  const colors =
    colorOptions.length
      ? colorOptions.map(
          (color) =>
            color.code
        )
      : parseArrayValue(
          product.colors
        );

  return {
    /*
      BASIC
    */

    id: productId,

    name:
      typeof product.name ===
        'string' &&
      product.name.trim()
        ? product.name.trim()
        : `Product ${productId}`,

    description:
      product.description ||
      '',

    shortDescription:
      product.shortDescription ||
      '',

    image,

    gallery,

    galleryImages:
      gallery,

    /*
      CATEGORY
    */

    category,

    productType:
      product.productType ||
      '',

    subcategory:
      product.subcategory ||
      '',

    collection:
      product.collection ||
      '',

    /*
      SEO
    */

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
        product.name ||
        `product-${productId}`
      )
        .toLowerCase()
        .trim()
        .replace(
          /[^a-z0-9]+/g,
          '-'
        )
        .replace(
          /^-+|-+$/g,
          ''
        ),

    /*
      IMAGE SEO
    */

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

    /*
      SIZES
    */

    size:
      sizes.length
        ? sizes
        : ['M'],

    sizes:
      sizes.length
        ? sizes
        : ['M'],

    customSizeAvailable:
      Boolean(
        product.customSizeAvailable
      ),

    customSizeInstructions:
      product.customSizeInstructions ||
      '',

    /*
      COLORS
    */

    color:
      product.color ||
      colors[0] ||
      '#111111',

    colors:
      colors.length
        ? colors
        : ['#111111'],

    colorOptions:
      colorOptions.length
        ? colorOptions
        : [
            {
              name: 'Black',
              code: '#111111',
            },
          ],

    /*
      CUSTOMIZATION
    */

    customizationAvailable:
      Boolean(
        product.customizationAvailable
      ),

    customLogo:
      Boolean(
        product.customLogo
      ),

    customDesign:
      Boolean(
        product.customDesign
      ),

    privateLabel:
      Boolean(
        product.privateLabel
      ),

    customizationDetails:
      product.customizationDetails ||
      '',

    /*
      MANUFACTURING
    */

    material:
      product.material ||
      '',

    fabric:
      product.fabric ||
      '',

    fitStyle:
      product.fitStyle ||
      product.fit ||
      product.style ||
      '',

    features:
      parseArrayValue(
        product.features ||
        []
      ),

    specifications:
      parseArrayValue(
        product.specifications ||
        []
      ),

    careInstructions:
      product.careInstructions ||
      '',

    manufacturingDetails:
      product.manufacturingDetails ||
      '',

    /*
      BUSINESS
    */

    moq:
      product.moq ||
      '',

    leadTime:
      product.leadTime ||
      '',

    /*
      INVENTORY
    */

    stock:
      product.stock ||
      'In Stock',

    badge:
      product.badge ||
      'New',

    /*
      REVIEWS
    */

    rating:
      Number(product.rating) ||
      4.5,

    reviews:
      Number(product.reviews) ||
      0,

    /*
      FEATURED
    */

    featured:
      Number(product.featured) ===
        1 ||
      product.featured === true,
  };
};


/*
  ============================================================
  FETCH PRODUCTS
  ============================================================
*/

export const fetchProductsFromAPI =
  async (
    signal,
    options = {}
  ) => {

    const params =
      new URLSearchParams();

    if (
      options.includeGallery ===
      false
    ) {
      params.set(
        'includeGallery',
        'false'
      );
    }

    if (
      options.featuredOnly
    ) {
      params.set(
        'featured',
        'true'
      );
    }

    if (
      Number.isInteger(
        options.limit
      ) &&
      options.limit > 0
    ) {
      params.set(
        'limit',
        String(
          options.limit
        )
      );
    }

    const query =
      params.toString()
        ? `?${params.toString()}`
        : '';

    /*
      Retry because Render backend
      can take time to wake up.
    */

    let lastError = null;

    for (
      let attempt = 1;
      attempt <= 3;
      attempt += 1
    ) {
      try {
        const controller =
          new AbortController();

        const timeoutId =
          setTimeout(() => {
            controller.abort();
          }, 30000);

        const fetchOptions =
          signal
            ? {
                signal,
              }
            : {
                signal:
                  controller.signal,
              };

        let response;

        try {
          response =
            await fetch(
              `${PRODUCTS_API_URL}${query}`,
              fetchOptions
            );
        } finally {
          clearTimeout(
            timeoutId
          );
        }

        if (!response.ok) {
          const errorText =
            await response
              .text();

          throw new Error(
            `Products API error ${response.status}: ${errorText}`
          );
        }

        const data =
          await response.json();

        if (
          !Array.isArray(data)
        ) {
          throw new Error(
            'Products API returned invalid data.'
          );
        }

        return data.map(
          (
            product,
            index
          ) =>
            normalizeProduct(
              product,
              index
            )
        );

      } catch (error) {
        lastError = error;

        /*
          If caller cancelled request,
          do not retry.
        */

        if (
          signal?.aborted
        ) {
          throw error;
        }

        console.error(
          `Products API attempt ${attempt} failed:`,
          error
        );

        if (
          attempt < 3
        ) {
          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                1500
              )
          );
        }
      }
    }

    throw (
      lastError ||
      new Error(
        'Unable to load products.'
      )
    );
  };


/*
  ============================================================
  PREPARE PRODUCT PAYLOAD
  ============================================================
*/

const prepareProductPayload =
  (product = {}) => {

    const sizes =
      parseArrayValue(
        product.sizes ??
        product.size ??
        []
      );

    const gallery =
      cleanGallery(
        product.gallery ??
        product.galleryImages ??
        []
      );

    const mainImage =
      cleanImageValue(
        product.image
      ) ||
      gallery[0] ||
      '';

    const colorOptions =
      parseColorOptions(
        product.colorOptions ??
        product.colors ??
        []
      );

    const colors =
      colorOptions.length
        ? colorOptions.map(
            (color) =>
              color.code
          )
        : parseArrayValue(
            product.colors
          );

    return {

      /*
        BASIC
      */

      name:
        product.name ||
        '',

      description:
        product.description ||
        '',

      shortDescription:
        product.shortDescription ||
        '',

      /*
        IMAGE
      */

      image:
        mainImage,

      gallery,

      /*
        CATEGORY
      */

      category:
        product.category ||
        'Men',

      productType:
        product.productType ||
        '',

      subcategory:
        product.subcategory ||
        '',

      collection:
        product.collection ||
        '',

      /*
        SEO
      */

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
        '',

      /*
        IMAGE SEO
      */

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

      /*
        SIZES
      */

      sizes,

      size:
        sizes,

      customSizeAvailable:
        Boolean(
          product.customSizeAvailable
        ),

      customSizeInstructions:
        product.customSizeInstructions ||
        '',

      /*
        COLORS
      */

      colors,

      color:
        product.color ||
        colors[0] ||
        '#111111',

      colorOptions,

      /*
        CUSTOMIZATION
      */

      customizationAvailable:
        Boolean(
          product.customizationAvailable
        ),

      customLogo:
        Boolean(
          product.customLogo
        ),

      customDesign:
        Boolean(
          product.customDesign
        ),

      privateLabel:
        Boolean(
          product.privateLabel
        ),

      customizationDetails:
        product.customizationDetails ||
        '',

      /*
        MANUFACTURING
      */

      material:
        product.material ||
        '',

      fabric:
        product.fabric ||
        '',

      fitStyle:
        product.fitStyle ||
        product.fit ||
        product.style ||
        '',

      features:
        parseArrayValue(
          product.features ||
          []
        ),

      specifications:
        parseArrayValue(
          product.specifications ||
          []
        ),

      careInstructions:
        product.careInstructions ||
        '',

      manufacturingDetails:
        product.manufacturingDetails ||
        '',

      /*
        BUSINESS
      */

      moq:
        product.moq ||
        '',

      leadTime:
        product.leadTime ||
        '',

      /*
        INVENTORY
      */

      stock:
        product.stock ||
        'In Stock',

      badge:
        product.badge ||
        'New',

      /*
        REVIEWS
      */

      rating:
        Number(
          product.rating
        ) || 4.5,

      reviews:
        Number(
          product.reviews
        ) || 0,

      /*
        FEATURED
      */

      featured:
        product.featured
          ? 1
          : 0,
    };
  };


/*
  ============================================================
  CREATE PRODUCT
  ============================================================
*/

export const createProductAPI =
  async (
    product
  ) => {

    const productPayload =
      prepareProductPayload(
        product
      );

    console.log(
      'CREATE PRODUCT PAYLOAD:',
      productPayload
    );

    /*
      Check image size before
      sending to backend.
    */

    const payloadText =
      JSON.stringify(
        productPayload
      );

    console.log(
      'PRODUCT PAYLOAD SIZE:',
      (
        payloadText.length /
        1024 /
        1024
      ).toFixed(2),
      'MB'
    );

    const response =
      await fetch(
        PRODUCTS_API_URL,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Accept:
              'application/json',
          },

          body:
            payloadText,
        }
      );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        'CREATE PRODUCT BACKEND ERROR:',
        errorText
      );

      throw new Error(
        `Failed to create product: ${response.status}`
      );
    }

    return await response.json();
  };


/*
  ============================================================
  UPDATE PRODUCT
  ============================================================
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
      'UPDATE PRODUCT PAYLOAD:',
      productPayload
    );

    const payloadText =
      JSON.stringify(
        productPayload
      );

    console.log(
      'UPDATE PAYLOAD SIZE:',
      (
        payloadText.length /
        1024 /
        1024
      ).toFixed(2),
      'MB'
    );

    const response =
      await fetch(
        `${PRODUCTS_API_URL}/${productId}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Accept:
              'application/json',
          },

          body:
            payloadText,
        }
      );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        'UPDATE PRODUCT BACKEND ERROR:',
        errorText
      );

      throw new Error(
        `Failed to update product: ${response.status}`
      );
    }

    return await response.json();
  };


/*
  ============================================================
  DELETE PRODUCT
  ============================================================
*/

export const deleteProductAPI =
  async (
    productId
  ) => {

    const response =
      await fetch(
        `${PRODUCTS_API_URL}/${productId}`,
        {
          method: 'DELETE',

          headers: {
            Accept:
              'application/json',
          },
        }
      );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        'DELETE PRODUCT BACKEND ERROR:',
        errorText
      );

      throw new Error(
        `Failed to delete product: ${response.status}`
      );
    }

    return await response.json();
  };


/*
  ============================================================
  COMPATIBILITY HELPERS
  ============================================================
*/

export const getProducts =
  () => {
    return [];
  };


export const saveProducts =
  () => {
    return [];
  };


/*
  ============================================================
  EMPTY INITIAL LIST
  ============================================================
*/

export const products = [];


export default products;