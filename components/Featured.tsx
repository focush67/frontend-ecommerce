import styled from "styled-components";
import Center from "./Center";
import PrimaryButton, { NeutralButton } from "./Buttons";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebaseConfig";
import { useEffect, useState, useContext } from "react";
import Cart from "./CartIcon";
import { CartContext } from "./CartContext";
import { ObjectId } from "mongoose";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
export type CartContextType = {
  addToCart: (productID: ObjectId) => void;
  cart: ObjectId[];
  setCart: any;
  clearCart: any;
};

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
  align-items: center;
  display: grid;
  justify-content: space-between;
  grid-template-columns: 1fr 1fr;
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

export default function Featured({ featuredProduct }: any) {
  const [imageUrl, setImageUrl] = useState("");
  const { data: session } = useSession();
  const imageListReference = ref(storage, `${featuredProduct?.title}/`);
  const { cart, setCart } = useContext<CartContextType>(CartContext);
  useEffect(() => {
    listAll(imageListReference)
      .then((response: any) => {
        if (response.items.length > 0) {
          const sortedItems = response.items.sort((a: any, b: any) => {
            const fileNameA = a.name.toLowerCase();
            const fileNameB = b.name.toLowerCase();
            return fileNameA.localeCompare(fileNameB);
          });

          const firstImage = sortedItems[sortedItems.length - 1];
          getDownloadURL(firstImage).then((url) => {
            setImageUrl(url);
          });
        }
      })
      .catch((error: any) => console.log(error));
  }, []);

  const addFeaturedProductToCart = async () => {
    if (!session) {
      await signIn("google");
      return;
    }

    try {
      const cartData = {
        name: session?.user?.name,
        email: session?.user?.email,
        avatar: session?.user?.image,
        productDetails: {
          _id: featuredProduct._id,
          title: featuredProduct.title,
          price: featuredProduct.price,
          coverPhoto: imageUrl,
          quantity: 1,
          stripeID: featuredProduct.stripeID,
        },
      };

      const response = await axios.post("/api/cart", cartData);
      console.log(response.data);

      if (cart[featuredProduct._id]) {
        setCart((prev: any) => ({
          ...prev,
          [featuredProduct._id]: prev[featuredProduct._id] + 1,
        }));
      } else {
        setCart((prev: any) => ({
          ...prev,
          [featuredProduct._id]: 1,
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Bg>
      <Center>
        <Wrapper>
          <Column>
            <div>
              <Title>{featuredProduct?.title}</Title>
              <Description>{featuredProduct?.description}</Description>
              <Column>
                <NeutralButton size="large">Read More</NeutralButton>
                <PrimaryButton size="large" onClick={addFeaturedProductToCart}>
                  <Cart />
                  Add to Cart
                </PrimaryButton>
              </Column>
            </div>
          </Column>
          <div>
            <img src={imageUrl} alt="photo" />
          </div>
        </Wrapper>
      </Center>
    </Bg>
  );
}
