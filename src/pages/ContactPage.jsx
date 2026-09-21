import { useMemo, useState } from 'react';
import contactInfo from '../config/contact';
import './ContactPage.css';

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
      'I am interested in your sportswear manufacturing services.',
      '',
      'Please share your product catalogue, MOQ, pricing and export details.',
    ].join('\n');

    return `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  }, [companyName, whatsappNumber]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
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

    const hasEmptyField = requiredFields.some(
      (value) => !value.trim()
    );

    if (hasEmptyField) {
      setFormMessage(
        'Please complete all fields before sending your inquiry.'
      );
      return;
    }

    setFormMessage(
      'Your inquiry request has been prepared successfully. We will review your details shortly.'
    );

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
    {
      label: 'Facebook',
      href: facebook,
      icon: 'f',
    },
    {
      label: 'Instagram',
      href: instagram,
      icon: '◎',
    },
    {
      label: 'LinkedIn',
      href: linkedin,
      icon: 'in',
    },
  ];

  const benefits = [
    {
      number: '01',
      title: 'Custom Manufacturing',
      text: 'Custom sportswear production based on your designs, specifications and branding requirements.',
    },
    {
      number: '02',
      title: 'OEM & Private Label',
      text: 'Build your own sportswear collection with OEM and private label manufacturing support.',
    },
    {
      number: '03',
      title: 'Bulk Orders',
      text: 'Production support for wholesalers, retailers, sportswear brands and international buyers.',
    },
    {
      number: '04',
      title: 'Worldwide Export',
      text: 'Professional export support for international customers and bulk sportswear shipments.',
    },
  ];

  return (
    <main className="contact-page">

      {/* HERO */}
      <section
  className="contact-hero"
  style={{
    backgroundImage: `
      linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.88) 45%,
        rgba(0, 0, 0, 0.55) 100%
      ),
      url("/logo/s-hero.png")
    `,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }}
>
        <div className="contact-hero-overlay" />

        <div className="contact-container contact-hero-inner">
          <div className="contact-hero-content">
            <span className="contact-eyebrow">
              GLOBAL SPORTSWEAR MANUFACTURING
            </span>

            <h1>
              Let's Build Your
              <span> Sportswear Collection</span>
            </h1>

            <p>
              Contact {companyName} for custom sportswear manufacturing,
              OEM, private label, bulk orders and worldwide export
              solutions.
            </p>

            <div className="contact-hero-actions">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="contact-btn contact-btn-primary"
              >
                Chat on WhatsApp
              </a>

              <a
                href="#request-quote"
                className="contact-btn contact-btn-outline"
              >
                Request a Quote
              </a>
            </div>
          </div>

          <div className="contact-hero-card">
            <span>BUSINESS INQUIRIES</span>
            <strong>OEM • PRIVATE LABEL • BULK</strong>
            <p>
              Tell us what you need and our team can discuss your
              product requirements, quantities and export needs.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="contact-info-section">
        <div className="contact-container">

          <div className="contact-section-heading">
            <span className="contact-eyebrow-dark">
              GET IN TOUCH
            </span>

            <h2>Connect With Our Export Team</h2>

            <p>
              Whether you are launching a new sportswear brand,
              sourcing for wholesale or developing a private label
              collection, send us your requirements.
            </p>
          </div>

          <div className="contact-info-grid">

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="contact-info-card"
            >
              <span className="contact-info-icon">WA</span>
              <span className="contact-info-label">WhatsApp</span>
              <strong>{whatsappNumber}</strong>
              <small>Direct business inquiry</small>
            </a>

            <a
              href={`mailto:${businessEmail}`}
              className="contact-info-card"
            >
              <span className="contact-info-icon">@</span>
              <span className="contact-info-label">Business Email</span>
              <strong>{businessEmail}</strong>
              <small>Send your requirements</small>
            </a>

            <div className="contact-info-card">
              <span className="contact-info-icon">LOC</span>
              <span className="contact-info-label">Business Address</span>
              <strong>{businessAddress}</strong>
              <small>Manufacturing & export location</small>
            </div>

            <div className="contact-info-card">
              <span className="contact-info-icon">TIME</span>
              <span className="contact-info-label">Business Hours</span>
              <strong>{businessHours}</strong>
              <small>International customer support</small>
            </div>

          </div>
        </div>
      </section>

      {/* REQUEST QUOTE */}
      <section
        className="contact-quote-section"
        id="request-quote"
      >
        <div className="contact-container contact-quote-grid">

          <div className="contact-quote-intro">
            <span className="contact-eyebrow-dark">
              REQUEST A QUOTE
            </span>

            <h2>
              Tell Us About
              <span> Your Project</span>
            </h2>

            <p>
              Share your product requirements with our team. Include
              your target quantity, product type and country so we
              can better understand your project.
            </p>

            <div className="contact-process-list">

              <div>
                <span>01</span>
                <div>
                  <strong>Send Requirements</strong>
                  <p>
                    Tell us about your products, quantities and
                    specifications.
                  </p>
                </div>
              </div>

              <div>
                <span>02</span>
                <div>
                  <strong>Discuss Production</strong>
                  <p>
                    We review your requirements and discuss
                    manufacturing options.
                  </p>
                </div>
              </div>

              <div>
                <span>03</span>
                <div>
                  <strong>Move Toward Production</strong>
                  <p>
                    Finalize product details, pricing and production
                    requirements.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="contact-form-card">

            <div className="contact-form-header">
              <span>BUSINESS INQUIRY FORM</span>
              <h3>Request a Custom Quote</h3>
              <p>
                Please provide accurate information so we can
                understand your requirements.
              </p>
            </div>

            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >

              <div className="contact-form-row">

                <label>
                  <span>Full Name</span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label>
                  <span>Company Name</span>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your company"
                    required
                  />
                </label>

              </div>

              <div className="contact-form-row">

                <label>
                  <span>Country</span>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    required
                  />
                </label>

                <label>
                  <span>Email Address</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                  />
                </label>

              </div>

              <div className="contact-form-row">

                <label>
                  <span>Phone / WhatsApp</span>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 000 000 0000"
                    required
                  />
                </label>

                <label>
                  <span>Estimated Order Quantity</span>
                  <input
                    type="text"
                    name="estimatedOrderQuantity"
                    value={formData.estimatedOrderQuantity}
                    onChange={handleChange}
                    placeholder="e.g. 500 pieces"
                    required
                  />
                </label>

              </div>

              <label>
                <span>Product Interested In</span>
                <input
                  type="text"
                  name="productInterestedIn"
                  value={formData.productInterestedIn}
                  onChange={handleChange}
                  placeholder="e.g. MMA Shorts, Rash Guards, T-Shirts"
                  required
                />
              </label>

              <label>
                <span>Project Details</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Tell us about your design, materials, colors, branding, quantity or other requirements..."
                  required
                />
              </label>

              <button
                type="submit"
                className="contact-submit-btn"
              >
                Send Business Inquiry
              </button>

              {formMessage && (
                <div
                  className={`contact-form-message ${
                    formMessage.includes('Please complete')
                      ? 'is-error'
                      : 'is-success'
                  }`}
                >
                  {formMessage}
                </div>
              )}

            </form>
          </div>

        </div>
      </section>

      {/* SERVICES / BENEFITS */}
      <section className="contact-benefits-section">
        <div className="contact-container">

          <div className="contact-section-heading">
            <span className="contact-eyebrow-dark">
              WHY WORK WITH US
            </span>

            <h2>
              Built For
              <span> International Buyers</span>
            </h2>

            <p>
              Our services are designed for businesses looking for
              reliable custom sportswear manufacturing and export
              support.
            </p>
          </div>

          <div className="contact-benefits-grid">

            {benefits.map((item) => (
              <article
                key={item.number}
                className="contact-benefit-card"
              >
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}

          </div>
        </div>
      </section>

      {/* LOCATION / SOCIAL */}
      <section className="contact-location-section">
        <div className="contact-container contact-location-grid">

          <div className="contact-map-card">
            <div className="contact-map-heading">
              <span className="contact-eyebrow-dark">
                OUR LOCATION
              </span>

              <h2>Manufacturing & Export Support</h2>

              <p>{businessAddress}</p>
            </div>

            <div className="contact-map-placeholder">
              <div>
                <strong>{companyName}</strong>
                <span>Sportswear Manufacturing & Export</span>
                <small>{businessAddress}</small>
              </div>
            </div>
          </div>

          <div className="contact-social-card">

            <span className="contact-eyebrow-dark">
              STAY CONNECTED
            </span>

            <h2>Follow {companyName}</h2>

            <p>
              Stay connected with our latest sportswear products,
              manufacturing updates and business information.
            </p>

            <div className="contact-social-links">

              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </a>
              ))}

            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="contact-whatsapp-large"
            >
              Start a WhatsApp Inquiry
            </a>

          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="contact-final-cta">

        <div className="contact-container">

          <span>READY TO START?</span>

          <h2>
            Let's Develop Your Next
            <strong> Sportswear Collection.</strong>
          </h2>

          <p>
            Contact {companyName} for custom manufacturing,
            OEM, private label and bulk sportswear export.
          </p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
          >
            Talk to Our Team
          </a>

        </div>

      </section>

    </main>
  );
}

export default ContactPage;