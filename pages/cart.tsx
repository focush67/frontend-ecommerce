// pages/index.js
import React, { useContext } from "react";
import styled from "styled-components";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { CartContextType } from "@/components/Featured";
import { CartContext } from "@/components/CartContext";
import { useRouter } from "next/router";
import axios from "axios";
import { NeutralButton } from "@/components/Buttons";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || " ");


const PageContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  padding: 20px;
  gap: 20px;
  overflow: hidden;

  @media (max-width:669px){
    grid-template-columns: auto;
  }
`;

const TableContainer = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  max-height: 100vh;
  overflow: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 100vh;
  position: relative;
`;

const FormContainer = styled.div`
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  justify-content: center;
  align-items: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  gap: 2px;
  background-color: #fff;
  color: #aaa;
  padding: 10px;
  text-align: left;
  top: 0;
  z-index: 1;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  padding: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
`;

const StyledButton = styled.button`
  width: 1.2rem;
  height: 1.2rem;
  border: none;
  font-weight: 700;
  transition: transform 100ms all;
  border-radius: 50%;
  padding: 0;
  margin: 0 4px;
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

const InputField = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0.7rem 0;
`;

const SubmitButton = styled.button`
  margin: 0.1rem;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  border: 1px solid blue;
  color: blue;

  &:hover {
    background-color: blue;
    color: white;
  }
`;

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const { cart, setCart, clearCart } = useContext<CartContextType>(CartContext);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    address: "",
    phone: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


   const getPriceIdByStripeProductId = async(stripeProductId: string) => {
    try {
      const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_PRIVATE_KEY);
      const pricesList = await stripe.prices.list({
        product: stripeProductId,
      });

      if(pricesList.data && pricesList.data.length > 0){
        return pricesList.data[0].id;
      }
      else{
        throw new Error("No prices found for product");
      }

    } catch (error:any){
      console.log(error);
    }
  }


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    //console.log("Form Data: ", formData);
    const stripe = await stripePromise;
    try {
      const stripeResponse = await axios.post("/api/stripe",{
        email: formData?.email,
        userCart: products,
      });

      const lineItems = await Promise.all(products.map(async (prod:any) => {
        const priceId = await getPriceIdByStripeProductId(prod.stripeProductID);
        return{
          price: priceId,
          quantity: prod.quantity,
        }
      }))

      /*console.log("Lineitems: ",lineItems);
      console.log("Stripe Response Data: ",stripeResponse.data);*/

      const {id} = stripeResponse.data.session;
      
      await axios.post("/api/orders",{sessionId:id,
        ...formData,
        userCart: products,
      })

      localStorage.removeItem("user_cart");
      await emptyCart();

      //console.log("UserSessionId: ",id);
      if(!id)
      {
        return;
      }
      
      const {error} = await stripe?.redirectToCheckout({
        sessionId:id,
      })!

      if(error){
        console.log("Error frontend: ",error);
      }
      
    } catch (error: any) {
      console.log("Error from frontend ",error);
    }
  };


  useEffect(() => {
    if(!session)
    {
      return;
    }
    
    const fetchCart = async () => {
      const response = await axios.get(
        `/api/cart/?email=${session?.user?.email}`
      );
      setProducts(response?.data?.userCart || []);
        
     /* console.log("CART FROM LOCAL ", cart);
      console.log("CART FROM BACKEND", response.data);*/
    };
    fetchCart();
  },[session,cart]);

  const emptyCart = async () => {
    const requestBody = {
      empty: true,
    };

    try {
      const response = await axios.delete("/api/temp", { data: requestBody });
      //console.log("cart empty response", response);
      clearCart();
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.log(error);
    }
  };

  const addToCart = async ({ product }: any) => {
    try {
      const cartData = {
        name: session?.user?.name,
        email: session?.user?.email,
        avatar: session?.user?.image,
        productDetails: {
          _id: product._id,
          title: product.title,
          price: product.price,
          coverPhoto: product.coverPhoto,
          quantity: 1,
        },
      };

      const response = await axios.post("/api/cart", cartData);
      //console.log(response.data);

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
      //console.log(product);

      const response = await axios.delete("/api/cart", {
        data: {
          email: session?.user?.email,
          _id: product?._id,
          quantity: -1,
        },
      });

      if (response.status === 200) {
        if (Number(cart[product._id]) > 0) {
          setCart((prev: any) => ({
            ...prev,
            [product._id]: prev[product._id] - 1,
          }));
        }
      }

      const productCost = parseFloat(product?.price) || 0;
      setTotalCost((prevTotalCost) => prevTotalCost - productCost);
    } catch (error) {
      console.log(error);
    }

    try {
      await axios.delete("/api/temp");
    } catch (error: any) {
      console.log(error);
    }
  };

  const filteredProducts = products.filter((prod: any) => Number(cart[prod?._id]) > 0);

  useEffect(() => {
    const initialTotalCost = filteredProducts.reduce(
      (acc:number, prod:any) => acc + (parseFloat(prod?.price) || 0) * Number(cart[prod?._id]),
      0
    );

    setTotalCost(initialTotalCost);
  }, [filteredProducts, cart]);


  return (
    <>
    <Header profile={session?.user} />
      <PageContainer>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>Product</TableHeader>
                <TableHeader>Quantity</TableHeader>
                <TableHeader>Price</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 &&
                filteredProducts.map((prod: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div style={{ maxWidth: "100px", marginBottom: "8px" }}>
                        <Image
                          src={prod?.coverPhoto}
                          alt={`Image of ${prod?.title}`}
                          width={100}
                          height={100}
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      </div>

                      <div>
                        <div style={{ fontSize: "x-small", fontWeight: "bold" }}>
                          {prod?.title}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <StyledButton
                          className="minus"
                          onClick={() => removeFromCart({ product: prod })}
                        >
                          {" "}
                          -{" "}
                        </StyledButton>
                        <span style={{ fontWeight: "600", fontSize:"90%" }}>
                          {Number(cart[prod?._id])}
                        </span>
                        <StyledButton
                          className="plus"
                          onClick={() => addToCart({ product: prod })}
                        >
                          {" "}
                          +{" "}
                        </StyledButton>
                      </div>
                    </TableCell>
                    <TableCell>
                    <div style={{
                      fontSize:"90%"
                    }}>
                      ₹
                    {parseFloat(prod.price) || 0}
                    </div>
                    </TableCell>
                  </TableRow>
                ))}
            </tbody>
          </Table>
        </TableContainer>

        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <span
              style={{
                textAlign: "center",
                fontFamily: "Georgia",
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              Checkout
            </span>

            <InputField
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <InputField
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputField
              type="text"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <InputField
              type="tel"
              placeholder="Contact"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <div style={{ textAlign: "center", fontWeight: "bold" }}>
              Bill : <svg xmlns="http://www.w3.org/2000/svg" height="0.9rem" viewBox="0 0 320 512"><path d="M308 96c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v44.748c0 6.627 5.373 12 12 12h85.28c27.308 0 48.261 9.958 60.97 27.252H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h158.757c-6.217 36.086-32.961 58.632-74.757 58.632H12c-6.627 0-12 5.373-12 12v53.012c0 3.349 1.4 6.546 3.861 8.818l165.052 152.356a12.001 12.001 0 0 0 8.139 3.182h82.562c10.924 0 16.166-13.408 8.139-20.818L116.871 319.906c76.499-2.34 131.144-53.395 138.318-127.906H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-58.69c-3.486-11.541-8.28-22.246-14.252-32H308z"/></svg>{totalCost.toFixed(2)}
            </div>

            <SubmitButton type="submit">Continue to Payment</SubmitButton>
            <NeutralButton size="medium" onClick={emptyCart}>
              Empty Cart
            </NeutralButton>
          </Form>
        </FormContainer>
      </PageContainer>
    </>
  );
}
