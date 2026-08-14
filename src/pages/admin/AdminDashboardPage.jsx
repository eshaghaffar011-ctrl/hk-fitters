import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts,
  fetchProductsFromAPI,
createProductAPI,
updateProductAPI,
deleteProductAPI,
 } from '../../data/products';
import {
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '../../data/inquiries';

const ADMIN_KEY = 'hkfitters_admin';
const ADMIN_PASSWORD_KEY = 'hkfitters_admin_password';

const cards = [
  { title: 'Products', text: 'Add, edit, delete products' },
  { title: 'Orders', text: 'Manage incoming orders' },
  { title: 'Customers', text: 'View customer records' },
  { title: 'Reports', text: 'Track sales activity' },
];

const defaultProductForm = {
  name: '',
  
  category: 'Men',
  description: '',
  image: '',
  gallery:[],
  sizes: 'S,M,L',
  colors: '#111111,#e10600,#ffffff',
  stock: 'In Stock',
  badge: 'New',
  featured: false,
};

const toArray = (value) =>
  typeof value === 'string'
    ? value.split(',').map((item) => item.trim()).filter(Boolean)
    : Array.isArray(value)
      ? value.filter(Boolean)
      : [];

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState(() => getProducts());
  const [inquiries, setInquiries] = useState([]);


  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [customerSearch, setCustomerSearch] = useState('');
  const [customerCountry, setCustomerCountry] = useState('All');

  const [showReports, setShowReports] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultProductForm);


  useEffect(() => {
  const loadProducts = async () => {
    try {
      const data = await fetchProductsFromAPI();

      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  loadProducts();
}, []);

  useEffect(() => {
    const isAdminLoggedIn =
      localStorage.getItem(ADMIN_KEY) === 'true';

    if (!isAdminLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    refreshInquiries();
  }, []);

  

  const refreshInquiries = async () => {
  try {
   

    const data = await getInquiries();

    setInquiries(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Failed to load inquiries:', error);
    setInquiries([]);
  } finally {
    
  }
};
  const filteredInquiries = inquiries.filter((inquiry) => {
  const customerName = inquiry.customer?.fullName || '';
  const customerCountry = inquiry.customer?.country || '';

  const matchesSearch =
    customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customerCountry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.id.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === 'All' ||
    (inquiry.status || 'New') === statusFilter;

  return matchesSearch && matchesStatus;
});

const customers = inquiries.reduce((list, inquiry) => {
  const customer = inquiry.customer;

  if (!customer) {
    return list;
  }

  const customerKey =
    customer.email ||
    `${customer.fullName || ''}-${customer.country || ''}`;

  const existing = list.find(
    (item) => item.key === customerKey
  );

  if (existing) {
    existing.orders += 1;
    return list;
  }

  list.push({
    key: customerKey,
    name: customer.fullName || 'Unknown Customer',
    email: customer.email || 'N/A',
    phone: customer.phone || 'N/A',
    city: customer.city || 'N/A',
    country: customer.country || 'N/A',
    address: customer.address || 'N/A',
    orders: 1,
  });

  return list;
}, []);

const customerCountries = [
  ...new Set(
    customers.map((customer) => customer.country)
  ),
].filter(
  (country) => country && country !== 'N/A'
);

const filteredCustomers = customers.filter(
  (customer) => {
    const search = customerSearch
      .toLowerCase()
      .trim();

    const matchesSearch =
      customer.name
        .toLowerCase()
        .includes(search) ||
      customer.email
        .toLowerCase()
        .includes(search) ||
      customer.phone
        .toLowerCase()
        .includes(search);

    const matchesCountry =
      customerCountry === 'All' ||
      customer.country === customerCountry;

    return matchesSearch && matchesCountry;
  }
);

const totalInquiries = inquiries.length;

const newInquiries = inquiries.filter(
  (inquiry) => (inquiry.status || 'New') === 'New'
).length;

const contactedInquiries = inquiries.filter(
  (inquiry) => inquiry.status === 'Contacted'
).length;

const completedInquiries = inquiries.filter(
  (inquiry) => inquiry.status === 'Completed'
).length;



const reportCountries = [
  ...new Set(
    inquiries
      .map(
        (inquiry) =>
          inquiry.customer?.country
      )
      .filter(Boolean)
  ),
];


const handleChangePassword = (event) => {
  event.preventDefault();

  setPasswordMessage('');

  const savedPassword =
    localStorage.getItem(ADMIN_PASSWORD_KEY) ||
    'admin123';

  if (oldPassword !== savedPassword) {
    setPasswordMessage('Old password is incorrect.');
    return;
  }

  if (!newPassword.trim()) {
    setPasswordMessage('Please enter a new password.');
    return;
  }

  if (newPassword.length < 6) {
    setPasswordMessage(
      'New password must be at least 6 characters.'
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordMessage(
      'New password and confirm password do not match.'
    );
    return;
  }

  localStorage.setItem(
    ADMIN_PASSWORD_KEY,
    newPassword
  );

  setOldPassword('');
  setNewPassword('');
  setConfirmPassword('');

  setPasswordMessage(
    'Password changed successfully.'
  );
};


  

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageUpload = (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    setForm((current) => ({
      ...current,
      image: reader.result,
    }));
  };

  reader.readAsDataURL(file);
};

const handleGalleryUpload = (event) => {
  const files = Array.from(event.target.files || []);

  if (!files.length) return;

  const readers = files.map(
    (file) =>
      new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.readAsDataURL(file);
      })
  );

  Promise.all(readers).then((images) => {
    setForm((current) => ({
      ...current,
      gallery: images,
    }));
  });
};

  const handleOpenAddForm = () => {
    setEditingId(null);
    setForm(defaultProductForm);
    setShowForm(true);
  };

  const handleOpenEditForm = (product) => {
    console.log('EDIT PRODUCT:', product);
  setEditingId(Number(product.id));

  setForm({
    name: product.name || '',
    category: product.category || 'Men',
    description: product.description || '',
    image: product.image || '',
    gallery: Array.isArray(product.gallery)
      ? product.gallery
      : toArray(product.gallery),
    sizes: Array.isArray(product.size)
      ? product.size.join(', ')
      : 'S,M,L',
    colors: Array.isArray(product.colors)
      ? product.colors.join(', ')
      : product.color || '#111111',
    stock: product.stock || 'In Stock',
    badge: product.badge || 'New',
    featured: Boolean(product.featured),
  });

  setShowForm(true);
};
  const handleSubmitProduct = async (event) => { 
  event.preventDefault();
  console.log('FEATURED DEFORE SAVE:', form.featured);
  const name = form.name.trim();
  const description = form.description.trim();
  const image = form.image || '';

  const galleryImages =
    Array.isArray(form.gallery) && form.gallery.length
      ? form.gallery
      : [image || ''];

  const sizes = toArray(form.sizes).length
    ? toArray(form.sizes)
    : ['M'];

  const colors = toArray(form.colors).length
    ? toArray(form.colors)
    : ['#111111'];

  if (!name || !description) {
    return;
  }

  const productData = {
    name,
    description,
    image: image || galleryImages[0] || '',
    gallery: galleryImages,

    category: [
      'Men',
      'Women',
      'Kids',
      'Accessories',
    ].includes(form.category)
      ? form.category
      : 'Men',

    size: sizes,
    sizes,

    color: colors[0] || '#111111',
    colors,

    rating: editingId !== null
      ? products.find(
          (product) =>
            Number(product.id) === Number(editingId)
        )?.rating || 4.7
      : 4.7,

    reviews: editingId !== null
      ? products.find(
          (product) =>
            Number(product.id) === Number(editingId)
        )?.reviews || 0
      : 0,

    badge: form.badge || 'New',
    stock: form.stock || 'In Stock',
    featured: form.featured || false,
  };

  try {
    if (editingId !== null) {
      await updateProductAPI(
        editingId,
        productData
      );
    } else {
      await createProductAPI(productData);
    }

    const updatedProducts =
      await fetchProductsFromAPI();

    setProducts(updatedProducts);

    setShowForm(false);
    setEditingId(null);
    setForm(defaultProductForm);

  } catch (error) {
    console.error(
      'Failed to save product:',
      error
    );

    window.alert(
      'Failed to save product. Please try again.'
    );
  }
};

 const handleDeleteProduct = async (productId) => {
  const id = Number(productId);

  const selected = products.find(
    (product) => Number(product.id) === id
  );

  if (!selected) {
    return;
  }

  const confirmed = window.confirm(
    `Delete ${selected.name}? This will remove it permanently.`
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteProductAPI(id);

    const updatedProducts =
      await fetchProductsFromAPI();

    setProducts(updatedProducts);

  } catch (error) {
    console.error(
      'Failed to delete product:',
      error
    );

    window.alert(
      'Failed to delete product. Please try again.'
    );
  }
};

  // =========================
  // INQUIRY FUNCTIONS
  // =========================

  const handleInquiryStatusChange = async (
  inquiryId,
  status
) => {
  try {
    await updateInquiryStatus(
      inquiryId,
      status
    );

    await refreshInquiries();
  } catch (error) {
    console.error(
      'Failed to update inquiry:',
      error
    );

    window.alert(
      'Failed to update inquiry status.'
    );
  }
};

  const handleDeleteInquiry = async (inquiryId) => {
  const confirmed = window.confirm(
    'Delete this inquiry? This cannot be undone.'
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteInquiry(inquiryId);

    await refreshInquiries();
  } catch (error) {
    console.error(
      'Failed to delete inquiry:',
      error
    );

    window.alert(
      'Failed to delete inquiry.'
    );
  }
};
  const formatDate = (date) => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleString();
  };

  const getCustomerName = (inquiry) => {
    return (
      inquiry.customer?.fullName ||
      'Unknown Customer'
    );
  };

  const getCustomerLocation = (inquiry) => {
    const city = inquiry.customer?.city || '';
    const country =
      inquiry.customer?.country || '';

    if (!city && !country) {
      return 'N/A';
    }

    return [city, country]
      .filter(Boolean)
      .join(', ');
  };

  const getItemsText = (inquiry) => {
    if (!Array.isArray(inquiry.items)) {
      return 'No items';
    }

    return inquiry.items
      .map(
        (item) =>
          `${item.name} × ${item.quantity}`
      )
      .join(', ');
  };

  return (
    <div className="page">
      <section className="section">

        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
            flexWrap: 'wrap',
          }}
        >
          <h1 style={{ margin: 0 }}>
            Admin Dashboard
          </h1>

          <button
  type="button"
  className="btn btn-secondary"
  onClick={() => {
    setShowPasswordForm((current) => !current);
    setPasswordMessage('');
  }}
>
  {showPasswordForm ? 'Close Password Settings' : 'Change Password'}
</button>

{showPasswordForm && (
  <form
    className="auth-card"
    onSubmit={handleChangePassword}
    style={{
      marginTop: '16px',
      marginBottom: '24px',
    }}
  >
    <h3>Change Admin Password</h3>

    {passwordMessage && (
      <p
        style={{
          marginBottom: '12px',
          fontWeight: '600',
        }}
      >
        {passwordMessage}
      </p>
    )}

    <input
      type="password"
      placeholder="Old Password"
      value={oldPassword}
      onChange={(event) =>
        setOldPassword(event.target.value)
      }
      required
    />

    <input
      type="password"
      placeholder="New Password"
      value={newPassword}
      onChange={(event) =>
        setNewPassword(event.target.value)
      }
      required
    />

    <input
      type="password"
      placeholder="Confirm New Password"
      value={confirmPassword}
      onChange={(event) =>
        setConfirmPassword(event.target.value)
      }
      required
    />

    <button
      type="submit"
      className="btn btn-primary"
      style={{ marginTop: '12px' }}
    >
      Update Password
    </button>
  </form>
)}
        </div>

       {/* DASHBOARD CARDS */}
<div className="card-grid">
  {cards.map((card, index) => (
    <article
      className="product-card"
      key={index}
    >
      <h3>{card.title}</h3>

      <p>{card.text}</p>

      {card.title === 'Orders' ? (
        <button
          type="button"
          className="btn btn-secondary small"
          onClick={() => {
            const nextShowOrders = !showOrders;

            setShowOrders(nextShowOrders);
            if (nextShowOrders) {
              refreshInquiries();
            }
          }}
        >
          {showOrders
            ? 'Close'
            : `Open (${inquiries.length})`}
        </button>

      ) : card.title === 'Customers' ? (
        <button
          type="button"
          className="btn btn-secondary small"
          onClick={() => {
            const customerSection =
              document.getElementById('customers-section');

            if (customerSection) {
              customerSection.scrollIntoView({
                behavior: 'smooth',
              });
            }
          }}
        >
          Open ({customers.length})
        </button>

      ) : card.title === 'Reports' ? (
        <button
          type="button"
          className="btn btn-secondary small"
          onClick={() => {
            setShowReports((current) => !current);
          }}
        >
          {showReports ? 'Close' : 'Open'}
        </button>

      ) : (
        <Link
          to="/admin/dashboard"
          className="btn btn-secondary small"
        >
          Open
        </Link>
      )}
    </article>
  ))}
</div>

        {/* ========================= */}
        {/* ORDERS / INQUIRIES */}
        {/* ========================= */}

        {showOrders && (
          <section
            style={{
              marginTop: '30px',
              marginBottom: '30px',
            }}
          >
            <div
              className="section-heading"
              style={{
                marginBottom: '16px',
              }}
            >
              <div>
                <p className="eyebrow">
                  WhatsApp Business
                </p>

                <h2>
                  Customer Inquiries
                </h2>

                <p>
                  Manage inquiries received
                  from the website checkout.
                </p>
              </div>
            </div>
            
            <div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  }}
>
  <input
    type="text"
    placeholder="Search customer or inquiry ID..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(event) => setStatusFilter(event.target.value)}
  >
    <option value="All">All Statuses</option>
    <option value="New">New</option>
    <option value="Contacted">Contacted</option>
    <option value="Completed">Completed</option>
  </select>
</div>

            {filteredInquiries.length === 0 ? (
              <div className="empty-state">
                <h3>No inquiries yet</h3>

                <p>
                  Customer inquiries will appear
                  here after someone submits an
                  order inquiry through checkout.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gap: '16px',
                }}
              >
                {filteredInquiries.map((inquiry) => (
                  <article
                    className="product-card"
                    key={inquiry.id}
                    style={{
                      padding: '20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        alignItems: 'flex-start',
                        gap: '15px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div>
                        <p className="eyebrow">
                          {inquiry.id}
                        </p>

                        <h3>
                          {getCustomerName(
                            inquiry
                          )}
                        </h3>

                        <p>
                          <strong>
                            Location:
                          </strong>{' '}
                          {getCustomerLocation(
                            inquiry
                          )}
                        </p>

                        <p>
                          <strong>
                            Date:
                          </strong>{' '}
                          {formatDate(
                            inquiry.createdAt
                          )}
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor={`status-${inquiry.id}`}
                          style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: '600',
                          }}
                        >
                          Status
                        </label>

                        <select
                          id={`status-${inquiry.id}`}
                          value={
                            inquiry.status || 'New'
                          }
                          onChange={(event) =>
                            handleInquiryStatusChange(
                              inquiry.id,
                              event.target.value
                            )
                          }
                        >
                          <option value="New">
                            New
                          </option>

                          <option value="Contacted">
                            Contacted
                          </option>

                          <option value="Completed">
                            Completed
                          </option>
                        </select>
                      </div>
                    </div>

                    <hr
                      style={{
                        margin: '16px 0',
                        opacity: 0.2,
                      }}
                    />

                    <p>
                      <strong>
                        Address:
                      </strong>{' '}
                      {inquiry.customer
                        ?.address || 'N/A'}
                    </p>

                    <p>
                      <strong>
                        Postal Code:
                      </strong>{' '}
                      {inquiry.customer
                        ?.postalCode || 'N/A'}
                    </p>

                    <p>
                      <strong>
                        Products:
                      </strong>{' '}
                      {getItemsText(inquiry)}
                    </p>

                   

                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        marginTop: '16px',
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-secondary small"
                        onClick={() =>
                          handleDeleteInquiry(
                            inquiry.id
                          )
                        }
                      >
                        Delete Inquiry
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

         {/* ========================= */}
{/* CUSTOMERS */}
{/* ========================= */}

<section
  id="customers-section"
  style={{
    marginTop: '40px',
    marginBottom: '40px',
  }}
>
  <div
    className="section-heading"
    style={{
      marginBottom: '16px',
    }}
  >
    <div>
      <p className="eyebrow">
        Customer Management
      </p>

      <h2>
        Customers
      </h2>

      <p>
        Customers who have submitted inquiries
        through the website.
      </p>
    </div>
  </div>

<div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  }}
>
  <input
    type="text"
    placeholder="Search customer, email or phone..."
    value={customerSearch}
    onChange={(event) =>
      setCustomerSearch(event.target.value)
    }
  />

  <select
    value={customerCountry}
    onChange={(event) =>
      setCustomerCountry(event.target.value)
    }
  >
    <option value="All">
      All Countries
    </option>

    {customerCountries.map((country) => (
      <option
        key={country}
        value={country}
      >
        {country}
      </option>
    ))}
  </select>
</div>

  {customers.length === 0 ? (
    <div className="empty-state">
      <h3>No customers yet</h3>

      <p>
        Customer records will appear here after
        an inquiry is submitted.
      </p>
    </div>
  ) : (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
      }}
    >
      {filteredCustomers.map((customer) => (
        <article
          className="product-card"
          key={customer.key}
          style={{
            padding: '20px',
          }}
        >
          <p className="eyebrow">
            Customer
          </p>

          <h3>
            {customer.name}
          </h3>

          <p>
            <strong>Email:</strong>{' '}
            {customer.email}
          </p>

          <p>
            <strong>Phone:</strong>{' '}
            {customer.phone}
          </p>

          <p>
            <strong>Location:</strong>{' '}
            {customer.city}, {customer.country}
          </p>

          <p>
            <strong>Address:</strong>{' '}
            {customer.address}
          </p>

          <p>
            <strong>Inquiries:</strong>{' '}
            {customer.orders}
          </p>
        </article>
      ))}
    </div>
  )}
</section>


{/* ========================= */}
{/* REPORTS */}
{/* ========================= */}

{showReports && (
  <section
    style={{
      marginTop: '40px',
      marginBottom: '40px',
    }}
  >
    <div
      className="section-heading"
      style={{
        marginBottom: '20px',
      }}
    >
      <div>
        <p className="eyebrow">
          Business Reports
        </p>

        <h2>
          Sales Activity
        </h2>

        <p>
          Overview of customer inquiries and
          order activity.
        </p>
      </div>
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
      }}
    >
      <article className="product-card">
        <p className="eyebrow">
          Total
        </p>

        <h3>
          {totalInquiries}
        </h3>

        <p>
          Total inquiries
        </p>
      </article>

      <article className="product-card">
        <p className="eyebrow">
          New
        </p>

        <h3>
          {newInquiries}
        </h3>

        <p>
          New inquiries
        </p>
      </article>

      <article className="product-card">
        <p className="eyebrow">
          Contacted
        </p>

        <h3>
          {contactedInquiries}
        </h3>

        <p>
          Contacted inquiries
        </p>
      </article>

      <article className="product-card">
        <p className="eyebrow">
          Completed
        </p>

        <h3>
          {completedInquiries}
        </h3>

        <p>
          Completed inquiries
        </p>
      </article>

      

      <article className="product-card">
        <p className="eyebrow">
          Countries
        </p>

        <h3>
          {reportCountries.length}
        </h3>

        <p>
          Countries with inquiries
        </p>
      </article>
    </div>
  </section>
)}

        {/* ========================= */}
        {/* PRODUCT MANAGEMENT */}
        {/* ========================= */}

        <div
          className="section-heading"
          style={{
            marginTop: '24px',
            marginBottom: '12px',
          }}
        >
          <div>
            <p className="eyebrow">
              Product Management
            </p>

            <h2>
              Manage catalog products
            </h2>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenAddForm}
          >
            Add Product
          </button>
        </div>

        {/* PRODUCT FORM */}
        {showForm && (
          <form
            className="auth-card"
            onSubmit={handleSubmitProduct}
            style={{
              marginBottom: '24px',
            }}
          >
            <h3>
              {editingId
                ? 'Edit Product'
                : 'Add Product'}
            </h3>

            <div
              style={{
                display: 'grid',
                gap: '12px',
              }}
            >
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Product name"
                required
              />

              
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
              >
                <option value="Men">
                  Men
                </option>

                <option value="Women">
                  Women
                </option>

                <option value="Kids">
                  Kids
                </option>

                <option value="Accessories">
                  Accessories
                </option>
              </select>

              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Description"
                rows="4"
                required
              />

              <label>
  <strong>Product Main Image</strong>

  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
  />
</label>

{form.image && (
  <img
    src={form.image}
    alt="Product preview"
    style={{
      width: '330px',
      height: 'auto',
      maxHeight: '400px',
      objectFit: 'contain',
      borderRadius: '12px',
      marginTop: '8px',
      background: '#f7f4ef'
    }}
  />
)}

<label>
  <strong>Gallery Images</strong>

  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleGalleryUpload}
  />
</label>

{form.gallery.length > 0 && (
  <div
    style={{
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      marginTop: '8px',
    }}
  >
   {toArray(form.gallery).map((image, index) => (
  <img
    key={index}
    src={image}
    alt={`Gallery ${index + 1}`}
    style={{
      width: '100px',
      height: '100px',
      objectFit: 'cover',
      borderRadius: '10px',
    }}
  />
))}
  </div>
)}

              <input
                name="sizes"
                value={form.sizes}
                onChange={handleFormChange}
                placeholder="Sizes (comma separated)"
              />

              <input
                name="colors"
                value={form.colors}
                onChange={handleFormChange}
                placeholder="Colors (comma separated or hex values)"
              />

              <input
                name="stock"
                value={form.stock}
                onChange={handleFormChange}
                placeholder="Stock / availability"
              />

              <select
  name="badge"
  value={form.badge}
  onChange={handleFormChange}
>
  <option value="New">New</option>
  <option value="Sale">Sale</option>
  <option value="Featured">Featured</option>
  <option value="Best Seller">Best Seller</option>
  <option value="">No Badge</option>
</select>
            </div>

            <label
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  }}
>
  <input
    type="checkbox"
    name="featured"
    checked={form.featured}
    onChange={(event) =>
      setForm((current) => ({
        ...current,
        featured: event.target.checked,
      }))
    }
  />

  <strong>Featured Product</strong>
</label>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '16px',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingId
                  ? 'Save Changes'
                  : 'Create Product'}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(defaultProductForm);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* PRODUCT LIST */}
        <div
          className="card-grid"
          style={{ marginTop: '8px' }}
          >
          {products.map((product) => (
            <article
            className="product-card"
            key={product.id}
            style={{
              overflow: 'hidden',
            }}
            >
             <img
  src={
    product.image ||
    product.gallery?.[0] ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
  }
  alt={product.name}
  style={{
    width: '100%',
    height: 'auto',
    maxHeight: '320px',
    objectFit: 'contain',
    display: 'block',
    marginBottom: '12px',
    borderRadius: '12px',
    background: '#f7f4ef',
  }}
/>

            <h3>{product.name}</h3>

            <p>
              <strong>
                Category:
              </strong>{' '}
              {product.category}
              </p>

              

              <p>
                <strong>
                  Stock:
                  </strong>{' '}
                {product.stock || 'In Stock'}
                </p>

              <div
              style={{
                display:'flex',
                gap:'8px',
                flexWrap: 'wrap',
                marginTop:'12px',
              }}  
              >
                <button
                type='button'
                className="btn btn-secondary small" 
                onClick={() =>
                 handleOpenEditForm(product)
                 }
                 >
                  Edit
                  </button>

                <button 
                type="button"
                 className="btn btn-secondary small"
                  onClick={() => handleDeleteProduct(
                    product.id
                    )
                    }
                    >
                      Delete
                      </button>
              </div>
            </article>
          ))}
        </div>


      </section>
    </div>
  );
}

export default AdminDashboardPage;