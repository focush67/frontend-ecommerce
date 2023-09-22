import Header from "@/components/Header";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { CartContextType, Column } from "@/components/Featured";
import { ProductsGrid, Wrapper } from "@/components/NewProducts";
import {
  PriceRow,
  ProductInfoBox,
  ProductWrapper,
  WhiteBox,
} from "@/components/ProductBox";
import styled from "styled-components";
import { CartContext } from "@/components/CartContext";
import PrimaryButton, { NeutralButton } from "@/components/Buttons";
import Link from "next/link";

const Title = styled.div`
  font-family: Georgia, "Times New Roman", Times, serif;
  margin-top: 0.7rem;
  margin-bottom: 0.6rem;
`;

const Quantity = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 600;
  padding: 0px;
  background-color: #aaa;
  color: #2c0b0b;
  border-radius: 10px;
  margin: 0;
`;

const StyledButton = styled.button`
  width: 1.2rem;
  height: 1.2rem;
  border: none;
  font-weight: 700;
  transition: transform 100ms all;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  cursor: pointer;
  &.plus {
    background-color: #2323af;
    color: white;
  }
  &.minus {
    background-color: #ab2626;
    color: white;
  }
`;

const Cluster = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const ButtonCluster = styled(Cluster)`
  align-items: flex-start;
`;

const ProductTitle = styled(Title)`
  max-height: 2rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const OuterWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
`;

const ModifiedNeutralButton = styled(NeutralButton)`
  justify-content: center;
  width: 20%;
`;

const ModifiedLink = styled(Link)`
  text-decoration: none;
  color: white;
`;

const ModifiedPrimaryButton = styled(PrimaryButton)`
  justify-content: center;
  background:none;
  max-width: 200px;
  color: black;
  font-size: large;
  pointer-events: none;
  font-weight: 600;
`

export default function Cart() {
  const [products, setProducts] = useState([{}]);
  const [totalCost, setTotalCost] = useState(0);
  const { cart, setCart } = useContext<CartContextType>(CartContext);

  useEffect(() => {
    const fetchCart = async () => {
      const response = await axios.get("/api/cart");
      setProducts((prev: any) => [...response.data]);

      console.log("CART FROM LOCAL ", cart);
      console.log("CART FROM BACKEND", response.data);
    };
    fetchCart();
  }, []);

  const emptyCart = async () => {
    const requestBody = {
      empty: true,
    };

    const response = await axios.delete("/api/temp", { data: requestBody });
    console.log("cart empty response", response);
    localStorage.clear();
    window.location.reload();
  };

  const addToCart = async ({ product }: any) => {
    try {
      console.log(product);
      const response = await axios.post("/api/cart", {
        _id: product?._id,
        title: product?.title,
        price: product?.price,
        coverPhoto: product?.coverPhoto,
        quantity: 1,
      });

      if (cart[product._id]) {
        setCart((prev: any) => ({
          ...prev,
          [product._id]: prev[product._id] + 1,
        }));
      } else {
        setCart((prev: any) => ({
          ...prev,
          [product._id]: 1,
        }));
      }

      const productCost = parseFloat(product?.price) || 0;
      setTotalCost((prevTotalCost) => prevTotalCost + productCost);
    } catch (error: any) {
      console.log(error);
    }
  };

  const removeFromCart = async ({ product }: any) => {
    try {
      console.log(product);

      const response = await axios.delete("/api/cart", {
        data: {
          _id: product?._id,
          quantity: -1,
        },
      });

      if (response.status === 200) {
        setCart((prev: any) => ({
          ...prev,
          [product._id]: prev[product._id] - 1,
        }));
      }

      const productCost = parseFloat(product?.price) || 0;
      setTotalCost((prevTotalCost) => prevTotalCost - productCost);
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await axios.delete("/api/temp");
    } catch (error: any) {
      console.log(error);
    }
  };

  const filteredProducts = products.filter((prod: any) => cart[prod?._id] > 0);

  useEffect(() => {
    const initialTotalCost = filteredProducts.reduce(
      (acc, prod) => acc + (parseFloat(prod?.price) || 0) * cart[prod?._id],
      0
    );

    setTotalCost(initialTotalCost);
  }, [filteredProducts, cart]);


  return (
    <>
      <Header />
      
        <ModifiedNeutralButton size="large" onClick={emptyCart}>
          Empty Cart
        </ModifiedNeutralButton>

        <ModifiedNeutralButton size="large">
          <ModifiedLink href={{
            pathname:"/checkout",
            search:`?totalCost=${totalCost}`,
          }}>Checkout</ModifiedLink>
        </ModifiedNeutralButton>
        <Wrapper>
          <Column>
            <ProductsGrid>
              {filteredProducts?.map((prod: any, index: number) => (
                <div key={index}>
                  <ProductWrapper>
                    <WhiteBox>
                      <div>
                        <img src={prod?.coverPhoto} alt="image" />
                      </div>
                    </WhiteBox>

                    <ProductInfoBox>
                      <ProductTitle>{prod?.title}</ProductTitle>
                      <PriceRow>
                        <ButtonCluster>
                          <StyledButton
                            className="plus"
                            onClick={() => addToCart({ product: prod })}
                          >
                            +
                          </StyledButton>
                          <Quantity>{cart[prod?._id]}</Quantity>
                          <StyledButton
                            className="minus"
                            onClick={() => removeFromCart({ product: prod })}
                          >
                            -
                          </StyledButton>
                        </ButtonCluster>
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
