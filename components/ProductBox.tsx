import styled from "styled-components";
import PrimaryButton from "./Buttons";
import axios from "axios";
import { CartContext } from "./CartContext";
import {useContext} from 'react';
import {CartContextType} from './Featured';
export const ProductWrapper = styled.div``;

export const WhiteBox = styled.div`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  img {
    max-width: 100%;
    max-height: 80px;
  }
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
`

export default function ProductBox({ product, imageUrl }: any) {

  const {setCart,cart} = useContext<CartContextType>(CartContext);
  const fallBackUrl =  "https://picsum.photos/id/237/200/300";

  const addNewProductToCart = async () => {
    try {
      const response = await axios.post("/api/cart" , {
        _id: product._id,
        title: product.title,
        price: product.price,
        coverPhoto: imageUrl[0],
        quantity: 1,
      });

      if(cart[product._id]){
        setCart((prev:any)=>({
          ...prev,
          [product._id] : prev[product._id] + 1,
        }));
      }

      else{
        setCart((prev:any)=>({
          ...prev,
          [product._id] : 1,
        }))
      }

      console.log(response.data);
    } catch (error:any) {
      console.log(error);
    }
}

  return (
    <ProductWrapper>
      <WhiteBox>
        <div>
          <img src={Array.isArray(imageUrl) ? imageUrl[0] : imageUrl} alt="image" onError={(e:any)=>e.currentTarget.src=fallBackUrl}/>
        </div>
      </WhiteBox>

      <ProductInfoBox>
        <Title>{product?.title}</Title>
        <PriceRow>
          <Price>${product?.price}</Price>
          <PrimaryButton background="white" size="small" onClick={addNewProductToCart}>
          Add to Cart
        </PrimaryButton>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}
