import styled from "styled-components";
import PrimaryButton from "./Buttons";
import axios from "axios";
import { CartContext } from "./CartContext";
import {useContext} from 'react';
import {CartContextType} from './Featured';
import {signIn, useSession} from "next-auth/react";
import Image from "next/image";
export const WhiteBox = styled.div`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export const Title = styled.h2`
  font-weight: normal;
  font-size: 0.9rem;
  margin: 0;
`;

export const ProductInfoBox = styled.div`
  text-align: center;
  margin-top: 5px;
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top:2px;
`;

export const Price = styled.div`
    font-size: 1.3rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    
    svg{
      margin: 3px;
    }
`

export default function ProductBox({ product, imageUrl }: any) {

  const {setCart,cart} = useContext<CartContextType>(CartContext);
  const fallBackUrl =  "https://picsum.photos/id/237/200/300";
  const {data: session} = useSession();
  const addNewProductToCart = async () => {

    if(!session)
    {
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
          coverPhoto: Array.isArray(imageUrl) ? imageUrl[0] : imageUrl,
          quantity: 1,
          stripeProductID: product.stripeProductID,
        },
      };
  
      console.log("FRONTEND ",cartData);
      const response = await axios.post("/api/cart",cartData);
      console.log(response.data);
      if(cartData.productDetails._id in cart)
          {
            setCart((prev:any) => ({
              ...prev,
              [cartData.productDetails._id] : prev[cartData.productDetails._id] + 1,
            }));
          }
  
          else
          {
            setCart((prev:any) => ({
              ...prev,
              [cartData.productDetails._id]: 1,
            }));
          }
            
          
    } catch (error:any) {
      console.log(error.message);
      console.log(error.status);
    }
        
}

  return (
    <div>
      <WhiteBox>
        <div>
          <Image src={Array.isArray(imageUrl) ? imageUrl[0] : imageUrl} alt={"image"} onError={(e:any) => e.currentTarget.src=fallBackUrl} layout="responsive" height={100} width={100} style={{
            maxWidth: "100%",
            maxHeight: "108px"
          }}/>
        </div>
      </WhiteBox>

      <ProductInfoBox>
        <Title>{product?.title}</Title>
        <PriceRow>
          <Price><svg xmlns="http://www.w3.org/2000/svg" height="0.99rem" viewBox="0 0 320 512"><path d="M308 96c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v44.748c0 6.627 5.373 12 12 12h85.28c27.308 0 48.261 9.958 60.97 27.252H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h158.757c-6.217 36.086-32.961 58.632-74.757 58.632H12c-6.627 0-12 5.373-12 12v53.012c0 3.349 1.4 6.546 3.861 8.818l165.052 152.356a12.001 12.001 0 0 0 8.139 3.182h82.562c10.924 0 16.166-13.408 8.139-20.818L116.871 319.906c76.499-2.34 131.144-53.395 138.318-127.906H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-58.69c-3.486-11.541-8.28-22.246-14.252-32H308z"/></svg>{product?.price}</Price>
          <PrimaryButton background="white" size="small" onClick={addNewProductToCart}>
          Add to Cart
        </PrimaryButton>
        </PriceRow>
      </ProductInfoBox>
      </div>
  );
}
