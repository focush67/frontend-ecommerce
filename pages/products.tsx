import styled from "styled-components";
import { getSession, useSession } from "next-auth/react";
import Header from "@/components/Header";
import { useState, useEffect } from "react";

import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { ProductInfoBox, Title } from "@/components/ProductBox";
import { NeutralButton } from "@/components/Buttons";
import { useRouter } from "next/router";

const ProductWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
  margin: 0.5rem;
`;

const ProductCard = styled.div`
  background-color: rgba(255, 255, 255, 0.66);
  border-radius: 12px;
  border: 1px solid rgba(209, 213, 219, 0.3);
  padding: 2em;
  margin: 0.5rem;
  max-width: 300px; /* Adjust the maximum width as needed */
  flex: 1; /* Distribute cards evenly in a row */
  text-align: center;

  @media (max-width: 768px) {
    padding: 1em;
  }

  @media (max-width: 480px) {
    padding: 0.5em;
  }
`;

const ProductImage = styled.img`
  width: 50%;
  border-radius: 8px;
`;

const ProductDescription = styled.div`
  font-size: 15px;
  margin: 10px 0;
  white-space: nowrap;
  height: 2.5rem;
  text-overflow: ellipsis;
  flex-grow: 1;
  overflow: hidden;
  line-height: 1.5;
`;


export default function Products() {
  const {data: session} = useSession();
  const [newProducts, setNewProducts] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [load, setLoad] = useState(true);
  const router = useRouter();
  function getFirst20Words(inputString:String){
    const first20words = inputString.match(/\S+/g)?.slice(0,20);
    const result = first20words?.join(" ");
    return result;
  }


  const productDetails = (product:any) => {
    router.push({
      pathname: `/products/${product._id}`,
      query:{
        imageUrl: productImages[product?.title][0],
      }
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Session: ",session?.user);
        const response = await axios.get("/api/products");
        console.log(response.data);
        if (response.status === 200) {
          setNewProducts(response.data);
        }
        console.log(productImages);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    setLoad(false);
    fetchProducts();
    setProductImages(JSON.parse(localStorage.getItem("product_images") || ""));
  }, [productImages]);

 

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
              <ProductImage src={productImages[product?.title] || `${product.title}`} alt="image" />
              <ProductInfoBox>
                <Title>{product?.title}</Title>
                <ProductDescription>{getFirst20Words(product?.description)}</ProductDescription>
                <NeutralButton size={"medium"} onClick={()=>productDetails(product)}>Learn More</NeutralButton>
              </ProductInfoBox>
            </ProductCard>
          ))
        )}
      </ProductWrapper>
    </>
  );
}
