import { createContext } from "react";
import { useState,useEffect } from "react";
export const CartContext = createContext({});

export function CartContextProvider({ children,initialCart }: any) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;

  const [cart, setCart] = useState(initialCart || {});

  useEffect(()=>{
    if(Object.keys(cart)?.length > 0){
      ls?.setItem('cart',JSON.stringify(cart));
    }
  },[cart,ls])

  useEffect(()=>{
    if(ls && ls.getItem("cart") && !initialCart)
    {
      setCart(JSON.parse(ls.getItem("cart")));
    }
  },[initialCart,ls]);

  const clearCart = () => {
    setCart({});
  }

  return (
    <CartContext.Provider value={{ cart, setCart,clearCart}}>
      {children}
    </CartContext.Provider>
  );
}
