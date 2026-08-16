import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProductsFromAPI } from '../data/products';
import contactInfo from '../config/contact';
import { useCartWishlist } from '../context/CartWishlistContext';

const FALLBACK_DETAIL_IMAGE = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80';

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
    normalized === '#e10600' ||
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


const reviewCards = [
  { name: 'Mina K.', role: 'Global Client', text: 'The quality feels unmistakably premium and the fit is flawless.' },
  { name: 'Daniel R.', role: 'Executive Buyer', text: 'International delivery was seamless and the packaging felt luxurious.' },
  { name: 'Ava S.', role: 'Creative Director', text: 'It looks sharp, performs beautifully, and feels effortless to wear.' },
];

function ProductDetailPage() {
  const { id } = useParams();
  
const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadProduct = async () => {
    try {
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
  const { addToCart, toggleWishlist, wishlistItems } = useCartWishlist();
  const productGallery = Array.isArray(product?.gallery) && product.gallery.length ? product.gallery : [product?.image || FALLBACK_DETAIL_IMAGE];
  const availableColors = Array.isArray(product?.colors) && product.colors.length
    ? product.colors.map((colorValue) => ({ name: getColorLabel(colorValue), value: colorValue }))
    : [{ name: product?.color || 'Black', value: product?.color || '#111111' }];
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.size?.[1] || product?.size?.[0]);
  const [selectedColor, setSelectedColor] = useState(product?.color || availableColors[0]?.name || 'Black');
  const [quantity, setQuantity] = useState(1);
  const isWishlisted = wishlistItems.some((item) => item.id === product?.id);

  if (loading) {
  return (
    <div className="page">
      <section className="section">
        <h1>Loading product...</h1>
      </section>
    </div>
  );
}

  if (!product) {
    return (
      <div className="page">
        <section className="section">
          <h1>Product not found</h1>
          <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
        </section>
      </div>
    );
  }

 
  const { whatsappNumber, companyName } = contactInfo;
  const whatsappMessage = [
    `Hi ${companyName},`,
    '',
    "I'm interested in this product.",
    '',
    `Product Name: ${product.name}`,
    `Category: ${product.category}`,
    `Size: ${selectedSize}`,
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
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleQuantityChange = (direction) => {
    setQuantity((current) => Math.max(1, current + direction));
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
    { size: 'S', chest: '34–36 in', waist: '28–30 in' },
    { size: 'M', chest: '37–39 in', waist: '31–33 in' },
    { size: 'L', chest: '40–42 in', waist: '34–36 in' },
    { size: 'XL', chest: '43–45 in', waist: '37–39 in' },
  ];

  return (
    <div className="page product-detail-page">
      <section className="section product-detail-layout">
        <div className="product-gallery-card">
          <div className="main-image-frame">
            <span className="image-pill">Luxury • Premium</span>
            <img
              src={productGallery[selectedImage] || product.image || FALLBACK_DETAIL_IMAGE}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.src = FALLBACK_DETAIL_IMAGE;
              }}
            />
      
          </div>
          <div className="thumbnail-row">
            {productGallery.map((image, index) => (
              <button
                key={`${product.id}-${image}-${index}`}
                type="button"
                className={`thumb-button ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_DETAIL_IMAGE;
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info-card">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <div className="product-rating-row">
            <span className="rating-stars">★★★★★</span>
            <span>{product.reviews} reviews</span>
          </div>
          
          <span className="export-badge">Export Quality</span>
          <p className="product-intro">Premium sportswear crafted for speed, comfort, and a sharp athletic silhouette built for both performance and presence.</p>
          <p className="stock-pill">{product.stock}</p>

          <div className="option-block">
            <h3>Sizes</h3>
            <div className="payment-options">
              {product.size.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`payment-pill ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

         <div className="option-block">
  <h3>Colors</h3>

  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginTop: '10px',
    }}
  >
    {availableColors.map((color) => (
      <button
        key={`${product.id}-${color.name}-${color.value}`}
        type="button"
        onClick={() => setSelectedColor(color.name)}
        title={color.name}
        aria-label={`Select ${color.name}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '999px',
          border:
            selectedColor === color.name
              ? '2px solid #e10600'
              : '1px solid #ccc',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            width: '24px',
            height: '24px',
            minWidth: '24px',
            borderRadius: '50%',
            backgroundColor: color.value,
            border: '1px solid #999',
            display: 'inline-block',
          }}
        />

        <span>{color.name}</span>
      </button>
    ))}
  </div>
</div>

          <div className="option-block">
            <h3>Quantity</h3>
            <div className="quantity-control">
              <button type="button" onClick={() => handleQuantityChange(-1)}>−</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>

          <div className="product-actions">
            <button className="btn btn-primary" type="button" onClick={handleAddToCart}>Add to Cart</button>
            <button className="wishlist-btn" type="button" onClick={() => toggleWishlist(product)}>
              {isWishlisted ? '★ Saved' : '♡ Wishlist'}
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              type="button"
              aria-label="Contact on WhatsApp"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.2s ease, filter 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                e.currentTarget.style.filter = 'brightness(1.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.filter = 'brightness(1)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(1px) scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ width: '16px', height: '16px', fill: 'currentColor' }}
              >
                <path d="M20.52 3.48A11.76 11.76 0 0 0 12.15 1C6.35 1 1.66 5.7 1.66 11.5c0 2.03.53 4.02 1.53 5.78L1.5 23l5.91-1.55a10.46 10.46 0 0 0 5.06 1.24h.01c5.8 0 10.49-4.69 10.49-10.49 0-2.8-1.09-5.42-3.06-7.39Zm-8.37 16.1c-1.63 0-3.24-.44-4.67-1.28l-.34-.19-3.5.92 1-3.4-.22-.35a8.4 8.4 0 0 1-1.29-4.45c0-4.66 3.79-8.45 8.45-8.45 2.26 0 4.38.88 5.98 2.47a8.42 8.42 0 0 1 2.48 5.98c0 4.66-3.79 8.45-8.45 8.45Zm4.64-6.34c-.25-.12-1.49-.73-1.72-.81-.23-.08-.4-.12-.57.12-.17.24-.66.81-.81 1-.15.17-.3.2-.55.07-.25-.12-1.05-.39-2-1.25-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.52.11-.11.25-.3.37-.45.12-.15.17-.26.25-.43.08-.17.04-.32-.02-.45-.06-.12-.57-1.38-.78-1.88-.2-.5-.41-.43-.57-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43.1 3.37.1.15.75 1.21 1.89 1.91 1.14.7 2.07.82 2.69.84.71.02 1.3-.15 1.5-.28.2-.13.52-.52.63-1.02.11-.5.11-.92.08-1.02-.03-.1-.1-.16-.24-.29Z" />
              </svg>
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="section product-detail-extra">
  <div className="detail-column">
    <div className="detail-panel">
      <h3>Size Guide</h3>

      <table className="size-guide-table">
        <thead>
          <tr>
            <th>Size</th>
            <th>Chest</th>
            <th>Waist</th>
          </tr>
        </thead>

        <tbody>
          {sizeGuideRows.map((row) => (
            <tr key={row.size}>
              <td>{row.size}</td>
              <td>{row.chest}</td>
              <td>{row.waist}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="detail-panel">
      <h3>Shipping Information</h3>
      <p>
        International delivery in 4–7 business days for standard export
        orders. Express shipping and bulk freight options are available
        upon request.
      </p>
    </div>
  </div>

  <div className="detail-column">
    <div className="detail-panel">
      <h3>Care Instructions</h3>
      <p>
        Machine wash cold with like colors. Avoid bleach. Line dry and iron
        on low heat if needed. Store in a cool, dry place.
      </p>
    </div>

    <div className="detail-panel">
      <h3>Return Policy</h3>
      <p>
        Complimentary exchanges are available within 14 days for unused
        items in original packaging. Returns are reviewed case by case for
        export wholesale orders.
      </p>
    </div>
  </div>
</section>

      <section className="section review-section">
        <div className="section-heading">
          <h2>Customer Reviews</h2>
          <p>Trusted by clients who expect luxury, precision, and comfort in every order.</p>
        </div>
        <div className="review-grid">
          {reviewCards.map((review) => (
            <article className="review-card" key={review.name}>
              <div className="review-stars">★★★★★</div>
              <p>“{review.text}”</p>
              <strong>{review.name}</strong>
              <span>{review.role}</span>
            </article>
          ))}
        </div>
      </section>

     
    </div>
  );
}

export default ProductDetailPage;
