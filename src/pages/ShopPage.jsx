import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../ShopPage.css';
import { fetchProductsFromAPI } from '../data/products';
import ProductCard from '../components/shop/ProductCard';
import ShopFilters from '../components/shop/ShopFilters';

const PAGE_SIZE = 6;

const CATEGORY_OPTIONS = [
  {
    value: 'All',
    label: 'All Sportswear',
    description: 'Explore our complete sportswear collection.',
  },
  {
    value: 'Men',
    label: "Men's Sportswear",
    description: 'Performance apparel for training and competition.',
  },
  {
    value: 'Women',
    label: "Women's Activewear",
    description: 'Performance-focused activewear for modern brands.',
  },
  {
    value: 'Kids',
    label: "Kids' Sportswear",
    description: 'Comfortable sportswear for active young athletes.',
  },
  {
    value: 'Accessories',
    label: 'Sportswear Accessories',
    description: 'Accessories designed to complete sports collections.',
  },
];

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const [searchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(
    ['All', 'Men', 'Women', 'Kids', 'Accessories'].includes(categoryFromUrl)
      ? categoryFromUrl
      : 'All'
  );

  const [selectedSize, setSelectedSize] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let isMounted = true;

    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 12000);

    const loadProducts = async () => {
      try {
        setLoading(true);
        setLoadError('');

        const data = await fetchProductsFromAPI(controller.signal, {
          includeGallery: false,
        });

        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to load shop products:', error);

        if (isMounted) {
          setProducts([]);
          setLoadError(
            'We could not load the product collection right now. Please try again.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [retryCount]);

  useEffect(() => {
    if (
      ['All', 'Men', 'Women', 'Kids', 'Accessories'].includes(categoryFromUrl)
    ) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  /*
   * Reset pagination whenever the user changes filters,
   * search, category or sorting.
   */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, selectedSize, searchText, sortBy]);

  const allSizes = useMemo(() => {
    const availableSizes = products.flatMap((product) =>
      Array.isArray(product.size) ? product.size : []
    );

    return ['All', ...new Set(availableSizes)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let items = [...products];

    if (searchText.trim()) {
      const query = searchText.trim().toLowerCase();

      items = items.filter((product) =>
        [
          product.name,
          product.category,
          product.color,
          product.badge,
          product.description,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }

    if (selectedCategory !== 'All') {
      items = items.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedSize !== 'All') {
      items = items.filter((product) =>
        Array.isArray(product.size)
          ? product.size.includes(selectedSize)
          : false
      );
    }

    if (sortBy === 'price-low') {
      items.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (sortBy === 'price-high') {
      items.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    if (sortBy === 'popular') {
      items.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    if (sortBy === 'newest') {
      items.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
    }

    return items;
  }, [
    products,
    searchText,
    selectedCategory,
    selectedSize,
    sortBy,
  ]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const activeCategory =
    CATEGORY_OPTIONS.find((item) => item.value === selectedCategory) ||
    CATEGORY_OPTIONS[0];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="shop-page">

      {/* =====================================================
          SHOP HERO
          ===================================================== */}
      <section
  className="shop-hero"
  style={{
    backgroundImage: `
      linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.94) 0%,
        rgba(0, 0, 0, 0.84) 42%,
        rgba(0, 0, 0, 0.60) 72%,
        rgba(85, 0, 0, 0.68) 100%
      ),
      url("/logo/s-hero.png")
    `,
  }}
>
        <div className="shop-hero-inner">

          <div className="shop-hero-content">
            <p className="shop-eyebrow">
              HK FITTERS · SPORTSWEAR MANUFACTURER
            </p>

            <h1>
              Custom Sportswear &amp; Activewear
              <span> Manufacturing Collection</span>
            </h1>

            <p className="shop-hero-text">
              Explore performance sportswear and activewear collections
              manufactured for brands, retailers, wholesalers, teams,
              and businesses worldwide.
            </p>

            <div className="shop-hero-actions">
              <a
                href="#shop-products"
                className="shop-primary-btn"
              >
                Explore Products
              </a>

              <Link
                to="/contact"
                className="shop-secondary-btn"
              >
                Request a Quote
              </Link>
            </div>

            <div className="shop-trust-row">
              <span>OEM Manufacturing</span>
              <span>Private Label</span>
              <span>Bulk Orders</span>
              <span>Worldwide Export</span>
            </div>
          </div>

          <div className="shop-hero-panel">
            <p className="shop-panel-label">
              Built for Global Buyers
            </p>

            <h2>
              Performance apparel made for your brand.
            </h2>

            <p>
              Select products from our collection or contact HK FITTERS
              for custom designs, private-label production, and bulk
              sportswear manufacturing.
            </p>

            <Link to="/contact">
              Start a Manufacturing Inquiry →
            </Link>
          </div>

        </div>
      </section>

      {/* =====================================================
          CATEGORY NAVIGATION
          ===================================================== */}
      <section className="shop-category-section">
        <div className="shop-container">

          <div className="shop-section-heading">
            <div>
              <p className="shop-section-eyebrow">
                Sportswear Categories
              </p>

              <h2>
                Explore Our Sportswear Collections
              </h2>
            </div>

            <p>
              Choose a product category to explore sportswear,
              activewear, and performance apparel for different
              markets and customer groups.
            </p>
          </div>

          <div className="shop-category-grid">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category.value}
                type="button"
                className={`shop-category-card ${
                  selectedCategory === category.value
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleCategoryChange(category.value)
                }
              >
                <span className="shop-category-number">
                  {category.value === 'All'
                    ? '01'
                    : category.value === 'Men'
                      ? '02'
                      : category.value === 'Women'
                        ? '03'
                        : category.value === 'Kids'
                          ? '04'
                          : '05'}
                </span>

                <span className="shop-category-title">
                  {category.label}
                </span>

                <span className="shop-category-description">
                  {category.description}
                </span>

                <span className="shop-category-arrow">
                  →
                </span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* =====================================================
          PRODUCTS
          ===================================================== */}
      <section
        id="shop-products"
        className="shop-products-section"
      >
        <div className="shop-container">

          <div className="shop-products-header">

            <div>
              <p className="shop-section-eyebrow">
                Product Collection
              </p>

              <h2>
                {activeCategory.label}
              </h2>

              <p className="shop-products-intro">
                {activeCategory.description}
              </p>
            </div>

            {!loading && !loadError ? (
              <div className="shop-result-count">
                <strong>{filteredProducts.length}</strong>
                <span>
                  {filteredProducts.length === 1
                    ? 'Product'
                    : 'Products'}
                </span>
              </div>
            ) : null}

          </div>

          {/* FILTERS */}
          <div className="shop-filter-shell">
            <ShopFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              searchText={searchText}
              setSearchText={setSearchText}
              sortBy={sortBy}
              setSortBy={setSortBy}
              allSizes={allSizes}
            />
          </div>

          {/* LOADING */}
          {loading ? (
            <div
              className="shop-state"
              role="status"
              aria-live="polite"
            >
              <div className="shop-state-icon">
                ...
              </div>

              <h3>
                Loading our sportswear collection
              </h3>

              <p>
                Please wait while we load the latest
                products.
              </p>
            </div>
          ) : loadError ? (
            /* ERROR */
            <div
              className="shop-state shop-state-error"
              role="alert"
            >
              <div className="shop-state-icon">
                !
              </div>

              <h3>
                Collection temporarily unavailable
              </h3>

              <p>{loadError}</p>

              <button
                type="button"
                className="shop-primary-btn"
                onClick={() =>
                  setRetryCount((current) => current + 1)
                }
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* EMPTY */
            <div className="shop-state">
              <div className="shop-state-icon">
                —
              </div>

              <h3>
                No products found
              </h3>

              <p>
                Try changing your category, size, search,
                or sorting options.
              </p>

              <button
                type="button"
                className="shop-primary-btn"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSize('All');
                  setSearchText('');
                  setSortBy('newest');
                }}
              >
                View All Products
              </button>
            </div>
          ) : (
            <>
              {/* PRODUCT GRID */}
              <div className="card-grid shop-grid">
                {visibleProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={index < 2}
                  />
                ))}
              </div>

              {/* LOAD MORE */}
              {hasMore ? (
                <div className="shop-load-more-wrap">
                  <button
                    type="button"
                    className="shop-load-more-btn"
                    onClick={() =>
                      setVisibleCount(
                        (current) => current + PAGE_SIZE
                      )
                    }
                  >
                    Load More Products
                    <span>→</span>
                  </button>

                  <p>
                    Showing {visibleProducts.length} of{' '}
                    {filteredProducts.length} products
                  </p>
                </div>
              ) : null}
            </>
          )}

        </div>
      </section>

      {/* =====================================================
          B2B MANUFACTURING CTA
          ===================================================== */}
      <section className="shop-manufacturing-section">
        <div className="shop-container">

          <div className="shop-manufacturing-card">

            <div className="shop-manufacturing-content">
              <p className="shop-section-eyebrow">
                B2B SPORTSWEAR MANUFACTURING
              </p>

              <h2>
                Need custom sportswear for your brand?
              </h2>

              <p>
                HK FITTERS works with sportswear brands,
                wholesalers, retailers, teams, and businesses
                looking for reliable custom apparel production.
              </p>

              <div className="shop-service-list">
                <span>✓ Custom Sportswear Manufacturing</span>
                <span>✓ OEM Production</span>
                <span>✓ Private Label Sportswear</span>
                <span>✓ Bulk Manufacturing</span>
                <span>✓ Custom Designs</span>
                <span>✓ Worldwide Export</span>
              </div>

              <div className="shop-manufacturing-actions">
                <Link
                  to="/contact"
                  className="shop-primary-btn"
                >
                  Request a Quote
                </Link>

                <Link
                  to="/about"
                  className="shop-text-btn"
                >
                  Learn About HK FITTERS →
                </Link>
              </div>
            </div>

            <div className="shop-manufacturing-side">
              <div>
                <strong>01</strong>
                <span>
                  Select a product
                </span>
              </div>

              <div>
                <strong>02</strong>
                <span>
                  Share your requirements
                </span>
              </div>

              <div>
                <strong>03</strong>
                <span>
                  Receive your quotation
                </span>
              </div>

              <div>
                <strong>04</strong>
                <span>
                  Move forward with production
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default ShopPage;