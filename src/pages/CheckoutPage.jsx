import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import contactInfo from '../config/contact';
import { createInquiry } from '../data/inquiries';
import { useCartWishlist } from '../context/CartWishlistContext';

function CheckoutPage() {
  const { cartItems } = useCartWishlist();

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const { companyName, whatsappNumber } = contactInfo;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = 25;
  const total = subtotal + shipping;

  const cartLines = useMemo(
    () =>
      cartItems.map(
        (item) =>
          `- ${item.name} | Qty: ${item.quantity} | Size: ${
            item.selectedSize || item.size?.[0] || 'N/A'
          } | Color: ${
            item.selectedColor || item.color || 'N/A'
          } `
      ),
    [cartItems]
  );

  const buildWhatsappMessage = () => {
    return [
      `Hi ${companyName},`,
      '',
      'I would like to inquire about my order.',
      '',
      'Customer Details:',
      `Name: ${formData.fullName || 'Not provided'}`,
      `Address: ${formData.address || 'Not provided'}`,
      `City: ${formData.city || 'Not provided'}`,
      `Postal Code: ${formData.postalCode || 'Not provided'}`,
      `Country: ${formData.country || 'Not provided'}`,
      '',
      'Cart Items:',
      ...cartLines,
      '',
      
      '',
      'Please confirm availability, shipping details, and next steps.',
    ].join('\n');
  };

  const handleWhatsAppInquiry = async () => {
    if (!formData.fullName.trim()) {
      window.alert('Please enter your full name.');
      return;
    }

    if (!formData.address.trim()) {
      window.alert('Please enter your address.');
      return;
    }

    if (!formData.city.trim()) {
      window.alert('Please enter your city.');
      return;
    }

    if (!formData.postalCode.trim()) {
      window.alert('Please enter your postal code.');
      return;
    }

    if (!formData.country.trim()) {
      window.alert('Please enter your country.');
      return;
    }

    const inquiry = await createInquiry({
      customer: {
        fullName: formData.fullName.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
      },

      items: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.selectedSize || item.size?.[0] || 'N/A',
        color: item.selectedColor || item.color || 'N/A',
      })),

      subtotal,
      shipping,
      total,
    });

    const message = buildWhatsappMessage();

    const whatsappHref =
      `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` +
      `?text=${encodeURIComponent(message)}`;

    window.open(whatsappHref, '_blank', 'noopener,noreferrer');

    console.log('HK FITTERS inquiry created:', inquiry.id);
    window.alert(`Inquiry saved successfully: ${inquiry.id}`);
  };

  return (
    <div className="page">
      <section className="section">
        <h1>Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <p>Your cart is empty.</p>

            <Link to="/shop" className="btn btn-primary">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="checkout-layout">
            <div className="summary-card">
              <h3>Customer Inquiry Details</h3>

              <form
                className="auth-card"
                onSubmit={(event) => event.preventDefault()}
              >
                <input
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  required
                />

                <input
                  placeholder="Address"
                  value={formData.address}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  required
                />

                <input
                  placeholder="City"
                  value={formData.city}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      city: event.target.value,
                    }))
                  }
                  required
                />

                <input
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      postalCode: event.target.value,
                    }))
                  }
                  required
                />

                <input
                  placeholder="Country"
                  value={formData.country}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      country: event.target.value,
                    }))
                  }
                  required
                />
              </form>
            </div>

            <div className="summary-card">
              <h3>Order Summary</h3>

              

              <button
                type="button"
                className="btn btn-primary full"
                onClick={handleWhatsAppInquiry}
              >
                Contact HK FITTERS on WhatsApp
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default CheckoutPage;