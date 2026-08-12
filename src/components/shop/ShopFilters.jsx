function ShopFilters({
  selectedCategory,
  setSelectedCategory,
  selectedSize,
  setSelectedSize,
  priceRange,
  setPriceRange,
  searchText,
  setSearchText,
  sortBy,
  setSortBy,
  allSizes,
}) {
  return (
    <div className="filters-panel">
      <div className="search-field">
        <label>Search</label>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search products"
        />
      </div>

      <div>
        <label>Category</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="All">All</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Accessories">Accessories</option>
          <option value="Kids">Kids</option>
        </select>
      </div>

      <div>
        <label>Size</label>
        <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
          {allSizes.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Price Range</label>
        <input
          type="range"
          min="50"
          max="220"
          step="5"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
        />
        <span>Up to ${priceRange}</span>
      </div>

      <div>
        <label>Sort By</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price-low">Price Low-High</option>
          <option value="price-high">Price High-Low</option>
          <option value="popular">Popular</option>
        </select>
      </div>
    </div>
  );
}

export default ShopFilters;
