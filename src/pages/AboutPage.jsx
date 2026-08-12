function AboutPage() {
  const journey = [
    { year: '2018', title: 'Brand Foundation', text: 'HK FITTERS began as a premium sportswear concept focused on refined movement and technical elegance.' },
    { year: '2020', title: 'Global Expansion', text: 'We extended our export partnerships to serve international clients in emerging and mature markets.' },
    { year: '2022', title: 'OEM & Private Label', text: 'Our manufacturing and branding services broadened to support retail-ready private label programs.' },
    { year: '2026', title: 'Today', text: 'HK FITTERS now delivers premium collections with elevated service for global wholesale and export buyers.' },
  ];

  const stats = [
    { label: 'Countries Served', value: '48+' },
    { label: 'Happy Clients', value: '320+' },
    { label: 'Products Manufactured', value: '12K+' },
    { label: 'Years of Experience', value: '8+' },
  ];

  const values = [
    'Performance-led design',
    'Transparent communication',
    'Premium manufacturing consistency',
    'Sustainable product thinking',
    'Client-first international service',
  ];

  return (
    <div className="page">
      <style>{`
        @media (max-width: 900px) {
          .about-grid,
          .about-stats-grid,
          .about-journey-grid,
          .about-values-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <section className="section">
        <div style={{ display: 'grid', gap: '18px' }}>
          <div className="summary-card" style={{ padding: '20px' }}>
            <p className="eyebrow" style={{ marginBottom: '8px' }}>Company Story</p>
            <h1 style={{ marginTop: 0 }}>About HK FITTERS</h1>
            <p>
              HK FITTERS is a premium international sportswear company built for modern performance culture,
              elevated design, and dependable export partnerships. We create bold, refined collections for clients
              who expect quality, consistency, and a polished business experience from concept to delivery.
            </p>
          </div>

          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div className="summary-card" style={{ padding: '20px' }}>
              <h3>Mission</h3>
              <p>To deliver premium sportswear solutions that empower active lifestyles and support global growth for our brand partners.</p>
            </div>
            <div className="summary-card" style={{ padding: '20px' }}>
              <h3>Vision</h3>
              <p>To become the trusted choice for export-ready, premium sportswear manufacturing and private label partnerships worldwide.</p>
            </div>
          </div>

          <div className="summary-card" style={{ padding: '20px' }}>
            <h3>Our Values</h3>
            <div className="about-values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '10px' }}>
              {values.map((value) => (
                <div key={value} style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '12px', textAlign: 'center', background: '#fafafa' }}>
                  {value}
                </div>
              ))}
            </div>
          </div>

          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div className="summary-card" style={{ padding: '20px' }}>
              <h3>Why Choose HK FITTERS</h3>
              <ul>
                <li>Premium product design with export-ready consistency</li>
                <li>Dedicated support for bulk and wholesale buyers</li>
                <li>Flexible OEM and private label solutions</li>
                <li>Efficient international communication and delivery coordination</li>
              </ul>
            </div>
            <div className="summary-card" style={{ padding: '20px' }}>
              <h3>OEM & Private Label Services</h3>
              <p>We support fashion-forward, performance-driven brands with custom manufacturing, private label development, quality assurance, and export planning.</p>
            </div>
          </div>

          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div className="summary-card" style={{ padding: '20px' }}>
              <h3>Manufacturing Process</h3>
              <p>From concept sampling and technical specification to production coordination, finishing, and shipment, every stage is managed with care and precision.</p>
            </div>
            <div className="summary-card" style={{ padding: '20px' }}>
              <h3>Quality Control</h3>
              <p>Our quality assurance process combines fabric inspection, production supervision, finishing checks, and final shipment review to protect consistency and client confidence.</p>
            </div>
          </div>

          <div className="summary-card" style={{ padding: '20px' }}>
            <h3>Worldwide Export Markets</h3>
            <p>HK FITTERS serves a growing international network of sportswear buyers, retailers, and distributors with responsive export support and premium delivery coordination.</p>
          </div>

          <div className="summary-card" style={{ padding: '20px' }}>
            <h3>Company Journey</h3>
            <div className="about-journey-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
              {journey.map((item) => (
                <div key={item.year} style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '14px', background: '#fafafa' }}>
                  <strong>{item.year}</strong>
                  <h4 style={{ margin: '8px 0 6px' }}>{item.title}</h4>
                  <p style={{ margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="summary-card" style={{ padding: '20px' }}>
            <h3>Our Impact</h3>
            <div className="about-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
              {stats.map((stat) => (
                <div key={stat.label} style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '16px', textAlign: 'center', background: '#fafafa' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b80c0c' }}>{stat.value}</div>
                  <div style={{ marginTop: '6px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="summary-card" style={{ padding: '20px', textAlign: 'center' }}>
            <h3>Start Your Business With HK FITTERS</h3>
            <p>Partner with us for premium sportswear production, tailored export solutions, and dependable brand support.</p>
            <a href="/contact" className="btn btn-primary">Start Your Business With HK FITTERS</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
