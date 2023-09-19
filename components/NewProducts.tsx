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
    gap: 2rem;
    padding: 1rem;
`
export default function NewProducts({ newProducts }: any) {
    const [imageUrls,setImageUrls] = useState<string[]>([]);
    useEffect(()=>{
      if(!newProducts){
        console.log("No Products found");
        return;
      }

      const fetchImages = async () => {
        const urls:string[] = [];

        for(const product of newProducts){
          console.log(product?.imagesFolder);
          const imageRef = ref(storage,`${product.imagesFolder}/`);
          try {
            const response = await listAll(imageRef);
            const downloadPromises = response.items.map(async (item:any) => {
              const url = await getDownloadURL(item);
              return url;
            });

            const productImageUrls = await Promise.all(downloadPromises);
            urls.push(...productImageUrls);
          } catch (error:any) {
            console.log(error);
          }
        }

        setImageUrls(urls);
      };
      fetchImages();
    },[newProducts])

    console.log(imageUrls);

  return (
    <Center>
      <Column>
        <ProductsGrid>
            {
               newProducts?.length > 0 && newProducts.map((product:any , index:number) => (
                <ProductBox key={index} product={product} imageUrl={imageUrls[index]} />
               ) )
            }
        </ProductsGrid>
      </Column>
    </Center>
  );
}
