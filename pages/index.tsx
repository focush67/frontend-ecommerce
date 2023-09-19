import { Product } from '@/lib/models/ProductSchema';
import Header from '@/components/Header';
import {useState,useEffect} from 'react';
import Featured from '@/components/Featured'
import { mongooseConnect } from '@/lib/mongoose';
import NewProducts from '@/components/NewProducts';
export default function Home({featuredProduct,newProducts}:any) {
  console.log(newProducts);
  const [latest,setLatest] = useState(newProducts);

  useEffect(()=>{
    const fetchNewProducts = async() => {
      try {
        const response = await fetch("/api/products");
        if(response.ok){
          const newProductsData = await response.json();
          setLatest(newProductsData);
        }
      } catch (error:any) {
        console.log(error.message);
      }
    }

    fetchNewProducts();
    const intervalID = setInterval(fetchNewProducts,5000);
    return ()=>clearInterval(intervalID);
  },[newProducts])
  return (
    <div>
      <Header/>
      <Featured featuredProduct={featuredProduct}/>
      <NewProducts newProducts={newProducts}/>
    </div>
  );
};


export async function getServerSideProps(){
  const featuredProductID = "65097f5a1520bcb448e6316e";

  await mongooseConnect();

  const featuredProduct = await Product.findById(featuredProductID);
  const newProducts = await Product.find({},null,{sort:{'updatedAt':-1}});

  return{
    props:{
      newProducts : JSON.parse(JSON.stringify(newProducts)),
      featuredProduct : JSON.parse(JSON.stringify(featuredProduct))},
  }
} 
