import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProductsFromAPI } from '../data/products';
import ProductCard from '../components/shop/ProductCard';
import ShopFilters from '../components/shop/ShopFilters';

const PAGE_SIZE = 6;

function ShopPage() {
  const[products, setProducts] = useState([]);
  const[loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = 
  useState(
    searchParams.get('category') || 'All'
  );
  const [selectedSize, setSelectedSize] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    const loadProducts = async () => {
      try {
        setLoading(true);
        setLoadError('');

        const data = await fetchProductsFromAPI(controller.signal);

        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to load shop products:', error);

        if (isMounted) {
          setProducts([]);
          setLoadError('We could not load the product collection right now. Please try again.');
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

  const categoryFromUrl = searchParams.get('category') || 'All';

  useEffect(() => {
    if (['All', 'Men', 'Women', 'Accessories', 'Kids'].includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  
  const allSizes = useMemo(() => {
    const availableSizes = products.flatMap((product) => product.size);
    return ['All', ...new Set(availableSizes)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let items = [...products];

    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      items = items.filter((product) =>
        [product.name, product.category, product.color, product.badge]
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }

    if (selectedCategory !== 'All') {
      items = items.filter((product) => product.category === selectedCategory);
    }

    if (selectedSize !== 'All') {
      items = items.filter((product) => product.size.includes(selectedSize));
    }


    if (sortBy === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    }

    if (sortBy === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    }

    if (sortBy === 'popular') {
      items.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === 'newest') {
      items.sort((a, b) => b.id - a.id);
    }

    return items;
  }, [products, searchText, selectedCategory, selectedSize, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="page">
      <section className="section">
        <div className="section-heading shop-banner">
          <div>
            <p className="eyebrow">Shop Collection</p>
            <h1>Premium Sportswear &amp; Activewear Shop</h1>
            <p className="shop-intro">
              Explore premium sportswear, activewear, and gym wear collections for training, performance, and everyday movement.
            </p>
          </div>
        </div>

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

        {loading ? (
          <div className="empty-state" role="status" aria-live="polite">
            Loading the latest sportswear and activewear collection...
          </div>
        ) : loadError ? (
          <div className="empty-state" role="alert">
            <p>{loadError}</p>
            <button type="button" className="btn btn-primary" onClick={() => setRetryCount((current) => current + 1)}>
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">No products match your current filters.</div>
        ) : (
          <div className="card-grid shop-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {!loading && !loadError && filteredProducts.length > 0 && hasMore ? (
          <div className="shop-load-more-wrap">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
            >
              Load More
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default ShopPage;
