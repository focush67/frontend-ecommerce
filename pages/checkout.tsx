import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/components/Header";
import axios from "axios";
const FormContainer = styled.div`
  border: 1px solid #b18989;
  padding: 16px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px; 
  margin: 1rem auto;
  background-color: #e1dada;
  text-align: center;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: center;
`;

const FormGroup = styled.div`
  margin-bottom: 12px;
`;

const Label = styled.label`
  display: flex;
  font-weight: 600;
  margin-bottom: 6px;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const CheckoutForm = () => {
    const router = useRouter();
    const queryParams = new URLSearchParams(router.asPath.split("?")[1]);
    const totalCost = queryParams.get("totalCost");
    const [checkCost , setCheckCost] = useState(0);

    useEffect(() => {
    const parsedTotalCost = parseFloat(totalCost);
    if(!isNaN(parsedTotalCost)){
        setCheckCost(parsedTotalCost);
    }
    }, [totalCost]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    payment: "credit-card",
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async(e:any) => {
    e.preventDefault();
    
    console.log("Form data:", formData);

    const response = await axios.post("/api/orders",formData);

    console.log("Response from backend",response.data);

    setFormData({
        name:"",
        email:"",
        phone:"",
        address:"",
        payment:"credit-card",
    });
  };

  return (
    <>
    <Header/>
    <FormContainer>
        <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Phone Number</Label>
          <Input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Shipping Address</Label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Payment Method</Label>
          <Select
            name="payment"
            value={formData.payment}
            onChange={handleChange}
          >
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="debit-card">Debit Card</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Billable Amount</Label>
          <div>
            {totalCost}
          </div>
        </FormGroup>
        <Button type="submit">Place Order</Button>
      </form>
    </FormContainer>
    </>
  );
};

export default CheckoutForm;
