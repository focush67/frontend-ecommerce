import styled from "styled-components";
import Center from "./Center";
import PrimaryButton, { NeutralButton } from "./Buttons";
import { ref,listAll,getDownloadURL } from "firebase/storage";
import { storage } from "@/firebaseConfig";
import { useEffect, useState } from "react";

export const Bg = styled.div`
  position: relative;
  background-color: #000;
  color: #fff;
  padding: 50px 0;
`;

export const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 3rem;
`;

export const Description = styled.p`
  color: #aaa;
  font-size: 0.8rem;
  z-index: 2;
`;

export const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;

  img {
    max-width: 100%;
    border-radius: 1rem;
  }
`;

export const Column = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0 0 0;
`;

export default function Featured({featuredProduct}:any) {

  const [imageUrl,setImageUrl] = useState("");
  const imageListReference = ref(storage,`${featuredProduct?.title}/`);

  useEffect(()=>{
    listAll(imageListReference).then((response:any)=>{
      if(response.items.length > 0){
        const firstImage = response.items[0];
        getDownloadURL(firstImage).then((url)=>{
          setImageUrl(url);
        })
      }
    }).catch((error:any)=>console.log(error));
  },[]);

  return (
    <Bg>
      <Center>
        <Wrapper>
          <Column>
            <div>
              <Title>{featuredProduct?.title}</Title>
              <Description>
                {featuredProduct?.description}
              </Description>
              <Column>
                <NeutralButton size="medium">Read More</NeutralButton>
                <PrimaryButton size="medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                  Add to Cart
                </PrimaryButton>
              </Column>
            </div>
          </Column>
          <div>
            <img src={imageUrl} alt="photo"/>
          </div>
        </Wrapper>
      </Center>
    </Bg>
  );
}
