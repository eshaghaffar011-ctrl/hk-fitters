import { Link } from 'react-router-dom';
import { useCartWishlist } from '../context/CartWishlistContext';

function WishlistPage() {
  const { wishlistItems, toggleWishlist, addToCart } = useCartWishlist();

  return (
    <div className="page">
      <section className="section">
        <h1>Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <div className="empty-state">
            <p>No saved items yet.</p>
            <Link to="/shop" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="card-grid">
            {wishlistItems.map((item) => (
              <article className="product-card" key={item.id}>
                <h3>{item.name}</h3>
                
                <div className="product-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary small" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                  <button className="btn btn-secondary small" onClick={() => toggleWishlist(item)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default WishlistPage;
