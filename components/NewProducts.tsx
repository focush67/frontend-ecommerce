import styled from "styled-components";
import { Column } from "./Featured";
import ProductBox from "./ProductBox";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import fetchImages from "@/pages/ImageLoader";
export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledHeader = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin: 13px 0 0 0;
  font-weight: 500;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
`;

export default function NewProducts({ newProducts }: any) {
  
  const [load, setLoad] = useState(true);
  const [images,setImages] = useState([{}]);
  const [imagesLS,setImagesLS] = useState([{}]);
  useEffect(() => {
    if (!newProducts) {
      console.log("No Products found");
      return;
    }
    
    const imageFetching = async() => {
      const imagesUrls = await fetchImages(newProducts);
      //console.log(imagesUrls);
      setImages(imagesUrls);
    }

    imageFetching();
    setLoad(false);

    setImagesLS(JSON.parse(localStorage.getItem("product_images")));
  },[])

  return (
    <>
      <StyledHeader>New Arrivals</StyledHeader>
      <Wrapper>
        <Column>
          <ProductsGrid>
            {load ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                }}
              >
                <FaSpinner className="animate-spin text-blue-500 text-5xl"/>
              </div>
            ) : (
              newProducts?.map((product: any, index: number) => (
                <ProductBox
                  key={index}
                  product={product}
                  imageUrl={imagesLS[product.title] || images[product?.title][0]}
                />
              ))
            )}
          </ProductsGrid>
        </Column>
      </Wrapper>
    </>
  );
}
