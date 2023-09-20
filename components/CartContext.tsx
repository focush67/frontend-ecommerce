import { ObjectId } from "mongoose";
import { createContext } from "react";
import { useState,useEffect } from "react";
export const CartContext = createContext({});

export function CartContextProvider({ children }: any) {
  const [cart, setCart] = useState<ObjectId[]>([]);

  useEffect(()=>{
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]") as ObjectId[];
    setCart(savedCart);
  },[])

  useEffect(()=>{
    localStorage.setItem("cart",JSON.stringify(cart));
  },[cart]);

  return (
    <CartContext.Provider value={{ cart, setCart}}>
      {children}
    </CartContext.Provider>
  );
}
