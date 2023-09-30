// pages/products/[productId].js

import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import styled from "styled-components";
import PrimaryButton from "@/components/Buttons";
const CardContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f2229;
  overflow: hidden;
`;

const Separator = styled.span`
  margin-left: 10px;
  margin-right: 10px;
`;

export default function ProductDetails(){
    const router = useRouter();
    const {id} = router.query;
    const {imageUrl} = router.query;
    console.log("Image: ",imageUrl);
    const [product,setProduct] = useState({
       title: String,
       description: String,
       price: String, 
    });
    useEffect(()=>{
        const fetchProduct = async() => {
            const response = await axios.get(`/api/products/?id=${id}`);
            console.log(response.data);
            setProduct(response.data);
        }

        fetchProduct();
    },[])

    return(
        <div>
           
            <CardContainer>
                <Card title={product.title} description={product?.description} price={product?.price} imgUrl={imageUrl}/>
                <Separator/>
            </CardContainer>
        </div>
    );
}
