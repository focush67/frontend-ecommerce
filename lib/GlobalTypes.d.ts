import mongoose from "mongoose";
import { ReactNode } from "react";

interface ButtonProps{
    children: React.ReactNode;
    background: string;
    size: "small" | "medium" | "large";
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }
  
interface CartContextType {
    children: ReactNode;
}

interface CartItem{
    _id: mongoose.Types.ObjectId,
    title: string,
    price: string,
    coverPhoto: string,
    quantity: number,
    stripeProductId: string,
}

interface UserCartType{
    _id: mongoose.Types.ObjectId,
    name: string,
    email: string,
    avatar: string,
    userCart: [CartItems]
}

interface Property{
    name: string;
    value: string;
}

interface ProductType{
    _id: string,
    title: string;
    description: string;
    price: string;
    imagesFolder: string;
    category: mongoose.Types.ObjectId,
    properties: Property[],
    stripeProductID: string,
}

interface UserProfile{
    image?: string;
    email?: string;
    name?: string;
}

interface Category{
    name: string;
    parent: null;
    properties:any[];
  }