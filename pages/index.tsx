import { Product } from "@/lib/models/ProductSchema";
import Header from "@/components/Header";
import { useState, useEffect} from "react";
import Featured from "@/components/Featured";
import  mongooseConnect from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import { useSession } from "next-auth/react";
export default function Home({ featuredProduct, newProducts }: any) {

  const [latest, setLatest] = useState(newProducts);
  const {data: session} = useSession();
  
  console.log("Session: ",session);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const newProductsData = await response.json();
          setLatest(newProductsData);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchNewProducts();
    const intervalID = setInterval(fetchNewProducts, 1995000);
    return () => clearInterval(intervalID);
  }, [newProducts]);

      return (
        <>
        <div>
          <Header profile={session?.user} />
          <Featured featuredProduct={featuredProduct} />
          <NewProducts newProducts={newProducts} />
        </div>
        </>
      );
  };

export async function getServerSideProps() {

  const featuredProductID = "650a38f6a3394adf83ec27af";

  await mongooseConnect();

  const featuredProduct = await Product.findById(featuredProductID);
  const newProducts = await Product.find({}, null, { sort: { updatedAt: -1 } });

  return {
    props: {
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
    },
  };
}
