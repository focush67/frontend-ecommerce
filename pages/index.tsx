import { Product } from "@/lib/models/ProductSchema";
import Header from "@/components/Header";
import { useState, useEffect, useContext } from "react";
import Featured from "@/components/Featured";
import mongooseConnect from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import { useSession, getSession } from "next-auth/react";
import axios from "axios";
import { CartContext } from "@/components/CartContext";

export default function Home({ featuredProduct, newProducts }: any) {
  const [latest, setLatest] = useState(newProducts);
  const { data: session } = useSession();
  const { cart, setCart } = useContext(CartContext);

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
  }, [newProducts]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const userSession = await getSession();
        const response = await axios.get(
          `/api/cart/?email=${userSession?.user?.email}`
        );

        const userCart = response.data.userCart;

        for (let i = 0; i < userCart.length; i++) {
          const currentProduct = userCart[i];
          setCart((prev: any) => ({
            ...prev,
            [currentProduct._id]: userCart[i].quantity,
          }));
        }

        console.log("CART: ",userCart);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchCartData();
  }, []);

  if (session) {
    return (
      <>
        <div>
          <Header profile={session?.user}/>
          <Featured featuredProduct={featuredProduct} />
          <NewProducts newProducts={newProducts} />
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <Header />
        <Featured featuredProduct={featuredProduct} />
        <NewProducts newProducts={newProducts} />
      </div>
    </>
  );
}

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
