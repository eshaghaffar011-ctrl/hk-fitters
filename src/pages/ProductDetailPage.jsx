import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProductsFromAPI } from '../data/products';
import contactInfo from '../config/contact';
import '../ProductDetail.css';
import { useCartWishlist } from '../context/CartWishlistContext';


const FALLBACK_DETAIL_IMAGE =
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80';

const reviewCards = [
  {
    name: 'Mina K.',
    role: 'Global Client',
    text: 'The quality feels unmistakably premium and the fit is flawless.',
  },
  {
    name: 'Daniel R.',
    role: 'Executive Buyer',
    text: 'International delivery was seamless and the packaging felt luxurious.',
  },
  {
    name: 'Ava S.',
    role: 'Creative Director',
    text: 'It looks sharp, performs beautifully, and feels effortless to wear.',
  },
];

const PRODUCT_FALLBACK_DESCRIPTION =
  'Explore this premium HK FITTERS sportswear product, designed for comfort, performance, and everyday movement.';

const getColorLabel = (value) => {
  if (!value) return 'Black';

  const normalized = String(value).toLowerCase().trim();

  if (
    normalized === '#111111' ||
    normalized === '#000000' ||
    normalized.includes('black')
  ) {
    return 'Black';
  }

  if (
    normalized === '#a50803' ||
    normalized.includes('red')
  ) {
    return 'Red';
  }

  if (
    normalized === '#ffffff' ||
    normalized === '#f4f4f4' ||
    normalized === '#f8f8f8' ||
    normalized.includes('white')
  ) {
    return 'White';
  }

  if (
    normalized === '#6b7280' ||
    normalized.includes('grey') ||
    normalized.includes('gray')
  ) {
    return 'Grey';
  }

  if (normalized.includes('blue')) return 'Blue';
  if (normalized.includes('green')) return 'Green';

  return value;
};

const getProductDescription = (product) => {
  const description =
    typeof product?.description === 'string'
      ? product.description.replace(/\s+/g, ' ').trim()
      : '';

  return description || PRODUCT_FALLBACK_DESCRIPTION;
};

const getMetaDescription = (description) => {
  if (description.length <= 160) return description;

  return `${description.slice(0, 157).replace(/\s+$/, '')}...`;
};

const getAvailabilityUrl = (stock) => {
  const normalizedStock = String(stock || '').toLowerCase();

  return normalizedStock.includes('out')
    ? 'https://schema.org/OutOfStock'
    : 'https://schema.org/InStock';
};

function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);

  const {
    addToCart,
    toggleWishlist,
    wishlistItems,
  } = useCartWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const data = await fetchProductsFromAPI();

        const foundProduct = data.find(
          (item) => Number(item.id) === Number(id)
        );

        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Failed to load product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const productGallery = useMemo(() => {
    if (
      Array.isArray(product?.gallery) &&
      product.gallery.length > 0
    ) {
      return product.gallery;
    }

    return [
      product?.image || FALLBACK_DETAIL_IMAGE,
    ];
  }, [product]);

  const availableColors = useMemo(() => {
    if (
      Array.isArray(product?.colors) &&
      product.colors.length > 0
    ) {
      return product.colors.map((colorValue) => ({
        name: getColorLabel(colorValue),
        value: colorValue,
      }));
    }

    return [
      {
        name: product?.color || 'Black',
        value: product?.color || '#111111',
      },
    ];
  }, [product]);

  const productDescription = getProductDescription(product);

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product?.id
  );

  useEffect(() => {
    if (!product) return;

    const firstSize =
      Array.isArray(product.size) && product.size.length
        ? product.size[0]
        : '';

    const firstColor =
      Array.isArray(product.colors) && product.colors.length
        ? getColorLabel(product.colors[0])
        : product.color || 'Black';

    setSelectedSize(firstSize);
    setSelectedColor(firstColor);
    setSelectedImage(0);
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    if (!product) return undefined;

    const canonicalUrl =
      `https://hk-fitters.vercel.app/product/${product.id}`;

    const metadataDescription =
      getMetaDescription(productDescription);

    document.title = `${product.name} | HK FITTERS`;

    const descriptionTag =
      document.head.querySelector(
        'meta[name="description"]'
      );

    if (descriptionTag) {
      descriptionTag.setAttribute(
        'content',
        metadataDescription
      );
    }

    const canonicalTag =
      document.head.querySelector(
        'link[rel="canonical"]'
      );

    if (canonicalTag) {
      canonicalTag.setAttribute(
        'href',
        canonicalUrl
      );
    }

    const existingSchema =
      document.head.querySelector(
        '#product-jsonld'
      );

    existingSchema?.remove();

    const schemaTag = document.createElement('script');
schemaTag.id = 'product-jsonld';
schemaTag.type = 'application/ld+json';

const productUrl = `https://hk-fitters.vercel.app/product/${product.id}`;

schemaTag.textContent = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Product',

  name: product.name,

  image: productGallery,

  description: productDescription,

  url: productUrl,

  brand: {
    '@type': 'Brand',
    name: 'HK FITTERS',
  },

  manufacturer: {
    '@type': 'Organization',
    name: 'HK FITTERS',
    url: 'https://hk-fitters.vercel.app',
  },

  productID: String(product.id),

  category: product.category,

  offers: {
    '@type': 'Offer',
    url: productUrl,
    availability: getAvailabilityUrl(product.stock),
    seller: {
      '@type': 'Organization',
      name: 'HK FITTERS',
    },
  },
});

document.head.appendChild(schemaTag);


/* Breadcrumb structured data */
const breadcrumbTag = document.createElement('script');
breadcrumbTag.id = 'breadcrumb-jsonld';
breadcrumbTag.type = 'application/ld+json';

breadcrumbTag.textContent = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',

  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://hk-fitters.vercel.app/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Sportswear Products',
      item: 'https://hk-fitters.vercel.app/shop',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: product.name,
      item: productUrl,
    },
  ],
});

document.head.appendChild(breadcrumbTag);

    return () => {
  schemaTag.remove();
  breadcrumbTag.remove();
};
  }, [
    product,
    productDescription,
    productGallery,
  ]);

  if (loading) {
    return (
      <div className="hk-product-page">
        <div className="hk-product-loading">
          <div className="hk-product-loading-spinner" />
          <h1>Loading product</h1>
          <p>
            Preparing product information for you.
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="hk-product-page">
        <div className="hk-product-not-found">
          <h1>Product not found</h1>

          <p>
            The product you are looking for is
            currently unavailable.
          </p>

          <Link
            to="/shop"
            className="hk-product-back-button"
          >
            Back to Sportswear
          </Link>
        </div>
      </div>
    );
  }

  const {
    whatsappNumber,
    companyName,
  } = contactInfo;

  const whatsappMessage = [
    `Hi ${companyName},`,
    '',
    "I'm interested in this product.",
    '',
    `Product Name: ${product.name}`,
    `Category: ${product.category}`,
    `Size: ${selectedSize || 'Not selected'}`,
    `Color: ${selectedColor}`,
    `Quantity: ${quantity}`,
    '',
    'Please share:',
    '- Price',
    '- MOQ',
    '- Available Colors',
    '- Available Sizes',
    '- Production Time',
    '- Export Details',
    '- Shipping Information',
  ].join('\n');

  const whatsappHref =
    `https://wa.me/${whatsappNumber.replace(
      /\D/g,
      ''
    )}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

  const handleQuantityChange = (direction) => {
    setQuantity((current) =>
      Math.max(1, current + direction)
    );
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    });
  };

  const sizeGuideRows = [
    {
      size: 'S',
      chest: '34–36 in',
      waist: '28–30 in',
    },
    {
      size: 'M',
      chest: '37–39 in',
      waist: '31–33 in',
    },
    {
      size: 'L',
      chest: '40–42 in',
      waist: '34–36 in',
    },
    {
      size: 'XL',
      chest: '43–45 in',
      waist: '37–39 in',
    },
  ];

  return (
    <div className="hk-product-page">

      {/* =================================================
          MAIN PRODUCT CONTENT
          ================================================= */}

      <main className="hk-product-shell">

        <div className="hk-product-main-grid">

          {/* LEFT COLUMN */}

          <div className="hk-product-left">

            <section className="hk-product-gallery">

              <div className="hk-product-image-frame">

                <span className="hk-product-image-badge">
                  Luxury • Premium
                </span>

                <img
                  src={
                    productGallery[selectedImage] ||
                    product.image ||
                    FALLBACK_DETAIL_IMAGE
                  }
                  alt={`${product.name} - HK FITTERS`}
                  width="1200"
                  height="1200"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onError={(event) => {
                    if (
                      event.currentTarget.src !==
                      FALLBACK_DETAIL_IMAGE
                    ) {
                      event.currentTarget.src =
                        FALLBACK_DETAIL_IMAGE;
                    }
                  }}
                />

              </div>

              <div className="hk-product-thumbnails">

                {productGallery.map(
                  (image, index) => (
                    <button
                      key={`${product.id}-${image}-${index}`}
                      type="button"
                      className={
                        `hk-product-thumbnail ${
                          selectedImage === index
                            ? 'active'
                            : ''
                        }`
                      }
                      onClick={() =>
                        setSelectedImage(index)
                      }
                      aria-label={
                        `View product image ${
                          index + 1
                        }`
                      }
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        width="160"
                        height="160"
                        loading="lazy"
                        decoding="async"
                        onError={(event) => {
                          if (
                            event.currentTarget.src !==
                            FALLBACK_DETAIL_IMAGE
                          ) {
                            event.currentTarget.src =
                              FALLBACK_DETAIL_IMAGE;
                          }
                        }}
                      />
                    </button>
                  )
                )}

              </div>

            </section>


            {/* SIZE GUIDE */}

            <section className="hk-detail-card">

              <div className="hk-detail-card-heading">
                <div>
                  <span>FIT & SIZING</span>
                  <h2>Size Guide</h2>
                </div>
              </div>

              <div className="hk-table-wrap">

                <table className="hk-size-table">

                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Chest</th>
                      <th>Waist</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sizeGuideRows.map(
                      (row) => (
                        <tr key={row.size}>
                          <td>{row.size}</td>
                          <td>{row.chest}</td>
                          <td>{row.waist}</td>
                        </tr>
                      )
                    )}
                  </tbody>

                </table>

              </div>

            </section>


            {/* SHIPPING */}

            <section className="hk-detail-card hk-detail-card-compact">

              <span className="hk-detail-label">
                GLOBAL DELIVERY
              </span>

              <h2>
                Shipping Information
              </h2>

              <p>
                International delivery in 4–7
                business days for standard export
                orders. Express shipping and bulk
                freight options are available upon
                request.
              </p>

            </section>

          </div>


          {/* RIGHT COLUMN */}

          <div className="hk-product-right">

            <section className="hk-product-information">

              <span className="hk-product-category">
                {product.category}
              </span>

              <h1>
                {product.name}
              </h1>

              <div className="hk-product-rating">

                <span className="hk-stars">
                  ★★★★★
                </span>

                <span>
                  {product.reviews || 0} reviews
                </span>

              </div>

              <div className="hk-quality-badge">
                EXPORT QUALITY
              </div>

              <p className="hk-product-description">
                {productDescription}
              </p>

              <div className="hk-stock-status">
                <span />
                {product.stock || 'In Stock'}
              </div>


              {/* SIZES */}

              <div className="hk-option-section">

                <div className="hk-option-title">
                  <span>01</span>
                  <strong>Choose Size</strong>
                </div>

                <div className="hk-size-options">

                  {Array.isArray(product.size) &&
                    product.size.map(
                      (size) => (
                        <button
                          key={size}
                          type="button"
                          className={
                            `hk-size-button ${
                              selectedSize === size
                                ? 'active'
                                : ''
                            }`
                          }
                          onClick={() =>
                            setSelectedSize(size)
                          }
                        >
                          {size}
                        </button>
                      )
                    )}

                </div>

              </div>


              {/* COLORS */}

              <div className="hk-option-section">

                <div className="hk-option-title">
                  <span>02</span>
                  <strong>Choose Color</strong>
                </div>

                <div className="hk-color-options">

                  {availableColors.map(
                    (color) => (
                      <button
                        key={`${product.id}-${color.name}-${color.value}`}
                        type="button"
                        className={
                          `hk-color-button ${
                            selectedColor ===
                            color.name
                              ? 'active'
                              : ''
                          }`
                        }
                        onClick={() =>
                          setSelectedColor(
                            color.name
                          )
                        }
                      >

                        <span
                          className="hk-color-swatch"
                          style={{
                            backgroundColor:
                              color.value,
                          }}
                        />

                        <span>
                          {color.name}
                        </span>

                      </button>
                    )
                  )}

                </div>

              </div>


              {/* QUANTITY */}

              <div className="hk-option-section">

                <div className="hk-option-title">
                  <span>03</span>
                  <strong>Quantity</strong>
                </div>

                <div className="hk-quantity">

                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(-1)
                    }
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(1)
                    }
                  >
                    +
                  </button>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="hk-product-actions">

                <button
                  type="button"
                  className="hk-add-cart"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  className={
                    `hk-wishlist ${
                      isWishlisted
                        ? 'active'
                        : ''
                    }`
                  }
                  onClick={() =>
                    toggleWishlist(product)
                  }
                >
                  {isWishlisted
                    ? '★ Saved'
                    : '♡ Wishlist'}
                </button>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="hk-whatsapp-button"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.52 3.48A11.76 11.76 0 0 0 12.15 1C6.35 1 1.66 5.7 1.66 11.5c0 2.03.53 4.02 1.53 5.78L1.5 23l5.91-1.55a10.46 10.46 0 0 0 5.06 1.24h.01c5.8 0 10.49-4.69 10.49-10.49 0-2.8-1.09-5.42-3.06-7.39Zm-8.37 16.1c-1.63 0-3.24-.44-4.67-1.28l-.34-.19-3.5.92 1-3.4-.22-.35a8.4 8.4 0 0 1-1.29-4.45c0-4.66 3.79-8.45 8.45-8.45 2.26 0 4.38.88 5.98 2.47a8.42 8.42 0 0 1 2.48 5.98c0 4.66-3.79 8.45-8.45 8.45Zm4.64-6.34c-.25-.12-1.49-.73-1.72-.81-.23-.08-.4-.12-.57.12-.17.24-.66.81-.81 1-.15.17-.3.2-.55.07-.25-.12-1.05-.39-2-1.25-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.52.11-.11.25-.3.37-.45.12-.15.17-.26.25-.43.08-.17.04-.32-.02-.45-.06-.12-.57-1.38-.78-1.88-.2-.5-.41-.43-.57-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43.1 3.37.1.15.75 1.21 1.89 1.91 1.14.7 2.07.82 2.69.84.71.02 1.3-.15 1.5-.28.2-.13.52-.52.63-1.02.11-.5.11-.92.08-1.02-.03-.1-.1-.16-.24-.29Z" />
                  </svg>

                  Contact on WhatsApp
                </a>

              </div>

            </section>


            {/* CARE */}

            <section className="hk-detail-card hk-detail-card-compact">

              <span className="hk-detail-label">
                PRODUCT CARE
              </span>

              <h2>
                Care Instructions
              </h2>

              <p>
                Machine wash cold with like
                colors. Avoid bleach. Line dry
                and iron on low heat if needed.
                Store in a cool, dry place.
              </p>

            </section>


            {/* RETURN */}

            <section className="hk-detail-card hk-detail-card-compact">

              <span className="hk-detail-label">
                CUSTOMER POLICY
              </span>

              <h2>
                Return Policy
              </h2>

              <p>
                Complimentary exchanges are
                available within 14 days for
                unused items in original
                packaging. Returns are reviewed
                case by case for export wholesale
                orders.
              </p>

            </section>

          </div>

        </div>


        {/* =================================================
            REVIEWS
            ================================================= */}

        <section className="hk-reviews-section">

          <div className="hk-reviews-heading">

            <div>
              <span>
                CLIENT FEEDBACK
              </span>

              <h2>
                Customer Reviews
              </h2>
            </div>

            <p>
              Trusted by clients who expect
              quality, precision, and reliable
              service.
            </p>

          </div>

          <div className="hk-review-grid">

            {reviewCards.map(
              (review) => (
                <article
                  className="hk-review-card"
                  key={review.name}
                >

                  <div className="hk-review-stars">
                    ★★★★★
                  </div>

                  <p>
                    “{review.text}”
                  </p>

                  <strong>
                    {review.name}
                  </strong>

                  <span>
                    {review.role}
                  </span>

                </article>
              )
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default ProductDetailPage;