import axios from "axios";
import {useRouter} from "next/router";
import { useContext, useEffect,useState } from "react";
import {ProductCard,ProductDescription,ProductImage,ProductInfoBoxHere,ProductWrapper} from "@/pages/products";
import { Title } from "@/components/ProductBox";
import Header from "@/components/Header";
import {useSession,signIn} from "next-auth/react";
import PrimaryButton, { NeutralButton } from "@/components/Buttons";
import { CartContextType } from "@/components/Featured";
import { CartContext } from "@/components/CartContext";

interface Product{
    _id: string;
    title: string;
    description: string;
    price: string;
    stripeProductID: string;
}
export default function CategoryProducts(){
    const {cart,setCart} = useContext<CartContextType>(CartContext);
    const router = useRouter();
    const {id} = router.query;
    const {data: session} = useSession();
    const [products,setProducts] = useState<Product[]>([]);
    const [productImages,setProductImages] = useState([]);

    useEffect(()=>{
        if(localStorage){
            setProductImages(JSON.parse(localStorage.getItem("product_images") || "[]"));
        }
        else{
            console.log("Local Storage not defined hence images could not be rendered");
        }
    },[]);

    useEffect(()=>{
        const fetchChildProducts = async() => {
            try {
                const response = await axios.get(`/api/products?parent=${id}`);
                console.log(response.data);
                setProducts(response.data.products);
                console.log(productImages);
            } catch (error:any){
                console.log(error.message);
            }
        }

        fetchChildProducts();
    },[])


    const productDetails = (product:any) => {
        router.push({
            pathname:`/products/${product._id}`,
            query:{
                imageUrl: productImages[product?.title][0],
            }
        })
    }

    const addToCart = async({product,imageUrl}:any) => {
        if(!session){
            await signIn("google");
            return;
        }

        try {
            const cartData = {
                name: session?.user?.name,
                email: session?.user?.email,
                avatar: session?.user?.image,
                productDetails:{
                    _id: product._id,
                    title: product.title,
                    price: product.price,
                    coverPhoto: Array.isArray(imageUrl) ? imageUrl[1] : imageUrl,
                    quantity: 1,
                    stripeProductID: product.stripeProductID,
                }
            };

            const response = await axios.post("/api/cart",cartData);
            console.log(response.data);
            
            if(cartData.productDetails._id in cart){
                setCart((prev:any) => ({
                    ...prev,
                    [cartData.productDetails._id]: prev[cartData.productDetails._id] + 1,
                }));
            }


            else{
                setCart((prev:any) => ({
                    ...prev,
                    [cartData.productDetails._id]: 1,
                }));
            }

        } catch (error:any){
            console.log(error.message);
        }
    }


    return(
        <>
            <Header profile={session?.user}/>
            <ProductWrapper>
        {
          products?.map((product: any, index: number) => (
            <ProductCard key={index}>
              <ProductImage src={productImages && productImages[product?.title][1] || `${product.title}`} alt="image" />
              <ProductInfoBoxHere>
                <Title style={{fontWeight:"bold",fontSize:"1.5rem"}}>{product?.title}</Title>
                <ProductDescription>{product?.description}</ProductDescription>
                <div style={{
                  display:"flex",
                  justifyContent:"center",
                }}>
                <NeutralButton size={"medium"} onClick={()=>productDetails(product)}>Learn More</NeutralButton>
                <PrimaryButton size={"medium"} onClick={() => addToCart({product,imageUrl : productImages[product?.title]})}>Add to Cart</PrimaryButton>
                </div>
              </ProductInfoBoxHere>
            </ProductCard>
          ))
        }
      </ProductWrapper>
        </>
    )

}