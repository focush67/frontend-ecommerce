import { CartContextType } from "@/lib/GlobalTypes";
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext<any>({});

export function CartContextProvider({children}:CartContextType) {
  const getLocalStorage = () => {
    if (typeof window !== "undefined") {
      const ls = window.localStorage;
      const defaultProducts = JSON.parse(ls.getItem("user_cart")!) || {};
      return defaultProducts;
    }
    return {};
  };

  const [cart, setCart] = useState(getLocalStorage);

  useEffect(() => {
    if (Object.keys(cart).length > 0) {

      localStorage.setItem("user_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const clearCart = () => {
    // Clear the cart in both state and local storage
    setCart({});
    if(typeof window !== "undefined"){
      localStorage.removeItem("user_cart");
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
