import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="page">
      <section className="section">
        <div className="summary-card">
          <p className="eyebrow">Page Not Found</p>
          <h1>We could not find that page.</h1>
          <p>
            The page may have moved or the address may be incorrect. Continue to the HK FITTERS homepage or browse the shop.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'flex-start', marginTop: '18px' }}>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
            <Link to="/shop" className="btn btn-secondary">Browse Shop</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NotFoundPage;
