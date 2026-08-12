import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import contactInfo from '../config/contact';

function Layout({ children }) {
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems, wishlistItems } = useCartWishlist();
  const cartCount = cartItems.reduce((total, item) => total + Math.max(Number(item.quantity) || 1, 1), 0);
  const {
    companyName,
    whatsappNumber,
    whatsappMessage,
    businessEmail,
    businessAddress,
    businessHours,
    facebook,
    instagram,
  } = contactInfo;
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  const socialLinks = [
    { label: 'Facebook', href: facebook, icon: 'f' },
    { label: 'Instagram', href: instagram, icon: '◎' },

  ];

  const categoryLinks = [
    { label: 'Men', path: '/shop?category=Men' },
    { label: 'Women', path: '/shop?category=Women' },
    { label: 'Accessories', path: '/shop?category=Accessories' },
    { label: 'Kids', path: '/shop?category=Kids' },
  ];

  return (
    <div className="app-shell">
      <style>{`
        @media (max-width: 760px) {
          .top-header-hours,
          .top-header-social {
            display: none !important;
          }
        }
.icon-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  vertical-align: middle !important;
  line-height: 1.2 !important;
  box-sizing: border-box !important;
  width: auto !important;
  min-width: 0 !important;
  height: auto !important;
  min-height: 38px !important;
  padding: 8px 12px !important;
  white-space: nowrap !important;
  border-radius: 999px !important;
  flex-shrink: 0 !important;
}

.top-actions {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  flex-wrap: wrap !important;
}

      `}</style>
      <div
        style={{
          background: '#111111',
          color: '#ffffff',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          fontSize: '0.70rem',
          padding: '8px 16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap',
            margin: '0 auto',
            maxWidth: '1400px',
          }}
        >
          <div
            className="top-header-info"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ width: '14px', height: '14px', fill: 'currentColor' }}
              >
                <path d="M20.52 3.48A11.76 11.76 0 0 0 12.15 1C6.35 1 1.66 5.7 1.66 11.5c0 2.03.53 4.02 1.53 5.78L1.5 23l5.91-1.55a10.46 10.46 0 0 0 5.06 1.24h.01c5.8 0 10.49-4.69 10.49-10.49 0-2.8-1.09-5.42-3.06-7.39Zm-8.37 16.1c-1.63 0-3.24-.44-4.67-1.28l-.34-.19-3.5.92 1-3.4-.22-.35a8.4 8.4 0 0 1-1.29-4.45c0-4.66 3.79-8.45 8.45-8.45 2.26 0 4.38.88 5.98 2.47a8.42 8.42 0 0 1 2.48 5.98c0 4.66-3.79 8.45-8.45 8.45Zm4.64-6.34c-.25-.12-1.49-.73-1.72-.81-.23-.08-.4-.12-.57.12-.17.24-.66.81-.81 1-.15.17-.3.2-.55.07-.25-.12-1.05-.39-2-1.25-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.52.11-.11.25-.3.37-.45.12-.15.17-.26.25-.43.08-.17.04-.32-.02-.45-.06-.12-.57-1.38-.78-1.88-.2-.5-.41-.43-.57-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43.1 3.37.1.15.75 1.21 1.89 1.91 1.14.7 2.07.82 2.69.84.71.02 1.3-.15 1.5-.28.2-.13.52-.52.63-1.02.11-.5.11-.92.08-1.02-.03-.1-.1-.16-.24-.29Z" />
              </svg>
              <span>{whatsappNumber}</span>
            </a>

            <a
              href={`mailto:${businessEmail}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ width: '14px', height: '14px', fill: 'currentColor' }}
              >
                <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.18.96L12 12.72l7.82-5.26a1 1 0 0 0-.82-1.77H4.5a1 1 0 0 0-.32.04Zm15.32 1.9-6.48 4.36a1.5 1.5 0 0 1-1.64 0L4.5 9.36v8.14a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V9.36Z" />
              </svg>
              <span>{businessEmail}</span>
            </a>

            <span className="top-header-hours" style={{ opacity: 0.85 }}>{businessHours}</span>
          </div>

          <div
            className="top-header-social"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                title={item.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#111111',
                  textDecoration: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  transition: 'transform 0.2s ease, background 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.08)';
                  e.currentTarget.style.background = '#b80c0c';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#111111';
                }}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <header className="topbar">
  <Link
    to="/"
    className="brand-mark"
    onClick={() => setMobileMenuOpen(false)}
  >
    <span
      className="brand-icon"
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: '#ffffff',
      }}
    >
      <img
        src="/logo/hk-logo.jpeg"
        alt="HK FITTERS Logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </span>

    <span>HK FITTERS</span>
  </Link>

        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMobileMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`topnav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
          {categoryLinks.map((category) => (
            <Link
              key={category.label}
              to={category.path}
              onClick={() => setMobileMenuOpen(false)}
            >
              {category.label}
            </Link>
          ))}
          <Link to="/track" onClick={() => setMobileMenuOpen(false)}>Track</Link>
          <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
        </nav>

        <div className="top-actions">
          <Link to="/shop" className="icon-btn" aria-label="Search products" onClick={() => setMobileMenuOpen(false)}>🔍</Link>
          <Link to="/wishlist" className="icon-btn" onClick={() => setMobileMenuOpen(false)}>♡ {wishlistItems.length}</Link>
          <Link to="/cart" className="icon-btn" onClick={() => setMobileMenuOpen(false)}>🛒 {cartCount}</Link>
          {user ? (
            <>
             <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  }}
>
  <Link
    to="/profile"
    className="icon-btn"
    onClick={() => setMobileMenuOpen(false)}
    style={{
      width: 'auto',
      maxWidth: '130px',
      padding: '8px 10px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      borderRadius: '999px',
      flexShrink: 1,
    }}
  >
    👤 {user.email.split('@')[0]}
  </Link>

  <button
    type="button"
    className="icon-btn"
    onClick={logout}
    style={{
      width: 'auto',
      padding: '8px 10px',
      whiteSpace: 'nowrap',
      borderRadius: '999px',
      flexShrink: 0,
    }}
  >
    Logout
  </button>
</div>
            </>
          ) : (
            <>
              <Link
  to="/login"
  className="icon-btn"
  onClick={() => setMobileMenuOpen(false)}
  style={{
    width: 'auto',
    minWidth: '70px',
    padding: '8px 14px',
    whiteSpace: 'nowrap',
    borderRadius: '999px',
  }}
>
  Login
</Link>

<Link
  to="/register"
  className="icon-btn"
  onClick={() => setMobileMenuOpen(false)}
  style={{
    width: 'auto',
    minWidth: '90px',
    padding: '8px 14px',
    whiteSpace: 'nowrap',
    borderRadius: '999px',
  }}
>
  Register
</Link>
            </>
          )}
        </div>
      </header>

      <main>{children}</main>

      <footer
        className="footer"
        style={{
          background: '#111111',
          color: '#ffffff',
          padding: '32px 16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <style>{`
          @media (max-width: 900px) {
            .footer-export-grid {
              grid-template-columns: 1fr 1fr !important;
            }
          }

          @media (max-width: 640px) {
            .footer-export-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        <div
          className="footer-export-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.9fr 0.9fr 1fr 1fr',
            gap: '18px',
            maxWidth: '1400px',
            margin: '0 auto 18px',
          }}
        >
          <div style={{ display: 'grid', gap: '10px' }}>
            <h3 style={{ margin: 0, color: '#ffffff' }}>{companyName}</h3>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>
              Designed for global sportswear export with premium quality, reliable service, and polished international support.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            <h4 style={{ margin: 0, color: '#ffffff' }}>Quick Links</h4>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Home</Link>
            <Link to="/shop" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Shop</Link>
            <Link to="/about" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>About</Link>
            <Link to="/contact" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Contact</Link>
            <Link to="/faq" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>FAQ</Link>
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            <h4 style={{ margin: 0, color: '#ffffff' }}>Product Categories</h4>
            <Link to="/shop?category=Men" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Men</Link>
            <Link to="/shop?category=Women" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Women</Link>
            <Link to="/shop?category=Accessories" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Accessories</Link>
            <Link to="/shop?category=Kids" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Kids</Link>
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            <h4 style={{ margin: 0, color: '#ffffff' }}>Export Services</h4>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>OEM Manufacturing</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Private Label</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Bulk Orders</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Worldwide Shipping</span>
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            <h4 style={{ margin: 0, color: '#ffffff' }}>Contact</h4>
            <a href={whatsappHref} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>WhatsApp: {whatsappNumber}</a>
            <a href={`mailto:${businessEmail}`} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{businessEmail}</a>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{businessAddress}</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{businessHours}</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    color: '#111111',
                    textDecoration: 'none',
                    fontWeight: 700,
                    transition: 'transform 0.2s ease, background 0.2s ease, color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.08)';
                    e.currentTarget.style.background = '#b80c0c';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#111111';
                  }}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'grid', gap: '4px' }}>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)' }}>© 2026 HK FITTERS. All Rights Reserved.</p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)' }}>Designed for Global Sportswear Export.</p>
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              background: '#ffffff',
              color: '#111111',
              borderRadius: '999px',
              padding: '8px 14px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, background 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.background = '#b80c0c';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#111111';
            }}
          >
            Back to Top
          </button>
        </div>
      </footer>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        onMouseEnter={() => setIsWhatsAppHovered(true)}
        onMouseLeave={() => setIsWhatsAppHovered(false)}
        style={{
          position: 'fixed',
          right: 'clamp(14px, 2vw, 24px)',
          bottom: 'clamp(14px, 2vw, 24px)',
          width: 'clamp(54px, 6vw, 62px)',
          height: 'clamp(54px, 6vw, 62px)',
          borderRadius: '50%',
          background: '#25D366',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isWhatsAppHovered
            ? '0 14px 28px rgba(0, 0, 0, 0.34)'
            : '0 10px 24px rgba(0, 0, 0, 0.28)',
          transform: isWhatsAppHovered ? 'translateY(-2px) scale(1.06)' : 'translateY(0) scale(1)',
          zIndex: 9999,
          transition: 'transform 0.25s ease, boxShadow 0.25s ease',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ width: '28px', height: '28px', fill: 'currentColor' }}
        >
          <path d="M20.52 3.48A11.76 11.76 0 0 0 12.15 1C6.35 1 1.66 5.7 1.66 11.5c0 2.03.53 4.02 1.53 5.78L1.5 23l5.91-1.55a10.46 10.46 0 0 0 5.06 1.24h.01c5.8 0 10.49-4.69 10.49-10.49 0-2.8-1.09-5.42-3.06-7.39Zm-8.37 16.1c-1.63 0-3.24-.44-4.67-1.28l-.34-.19-3.5.92 1-3.4-.22-.35a8.4 8.4 0 0 1-1.29-4.45c0-4.66 3.79-8.45 8.45-8.45 2.26 0 4.38.88 5.98 2.47a8.42 8.42 0 0 1 2.48 5.98c0 4.66-3.79 8.45-8.45 8.45Zm4.64-6.34c-.25-.12-1.49-.73-1.72-.81-.23-.08-.4-.12-.57.12-.17.24-.66.81-.81 1-.15.17-.3.2-.55.07-.25-.12-1.05-.39-2-1.25-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.52.11-.11.25-.3.37-.45.12-.15.17-.26.25-.43.08-.17.04-.32-.02-.45-.06-.12-.57-1.38-.78-1.88-.2-.5-.41-.43-.57-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43.1 3.37.1.15.75 1.21 1.89 1.91 1.14.7 2.07.82 2.69.84.71.02 1.3-.15 1.5-.28.2-.13.52-.52.63-1.02.11-.5.11-.92.08-1.02-.03-.1-.1-.16-.24-.29Z" />
        </svg>
      </a>
    </div>
  );
}

export default Layout;
