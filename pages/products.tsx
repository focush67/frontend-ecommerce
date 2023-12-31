"use client";

import styled from "styled-components";
import { signIn, useSession } from "next-auth/react";
import Header from "@/components/Header";
import { useState, useEffect, useContext } from "react";

import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { ProductInfoBox, Title } from "@/components/ProductBox";
import PrimaryButton, { NeutralButton } from "@/components/Buttons";
import { useRouter } from "next/router";
import { CartContextType } from "@/components/Featured";
import { CartContext } from "@/components/CartContext";

export const ProductWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
  margin: 0.5rem;
`;

export const ProductCard = styled.div`
  background-color: rgba(255, 255, 255, 0.66);
  border-radius: 12px;
  border: 1px solid rgba(209, 213, 219, 0.3);
  padding: 2.5rem;
  margin: 0.5rem;
  max-width: 300px; /* Adjust the maximum width as needed */
  flex: 1; /* Distribute cards evenly in a row */
  text-align: center;
  flex-direction: column;
  display: flex;
  @media (max-width: 768px) {
    padding: 1em;
  }

  @media (max-width: 480px) {
    padding: 0.5em;
  }
`;

export const ProductImage = styled.img`
  flex: 1;
  width: 100%;
  border-radius: 8px;
  object-fit: contain;
`;

export const ProductDescription = styled.div`
  font-size: 15px;
  margin: 10px 0;
  white-space: nowrap;
  height: 2.5rem;
  text-overflow: ellipsis;
  flex-grow: 1;
  overflow: hidden;
  line-height: 1.5;
`;

export const ProductInfoBoxHere = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1em; /* Adjust padding as needed */

  /* Add a margin to create space between the image and text */
  margin-top: 10px;

  /* Adjust the following styles for the product description */
  font-size: 15px;
  line-height: 1.5;
  white-space: normal;
  height: auto;
  overflow: hidden;
`;


export default function Products() {
  const {cart,setCart} = useContext<CartContextType>(CartContext);
  const {data: session} = useSession();
  const [newProducts, setNewProducts] = useState([]);  
  const [load, setLoad] = useState(true);
  const router = useRouter();
  
  const [productImages,setProductsImages] = useState([]);

  useEffect(()=>{
    if(localStorage){
      setProductsImages(JSON.parse(localStorage.getItem("product_images") || "[]"));
    }
    else{
      console.log("Local Storage not defined");
    }
  },[])

  const productDetails = (product:any) => {
    router.push({
      pathname: `/products/${product._id}`,
      query:{
        imageUrl: productImages[product?.title][0],
        properties: product.properties,
      }
    });
  };

  /*Fetching the products from the backend*/  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Session: ",session?.user);
        const response = await axios.get("/api/products");
        console.log(response.data);
        if (response.status === 200) {
          setNewProducts(response.data);
          setLoad(false);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async({product,imageUrl}:any) => {
    if(!session){
      await signIn("google");
      return;
    }

    try {
      const cartData = {
        name: session?.user?.name,
        email: session?.user?.email,
        avatar: session?.user?.image,
        productDetails:{
          _id: product._id,
          title: product.title,
          price: product.price,
          coverPhoto: Array.isArray(imageUrl) ? imageUrl[1] : imageUrl,
          quantity: 1,
          stripeProductID: product.stripeProductID,
        },
      };

      console.log("Frontend: ",cartData);
      const response = await axios.post("/api/cart",cartData);
      console.log(response.data);
      if(cartData.productDetails._id in cart){
        setCart((prev:any) => ({
          ...prev,
          [cartData.productDetails._id]: prev[cartData.productDetails._id] + 1,
        }));
      }

      else{
        setCart((prev:any) => ({
          ...prev,
          [cartData.productDetails._id]: 1,
        }));
      }

    } catch (error:any){
      console.log(error.message);
    }
  }
  

  return (
    <>
    <Header profile={session?.user} />
      <ProductWrapper>
        {load ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <FaSpinner className="animate-spin text-blue-500 text-5xl" />
          </div>
        ) : (
          newProducts?.map((product: any, index: number) => (
            <ProductCard key={index}>
              <ProductImage src={productImages && productImages[product?.title][1] || `${product.title}`} alt="image" />
              <ProductInfoBoxHere>
                <Title style={{fontWeight:"bold",fontSize:"1.5rem"}}>{product?.title}</Title>
                <ProductDescription>{product?.description}</ProductDescription>
                <div style={{
                  display:"flex",
                  justifyContent:"center",
                }}>
                <NeutralButton size={"medium"} onClick={()=>productDetails(product)}>Learn More</NeutralButton>
                <PrimaryButton size={"medium"} onClick={() => addToCart({product,imageUrl : productImages[product?.title]})}>Add to Cart</PrimaryButton>
                </div>
              </ProductInfoBoxHere>
            </ProductCard>
          ))
        )}
      </ProductWrapper>
    </>
  );
}
