import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('hostelCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hostelCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (food, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.foodId === food._id);
      
      if (existingItem) {
        const updatedItems = prevItems.map(item =>
          item.foodId === food._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`Updated ${food.name} quantity in cart`);
        return updatedItems;
      } else {
        const newItem = {
          foodId: food._id,
          name: food.name,
          price: food.price,
          image: food.image,
          quantity: quantity,
          category: food.category,
          isVegetarian: food.isVegetarian
        };
        toast.success(`${food.name} added to cart`);
        return [...prevItems, newItem];
      }
    });
    
    // Open cart sidebar when adding items
    setIsCartOpen(true);
  };

  const removeFromCart = (foodId) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.foodId === foodId);
      if (item) {
        toast.success(`${item.name} removed from cart`);
      }
      return prevItems.filter(item => item.foodId !== foodId);
    });
  };

  const updateQuantity = (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(foodId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.foodId === foodId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartItem = (foodId) => {
    return cartItems.find(item => item.foodId === foodId);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartItem,
    isCartOpen,
    setIsCartOpen,
    toggleCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};