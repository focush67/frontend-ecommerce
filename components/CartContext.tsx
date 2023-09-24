import { createContext } from "react";
import { useState,useEffect } from "react";
export const CartContext = createContext({});

export function CartContextProvider({ children }: any) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;

  const defaultProducts = ls ? JSON.parse(ls?.getItem('cart')) : {};
  const [cart, setCart] = useState(defaultProducts || {});

  useEffect(()=>{
    if(Object.keys(cart)?.length > 0){
      ls?.setItem('cart',JSON.stringify(cart));
    }
  },[cart,ls])

  useEffect(()=>{
    if(ls && ls.getItem("cart")){
      setCart(JSON.parse(ls.getItem('cart')));
    }
  },[])

  const clearCart = () => {
    setCart({});
  }

  return (
    <CartContext.Provider value={{ cart, setCart,clearCart}}>
      {children}
    </CartContext.Provider>
  );
}
