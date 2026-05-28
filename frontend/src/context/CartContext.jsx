import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, {
        product_id: product.id,
        title: product.title,
        price: product.price,
        image_url: product.image_url,
        quantity: 1,
      }];
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeItem(productId);
    setItems((prev) =>
      prev.map((i) => (i.product_id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}