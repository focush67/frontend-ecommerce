import Header from "@/components/Header";
import axios from "axios";
import { useState, useEffect } from "react";
import { Column } from "@/components/Featured";
import { ProductsGrid, Wrapper } from "@/components/NewProducts";
import ProductBox, {PriceRow, ProductInfoBox, ProductWrapper, Title, WhiteBox } from "@/components/ProductBox";
import styled from "styled-components";
const Quantity = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3px;
  font-weight: 800;
  border: 2px solid none;
  padding: 4px;
  background-color: #aaa;
  color: #2c0b0b;
`

const Price = styled.div`
  font-size: 1.1rem;
    font-weight: bold;
`

export default function Cart() {
  const [products, setProducts] = useState([{}]);
  const [cartData,setCartData] = useState({});
  useEffect(() => {
    const fetchCart = async () => {
      const response = await axios.get("/api/cart");
      setProducts((prev: any) => [...response.data]);

      const cartDataFromStorage = JSON.parse(localStorage.getItem("cart") || "{}");
      setCartData(cartDataFromStorage);
    };
    fetchCart();
  }, []);

  const emptyCart = async() => {
    const response = await axios.delete("/api/cart");
    console.log(response);
    localStorage.clear();
    window.location.reload();
  }

  return (
    <>
      <Header />
      <Wrapper>
        <Column>
        <button onClick={emptyCart}>Empty Cart</button>
          <ProductsGrid>
            {products?.map((prod: any, index: number) => (
              <div key={index}>
                <ProductWrapper>
                  <WhiteBox>
                    <div>
                      <img src={prod?.coverPhoto} alt="image" />
                    </div>
                  </WhiteBox>

                  <ProductInfoBox>
                    <Title>{prod?.title}</Title>
                    <PriceRow>
                      <Price>${prod?.price}</Price>
                      <Quantity>{prod?.quantity}</Quantity>
                      <button>+</button>
                      <button>-</button>
                    </PriceRow>
                  </ProductInfoBox>
                </ProductWrapper>
              </div>
            ))}
          </ProductsGrid>
        </Column>
      </Wrapper>
    </>
  );
}
