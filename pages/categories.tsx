import Header from '@/components/Header';
import { fetchCategoryImages } from '@/components/ImageLoaderForCategory';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import { Category } from '@/lib/GlobalTypes';
const CategoryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
  margin: 0.5rem;
  
`;

const CategoryCard = styled.div`
  background-color: rgba(255, 255, 255, 0.66);
  border-radius: 12px;
  border: 1px solid rgba(209, 213, 219, 0.3);
  padding: 2.5rem;
  margin: 0.5rem;
  max-width: 300px; /* Adjust the maximum width as needed */
  flex: 1; /* Distribute cards evenly in a row */
  text-align: center;
  flex-direction: column;
  display: flex;
  transition: all 2s ease-in;
  :hover{
    cursor: pointer;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    padding: 1em;
  }

  @media (max-width: 480px) {
    padding: 0.5em;
  }
`;  

const CategoryTitle = styled.div`
  font-weight: semibold;
  font-size: large;
  padding: 1em;
`

const CategoryImage = styled.img`
  flex: 1;
  height: 100%;
  border-radius: 8px;
  object-fit: contain;
`;
3
const Categories = () => {
  const {data: session} = useSession();
  const router = useRouter();
  const [categories,setCategories] = useState<Category[]>([]);
  const [images,setImages] = useState<{[key:string] : string[]}>({});

  useEffect(()=>{
    const fetchCategories = async() => {
      const response = await axios.get("/api/categories");
      console.log(response.data.categories);
      setCategories(response.data.categories);

      fetchCategoryImages(response.data.categories).then((images:any) => {
        setImages(images);
      })
    }

    fetchCategories();
  },[])


  const categoryDetails = (category:any) => {
    router.push({
      pathname: `/categories/${category._id}`,
      query:{
        id: category._id,
      }
    })
  }


  return (
    <>
    <Header profile={session?.user} />
    <CategoryWrapper>
     {
      categories.map((category,index) => (
        <CategoryCard key={index} onClick={() => categoryDetails(category)}>
          <CategoryTitle>{category.name.toUpperCase()}</CategoryTitle>
          {
            images[category?.name] && images[category?.name].length > 0 && (
              <CategoryImage src={images[category?.name][0]} alt={category.name}/>
            )
          }
        </CategoryCard>
      ))

     }
    </CategoryWrapper>
    </>
  )
}

export default Categories;