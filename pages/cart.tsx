import Header from "@/components/Header";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { CartContextType, Column } from "@/components/Featured";
import { ProductsGrid, Wrapper } from "@/components/NewProducts";
import ProductBox, {
  PriceRow,
  ProductInfoBox,
  ProductWrapper,
  Title,
  WhiteBox,
} from "@/components/ProductBox";
import styled from "styled-components";
import { CartContext } from "@/components/CartContext";
const Quantity = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3px;
  font-weight: 800;
  border: 2px solid none;
  padding: 4px;
  background-color: #aaa;
  color: #2c0b0b;
`;

const Price = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
`;

export default function Cart() {
  const [products, setProducts] = useState([{}]);

  const { cart, setCart } = useContext<CartContextType>(CartContext);
  useEffect(() => {
    const fetchCart = async () => {
      const response = await axios.get("/api/cart");
      setProducts((prev: any) => [...response.data]);

      console.log(cart);
    };
    fetchCart();
  }, []);

  const emptyCart = async () => {
    const response = await axios.delete("/api/cart");
    console.log(response);
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
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await axios.delete("/api/temp");
    } catch (error:any) {
      console.log(error);
    }
  };

  const filteredProducts = products.filter((prod: any) => cart[prod?._id] > 0);

  return (
    <>
      <Header />
      <Wrapper>
        <Column>
          <button onClick={emptyCart}>Empty Cart</button>
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
                    <Title>{prod?.title}</Title>
                    <PriceRow>
                      <Price>${prod?.price}</Price>
                      <Quantity>{cart[prod?._id]}</Quantity>
                      <button onClick={() => addToCart({ product: prod })}>
                        +
                      </button>
                      <button onClick={() => removeFromCart({ product: prod })}>
                        -
                      </button>
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
