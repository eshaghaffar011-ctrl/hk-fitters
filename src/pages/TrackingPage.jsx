import { useState } from 'react';
import { getInquiries } from '../data/inquiries';

function TrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [inquiry, setInquiry] = useState(null);
  const [message, setMessage] = useState('');

  const handleTrackOrder = () => {
    const searchId = orderId.trim().toUpperCase();

    if (!searchId) {
      setInquiry(null);
      setMessage('Please enter your Order ID.');
      return;
    }

    const inquiries = getInquiries();

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

  return (
    <div className="page">
      <section className="section">
        <h1>Order Tracking</h1>

        <div className="summary-card">
          <p>
            Enter your order number to track your inquiry.
          </p>

          <input
            placeholder="Order ID e.g. INQ-123456789"
            className="full-width-input"
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleTrackOrder();
              }
            }}
          />

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleTrackOrder}
          >
            Track Order
          </button>

          {message && (
            <p
              style={{
                marginTop: '16px',
                color: '#b80c0c',
                fontWeight: '600',
              }}
            >
              {message}
            </p>
          )}

          {inquiry && (
            <div
              className="summary-card"
              style={{
                marginTop: '20px',
              }}
            >
              <h2>Inquiry Found</h2>

              <p>
                <strong>Order ID:</strong>{' '}
                {inquiry.id}
              </p>

              <p>
                <strong>Customer:</strong>{' '}
                {inquiry.customer?.fullName || 'N/A'}
              </p>

              <p>
                <strong>Date:</strong>{' '}
                {new Date(
                  inquiry.createdAt
                ).toLocaleString()}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                {inquiry.status || 'New'}
              </p>

              <p>
                <strong>Products:</strong>{' '}
                {Array.isArray(inquiry.items)
                  ? inquiry.items
                      .map(
                        (item) =>
                          `${item.name} × ${item.quantity}`
                      )
                      .join(', ')
                  : 'N/A'}
              </p>

              <p>
                <strong>Total:</strong>{' '}
                $
                {Number(
                  inquiry.total || 0
                ).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default TrackingPage;