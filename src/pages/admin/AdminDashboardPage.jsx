import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getProducts,
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

import {
  getSubscribers,
  deleteSubscriber,
} from '../../data/newsletter';

const ADMIN_KEY = 'hkfitters_admin';
const ADMIN_PASSWORD_KEY = 'hkfitters_admin_password';

const defaultProductForm = {
  name: '',
  category: 'Men',
  shortDescription: '',
  description: '',
  material: '',
  fitStyle: '',
  features: '',
  sizes: '',
  colors: '',
  careInstructions: '',
  image: '',
  gallery: [],
  stock: 'In Stock',
  featured: false,
};

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const parseColors = (value) => {
  const entries = toArray(value);

  return entries.map((entry) => {
    const parts = String(entry)
      .split(':')
      .map((item) => item.trim());

    return {
      name: parts[0] || 'Color',
      code: parts[1] || '#111111',
    };
  });
};

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState(() => getProducts() || []);
  const [inquiries, setInquiries] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  const [showProducts, setShowProducts] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    ...defaultProductForm,
  });

  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [customerSearch, setCustomerSearch] = useState('');
  const [customerCountry, setCustomerCountry] = useState('All');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  /*
   * ============================================================
   * AUTH CHECK
   * ============================================================
   */

  useEffect(() => {
    const isAdminLoggedIn =
      localStorage.getItem(ADMIN_KEY) === 'true';

    if (!isAdminLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  /*
   * ============================================================
   * LOAD PRODUCTS
   * ============================================================
   */

  const loadProducts = async () => {
    try {
      setProductLoading(true);
      setProductError('');

      const data = await fetchProductsFromAPI();

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        'Failed to load products:',
        error
      );

      setProductError(
        'Unable to load products right now.'
      );
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /*
   * ============================================================
   * LOAD INQUIRIES
   * ============================================================
   */

  const refreshInquiries = async () => {
    try {
      const data = await getInquiries();

      setInquiries(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        'Failed to load inquiries:',
        error
      );

      setInquiries([]);
    }
  };

  useEffect(() => {
    refreshInquiries();
  }, []);

  /*
   * ============================================================
   * LOAD SUBSCRIBERS
   * ============================================================
   */

  const refreshSubscribers = async () => {
    try {
      const data = await getSubscribers();

      setSubscribers(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        'Failed to load subscribers:',
        error
      );

      setSubscribers([]);
    }
  };

  useEffect(() => {
    refreshSubscribers();
  }, []);

  /*
   * ============================================================
   * FORM CHANGE
   * ============================================================
   */

  const handleFormChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
   * ============================================================
   * IMAGE UPLOAD
   * ============================================================
   */

  const handleImageUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setForm((current) => ({
        ...current,
        image:
          reader.result || '',
      }));
    };

    reader.readAsDataURL(file);
  };

  /*
   * ============================================================
   * GALLERY UPLOAD
   * ============================================================
   */

  const handleGalleryUpload = (
    event
  ) => {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) {
      return;
    }

    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader =
            new FileReader();

          reader.onload = () => {
            resolve(
              reader.result
            );
          };

          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then(
      (images) => {
        setForm((current) => ({
          ...current,
          gallery: images.filter(
            Boolean
          ),
        }));
      }
    );
  };

  /*
   * ============================================================
   * OPEN ADD PRODUCT
   * ============================================================
   */

  const handleOpenAddForm = () => {
    setShowProducts(true);
    setEditingId(null);

    setForm({
      ...defaultProductForm,
    });

    setProductError('');
    setShowForm(true);

    setTimeout(() => {
      document
        .getElementById(
          'product-management-section'
        )
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    }, 100);
  };

  /*
   * ============================================================
   * OPEN EDIT PRODUCT
   * ============================================================
   */

  const handleOpenEditForm = (
    product
  ) => {
    if (!product) {
      return;
    }

    setShowProducts(true);
    setShowForm(true);
    setProductError('');

    setEditingId(
      Number(product.id)
    );

    const existingSizes =
      Array.isArray(
        product.size
      )
        ? product.size
        : Array.isArray(
            product.sizes
          )
        ? product.sizes
        : [];

    let colorInput = '';

    if (
      Array.isArray(
        product.colorOptions
      ) &&
      product.colorOptions.length
    ) {
      colorInput =
        product.colorOptions
          .map(
            (color) =>
              `${color.name || 'Color'}:${
                color.code ||
                color.value ||
                '#111111'
              }`
          )
          .join(', ');
    } else if (
      Array.isArray(
        product.colors
      )
    ) {
      colorInput =
        product.colors.join(', ');
    } else if (
      product.color
    ) {
      colorInput =
        product.color;
    }

    setForm({
      name:
        product.name || '',

      category:
        product.category ||
        'Men',

      shortDescription:
        product.shortDescription ||
        '',

      description:
        product.description ||
        '',

      material:
        product.material ||
        product.fabric ||
        '',

      fitStyle:
        product.fitStyle ||
        '',

      features:
        Array.isArray(
          product.features
        )
          ? product.features.join(
              ', '
            )
          : product.features ||
            '',

      sizes:
        existingSizes.join(
          ', '
        ),

      colors:
        colorInput,

      careInstructions:
        product.careInstructions ||
        '',

      image:
        product.image || '',

      gallery:
        Array.isArray(
          product.gallery
        )
          ? product.gallery
          : [],

      stock:
        product.stock ||
        'In Stock',

      featured:
        Boolean(
          product.featured
        ),
    });

    setTimeout(() => {
      document
        .getElementById(
          'product-management-section'
        )
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    }, 100);
  };

  /*
   * ============================================================
   * CLOSE PRODUCT FORM
   * ============================================================
   */

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);

    setForm({
      ...defaultProductForm,
    });
  };

  /*
   * ============================================================
   * SAVE PRODUCT
   * ============================================================
   */

  const handleSubmitProduct =
    async (event) => {
      event.preventDefault();

      if (saveLoading) {
        return;
      }

      const name =
        form.name.trim();

      const shortDescription =
        form.shortDescription.trim();

      const description =
        form.description.trim();

      if (!name) {
        window.alert(
          'Please enter a product name.'
        );
        return;
      }

      if (!description) {
        window.alert(
          'Please enter the full product description.'
        );
        return;
      }

      const sizes =
        toArray(form.sizes);

      const colorOptions =
        parseColors(
          form.colors
        );

      const colors =
        colorOptions.map(
          (color) =>
            color.code
        );

      const galleryImages =
        Array.isArray(
          form.gallery
        )
          ? form.gallery.filter(
              Boolean
            )
          : [];

      const finalImage =
        form.image ||
        galleryImages[0] ||
        '';

      const existingProduct =
        products.find(
          (product) =>
            Number(product.id) ===
            Number(editingId)
        );

      const productData = {
        name,

        shortDescription,

        description,

        image:
          finalImage,

        gallery:
          galleryImages,

        category:
          [
            'Men',
            'Women',
            'Kids',
            'Accessories',
          ].includes(
            form.category
          )
            ? form.category
            : 'Men',

        material:
          form.material.trim(),

        fabric:
          form.material.trim(),

        fitStyle:
          form.fitStyle.trim(),

        features:
          toArray(
            form.features
          ),

        careInstructions:
          form.careInstructions.trim(),

        size:
          sizes,

        sizes:
          sizes,

        color:
          colors[0] ||
          '#111111',

        colors:
          colors,

        colorOptions:
          colorOptions,

        rating:
          existingProduct?.rating ||
          4.7,

        reviews:
          existingProduct?.reviews ||
          0,

        stock:
          form.stock ||
          'In Stock',

        featured:
          Boolean(
            form.featured
          ),
      };

      try {
        setSaveLoading(true);

        if (
          editingId !== null
        ) {
          await updateProductAPI(
            editingId,
            productData
          );
        } else {
          await createProductAPI(
            productData
          );
        }

        await loadProducts();

        handleCloseForm();

        window.alert(
          editingId !== null
            ? 'Product updated successfully.'
            : 'Product created successfully.'
        );
      } catch (error) {
        console.error(
          'Failed to save product:',
          error
        );

        window.alert(
          'Failed to save product. Please try again.'
        );
      } finally {
        setSaveLoading(false);
      }
    };

  /*
   * ============================================================
   * DELETE PRODUCT
   * ============================================================
   */

  const handleDeleteProduct =
    async (productId) => {
      const selected =
        products.find(
          (product) =>
            Number(product.id) ===
            Number(productId)
        );

      if (!selected) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete ${selected.name}? This will remove it permanently.`
        );

      if (!confirmed) {
        return;
      }

      try {
        await deleteProductAPI(
          Number(productId)
        );

        await loadProducts();

        if (
          Number(editingId) ===
          Number(productId)
        ) {
          handleCloseForm();
        }
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

  /*
   * ============================================================
   * INQUIRIES
   * ============================================================
   */

  const handleInquiryStatusChange =
    async (
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

  const handleDeleteInquiry =
    async (inquiryId) => {
      const confirmed =
        window.confirm(
          'Delete this inquiry? This cannot be undone.'
        );

      if (!confirmed) {
        return;
      }

      try {
        await deleteInquiry(
          inquiryId
        );

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

  /*
   * ============================================================
   * SUBSCRIBER DELETE
   * ============================================================
   */

  const handleDeleteSubscriber =
    async (
      subscriberId
    ) => {
      const subscriber =
        subscribers.find(
          (item) =>
            Number(item.id) ===
            Number(subscriberId)
        );

      if (!subscriber) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete ${subscriber.email}? This cannot be undone.`
        );

      if (!confirmed) {
        return;
      }

      try {
        await deleteSubscriber(
          subscriberId
        );

        await refreshSubscribers();
      } catch (error) {
        console.error(
          'Failed to delete subscriber:',
          error
        );

        window.alert(
          'Failed to delete subscriber.'
        );
      }
    };

  /*
   * ============================================================
   * PASSWORD
   * ============================================================
   */

  const handleChangePassword =
    (event) => {
      event.preventDefault();

      setPasswordMessage('');

      const savedPassword =
        localStorage.getItem(
          ADMIN_PASSWORD_KEY
        ) ||
        'admin123';

      if (
        oldPassword !==
        savedPassword
      ) {
        setPasswordMessage(
          'Old password is incorrect.'
        );
        return;
      }

      if (
        !newPassword.trim()
      ) {
        setPasswordMessage(
          'Please enter a new password.'
        );
        return;
      }

      if (
        newPassword.length <
        6
      ) {
        setPasswordMessage(
          'New password must be at least 6 characters.'
        );
        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
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

  /*
   * ============================================================
   * FILTER INQUIRIES
   * ============================================================
   */

  const filteredInquiries =
    inquiries.filter(
      (inquiry) => {
        const customerName =
          inquiry.customer
            ?.fullName || '';

        const country =
          inquiry.customer
            ?.country || '';

        const inquiryId =
          String(
            inquiry.id || ''
          );

        const search =
          searchTerm
            .toLowerCase()
            .trim();

        const matchesSearch =
          customerName
            .toLowerCase()
            .includes(search) ||
          country
            .toLowerCase()
            .includes(search) ||
          inquiryId
            .toLowerCase()
            .includes(search);

        const matchesStatus =
          statusFilter ===
            'All' ||
          (inquiry.status ||
            'New') ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  /*
   * ============================================================
   * CUSTOMERS
   * ============================================================
   */

  const customers =
    inquiries.reduce(
      (list, inquiry) => {
        const customer =
          inquiry.customer;

        if (!customer) {
          return list;
        }

        const customerKey =
          customer.email ||
          `${customer.fullName || ''}-${customer.country || ''}`;

        const existing =
          list.find(
            (item) =>
              item.key ===
              customerKey
          );

        if (existing) {
          existing.orders += 1;
          return list;
        }

        list.push({
          key: customerKey,

          name:
            customer.fullName ||
            'Unknown Customer',

          email:
            customer.email ||
            'N/A',

          phone:
            customer.phone ||
            'N/A',

          city:
            customer.city ||
            'N/A',

          country:
            customer.country ||
            'N/A',

          address:
            customer.address ||
            'N/A',

          orders: 1,
        });

        return list;
      },
      []
    );

  const customerCountries =
    [
      ...new Set(
        customers.map(
          (customer) =>
            customer.country
        )
      ),
    ].filter(
      (country) =>
        country &&
        country !== 'N/A'
    );

  const filteredCustomers =
    customers.filter(
      (customer) => {
        const search =
          customerSearch
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
          customerCountry ===
            'All' ||
          customer.country ===
            customerCountry;

        return (
          matchesSearch &&
          matchesCountry
        );
      }
    );

  /*
   * ============================================================
   * COUNTERS
   * ============================================================
   */

  const totalInquiries =
    inquiries.length;

  const newInquiries =
    inquiries.filter(
      (inquiry) =>
        (inquiry.status ||
          'New') === 'New'
    ).length;

  const contactedInquiries =
    inquiries.filter(
      (inquiry) =>
        inquiry.status ===
        'Contacted'
    ).length;

  const completedInquiries =
    inquiries.filter(
      (inquiry) =>
        inquiry.status ===
        'Completed'
    ).length;

  const reportCountries =
    [
      ...new Set(
        inquiries
          .map(
            (inquiry) =>
              inquiry.customer
                ?.country
          )
          .filter(Boolean)
      ),
    ];

  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */

  const formatDate = (
    date
  ) => {
    if (!date) {
      return 'N/A';
    }

    return new Date(
      date
    ).toLocaleString();
  };

  const getCustomerName = (
    inquiry
  ) => {
    return (
      inquiry.customer
        ?.fullName ||
      'Unknown Customer'
    );
  };

  const getCustomerLocation = (
    inquiry
  ) => {
    const city =
      inquiry.customer
        ?.city || '';

    const country =
      inquiry.customer
        ?.country || '';

    if (!city && !country) {
      return 'N/A';
    }

    return [
      city,
      country,
    ]
      .filter(Boolean)
      .join(', ');
  };

  const getItemsText = (
    inquiry
  ) => {
    if (
      !Array.isArray(
        inquiry.items
      )
    ) {
      return 'No items';
    }

    return inquiry.items
      .map(
        (item) =>
          `${item.name} × ${item.quantity}`
      )
      .join(', ');
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="page">
      <section className="section">

        {/* =====================================================
            HEADER
            ===================================================== */}

        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p className="eyebrow">
              HK FITTERS
            </p>

            <h1
              style={{
                margin: 0,
              }}
            >
              Admin Dashboard
            </h1>

            <p
              style={{
                marginTop: '8px',
              }}
            >
              Manage products,
              inquiries,
              customers and
              website content.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setShowPasswordForm(
                (current) =>
                  !current
              );

              setPasswordMessage(
                ''
              );
            }}
          >
            {showPasswordForm
              ? 'Close Password Settings'
              : 'Change Password'}
          </button>
        </div>

        {/* =====================================================
            PASSWORD
            ===================================================== */}

        {showPasswordForm && (
          <form
            className="auth-card"
            onSubmit={
              handleChangePassword
            }
            style={{
              marginBottom:
                '24px',
            }}
          >
            <h3>
              Change Admin Password
            </h3>

            {passwordMessage && (
              <p
                style={{
                  fontWeight:
                    '600',
                }}
              >
                {passwordMessage}
              </p>
            )}

            <input
              type="password"
              placeholder="Old Password"
              value={
                oldPassword
              }
              onChange={(
                event
              ) =>
                setOldPassword(
                  event.target
                    .value
                )
              }
              required
            />

            <input
              type="password"
              placeholder="New Password"
              value={
                newPassword
              }
              onChange={(
                event
              ) =>
                setNewPassword(
                  event.target
                    .value
                )
              }
              required
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={
                confirmPassword
              }
              onChange={(
                event
              ) =>
                setConfirmPassword(
                  event.target
                    .value
                )
              }
              required
            />

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                marginTop:
                  '12px',
              }}
            >
              Update Password
            </button>
          </form>
        )}

        {/* =====================================================
            DASHBOARD CARDS
            ===================================================== */}

        <div className="card-grid">

          {/* PRODUCTS */}

          <article className="product-card">
            <p className="eyebrow">
              Catalog
            </p>

            <h3>
              Products
            </h3>

            <p>
              Add, edit and
              delete sportswear
              products.
            </p>

            <button
              type="button"
              className="btn btn-secondary small"
              onClick={() => {
                const next =
                  !showProducts;

                setShowProducts(
                  next
                );

                if (next) {
                  setTimeout(
                    () => {
                      document
                        .getElementById(
                          'product-management-section'
                        )
                        ?.scrollIntoView(
                          {
                            behavior:
                              'smooth',
                            block:
                              'start',
                          }
                        );
                    },
                    100
                  );
                }
              }}
            >
              {showProducts
                ? 'Close'
                : `Open (${products.length})`}
            </button>
          </article>

          {/* ORDERS */}

          <article className="product-card">
            <p className="eyebrow">
              Inquiries
            </p>

            <h3>
              Orders
            </h3>

            <p>
              Manage customer
              inquiries.
            </p>

            <button
              type="button"
              className="btn btn-secondary small"
              onClick={() => {
                const next =
                  !showOrders;

                setShowOrders(
                  next
                );

                if (next) {
                  refreshInquiries();
                }
              }}
            >
              {showOrders
                ? 'Close'
                : `Open (${inquiries.length})`}
            </button>
          </article>

          {/* CUSTOMERS */}

          <article className="product-card">
            <p className="eyebrow">
              Customers
            </p>

            <h3>
              Customers
            </h3>

            <p>
              View customer
              records.
            </p>

            <button
              type="button"
              className="btn btn-secondary small"
              onClick={() => {
                document
                  .getElementById(
                    'customers-section'
                  )
                  ?.scrollIntoView(
                    {
                      behavior:
                        'smooth',
                    }
                  );
              }}
            >
              Open ({customers.length})
            </button>
          </article>

          {/* SUBSCRIBERS */}

          <article className="product-card">
            <p className="eyebrow">
              Newsletter
            </p>

            <h3>
              Subscribers
            </h3>

            <p>
              View newsletter
              subscribers.
            </p>

            <button
              type="button"
              className="btn btn-secondary small"
              onClick={() => {
                const next =
                  !showSubscribers;

                setShowSubscribers(
                  next
                );

                if (next) {
                  refreshSubscribers();
                }
              }}
            >
              {showSubscribers
                ? 'Close'
                : `Open (${subscribers.length})`}
            </button>
          </article>

          {/* REPORTS */}

          <article className="product-card">
            <p className="eyebrow">
              Analytics
            </p>

            <h3>
              Reports
            </h3>

            <p>
              View inquiry
              activity.
            </p>

            <button
              type="button"
              className="btn btn-secondary small"
              onClick={() =>
                setShowReports(
                  (current) =>
                    !current
                )
              }
            >
              {showReports
                ? 'Close'
                : 'Open'}
            </button>
          </article>
        </div>

        {/* =====================================================
            PRODUCT MANAGEMENT
            ===================================================== */}

        {showProducts && (
          <section
            id="product-management-section"
            style={{
              marginTop:
                '32px',
            }}
          >

            <div
              className="section-heading"
              style={{
                marginBottom:
                  '16px',
              }}
            >
              <div>
                <p className="eyebrow">
                  Product Management
                </p>

                <h2>
                  Manage Sportswear Products
                </h2>

                <p>
                  Add professional
                  product information,
                  images, sizes and
                  colors.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={
                  handleOpenAddForm
                }
              >
                Add Product
              </button>
            </div>

            {/* PRODUCT ERROR */}

            {productError && (
              <div
                className="empty-state"
                style={{
                  marginBottom:
                    '20px',
                }}
              >
                <h3>
                  Products could not
                  be loaded
                </h3>

                <p>
                  {productError}
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={
                    loadProducts
                  }
                >
                  Try Again
                </button>
              </div>
            )}

            {/* =================================================
                PRODUCT FORM
                ================================================= */}

            {showForm && (
              <form
                className="auth-card"
                onSubmit={
                  handleSubmitProduct
                }
                style={{
                  marginBottom:
                    '24px',
                  padding:
                    '24px',
                }}
              >

                <div
                  style={{
                    display:
                      'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'flex-start',
                    gap: '16px',
                    marginBottom:
                      '20px',
                    flexWrap:
                      'wrap',
                  }}
                >
                  <div>
                    <p className="eyebrow">
                      Product
                    </p>

                    <h3
                      style={{
                        margin:
                          0,
                      }}
                    >
                      {editingId !==
                      null
                        ? 'Edit Product'
                        : 'Add Product'}
                    </h3>

                    <p
                      style={{
                        marginTop:
                          '6px',
                      }}
                    >
                      Enter the
                      information
                      customers need
                      to understand
                      the product.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={
                      handleCloseForm
                    }
                  >
                    Close
                  </button>
                </div>

                {/* NAME */}

                <label>
                  <strong>
                    Product Name
                  </strong>

                  <input
                    type="text"
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Product name"
                    required
                  />
                </label>

                {/* CATEGORY */}

                <label>
                  <strong>
                    Category
                  </strong>

                  <select
                    name="category"
                    value={
                      form.category
                    }
                    onChange={
                      handleFormChange
                    }
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
                </label>

                {/* SHORT DESCRIPTION */}

                <label>
                  <strong>
                    Short Description
                  </strong>

                  <textarea
                    name="shortDescription"
                    value={
                      form.shortDescription
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Short product introduction"
                    rows="3"
                  />
                </label>

                {/* FULL DESCRIPTION */}

                <label>
                  <strong>
                    Full Description
                  </strong>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Complete product description"
                    rows="6"
                    required
                  />
                </label>

                {/* MATERIAL */}

                <label>
                  <strong>
                    Material / Fabric
                  </strong>

                  <input
                    type="text"
                    name="material"
                    value={
                      form.material
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="e.g. Polyester, Cotton, Fleece"
                  />
                </label>

                {/* FIT */}

                <label>
                  <strong>
                    Fit / Style
                  </strong>

                  <input
                    type="text"
                    name="fitStyle"
                    value={
                      form.fitStyle
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="e.g. Regular Fit, Oversized"
                  />
                </label>

                {/* FEATURES */}

                <label>
                  <strong>
                    Features
                  </strong>

                  <textarea
                    name="features"
                    value={
                      form.features
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Breathable, lightweight, durable"
                    rows="4"
                  />

                  <small>
                    Separate multiple
                    features with
                    commas.
                  </small>
                </label>

                {/* SIZES */}

                <label>
                  <strong>
                    Available Sizes
                  </strong>

                  <input
                    type="text"
                    name="sizes"
                    value={
                      form.sizes
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="S, M, L, XL, XXL"
                  />

                  <small>
                    Example: S, M, L,
                    XL, XXL
                  </small>
                </label>

                {/* COLORS */}

                <label>
                  <strong>
                    Available Colors
                  </strong>

                  <input
                    type="text"
                    name="colors"
                    value={
                      form.colors
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Black:#111111, Red:#e10600, White:#ffffff"
                  />

                  <small>
                    Format:
                    Black:#111111,
                    Red:#e10600
                  </small>
                </label>

                {/* CARE */}

                <label>
                  <strong>
                    Care Instructions
                  </strong>

                  <textarea
                    name="careInstructions"
                    value={
                      form.careInstructions
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Washing and care instructions"
                    rows="4"
                  />
                </label>

                {/* STOCK */}

                <label>
                  <strong>
                    Stock Status
                  </strong>

                  <select
                    name="stock"
                    value={
                      form.stock
                    }
                    onChange={
                      handleFormChange
                    }
                  >
                    <option value="In Stock">
                      In Stock
                    </option>

                    <option value="Made to Order">
                      Made to Order
                    </option>

                    <option value="Out of Stock">
                      Out of Stock
                    </option>
                  </select>
                </label>

                {/* MAIN IMAGE */}

                <div
                  style={{
                    display:
                      'grid',
                    gap:
                      '10px',
                    padding:
                      '16px',
                    border:
                      '1px solid #e5e5e5',
                    borderRadius:
                      '12px',
                    marginTop:
                      '12px',
                  }}
                >
                  <strong>
                    Main Product Image
                  </strong>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageUpload
                    }
                  />

                  {form.image && (
                    <img
                      src={
                        form.image
                      }
                      alt="Main product preview"
                      style={{
                        width:
                          '180px',
                        height:
                          '180px',
                        objectFit:
                          'cover',
                        borderRadius:
                          '10px',
                      }}
                    />
                  )}
                </div>

                {/* GALLERY */}

                <div
                  style={{
                    display:
                      'grid',
                    gap:
                      '10px',
                    padding:
                      '16px',
                    border:
                      '1px solid #e5e5e5',
                    borderRadius:
                      '12px',
                    marginTop:
                      '12px',
                  }}
                >
                  <strong>
                    Gallery Images
                  </strong>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={
                      handleGalleryUpload
                    }
                  />

                  {form.gallery
                    .length >
                    0 && (
                    <div
                      style={{
                        display:
                          'flex',
                        gap:
                          '10px',
                        flexWrap:
                          'wrap',
                      }}
                    >
                      {form.gallery.map(
                        (
                          image,
                          index
                        ) => (
                          <img
                            key={`${image}-${index}`}
                            src={
                              image
                            }
                            alt={`Gallery ${
                              index +
                              1
                            }`}
                            style={{
                              width:
                                '90px',
                              height:
                                '90px',
                              objectFit:
                                'cover',
                              borderRadius:
                                '8px',
                            }}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* FEATURED */}

                <label
                  style={{
                    display:
                      'flex',
                    alignItems:
                      'center',
                    gap:
                      '8px',
                    marginTop:
                      '16px',
                    cursor:
                      'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={
                      form.featured
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          featured:
                            event
                              .target
                              .checked,
                        })
                      )
                    }
                  />

                  <strong>
                    Featured Product
                  </strong>
                </label>

                {/* BUTTONS */}

                <div
                  style={{
                    display:
                      'flex',
                    gap:
                      '10px',
                    marginTop:
                      '20px',
                    flexWrap:
                      'wrap',
                  }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      saveLoading
                    }
                  >
                    {saveLoading
                      ? 'Saving...'
                      : editingId !==
                        null
                      ? 'Save Changes'
                      : 'Create Product'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={
                      handleCloseForm
                    }
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* =================================================
                PRODUCTS LIST
                ================================================= */}

            {productLoading ? (
              <div
                className="empty-state"
              >
                <h3>
                  Loading Products...
                </h3>

                <p>
                  Please wait while
                  products are being
                  loaded.
                </p>
              </div>
            ) : products.length ===
              0 ? (
              <div
                className="empty-state"
              >
                <h3>
                  No Products Found
                </h3>

                <p>
                  Add your first
                  sportswear product
                  using the Add
                  Product button.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={
                    handleOpenAddForm
                  }
                >
                  Add Product
                </button>
              </div>
            ) : (
              <div
                className="card-grid"
                style={{
                  marginTop:
                    '12px',
                }}
              >
                {products.map(
                  (product) => (
                    <article
                      className="product-card"
                      key={
                        product.id
                      }
                      style={{
                        overflow:
                          'hidden',
                      }}
                    >

                      <img
                        src={
                          product.image ||
                          product
                            .gallery?.[0] ||
                          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
                        }
                        alt={
                          product.name
                        }
                        style={{
                          width:
                            '100%',
                          height:
                            '240px',
                          objectFit:
                            'contain',
                          display:
                            'block',
                          background:
                            '#f7f7f7',
                          borderRadius:
                            '12px',
                          marginBottom:
                            '14px',
                        }}
                        onError={(
                          event
                        ) => {
                          event.currentTarget.src =
                            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80';
                        }}
                      />

                      <p className="eyebrow">
                        {product.category ||
                          'Sportswear'}
                      </p>

                      <h3>
                        {product.name}
                      </h3>

                      {product.shortDescription && (
                        <p>
                          {
                            product.shortDescription
                          }
                        </p>
                      )}

                      <p>
                        <strong>
                          Stock:
                        </strong>{' '}
                        {product.stock ||
                          'In Stock'}
                      </p>

                      <div
                        style={{
                          display:
                            'flex',
                          gap:
                            '8px',
                          flexWrap:
                            'wrap',
                          marginTop:
                            '14px',
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-secondary small"
                          onClick={() =>
                            handleOpenEditForm(
                              product
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-secondary small"
                          onClick={() =>
                            handleDeleteProduct(
                              product.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            ORDERS / INQUIRIES
            ===================================================== */}

        {showOrders && (
          <section
            style={{
              marginTop:
                '32px',
            }}
          >
            <div
              className="section-heading"
            >
              <div>
                <p className="eyebrow">
                  Customer Inquiries
                </p>

                <h2>
                  Customer Inquiries
                </h2>

                <p>
                  Manage inquiries
                  received from the
                  website.
                </p>
              </div>
            </div>

            <div
              style={{
                display:
                  'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(200px, 1fr))',
                gap:
                  '12px',
                marginBottom:
                  '20px',
              }}
            >
              <input
                type="text"
                placeholder="Search customer or inquiry ID..."
                value={
                  searchTerm
                }
                onChange={(
                  event
                ) =>
                  setSearchTerm(
                    event.target
                      .value
                  )
                }
              />

              <select
                value={
                  statusFilter
                }
                onChange={(
                  event
                ) =>
                  setStatusFilter(
                    event.target
                      .value
                  )
                }
              >
                <option value="All">
                  All Statuses
                </option>

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

            {filteredInquiries.length ===
            0 ? (
              <div className="empty-state">
                <h3>
                  No inquiries yet
                </h3>

                <p>
                  Customer inquiries
                  will appear here.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display:
                    'grid',
                  gap:
                    '16px',
                }}
              >
                {filteredInquiries.map(
                  (inquiry) => (
                    <article
                      className="product-card"
                      key={
                        inquiry.id
                      }
                      style={{
                        padding:
                          '20px',
                      }}
                    >
                      <div
                        style={{
                          display:
                            'flex',
                          justifyContent:
                            'space-between',
                          gap:
                            '16px',
                          flexWrap:
                            'wrap',
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
                            style={{
                              display:
                                'block',
                              marginBottom:
                                '6px',
                              fontWeight:
                                '600',
                            }}
                          >
                            Status
                          </label>

                          <select
                            value={
                              inquiry.status ||
                              'New'
                            }
                            onChange={(
                              event
                            ) =>
                              handleInquiryStatusChange(
                                inquiry.id,
                                event
                                  .target
                                  .value
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
                          margin:
                            '16px 0',
                          opacity:
                            0.2,
                        }}
                      />

                      <p>
                        <strong>
                          Address:
                        </strong>{' '}
                        {inquiry
                          .customer
                          ?.address ||
                          'N/A'}
                      </p>

                      <p>
                        <strong>
                          Postal Code:
                        </strong>{' '}
                        {inquiry
                          .customer
                          ?.postalCode ||
                          'N/A'}
                      </p>

                      <p>
                        <strong>
                          Products:
                        </strong>{' '}
                        {getItemsText(
                          inquiry
                        )}
                      </p>

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
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            SUBSCRIBERS
            ===================================================== */}

        {showSubscribers && (
          <section
            style={{
              marginTop:
                '32px',
            }}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  Newsletter
                </p>

                <h2>
                  Subscribers
                </h2>
              </div>
            </div>

            {subscribers.length ===
            0 ? (
              <div className="empty-state">
                <h3>
                  No subscribers
                </h3>

                <p>
                  Newsletter
                  subscribers will
                  appear here.
                </p>
              </div>
            ) : (
              <div
                className="card-grid"
              >
                {subscribers.map(
                  (
                    subscriber
                  ) => (
                    <article
                      className="product-card"
                      key={
                        subscriber.id
                      }
                    >
                      <p className="eyebrow">
                        Subscriber
                      </p>

                      <h3>
                        {
                          subscriber.email
                        }
                      </h3>

                      <button
                        type="button"
                        className="btn btn-secondary small"
                        onClick={() =>
                          handleDeleteSubscriber(
                            subscriber.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            CUSTOMERS
            ===================================================== */}

        <section
          id="customers-section"
          style={{
            marginTop:
              '32px',
          }}
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                Customer Records
              </p>

              <h2>
                Customers
              </h2>
            </div>
          </div>

          <div
            style={{
              display:
                'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(200px, 1fr))',
              gap:
                '12px',
              marginBottom:
                '20px',
            }}
          >
            <input
              type="text"
              placeholder="Search customer..."
              value={
                customerSearch
              }
              onChange={(
                event
              ) =>
                setCustomerSearch(
                  event.target
                    .value
                )
              }
            />

            <select
              value={
                customerCountry
              }
              onChange={(
                event
              ) =>
                setCustomerCountry(
                  event.target
                    .value
                )
              }
            >
              <option value="All">
                All Countries
              </option>

              {customerCountries.map(
                (country) => (
                  <option
                    key={
                      country
                    }
                    value={
                      country
                    }
                  >
                    {country}
                  </option>
                )
              )}
            </select>
          </div>

          {filteredCustomers.length ===
          0 ? (
            <div className="empty-state">
              <h3>
                No customer records
              </h3>

              <p>
                Customer records
                will appear here
                after inquiries
                are received.
              </p>
            </div>
          ) : (
            <div
              className="card-grid"
            >
              {filteredCustomers.map(
                (customer) => (
                  <article
                    className="product-card"
                    key={
                      customer.key
                    }
                  >
                    <p className="eyebrow">
                      Customer
                    </p>

                    <h3>
                      {
                        customer.name
                      }
                    </h3>

                    <p>
                      <strong>
                        Email:
                      </strong>{' '}
                      {
                        customer.email
                      }
                    </p>

                    <p>
                      <strong>
                        Phone:
                      </strong>{' '}
                      {
                        customer.phone
                      }
                    </p>

                    <p>
                      <strong>
                        Location:
                      </strong>{' '}
                      {
                        customer.city
                      }
                      ,{' '}
                      {
                        customer.country
                      }
                    </p>

                    <p>
                      <strong>
                        Inquiries:
                      </strong>{' '}
                      {
                        customer.orders
                      }
                    </p>
                  </article>
                )
              )}
            </div>
          )}
        </section>

        {/* =====================================================
            REPORTS
            ===================================================== */}

        {showReports && (
          <section
            style={{
              marginTop:
                '32px',
            }}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  Reports
                </p>

                <h2>
                  Activity Overview
                </h2>
              </div>
            </div>

            <div
              className="card-grid"
            >
              <article className="product-card">
                <p className="eyebrow">
                  Total
                </p>

                <h3>
                  {
                    totalInquiries
                  }
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
                  {
                    newInquiries
                  }
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
                  {
                    contactedInquiries
                  }
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
                  {
                    completedInquiries
                  }
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
                  {
                    reportCountries.length
                  }
                </h3>

                <p>
                  Countries with inquiries
                </p>
              </article>
            </div>
          </section>
        )}

      </section>
    </div>
  );
}

export default AdminDashboardPage;