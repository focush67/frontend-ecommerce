import Header from "@/components/Header";
import { Product } from "@/lib/models/ProductSchema";
import { useState, useEffect, useContext } from "react";
import Featured from "@/components/Featured";
import mongooseConnect from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import { useSession, getSession } from "next-auth/react";
import axios from "axios";
import { CartContext } from "@/components/CartContext";
import fetchImages from "../components/ImageLoaderForProducts";
import { fetchCategoryImages } from "@/components/ImageLoaderForCategory";
import { Category,ProductType } from "@/lib/GlobalTypes";
export default function Home({ featuredProduct, newProducts,categories }: {
  featuredProduct: ProductType,newProducts: ProductType[],categories:Category[]
}) {
  const [latest, setLatest] = useState(newProducts);
  const { data: session } = useSession();
  const { cart, setCart } = useContext(CartContext);
  const [categ,setCateg] = useState(categories);

  useEffect(()=>{
    const fetchCategories = async() => {
      try {
        const response = await axios.get("/api/categories");
        if(response.data.categories){
          setCateg(response.data.categories);
          fetchCategoryImages(response.data.categories);
        }
      } catch (error:any){
        console.log(error.message);
      }
    }

    fetchCategories();
  },[])

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const newProductsData = await response.json();
          setLatest(newProductsData);
        }
        else{
          throw new Error("Failed to fetch products");
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchNewProducts();
    fetchImages(newProducts);
  }, [newProducts]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const userSession = await getSession();
        const response = await axios.get(
          `/api/cart/?email=${userSession?.user?.email}`
        );
        
        //console.log("User Session: ",userSession);
        const userCart = response.data.userCart;
        
        if(!userCart){
          return;
        }

        for (let i = 0; i < userCart.length; i++) {
          const currentProduct = userCart[i];
          setCart((prev: any) => ({
            ...prev,
            [currentProduct._id]: userCart[i].quantity,
          }));
        }

      } catch (error: any) {
        console.log(error);
      }
    };

    fetchCartData();
  },[]);

  if (session) {
    return (
      <>
          <Header profile={session?.user} />
          <Featured featuredProduct={featuredProduct} />
          <NewProducts newProducts={newProducts} />
      </>
    );
  }

  return (
    <>
        <Header profile={null} />
        <Featured featuredProduct={featuredProduct} />
        <NewProducts newProducts={newProducts} />
    </>
  );
}

export async function getServerSideProps() {
  const featuredProductID = "6532b939899b9097c03be119";

  await mongooseConnect();

  const featuredProduct = await Product.findById(featuredProductID);
  const newProducts = await Product.find({}, null, { sort: { updatedAt: -1 } });
  
  return {
    props: {
      newProducts: newProducts ? JSON.parse(JSON.stringify(newProducts)) : null,
      featuredProduct: featuredProduct ? JSON.parse(JSON.stringify(featuredProduct)) : null,
      
    },
  };
}
