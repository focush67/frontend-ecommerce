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

const PageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  gap: 20px;
  overflow: hidden;
`;

const TableContainer = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  overflow: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 100vh;
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
  background-color: #114072;
  color: #fff;
  padding: 10px;
  text-align: left;
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

const InputLabel = styled.label`
  font-weight: bold;
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
  const [products, setProducts] = useState([{}]);
  const [totalCost, setTotalCost] = useState(0);
  const { cart, setCart } = useContext<CartContextType>(CartContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    payment: "",
  });

  const handleChange = (e:any) => {
    const {name,value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleSubmit = async(e:any) => {
    e.preventDefault();
    console.log("Form Data: ",formData);

    try{
      const response = await axios.post("/api/orders" , {
        ...formData,cartItems:products,
      });

      console.log(response.data);
      router.push("/payment");
      
    }catch(error:any){
      console.log(error);
    }
    
  }


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
    router.push("/"); 
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
              {filteredProducts.map((prod: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <div style={{ maxWidth: "100px", marginBottom: "8px" }}>
                      <img
                        src={prod?.coverPhoto}
                        alt={`Image of ${prod?.title}`}
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
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
                      <span style={{ fontWeight: "600" }}>
                        {cart[prod?._id]}
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
                  <TableCell>${parseFloat(prod.price) || 0}</TableCell>
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
            <InputLabel>Name</InputLabel>
            <InputField type="text" name="name" value={formData.name} onChange={handleChange} required/>

            <InputLabel>Email</InputLabel>
            <InputField type="text" name="email" value={formData.email} onChange={handleChange} required/>

            <InputLabel>Address</InputLabel>
            <InputField type="text" name="address" value={formData.address} onChange={handleChange} required/>

            <InputLabel>Phone</InputLabel>
            <InputField type="tel" name="phone" value={formData.phone} onChange={handleChange} required/>

            <InputLabel>Payment Method</InputLabel>
            <select name="payment" defaultValue="" value={formData.payment} onChange={handleChange}>
              <option value="" disabled>
                Select Payment Method
              </option>
              <option value="creditCard">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bankTransfer">Bank Transfer</option>
              {/* Add more payment method options as needed */}
            </select>

            <div style={{ textAlign: "center", fontWeight: "bold" }}>
              Bill : ${totalCost.toFixed(2)}
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
