import { createContext, useState, useEffect } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  // Use a function to access local storage to avoid hydration issues
  const getLocalStorage = () => {
    if (typeof window !== "undefined") {
      const ls = window.localStorage;
      const defaultProducts = JSON.parse(ls.getItem("user_cart")) || {};
      return defaultProducts;
    }
    return {};
  };

  const [cart, setCart] = useState(getLocalStorage);

  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      // Update local storage when the cart changes
      localStorage.setItem("user_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const clearCart = () => {
    // Clear the cart in both state and local storage
    setCart({});
    localStorage.removeItem("user_cart");
  };

  return (
    <CartContext.Provider value={{ cart, setCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
