import { Link } from 'react-router-dom';
import { useCartWishlist } from '../context/CartWishlistContext';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCartWishlist();

  

  const adjustQuantity = (item, delta) => {
    const nextQuantity = Math.max(1, (Number(item.quantity) || 1) + delta);
    updateQuantity(item.id, nextQuantity, item.selectedSize, item.selectedColor);
  };

  return (
    <div className="page">
      <section className="section">
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="empty-state">
            <p>Your cart is empty.</p>
            <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={`${item.id}-${item.selectedSize || 'default'}-${item.selectedColor || 'default'}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    )}
                    <div>
                      <h3>{item.name}</h3>
                     
                      <p style={{ margin: '4px 0 0' }}>
                        Size: {item.selectedSize || item.size?.[0] || 'N/A'}
                      </p>
                      <p style={{ margin: 0 }}>
                        Color: {item.selectedColor || item.color || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="cart-controls">
                    <div className="quantity-control" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button type="button" onClick={() => adjustQuantity(item, -1)} aria-label="Decrease quantity">−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => adjustQuantity(item, 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <button
                      className="btn btn-secondary small"
                      onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="summary-card">
              <h3>Order Summary</h3>
            
              <Link to="/checkout" className="btn btn-primary full">Proceed to Checkout</Link>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

export default CartPage;
