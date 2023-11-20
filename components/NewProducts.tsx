import styled from "styled-components";
import { Column } from "./Featured";
import ProductBox from "./ProductBox";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import fetchImages from "@/components/ImageLoaderForProducts";
import { ProductType } from "@/lib/GlobalTypes";

export const ProductsGrid = styled.div`
  margin: auto auto;
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 20px;
  overflow-x: hidden;
  @media (max-width:550px){
    grid-template-columns: auto auto;
  }

  @media (max-width:397px){
    grid-template-columns: auto;
  }
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

export default function NewProducts({ newProducts }: {newProducts:ProductType[]}) {
  
  const [load, setLoad] = useState(true);
  const [images,setImages] = useState<any>([{}]);
  const [imagesLS,setImagesLS] = useState([{}]);
  useEffect(() => {
    if (!newProducts) {
      console.log("No Products found");
      return;
    }
    
    const imageFetching = async() => {
      const imagesUrls = await fetchImages(newProducts);
      setImages(imagesUrls);
    }

   
    imageFetching();
    const products_images_from_LS = (localStorage.getItem("product_images"));
    setLoad(false);
    setImagesLS(( products_images_from_LS ? JSON.parse(products_images_from_LS) : null));
    
  },[newProducts]);

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
                  imageUrl={imagesLS[product?.title] || (images[product?.title] && images[product?.title][0])}
                />
              ))
            )}
          </ProductsGrid>
        </Column>
      </Wrapper>
    </>
  );
}
