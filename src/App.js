import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const categories = [
    {
      title: 'Men',
      subtitle: 'Precision training layers',
      image:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Women',
      subtitle: 'Elevated movement essentials',
      image:
        'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Accessories',
      subtitle: 'Refined performance details',
      image:
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    },
  ];

  const arrivals = [
    {
      title: 'Velocity Jacket',
      price: '$240',
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Aero Leggings',
      price: '$160',
      image:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Race Gloves',
      price: '$90',
      image:
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    },
  ];

  const featuredProducts = [
    { id: 1, title: 'Velocity Jacket', category: 'Jackets', original: '$320', price: '$240', rating: 4.8, badges: ['New'], sizes: ['S','M','L','XL'], colors: ['#000000','#ffffff','#e10600'], image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'Aero Leggings', category: 'Leggings', original: '$200', price: '$160', rating: 4.6, badges: ['Sale'], sizes: ['S','M','L','XL'], colors: ['#000000','#666666','#e10600'], image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' },
    { id: 3, title: 'Signature Hoodie', category: 'Tops', original: '$220', price: '$180', rating: 4.7, badges: [], sizes: ['S','M','L','XL'], colors: ['#000000','#ffffff'], image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80' },
    { id: 4, title: 'Pro Compression Tee', category: 'T-Shirts', original: '$140', price: '$110', rating: 4.5, badges: ['Sale'], sizes: ['S','M','L','XL'], colors: ['#000000','#e10600'], image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80' },
    { id: 5, title: 'Race Gloves', category: 'Accessories', original: '$120', price: '$90', rating: 4.4, badges: ['New'], sizes: ['S','M','L'], colors: ['#000000','#e10600'], image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80' },
    { id: 6, title: 'Elite Training Set', category: 'Sets', original: '$420', price: '$320', rating: 4.9, badges: [], sizes: ['M','L','XL'], colors: ['#000000','#ffffff'], image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80' },
    { id: 7, title: 'Urban Track Shorts', category: 'Shorts', original: '$120', price: '$95', rating: 4.3, badges: [], sizes: ['S','M','L','XL'], colors: ['#000000','#666666'], image: 'https://images.unsplash.com/photo-1556909210-77e4f400ae0b?auto=format&fit=crop&w=800&q=80' },
    { id: 8, title: 'Stretch Runner', category: 'Shoes', original: '$260', price: '$210', rating: 4.6, badges: ['Sale'], sizes: ['M','L','XL'], colors: ['#000000','#e10600','#ffffff'], image: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=800&q=80' },
  ];

  const bestSellers = [
    {
      title: 'Elite Training Set',
      price: '$320',
      image:
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Signature Hoodie',
      price: '$180',
      image:
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Pro Compression Tee',
      price: '$110',
      image:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    },
  ];

  

  const whyFeatures = [
    { id: 1, title: 'Premium Quality', desc: 'Hand-selected fabrics and rigorous QA for lasting performance.' },
    { id: 2, title: 'Worldwide Shipping', desc: 'Fast, reliable delivery to over 120 countries.' },
    { id: 3, title: 'Secure Payments', desc: 'Industry-standard encryption and trusted payment partners.' },
    { id: 4, title: 'Easy Returns', desc: 'Hassle-free returns within 30 days for full refunds.' },
    { id: 5, title: '24/7 Customer Support', desc: 'Dedicated global support every day, any time.' },
    { id: 6, title: 'Performance Tested', desc: 'Proven in labs and field tests by elite athletes.' },
  ];

  const testimonials = [
    { name: 'Olivia P.', country: 'USA', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', rating: 5, text: 'Incredible fit and finish — feels like true premium sportswear.' },
    { name: 'Ethan W.', country: 'UK', photo: 'https://images.unsplash.com/photo-1545996124-1b8e6d1a3e3d?auto=format&fit=crop&w=200&q=80', rating: 5, text: 'Fast delivery to London and the materials are top tier.' },
    { name: 'Aisha K.', country: 'UAE', photo: 'https://images.unsplash.com/photo-1541233349642-6e425fe6190e?auto=format&fit=crop&w=200&q=80', rating: 5, text: 'Luxurious feel. Perfect for training and city wear.' },
    { name: 'Lukas M.', country: 'Germany', photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=80', rating: 5, text: 'Durable and performance-ready — highly recommend.' },
    { name: 'Sophie L.', country: 'Canada', photo: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=200&q=80', rating: 5, text: 'The attention to detail is phenomenal — love the pieces.' },
    { name: 'Noah J.', country: 'Australia', photo: 'https://images.unsplash.com/photo-1545996124-1b8e6d1a3e3d?auto=format&fit=crop&w=200&q=80', rating: 5, text: 'Excellent customer support and quick returns — five stars.' },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [testIndex, setTestIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1024) setSlidesToShow(3);
      else if (w >= 640) setSlidesToShow(2);
      else setSlidesToShow(1);
      setTestIndex(0);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  useEffect(() => {
    const maxIndex = Math.max(0, testimonials.length - slidesToShow);
    const id = setInterval(() => {
      setTestIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 4200);
    return () => clearInterval(id);
  }, [slidesToShow, testimonials.length]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="App">
      <header className="hero">
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
          <div className="nav-inner">
            <div className="brand logo">HK FITTERS</div>

            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>

            <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
              <a href="#home">Home</a>
              <a href="#categories">Shop</a>
              <a href="#categories">Men</a>
              <a href="#categories">Women</a>
              <a href="#categories">Accessories</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>

            <div className="nav-actions">
              <button className="icon-button" aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="icon-button" aria-label="Wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z" stroke="currentColor" strokeWidth="0" fill="currentColor"/></svg>
              </button>
              <button className="icon-button" aria-label="Cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h15l-1.5 9h-12L6 6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="20" r="1" fill="currentColor"/><circle cx="18" cy="20" r="1" fill="currentColor"/></svg>
              </button>

              <button className="btn login-btn">Login</button>
            </div>
          </div>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">International Performancewear</p>
          <h1>Train Hard. Wear HK FITTERS.</h1>
          <p className="hero-text">
            Premium sportswear for athletes, founders, and modern movers who demand comfort, precision, and style.
          </p>
          <div className="hero-actions">
            <a className="cta" href="#arrivals">Shop New Arrivals</a>
            <a className="cta secondary" href="#categories">Explore Collection</a>
          </div>
        </div>
      </header>

      <main className="page-content">
        <section id="categories" className="section">
          <div className="section-heading">
            <p className="section-label">Featured Categories</p>
            <h2>Curated for every movement.</h2>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <article className="category-card" key={category.title}>
                <div className="category-image" style={{ backgroundImage: `url(${category.image})` }} />
                <div className="card-body">
                  <h3>{category.title}</h3>
                  <p>{category.subtitle}</p>
                  <a className="category-link" href="#arrivals">Shop Now</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="featured" className="section">
          <div className="section-heading">
            <p className="section-label">Featured Products</p>
            <h2>Premium picks — curated for performance.</h2>
          </div>
          <div className="featured-grid">
            {featuredProducts.map((p) => (
              <article className="product-card" key={p.id}>
                <div className="product-media" style={{ backgroundImage: `url(${p.image})` }}>
                  <div className="badges">
                    {p.badges.map((b) => (
                      <span className={`badge ${b.toLowerCase()}`} key={b}>{b}</span>
                    ))}
                  </div>
                  <button className="wish btn-icon" aria-label="Add to wishlist">♡</button>
                  <button className="quickview btn-ghost">Quick View</button>
                </div>

                <div className="card-body">
                  <p className="product-category">{p.category}</p>
                  <h3 className="product-title">{p.title}</h3>
                  <div className="price-row">
                    <span className="price-new">{p.price}</span>
                    <span className="price-old">{p.original}</span>
                  </div>
                  <div className="rating">{Array.from({length:5}).map((_,i)=> (
                    <span key={i} className={i < Math.round(p.rating) ? 'star filled' : 'star'}>★</span>
                  ))}<span className="rating-value">{p.rating}</span></div>

                  <div className="product-meta">
                    <div className="sizes">
                      {p.sizes.map(s => <span key={s} className="size">{s}</span>)}
                    </div>
                    <div className="colors">
                      {p.colors.map((c, idx) => <button key={idx} className="color-swatch" style={{ background: c }} aria-label={`Color ${idx+1}`} />)}
                    </div>
                  </div>

                  <div className="product-actions">
                    <button className="btn add">Add to Cart</button>
                    <button className="btn ghost">Wishlist</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="arrivals" className="section section-dark">
          <div className="section-heading">
            <p className="section-label">New Arrivals</p>
            <h2>Fresh drops built for momentum.</h2>
          </div>
          <div className="product-grid">
            {arrivals.map((item) => (
              <article className="product-card" key={item.title}>
                <div className="product-image" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p>{item.price}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="section-label">Best Sellers</p>
            <h2>Trusted by elite performers.</h2>
          </div>
          <div className="product-grid">
            {bestSellers.map((item) => (
              <article className="product-card" key={item.title}>
                <div className="product-image" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p>{item.price}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-accent why-section">
          <div className="section-heading">
            <p className="section-label">Why Choose HK FITTERS</p>
            <h2>Luxury performance, without compromise.</h2>
          </div>
          <div className="why-grid">
            {whyFeatures.map((f) => (
              <div className="why-card" key={f.id}>
                <div className="why-icon" aria-hidden>
                  {f.id === 1 && (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3 6 6 .5-4.5 3 1.5 6L12 15l-6 3 1.5-6L3 8.5 9 8 12 2z" fill="#E10600"/></svg>
                  )}
                  {f.id === 2 && (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 4v2h3v2h-3v6h-2v-6H8V8h3V6h2z" fill="#E10600"/></svg>
                  )}
                  {f.id === 3 && (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="11" width="16" height="9" rx="2" stroke="#E10600" strokeWidth="1.5" fill="none"/><path d="M7 11V8a5 5 0 0110 0v3" stroke="#E10600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                  {f.id === 4 && (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 10v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" stroke="#E10600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 10V7a4 4 0 10-8 0v3" stroke="#E10600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                  {f.id === 5 && (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92V21l-4.1-1.1a10 10 0 01-6.9-6.9L10 9" stroke="#E10600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 10a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#E10600" strokeWidth="1.2"/></svg>
                  )}
                  {f.id === 6 && (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12l2-2 4 4 8-8 4 4v6H3z" fill="#E10600"/></svg>
                  )}
                </div>

                <div className="why-body">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="reviews" className="section reviews-section">
          <div className="section-heading">
            <p className="section-label">Customer Reviews</p>
            <h2>Trusted worldwide — real stories.</h2>
          </div>

          <div className="reviews-slider">
            <button className="arrow prev" onClick={() => setTestIndex((i) => Math.max(0, i - 1))} aria-label="Previous">‹</button>
            <div className="review-viewport">
              <div className="review-track" style={{ transform: `translateX(-${testIndex * (100 / slidesToShow)}%)` }}>
                {testimonials.map((t, idx) => (
                  <div className="review-slide" style={{ minWidth: `${100 / slidesToShow}%` }} key={t.name + idx}>
                    <div className="testimonial-card">
                      <div className="testimonial-top">
                        <img className="avatar" src={t.photo} alt={t.name} />
                        <div className="review-meta">
                          <strong className="customer-name">{t.name}</strong>
                          <span className="customer-country">{t.country}</span>
                          <div className="stars">{Array.from({ length: 5 }).map((_, i) => (<span key={i} className="star">★</span>))}</div>
                        </div>
                      </div>
                      <p className="testimonial-text">“{t.text}”</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="arrow next" onClick={() => setTestIndex((i) => Math.min(testimonials.length - slidesToShow, i + 1))} aria-label="Next">›</button>

            <div className="dots">
              {Array.from({ length: Math.max(1, testimonials.length - slidesToShow + 1) }).map((_, i) => (
                <button key={i} className={`dot ${i === testIndex ? 'active' : ''}`} onClick={() => setTestIndex(i)} aria-label={`Go to slide ${i + 1}`} />
              ))}
            </div>
          </div>
        </section>

        <section className="section newsletter-section">
          <div className="newsletter-card">
            <div className="newsletter-copy">
              <p className="section-label">Newsletter</p>
              <h2 className="newsletter-title">Be first to know — exclusive drops & offers</h2>
              <p className="newsletter-desc">Join the HK FITTERS circle for access to limited releases, early drops, and member-only perks.</p>
            </div>

            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <label className="input-wrap">
                <input type="email" placeholder="Enter your email" aria-label="Email address" required />
                <span className="input-underline" />
              </label>
              <button type="submit" className="btn subscribe">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>HK FITTERS</h3>
            <p>Premium sportswear for modern performance culture.</p>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><a href="#categories">Men</a></li>
              <li><a href="#categories">Women</a></li>
              <li><a href="#categories">Accessories</a></li>
              <li><a href="#arrivals">New Arrivals</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#shipping">Shipping</a></li>
              <li><a href="#returns">Returns</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms &amp; Conditions</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-social">
          <div className="social-links">
            <a href="#instagram">Instagram</a>
            <a href="#facebook">Facebook</a>
            <a href="#tiktok">TikTok</a>
            <a href="#youtube">YouTube</a>
            <a href="#linkedin">LinkedIn</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 HK FITTERS. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
