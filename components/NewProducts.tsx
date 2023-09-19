import styled from "styled-components";
import Center from "./Center";
import { Column } from "./Featured";
import ProductBox from "./ProductBox";
import {useEffect, useState} from 'react';
import {storage} from '@/firebaseConfig';
import {ref,listAll,getDownloadURL} from 'firebase/storage';
const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 2rem;
    padding: 1rem;
`
export default function NewProducts({ newProducts }: any) {
    const [imageUrls,setImageUrls] = useState([]);

    useEffect(()=>{
        const fetchProductImages = async () => {
            const urls = [];
            for(const product of newProducts){
                const imageListReference = ref(storage,`${product.title}/`);
                try {
                   const response = await listAll(imageListReference);
                   if(response.items.length > 0){
                    const firstImage = response.items[0];
                    const url = await getDownloadURL(firstImage);
                    urls.push(url);
                   } 
                } catch (error:any) {
                    console.log(error.message);
                }
            }
        };

        fetchProductImages();
    },[newProducts])
    

  return (
    <Center>
      <Column>
        <ProductsGrid>
            {
               newProducts?.length > 0 && newProducts.map((product:any , index:number) => (
                <ProductBox key={index} product={product} images={imageUrls} />
               ) )
            }
        </ProductsGrid>
      </Column>
    </Center>
  );
}
