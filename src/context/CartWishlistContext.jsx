import { createContext, useContext, useMemo, useState } from 'react';

const CartWishlistContext = createContext();

export function CartWishlistProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const selectedSize = product.selectedSize || product.size?.[0] || 'M';
      const selectedColor = product.selectedColor || product.color || 'Black';
      const quantityToAdd = Number(product.quantity) > 0 ? Number(product.quantity) : 1;
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }

      return [...prev, { ...product, selectedSize, selectedColor, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (id, selectedSize, selectedColor) => {
    setCartItems((prev) => {
      if (selectedSize === undefined && selectedColor === undefined) {
        return prev.filter((item) => item.id !== id);
      }

      return prev.filter(
        (item) => !(item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
      );
    });
  };

  const updateQuantity = (id, quantity, selectedSize, selectedColor) => {
    const nextQuantity = Number(quantity);
    if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
      return;
    }

    setCartItems((prev) => prev.map((item) =>
      item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
        ? { ...item, quantity: nextQuantity }
        : item
    ));
  };

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      return [...prev, product];
    });
  };

  const value = useMemo(() => ({
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWishlist
  }), [cartItems, wishlistItems]);

  return (
    <CartWishlistContext.Provider value={value}>
      {children}
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  return useContext(CartWishlistContext);
}
