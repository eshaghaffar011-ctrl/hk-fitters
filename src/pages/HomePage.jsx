import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProductsFromAPI } from '../data/products';


const featuredCategories = [
  {
    title: 'Men',
    subtitle:
      'Custom men’s sportswear and performance apparel designed for training, competition, comfort, and durability.',
    accent: 'Men’s Sportswear'
  },
  {
    title: 'Women',
    subtitle:
      'Custom women’s activewear and sportswear designed for performance, comfort, movement, and a refined fit.',
    accent: 'Women’s Activewear'
  },
  {
    title: 'Kids',
    subtitle:
      'Quality kids’ sportswear designed for active movement, comfort, durability, and everyday performance.',
    accent: 'Kids’ Sportswear'
  },
  {
    title: 'Accessories',
    subtitle:
      'Sportswear accessories and performance essentials designed to complete custom team and activewear collections.',
    accent: 'Sportswear Accessories'
  }
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
        const data = await fetchProductsFromAPI(undefined, {
          includeGallery: false,
          featuredOnly: true,
          limit: 8,
        });
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
      <section  className="hero-home"
   style={{
    backgroundImage:
      "linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.88) 32%, rgba(0,0,0,0.48) 55%, rgba(0,0,0,0.15) 75%), url('/logo/s-hero.png')",
     backgroundPosition: 'center center, right center',
    backgroundSize: '100% 100%, 68% 100%',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundColor: '#050505',
  }}>
        <div className="hero-content">
          <p className="eyebrow">International Performance Wear</p>
          <h1>Premium Sportswear & Activewear Manufacturer</h1>
          <p className="hero-text">
            HK FITTERS is a premium sportswear and activewear manufacturer delivering high-quality performance wear, custom gym wear, and reliable global manufacturing solutions for brands, retailers, and businesses worldwide.
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
              <h2 className="section-label">Sportswear & Activewear Collections</h2>
              <p className="section-description">Explore premium sportswear, activewear, and performance apparel designed for brands, retailers, and modern athletes.</p>
            </div>
            <p>From refined training layers to signature accessories, every piece is designed with distinction.</p>
          </div>
          <div
  className="home-category-grid"
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '20px',
    width: '100%',
  }}
>
            {featuredCategories.map((item) => (
              <article className="category-card" key={item.title}>
                <span className="category-badge">{item.accent}</span>
                <h3>
                  <Link to={`/shop?category=${item.title}`}>
                   {item.title === 'Men'
  ? "Men's Sportswear"
  : item.title === 'Women'
    ? "Women's Activewear"
    : item.title === 'Kids'
      ? "Kids' Sportswear"
      : 'Sportswear Accessories'}
                  </Link>
                </h3>
                <p>{item.subtitle}</p>
              </article>
            ))}
          </div>
        </section>

       <section className="section home-section alt-panel">
  <div className="section-title">
    <div>
      <h2 className="section-label">Featured Sportswear & Activewear</h2>
      <p className="section-description">Discover premium sportswear, activewear, and performance apparel crafted for quality, comfort, and lasting performance.</p>
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
    alt={`${product.name} sportswear by HK FITTERS`}
    width="900"
    height="900"
    loading={index < 2 ? 'eager' : 'lazy'}
    fetchPriority={index < 2 ? 'high' : 'auto'}
    decoding="async"
    onError={(event) => {
      if (event.currentTarget.dataset.fallbackApplied !== 'true') {
        event.currentTarget.dataset.fallbackApplied = 'true';
        event.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80';
      }
    }}
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
              <h2 className="section-label">Why Choose HK FITTERS for Sportswear Manufacturing?</h2>
              <p className="section-description">We combine premium materials, precise craftsmanship, performance-focused design, and reliable global service to deliver sportswear and activewear that meets the needs of modern brands and businesses.</p>
            </div>
            <p>Every experience is designed around quality, comfort, and confident sportswear manufacturing and global delivery.</p>
          </div>
          <div className="why-grid">
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 3l7 4v5c0 4.3-2.7 7.9-7 9-4.3-1.1-7-4.7-7-9V7l7-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <h3>Luxury quality</h3>
                <p>Premium fabrics and meticulous craftsmanship for durable, high-quality sportswear.</p>
              </div>
            </article>
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M5 16l4-4 3 3 7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M19 7h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </div>
              <div>
                <h3>Performance-first</h3>
                <p>Performance-driven designs built for movement, comfort, durability, and everyday wear.</p>
              </div>
            </article>
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 4v16M4 8l8-4 8 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <h3>Global service</h3>
                <p>Reliable manufacturing, export-ready packaging, and worldwide delivery for business partners.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="section home-section">
          <div className="split-layout">
            <article className="highlight-card">
              <h2 className="section-label">Best-Selling Sportswear & New Arrivals</h2>
              <p className="section-description">Explore our latest sportswear and activewear collections, featuring performance-focused designs, premium fabrics, and modern styles.</p>
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
              <h2 className="section-label">Worldwide Sportswear Manufacturing & Delivery</h2>
              <p className="section-description">We provide reliable worldwide delivery with export-ready packaging and professional service for sportswear brands, retailers, and business partners.</p>
              <p>We support streamlined shipping, secure packaging, and refined service for sportswear manufacturing partners and direct customers alike.</p>
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
              <h2 className="section-label">What Our Sportswear Clients Say</h2>
              <p className="section-description">See why brands and business partners trust HK FITTERS for quality sportswear, activewear, and reliable service.</p>
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
              <h2 className="section-label">Stay Connected with HK FITTERS</h2>
              <p className="section-description">Get updates on new sportswear and activewear collections, product launches, and exclusive offers.</p>
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
