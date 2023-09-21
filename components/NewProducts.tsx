import styled from "styled-components";
import { CartContextType, Column } from "./Featured";
import ProductBox from "./ProductBox";
import {useEffect, useState,useContext} from 'react';
import {storage} from '@/firebaseConfig';
import {ref,listAll,getDownloadURL} from 'firebase/storage';


export const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
    
`

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`

const StyledHeader = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin: 13px 0 0 0;
  font-weight: 500;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
`

export default function NewProducts({ newProducts }: any) {
    const [productImages,setProductImages] = useState<{[key:string] : string[]}>({});
    const [load,setLoad] = useState(true);
    
    useEffect(()=>{
      if(!newProducts){
        console.log("No Products found");
        return;
      }

      const fetchImages = async () => {
        const productImagesMap : {[key:string] : string[]} = {};

        for(const product of newProducts){
          
          const imageRef = ref(storage,`${product.imagesFolder}/`);
          try {
            const response = await listAll(imageRef);
            const downloadPromises = response.items.map(async (item:any) => {
              const url = await getDownloadURL(item);
              return url;
            });

            const productImageUrls = await Promise.all(downloadPromises);
            productImagesMap[product?.title] = productImageUrls;
          } catch (error:any) {
            console.log(error);
            productImagesMap[product?.title] = [];
          }
        }
        setLoad(false);
        setProductImages(productImagesMap);
      };
      fetchImages();
    },[newProducts])

  return (
    <>
    <StyledHeader>New Arrivals</StyledHeader>
    <Wrapper>
      <Column>
        <ProductsGrid>
            {
               load ? "Loading Images..." : newProducts?.map((product:any,index:number)=>(
                <ProductBox key={index} product={product} imageUrl={productImages[product.title]}/>
               ))
            }
        </ProductsGrid>
      </Column>
    </Wrapper>
    </>
  );
}
