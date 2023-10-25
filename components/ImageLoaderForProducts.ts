import {ref,listAll,getDownloadURL} from "firebase/storage";
import {productStorage} from "@/firebaseConfig";

export interface ImageCache{
    [key: string]: string[],
}

export interface ProductImagesMap{
    [key:string]: string[];
}

const imageCache:ImageCache = {};

export default async function fetchImages(newProducts:any[]){
    const productImagesMap:ProductImagesMap = {};
    for(const product of newProducts)
    {
        if(imageCache[product?.title])
        {
            productImagesMap[product?.title] = imageCache[product?.title];
        }

        else{
            const imageRef = ref(productStorage,`${product.imagesFolder}/`);
            try {
                const response = await listAll(imageRef);
                const downloadPromises = response.items.map(async (item:any) => {
                    const url = await getDownloadURL(item);
                    return url;
                });

                const productImageUrls = await Promise.all(downloadPromises);
                productImagesMap[product?.title] = productImageUrls;

                imageCache[product?.title] = productImageUrls;
            } catch (error:any){
                console.log(error);
                productImagesMap[product?.title] = [];
            }
        }
    }

    localStorage.setItem("product_images",JSON.stringify(productImagesMap));

    return productImagesMap;
}