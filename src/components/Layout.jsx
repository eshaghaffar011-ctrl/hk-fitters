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

          <Link
  to="/track"
  className="top-header-track"
  onClick={() => setMobileMenuOpen(false)}
>
  Order Tracking
</Link>
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
                  e.currentTarget.style.background = '#a50803';
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
        background: '#000000',
      }}
    >
      <img
        src="/logo/hk-logo-256.png"
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
  <Link to="/" onClick={() => setMobileMenuOpen(false)}>
    Home
  </Link>

  <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>
    Products
  </Link>

  <Link to="/shop?category=Men" onClick={() => setMobileMenuOpen(false)}>
    Men's
  </Link>

  <Link to="/shop?category=Women" onClick={() => setMobileMenuOpen(false)}>
    Women's
  </Link>

  <Link to="/shop?category=Kids" onClick={() => setMobileMenuOpen(false)}>
    Kids'
  </Link>

  <Link to="/shop?category=Accessories" onClick={() => setMobileMenuOpen(false)}>
    Accessories
  </Link>

  <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
    About
  </Link>
</nav>

        <div className="top-actions">
          <Link
  to="/contact"
  className="quote-nav-btn"
  onClick={() => setMobileMenuOpen(false)}
>
  Request a Quote
</Link>
          <Link to="/shop" className="icon-btn" aria-label="Search products" onClick={() => setMobileMenuOpen(false)}>🔍</Link>
          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist" onClick={() => setMobileMenuOpen(false)}>♡ {wishlistItems.length}</Link>
          <Link to="/cart" className="icon-btn" aria-label="Shopping Cart" onClick={() => setMobileMenuOpen(false)}>🛒 {cartCount}</Link>
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
    background: '#0b0b0b',
    color: '#ffffff',
    padding: '52px 20px 22px',
    borderTop: '1px solid rgba(165, 8, 3, 0.35)',
  }}
>
  <style>{`
    .footer-main-grid {
      display: grid;
      grid-template-columns: 1.35fr 0.85fr 1fr 1fr 1.15fr;
      gap: 42px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .footer-column {
      display: grid;
      align-content: start;
      gap: 10px;
    }

    .footer-heading {
      position: relative;
      margin: 0 0 8px;
      padding-bottom: 10px;
      color: #ffffff;
      font-size: 0.92rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .footer-heading::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 30px;
      height: 2px;
      background: #a50803;
      border-radius: 2px;
    }

    .footer-link {
      width: fit-content;
      color: rgba(255,255,255,0.72);
      text-decoration: none;
      font-size: 0.88rem;
      line-height: 1.55;
      transition: color 0.2s ease, transform 0.2s ease;
    }

    .footer-link:hover {
      color: #ffffff;
      transform: translateX(3px);
    }

    .footer-company-text {
      max-width: 310px;
      margin: 0;
      color: rgba(255,255,255,0.68);
      font-size: 0.9rem;
      line-height: 1.7;
    }

    .footer-contact-item {
      color: rgba(255,255,255,0.72);
      font-size: 0.86rem;
      line-height: 1.55;
      word-break: break-word;
    }

    .footer-contact-link {
      color: rgba(255,255,255,0.72);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .footer-contact-link:hover {
      color: #ffffff;
    }

    .footer-socials {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 5px;
    }

    .footer-social {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
      color: #ffffff;
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 800;
      transition:
        transform 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease;
    }

    .footer-social:hover {
      transform: translateY(-2px);
      background: #a50803;
      border-color: #a50803;
    }

    .footer-bottom {
      max-width: 1400px;
      margin: 38px auto 0;
      padding-top: 18px;
      border-top: 1px solid rgba(255,255,255,0.09);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;
    }

    .footer-bottom-text {
      display: grid;
      gap: 4px;
    }

    .footer-bottom-text p {
      margin: 0;
      color: rgba(255,255,255,0.55);
      font-size: 0.78rem;
      line-height: 1.5;
    }

    .footer-top-button {
      border: 1px solid rgba(255,255,255,0.16);
      background: transparent;
      color: #ffffff;
      border-radius: 999px;
      padding: 9px 16px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 700;
      transition:
        transform 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease;
    }

    .footer-top-button:hover {
      transform: translateY(-2px);
      background: #a50803;
      border-color: #a50803;
    }

    @media (max-width: 1100px) {
      .footer-main-grid {
        grid-template-columns: 1.3fr 1fr 1fr;
        gap: 34px 28px;
      }
    }

    @media (max-width: 700px) {
      .footer-main-grid {
        grid-template-columns: 1fr 1fr;
        gap: 32px 22px;
      }

      .footer-company {
        grid-column: 1 / -1;
      }

      .footer-bottom {
        align-items: flex-start;
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .footer-main-grid {
        grid-template-columns: 1fr;
      }

      .footer-company {
        grid-column: auto;
      }

      .footer {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
    }
  `}</style>

  <div className="footer-main-grid">

    {/* Company */}
    <div className="footer-column footer-company">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '2px',
        }}
      >
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#000000',
            flexShrink: 0,
          }}
        >
          <img
            src="/logo/hk-logo-256.png"
            alt="HK FITTERS Sportswear Manufacturer Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        <div>
          <h3
            style={{
              margin: 0,
              color: '#ffffff',
              fontSize: '1.15rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
            }}
          >
            {companyName}
          </h3>

          <span
            style={{
              color: '#a50803',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Sportswear Manufacturer & Exporter
          </span>
        </div>
      </div>

      <p className="footer-company-text">
        Custom sportswear manufacturing and worldwide export for brands,
        wholesalers, retailers, teams, and bulk buyers.
      </p>

      <p className="footer-company-text">
        OEM manufacturing, private label sportswear, custom designs, and
        reliable bulk production from Pakistan.
      </p>
    </div>

    {/* Quick Links */}
    <div className="footer-column">
      <h4 className="footer-heading">Quick Links</h4>

      <Link className="footer-link" to="/">
        Home
      </Link>

      <Link className="footer-link" to="/shop">
        Sportswear Products
      </Link>

      <Link className="footer-link" to="/about">
        About HK FITTERS
      </Link>

      <Link className="footer-link" to="/contact">
        Request a Quote
      </Link>

      <Link className="footer-link" to="/track">
        Order Tracking
      </Link>

      <Link className="footer-link" to="/faq">
        FAQ
      </Link>
    </div>

    {/* Categories */}
    <div className="footer-column">
      <h4 className="footer-heading">Product Categories</h4>

      <Link className="footer-link" to="/shop?category=Men">
        Men's Sportswear
      </Link>

      <Link className="footer-link" to="/shop?category=Women">
        Women's Activewear
      </Link>

      <Link className="footer-link" to="/shop?category=Kids">
        Kids' Sportswear
      </Link>

      <Link className="footer-link" to="/shop?category=Accessories">
        Sportswear Accessories
      </Link>

      <Link className="footer-link" to="/shop">
        Custom Sportswear
      </Link>
    </div>

    {/* Manufacturing */}
    <div className="footer-column">
      <h4 className="footer-heading">Manufacturing</h4>

      <Link className="footer-link" to="/contact">
        Custom Sportswear
      </Link>

      <Link className="footer-link" to="/contact">
        OEM Manufacturing
      </Link>

      <Link className="footer-link" to="/contact">
        Private Label
      </Link>

      <Link className="footer-link" to="/contact">
        Bulk Orders
      </Link>

      <Link className="footer-link" to="/contact">
        Worldwide Export
      </Link>
    </div>

    {/* Contact */}
    <div className="footer-column">
      <h4 className="footer-heading">Contact & Export</h4>

      <a
        className="footer-contact-link footer-contact-item"
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp: {whatsappNumber}
      </a>

      <a
        className="footer-contact-link footer-contact-item"
        href={`mailto:${businessEmail}`}
      >
        {businessEmail}
      </a>

      <span className="footer-contact-item">
        {businessAddress}
      </span>

      <span className="footer-contact-item">
        {businessHours}
      </span>

      <div className="footer-socials">
        {socialLinks.map((item) => (
          <a
            key={item.label}
            className="footer-social"
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            title={item.label}
          >
            {item.icon}
          </a>
        ))}
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    <div className="footer-bottom-text">
      <p>© 2026 HK FITTERS. All Rights Reserved.</p>
      <p>
        Custom Sportswear Manufacturer • OEM • Private Label • Worldwide Export
      </p>
    </div>

    <button
      type="button"
      className="footer-top-button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      Back to Top ↑
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
