import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProductsFromAPI } from '../data/products';
import contactInfo from '../config/contact';
import '../ProductDetail.css';


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
  const shortDescription =
    typeof product?.shortDescription === 'string'
      ? product.shortDescription.replace(/\s+/g, ' ').trim()
      : '';

  const description =
    typeof product?.description === 'string'
      ? product.description.replace(/\s+/g, ' ').trim()
      : '';

  return (
    shortDescription ||
    description ||
    PRODUCT_FALLBACK_DESCRIPTION
  );
};
const toDisplayList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
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
    `Hi ${companyName},`, '', "I'm interested in this product.", '',
    `Product Name: ${product.name}`,
    `Category: ${product.category}`,
    `Size: ${selectedSize || 'Not selected'}`,
    `Color: ${selectedColor}`, '',
    'Please share the price, availability, minimum order quantity, production time, and shipping details.',
  ].join('\n');

  const whatsappHref =
    `https://wa.me/${whatsappNumber.replace(
      /\D/g,
      ''
    )}?text=${encodeURIComponent(
      whatsappMessage
    )}`;


  const availableSizes = toDisplayList(product.size || product.sizes);
  const productFeatures = toDisplayList(product.features);
  const productSpecifications = toDisplayList(product.specifications);

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


            {/* PRODUCT DETAILS */}
            <section className="hk-detail-card">
              <div className="hk-detail-card-heading"><div><span>PRODUCT DETAILS</span><h2>Product Information</h2></div></div>
              {product.shortDescription && <p>{product.shortDescription}</p>}
              {productFeatures.length > 0 && <div style={{ marginTop: '18px' }}><strong>Key Features</strong><ul style={{ marginTop: '10px', paddingLeft: '20px' }}>{productFeatures.map((feature,index)=><li key={`${feature}-${index}`}>{feature}</li>)}</ul></div>}
              {(product.material || product.fabric || product.fitStyle) && <div style={{ display:'grid', gap:'10px', marginTop:'18px' }}>
                {(product.material || product.fabric) && <p><strong>Material:</strong> {product.material || product.fabric}</p>}
                {product.fitStyle && <p><strong>Fit / Style:</strong> {product.fitStyle}</p>}
              </div>}
              {productSpecifications.length > 0 && <div style={{ marginTop:'18px' }}><strong>Specifications</strong><ul style={{ marginTop:'10px', paddingLeft:'20px' }}>{productSpecifications.map((spec,index)=><li key={`${spec}-${index}`}>{spec}</li>)}</ul></div>}
            </section>

            {/* AVAILABLE SIZES */}
            <section className="hk-detail-card">
              <div className="hk-detail-card-heading"><div><span>AVAILABLE OPTIONS</span><h2>Available Sizes</h2></div></div>
              {availableSizes.length > 0 ? <div className="hk-size-options">{availableSizes.map((size)=><span key={size} className="hk-size-button active" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',cursor:'default'}}>{size}</span>)}</div> : <p>Size options are available on request.</p>}
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


              {/* WHATSAPP ACTION */}
              <div className="hk-product-actions">
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="hk-whatsapp-button" style={{ width: '100%', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.76 11.76 0 0 0 12.15 1C6.35 1 1.66 5.7 1.66 11.5c0 2.03.53 4.02 1.53 5.78L1.5 23l5.91-1.55a10.46 10.46 0 0 0 5.06 1.24h.01c5.8 0 10.49-4.69 10.49-10.49 0-2.8-1.09-5.42-3.06-7.39Z" /></svg>
                  Contact on WhatsApp for Price & Order Details
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

              <p>{product.careInstructions || 'Care instructions will be confirmed with your order inquiry.'}</p>

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