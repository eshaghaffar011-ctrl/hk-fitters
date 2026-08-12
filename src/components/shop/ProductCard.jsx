import { Link } from 'react-router-dom';
import { useCartWishlist } from '../../context/CartWishlistContext';
import contactInfo from '../../config/contact';

const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80';

function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlistItems } = useCartWishlist();
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);
  const { whatsappNumber, companyName } = contactInfo;
  const colorOptions = Array.isArray(product.colors) ? product.colors : [product.color];
  const sizeOptions = Array.isArray(product.size) ? product.size : [];
  const productImage = product.image || FALLBACK_PRODUCT_IMAGE;

  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello ${companyName},\n\nI am interested in this product:\n\nProduct Name: ${product.name}\nCategory: ${product.category}\n\nPlease send me:\n• Price\n• Available Sizes\n• Available Colors\n• Minimum Order Quantity (MOQ)\n• Export Details`
  )}`;

  const handleImageError = (event) => {
    event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
  };

  return (
    <article className="product-card shop-card">
      <div className="product-card-top">
        <span className="badge">{product.badge}</span>
        <span className="stock-pill">{product.stock}</span>
      </div>

      <div className="product-media modern-media">
        <img src={productImage} alt={product.name} onError={handleImageError} />
      </div>

      <div className="product-body">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="product-meta">{product.description || product.color}</p>

        <div className="size-pills">
          {sizeOptions.map((size) => (
            <span key={size} className="size-pill">{size}</span>
          ))}
        </div>

        <div className="color-pills">
          {colorOptions.map((color, index) => (
            <span
              key={`${product.id}-${color}-${index}`}
              className="color-pill"
              style={{ backgroundColor: color }}
              aria-label={`Color option ${index + 1}`}
            />
          ))}
        </div>

        

        <div className="rating-row">
          <span>★ {product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        <div className="product-actions">
          <Link to={`/product/${product.id}`} className="btn btn-secondary small">View Details</Link>
          <button className="btn btn-primary small" onClick={() => addToCart(product)}>Add to Cart</button>
          <button className="btn btn-secondary small" onClick={() => toggleWishlist(product)}>
            {isWishlisted ? '★ Saved' : '♡ Wishlist'}
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary small"
            aria-label="Order on WhatsApp"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
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
              style={{ width: '14px', height: '14px', fill: 'currentColor' }}
            >
              <path d="M20.52 3.48A11.76 11.76 0 0 0 12.15 1C6.35 1 1.66 5.7 1.66 11.5c0 2.03.53 4.02 1.53 5.78L1.5 23l5.91-1.55a10.46 10.46 0 0 0 5.06 1.24h.01c5.8 0 10.49-4.69 10.49-10.49 0-2.8-1.09-5.42-3.06-7.39Zm-8.37 16.1c-1.63 0-3.24-.44-4.67-1.28l-.34-.19-3.5.92 1-3.4-.22-.35a8.4 8.4 0 0 1-1.29-4.45c0-4.66 3.79-8.45 8.45-8.45 2.26 0 4.38.88 5.98 2.47a8.42 8.42 0 0 1 2.48 5.98c0 4.66-3.79 8.45-8.45 8.45Zm4.64-6.34c-.25-.12-1.49-.73-1.72-.81-.23-.08-.4-.12-.57.12-.17.24-.66.81-.81 1-.15.17-.3.2-.55.07-.25-.12-1.05-.39-2-1.25-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.52.11-.11.25-.3.37-.45.12-.15.17-.26.25-.43.08-.17.04-.32-.02-.45-.06-.12-.57-1.38-.78-1.88-.2-.5-.41-.43-.57-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43.1 3.37.1.15.75 1.21 1.89 1.91 1.14.7 2.07.82 2.69.84.71.02 1.3-.15 1.5-.28.2-.13.52-.52.63-1.02.11-.5.11-.92.08-1.02-.03-.1-.1-.16-.24-.29Z" />
            </svg>
            WhatsApp Inquiry
          </a>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
