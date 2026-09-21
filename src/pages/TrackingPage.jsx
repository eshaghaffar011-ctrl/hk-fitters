import { useState } from 'react';
import { getInquiries } from '../data/inquiries';
import contactInfo from '../config/contact';
import './TrackingPage.css';

const { whatsappNumber } = contactInfo;

function TrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [inquiry, setInquiry] = useState(null);
  const [message, setMessage] = useState('');

 const handleTrackOrder = async () => {
    const searchId = orderId.trim().toUpperCase();

    if (!searchId) {
      setInquiry(null);
      setMessage('Please enter your Order ID.');
      return;
    }

    const inquiries = await getInquiries();

    const found = inquiries.find(
      (item) => item.id.toUpperCase() === searchId
    );

    if (!found) {
      setInquiry(null);
      setMessage('Order ID not found. Please check your ID.');
      return;
    }

    setInquiry(found);
    setMessage('');
  };

  const getStatusClass = (status) => {
    const normalized = (status || 'New').toLowerCase();

    if (
      normalized.includes('complete') ||
      normalized.includes('deliver')
    ) {
      return 'is-complete';
    }

    if (
      normalized.includes('process') ||
      normalized.includes('production') ||
      normalized.includes('ship')
    ) {
      return 'is-progress';
    }

    return 'is-new';
  };

  return (
    <main className="tracking-page">

      {/* HERO */}
      <section className="tracking-hero">
        <div className="tracking-hero-overlay" />

        <div className="tracking-container tracking-hero-inner">
          <div>
            <span className="tracking-eyebrow">
              ORDER & INQUIRY SUPPORT
            </span>

            <h1>
              Track Your
              <span> Order Inquiry</span>
            </h1>

            <p>
              Enter your Order ID to check the current status of your
              sportswear inquiry and review your submitted order details.
            </p>
          </div>

          <div className="tracking-hero-badge">
            <strong>HK FITTERS</strong>
            <span>Sportswear Manufacturing & Export</span>
          </div>
        </div>
      </section>

      {/* TRACKING AREA */}
      <section className="tracking-main-section">
        <div className="tracking-container">

          <div className="tracking-search-card">

            <div className="tracking-search-header">
              <span className="tracking-eyebrow-dark">
                CHECK YOUR STATUS
              </span>

              <h2>Track Your Inquiry</h2>

              <p>
                Enter the Order ID provided with your inquiry confirmation.
              </p>
            </div>

            <div className="tracking-search-form">

              <label htmlFor="tracking-order-id">
                Order ID
              </label>

              <div className="tracking-input-row">
                <input
                  id="tracking-order-id"
                  type="text"
                  placeholder="e.g. INQ-123456789"
                  value={orderId}
                  onChange={(event) => {
                    setOrderId(event.target.value);
                    if (message) {
                      setMessage('');
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleTrackOrder();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={handleTrackOrder}
                >
                  Track Order
                </button>
              </div>

              {message && (
                <div className="tracking-error">
                  {message}
                </div>
              )}

            </div>

          </div>

          {/* RESULT */}
          {inquiry && (
            <section className="tracking-result-section">

              <div className="tracking-result-header">
                <div>
                  <span className="tracking-eyebrow-dark">
                    INQUIRY FOUND
                  </span>

                  <h2>Order Details</h2>
                </div>

                <span
                  className={`tracking-status ${getStatusClass(
                    inquiry.status
                  )}`}
                >
                  {inquiry.status || 'New'}
                </span>
              </div>

              <div className="tracking-order-grid">

                <div className="tracking-detail-card">
                  <span>ORDER ID</span>
                  <strong>{inquiry.id}</strong>
                </div>

                <div className="tracking-detail-card">
                  <span>CUSTOMER</span>
                  <strong>
                    {inquiry.customer?.fullName || 'N/A'}
                  </strong>
                </div>

                <div className="tracking-detail-card">
                  <span>DATE SUBMITTED</span>
                  <strong>
                    {new Date(
                      inquiry.createdAt
                    ).toLocaleString()}
                  </strong>
                </div>

                <div className="tracking-detail-card">
                  <span>STATUS</span>
                  <strong>
                    {inquiry.status || 'New'}
                  </strong>
                </div>

              </div>

              <div className="tracking-products-card">

                <div className="tracking-card-heading">
                  <span>PRODUCTS</span>
                  <h3>Items in This Inquiry</h3>
                </div>

                {Array.isArray(inquiry.items) &&
                inquiry.items.length > 0 ? (
                  <div className="tracking-product-list">

                    {inquiry.items.map((item, index) => (
                      <div
                        className="tracking-product-row"
                        key={`${item.name}-${index}`}
                      >
                        <div>
                          <strong>{item.name}</strong>
                        </div>

                        <span>
                          Quantity: {item.quantity}
                        </span>
                      </div>
                    ))}

                  </div>
                ) : (
                  <p className="tracking-empty">
                    No product information available.
                  </p>
                )}

                <div className="tracking-total">
                  <span>Total</span>
                  <strong>
                    $
                    {Number(
                      inquiry.total || 0
                    ).toFixed(2)}
                  </strong>
                </div>

              </div>

            </section>
          )}

          {/* HOW IT WORKS */}
          <section className="tracking-process-section">

            <div className="tracking-section-heading">
              <span className="tracking-eyebrow-dark">
                HOW IT WORKS
              </span>

              <h2>Simple Order Tracking</h2>

              <p>
                Use your inquiry ID to quickly access the latest
                information available for your request.
              </p>
            </div>

            <div className="tracking-process-grid">

              <article>
                <span>01</span>
                <h3>Submit Your Inquiry</h3>
                <p>
                  Send your sportswear requirements through our
                  inquiry or quotation process.
                </p>
              </article>

              <article>
                <span>02</span>
                <h3>Receive Your Order ID</h3>
                <p>
                  Your inquiry is assigned an identification number
                  for future reference.
                </p>
              </article>

              <article>
                <span>03</span>
                <h3>Check Your Status</h3>
                <p>
                  Enter the Order ID above to review the information
                  currently available.
                </p>
              </article>

            </div>

          </section>

          {/* SUPPORT */}
          <section className="tracking-support">

            <div>
              <span className="tracking-eyebrow">
                NEED ASSISTANCE?
              </span>

              <h2>Have a Question About Your Order?</h2>

              <p>
                If you need help with your inquiry, production
                requirements or export order, contact our team
                directly.
              </p>
            </div>

           <a
  href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
  target="_blank"
  rel="noreferrer"
>
  Contact Support
</a>
          </section>

        </div>
      </section>

    </main>
  );
}

export default TrackingPage;