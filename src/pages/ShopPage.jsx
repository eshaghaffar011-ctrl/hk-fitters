import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProductsFromAPI } from '../data/products';
import ProductCard from '../components/shop/ProductCard';
import ShopFilters from '../components/shop/ShopFilters';

const PAGE_SIZE = 6;

function ShopPage() {
  const[products, setProducts] = useState([]);
  const[loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = 
  useState(
    searchParams.get('category') || 'All'
  );
  const [selectedSize, setSelectedSize] = useState('All');
  const [priceRange, setPriceRange] = useState(220);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await fetchProductsFromAPI();
      console.log('SHOP API PRODUCTS:', data);

      setProducts(data);
    } catch (error) {
      console.error('Failed to load shop products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  loadProducts();
}, []);

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
  }, [products, priceRange, searchText, selectedCategory, selectedSize, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="page">
      <section className="section">
        <div className="section-heading shop-banner">
          <div>
            <p className="eyebrow">Shop Collection</p>
            <h1>Premium Sportswear for Every Performance</h1>
          </div>
        </div>

        <ShopFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          searchText={searchText}
          setSearchText={setSearchText}
          sortBy={sortBy}
          setSortBy={setSortBy}
          allSizes={allSizes}
        />

        {loading ? (
  <div className="empty-state">
    Loading products...
  </div>
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

        {filteredProducts.length === 0 ? (
          <div className="empty-state">No products match your current filters.</div>
        ) : hasMore ? (
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
