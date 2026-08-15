import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProductsFromAPI } from '../data/products';


const featuredCategories = [
  { title: 'Men', subtitle: 'Tailored athletic essentials and elevated layering.', accent: 'Precision tailoring' },
  { title: 'Women', subtitle: 'Sculpted silhouettes with premium comfort and movement.', accent: 'Luxury fit' },
  { title: 'Accessories', subtitle: 'Refined pieces to complete every global wardrobe.', accent: 'Signature details' }
];


const testimonials = [
  { quote: 'The quality is exceptional and the fit is flawless for every trip and training session.', author: 'Mina K.', role: 'Founder, Studio North' },
  { quote: 'A premium brand experience from first click to delivery, with global shipping that feels effortless.', author: 'Daniel R.', role: 'Executive, Lumen Group' },
  { quote: 'Every detail feels intentional. The pieces look as sharp as they perform.', author: 'Ava S.', role: 'Creative Director' }
];

function HomePage() {
  const [activeReview, setActiveReview] = useState(0);

  const [products, setProducts] = useState([]);

  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  console.log('HOME PRODUCTS:', products);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsFromAPI();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load home products:', error);
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveReview((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const nextReview = () => {
    setActiveReview((current) => (current + 1) % testimonials.length);
  };

  const previousReview = () => {
    setActiveReview((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

 

  return (
    <div className="page home-page">
      <section className="hero-home">
        <div className="hero-content">
          <p className="eyebrow">International Performance Wear</p>
          <h1>Train Hard. Wear HK FITTERS.</h1>
          <p className="hero-text">
            HK FITTERS is a premium international sportswear export brand delivering refined performance wear, elevated craftsmanship, and dependable global service for modern athletes and business partners.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
            <a href="#featured" className="btn btn-secondary">Explore Categories</a>
          </div>
          <div className="hero-stats" aria-label="brand highlights">
            <span className="hero-pill">Premium export packaging</span>
            <span className="hero-pill">Worldwide delivery</span>
            <span className="hero-pill">Trusted by global buyers</span>
          </div>
        </div>
      </section>

      <main className="home-main">
        <section id="featured" className="section home-section">
          <div className="section-title">
            <div>
              <p className="section-label">Curated collections</p>
              <h2>Premium categories tailored for modern movement.</h2>
            </div>
            <p>From refined training layers to signature accessories, every piece is designed with distinction.</p>
          </div>
          <div className="category-grid">
            {featuredCategories.map((item) => (
              <article className="category-card" key={item.title}>
                <span className="category-badge">{item.accent}</span>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </article>
            ))}
          </div>
        </section>

       <section className="section home-section alt-panel">
  <div className="section-title">
    <div>
      <p className="section-label">Featured products</p>
      <h2>Modern essentials with elevated performance.</h2>
    </div>

    <p>
      Precision fabrics, sophisticated silhouettes, and a finish that turns
      heads worldwide.
    </p>
  </div>

  <div className="featured-grid">
    {products
    .filter((product)=> product.featured === true)
    .map((product, index) => (
        <article
          className="product-card featured-product-card"
          key={product.name}
        >
         <div className={`product-image product-image-${index + 1}`}>
  <img
    src={product.image}
    alt={product.name}
  />
</div>

          <div className="product-body">
            <span className="product-badge">{product.badge}</span>
            <h3>{product.name}</h3>
          </div>
        </article>
      ))}
  </div>
</section>
        <section className="section home-section">
          <div className="section-title">
            <div>
              <p className="section-label">Why HK FITTERS</p>
              <h2>Crafted to impress and engineered to endure.</h2>
            </div>
            <p>Every experience is designed around quality, comfort, and confident global delivery.</p>
          </div>
          <div className="why-grid">
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 3l7 4v5c0 4.3-2.7 7.9-7 9-4.3-1.1-7-4.7-7-9V7l7-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <h3>Luxury quality</h3>
                <p>Premium fabrics and meticulous detailing that elevate every look from the first wear.</p>
              </div>
            </article>
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M5 16l4-4 3 3 7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M19 7h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </div>
              <div>
                <h3>Performance-first</h3>
                <p>Built for movement, resilience, and all-day comfort without compromising on style.</p>
              </div>
            </article>
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 4v16M4 8l8-4 8 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <h3>Global service</h3>
                <p>From export-ready packaging to responsive support, your order arrives with confidence.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="section home-section">
          <div className="split-layout">
            <article className="highlight-card">
              <p className="section-label">Best sellers & new arrivals</p>
              <h2>Signature pieces arriving for the season ahead.</h2>
              <p>Seasonal drops designed to stand at the intersection of athletic performance and elevated luxury.</p>
              <div className="insight-list">
                {products.filter((product) => product.badge === 'Best Seller').map((item) => (
                  <div className="insight-item" key={item.name}>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.badge}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
            <article className="stack-card">
              <p className="section-label">Worldwide shipping</p>
              <h3>International delivery with export-ready care.</h3>
              <p>We support streamlined shipping, secure packaging, and refined service for retailers and direct customers alike.</p>
              <div className="stats-row">
                <div>
                  <strong>40+</strong>
                  <p>markets served</p>
                </div>
                <div>
                  <strong>24/7</strong>
                  <p>support access</p>
                </div>
                <div>
                  <strong>98%</strong>
                  <p>on-time delivery</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="section home-section review-section">
          <div className="section-title">
            <div>
              <p className="section-label">Customer reviews</p>
              <h2>Trusted by clients who value style and substance.</h2>
            </div>
          </div>
          <div className="review-shell">
            <button type="button" className="arrow-btn" onClick={previousReview} aria-label="Previous review">←</button>
            <article className="review-card active">
              <div className="review-stars">★★★★★</div>
              <p>“{testimonials[activeReview].quote}”</p>
              <div className="review-author">
                <strong>{testimonials[activeReview].author}</strong>
                <span>{testimonials[activeReview].role}</span>
              </div>
            </article>
            <button type="button" className="arrow-btn" onClick={nextReview} aria-label="Next review">→</button>
          </div>
          <div className="review-dots" aria-label="review selection">
            {testimonials.map((item, index) => (
              <button
                key={item.author}
                type="button"
                className={`dot ${index === activeReview ? 'active' : ''}`}
                onClick={() => setActiveReview(index)}
                aria-label={`Show review ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="section home-section newsletter-section">
          <div className="newsletter-card">
            <div>
              <p className="section-label">Stay connected</p>
              <h2>Join the HK FITTERS newsletter.</h2>
              <p>Receive early access to new arrivals, private offers, and exclusive export drops.</p>
            </div>
            <form
  className="newsletter-form"
  onSubmit={async (e) => {
    e.preventDefault();

    if (!subscriberEmail.trim()) {
      setSubscribeMessage('Please enter your email address.');
      return;
    }

    try {
      setIsSubscribing(true);
      setSubscribeMessage('');

     const response = await fetch(
  'https://hk-fitters-backend.onrender.com/api/subscribers',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: subscriberEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
  setSubscribeMessage(
    `Error ${response.status}: ${data.message || 'Subscription failed.'}`
  );
  return;
}

      setSubscribeMessage(
        'Subscribed successfully! Thank you.'
      );

      setSubscriberEmail('');
   } catch (error) {
  console.error('Subscribe error:', error);

  setSubscribeMessage(
    `Connection error: ${error.message}`
  );
} finally {
      setIsSubscribing(false);
    }
  }}
>
  <input
    type="email"
    placeholder="Your email address"
    value={subscriberEmail}
    onChange={(e) => setSubscriberEmail(e.target.value)}
    required
  />

  <button type="submit" disabled={isSubscribing}>
    {isSubscribing ? 'Subscribing...' : 'Subscribe'}
  </button>

  {subscribeMessage && (
    <p style={{ marginTop: '8px' }}>
      {subscribeMessage}
    </p>
  )}
</form>
          </div>
        </section>
      </main>

    </div>
  );
}

export default HomePage;
