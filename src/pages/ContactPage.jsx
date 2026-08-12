import { useMemo, useState } from 'react';
import contactInfo from '../config/contact';

function ContactPage() {
  const {
    companyName,
    whatsappNumber,
    businessEmail,
    businessAddress,
    businessHours,
    facebook,
    instagram,
    linkedin,
  } = contactInfo;

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    country: '',
    email: '',
    phone: '',
    productInterestedIn: '',
    estimatedOrderQuantity: '',
    message: '',
  });
  const [formMessage, setFormMessage] = useState('');

  const whatsappHref = useMemo(() => {
    const message = [
      `Hello ${companyName},`,
      '',
      'I am interested in your products.',
      'Please share your catalogue and export details.',
    ].join('\n');

    return `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  }, [companyName, whatsappNumber]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const requiredFields = [
      formData.fullName,
      formData.companyName,
      formData.country,
      formData.email,
      formData.phone,
      formData.productInterestedIn,
      formData.estimatedOrderQuantity,
      formData.message,
    ];

    const hasEmptyField = requiredFields.some((value) => !value.trim());

    if (hasEmptyField) {
      setFormMessage('Please complete all fields before sending your inquiry.');
      return;
    }

    setFormMessage('Your inquiry request has been prepared successfully. We will review your details shortly.');
    setFormData({
      fullName: '',
      companyName: '',
      country: '',
      email: '',
      phone: '',
      productInterestedIn: '',
      estimatedOrderQuantity: '',
      message: '',
    });
  };

  const socialLinks = [
    { label: 'Facebook', href: facebook, icon: 'f' },
    { label: 'Instagram', href: instagram, icon: '◎' },
    { label: 'LinkedIn', href: linkedin, icon: 'in' },
  ];

  const benefits = [
    'Fast Response',
    'Worldwide Export',
    'OEM & Private Label',
    'Bulk Orders',
    'Professional Support',
  ];

  return (
    <div className="page">
      <style>{`
        @media (max-width: 900px) {
          .contact-layout {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .contact-contact-grid,
          .contact-grid-two,
          .contact-benefits-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <section className="section">
        <div style={{ display: 'grid', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '6px' }}>Export Business Inquiry</p>
              <h1 style={{ margin: 0 }}>Contact {companyName}</h1>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
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
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '16px', height: '16px', fill: 'currentColor' }}>
                <path d="M20.52 3.48A11.76 11.76 0 0 0 12.15 1C6.35 1 1.66 5.7 1.66 11.5c0 2.03.53 4.02 1.53 5.78L1.5 23l5.91-1.55a10.46 10.46 0 0 0 5.06 1.24h.01c5.8 0 10.49-4.69 10.49-10.49 0-2.8-1.09-5.42-3.06-7.39Zm-8.37 16.1c-1.63 0-3.24-.44-4.67-1.28l-.34-.19-3.5.92 1-3.4-.22-.35a8.4 8.4 0 0 1-1.29-4.45c0-4.66 3.79-8.45 8.45-8.45 2.26 0 4.38.88 5.98 2.47a8.42 8.42 0 0 1 2.48 5.98c0 4.66-3.79 8.45-8.45 8.45Zm4.64-6.34c-.25-.12-1.49-.73-1.72-.81-.23-.08-.4-.12-.57.12-.17.24-.66.81-.81 1-.15.17-.3.2-.55.07-.25-.12-1.05-.39-2-1.25-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.52.11-.11.25-.3.37-.45.12-.15.17-.26.25-.43.08-.17.04-.32-.02-.45-.06-.12-.57-1.38-.78-1.88-.2-.5-.41-.43-.57-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43.1 3.37.1.15.75 1.21 1.89 1.91 1.14.7 2.07.82 2.69.84.71.02 1.3-.15 1.5-.28.2-.13.52-.52.63-1.02.11-.5.11-.92.08-1.02-.03-.1-.1-.16-.24-.29Z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '18px' }}>
            <div className="summary-card" style={{ display: 'grid', gap: '14px', padding: '18px' }}>
              <div className="contact-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '12px' }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 700 }}>WhatsApp</p>
                  <p style={{ margin: 0 }}>{whatsappNumber}</p>
                </div>
                <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '12px' }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 700 }}>Business Email</p>
                  <p style={{ margin: 0 }}>{businessEmail}</p>
                </div>
                <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '12px' }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 700 }}>Business Address</p>
                  <p style={{ margin: 0 }}>{businessAddress}</p>
                </div>
                <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '12px' }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 700 }}>Business Hours</p>
                  <p style={{ margin: 0 }}>{businessHours}</p>
                </div>
              </div>

              <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', background: '#f8f8f8' }}>
                <p style={{ margin: '0 0 8px', fontWeight: 700 }}>Google Maps Placeholder</p>
                <div style={{ height: '220px', borderRadius: '10px', background: 'linear-gradient(135deg, #111111, #b80c0c)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '16px' }}>
                  Map Preview Placeholder for {companyName}
                </div>
              </div>

              <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px' }}>
                <p style={{ margin: '0 0 8px', fontWeight: 700 }}>Social Media</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#111111',
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontWeight: 700,
                        transition: 'transform 0.2s ease, background 0.2s ease, color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                        e.currentTarget.style.background = '#b80c0c';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.background = '#111111';
                      }}
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="summary-card" style={{ padding: '18px' }}>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
                <div className="contact-grid-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label style={{ display: 'grid', gap: '6px' }}>
                    <span>Full Name</span>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} required style={{ padding: '10px 12px' }} />
                  </label>
                  <label style={{ display: 'grid', gap: '6px' }}>
                    <span>Company Name</span>
                    <input name="companyName" value={formData.companyName} onChange={handleChange} required style={{ padding: '10px 12px' }} />
                  </label>
                  <label style={{ display: 'grid', gap: '6px' }}>
                    <span>Country</span>
                    <input name="country" value={formData.country} onChange={handleChange} required style={{ padding: '10px 12px' }} />
                  </label>
                  <label style={{ display: 'grid', gap: '6px' }}>
                    <span>Email</span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ padding: '10px 12px' }} />
                  </label>
                  <label style={{ display: 'grid', gap: '6px' }}>
                    <span>Phone / WhatsApp</span>
                    <input name="phone" value={formData.phone} onChange={handleChange} required style={{ padding: '10px 12px' }} />
                  </label>
                  <label style={{ display: 'grid', gap: '6px' }}>
                    <span>Product Interested In</span>
                    <input name="productInterestedIn" value={formData.productInterestedIn} onChange={handleChange} required style={{ padding: '10px 12px' }} />
                  </label>
                  <label style={{ display: 'grid', gap: '6px' }}>
                    <span>Estimated Order Quantity</span>
                    <input name="estimatedOrderQuantity" value={formData.estimatedOrderQuantity} onChange={handleChange} required style={{ padding: '10px 12px' }} />
                  </label>
                </div>

                <label style={{ display: 'grid', gap: '6px' }}>
                  <span>Message</span>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required style={{ padding: '10px 12px', resize: 'vertical' }} />
                </label>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Send Inquiry
                </button>

                {formMessage && (
                  <div
                    style={{
                      borderRadius: '10px',
                      background: formMessage.includes('Please complete') ? '#fff3f3' : '#f2fff4',
                      color: '#111111',
                      padding: '10px 12px',
                    }}
                  >
                    {formMessage}
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="summary-card" style={{ padding: '18px' }}>
            <h2 style={{ marginTop: 0 }}>Why Contact {companyName}?</h2>
            <div className="contact-benefits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '12px' }}>
              {benefits.map((item) => (
                <div key={item} style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '14px', textAlign: 'center', background: '#fafafa' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
