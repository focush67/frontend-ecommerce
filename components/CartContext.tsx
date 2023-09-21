import { ObjectId } from "mongoose";
import { createContext } from "react";
import { useState,useEffect } from "react";
export const CartContext = createContext({});

export function CartContextProvider({ children }: any) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;

  const defaultProducts = ls ? JSON.parse(ls?.getItem('cart')) : [];
  const [cart, setCart] = useState(defaultProducts || []);

  useEffect(()=>{
    if(cart?.length > 0){
      ls?.setItem('cart',JSON.stringify(cart));
    }
  },[cart])

  useEffect(()=>{
    if(ls && ls.getItem("cart")){
      setCart(JSON.parse(ls.getItem('cart')));
    }
  },[])


  return (
    <CartContext.Provider value={{ cart, setCart}}>
      {children}
    </CartContext.Provider>
  );
}
