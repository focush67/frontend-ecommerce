import {ref,listAll,getDownloadURL} from "firebase/storage";
import {storage} from "@/firebaseConfig";

interface ImageCache{
    [key: string]: string[],
}

interface ProductImagesMap{
    [key:string]: string[];
}

const imageCache:ImageCache = {};

export default async function fetchImages(newProducts:any){
    const productImagesMap:ProductImagesMap = {};
    for(const product of newProducts)
    {
        if(imageCache[product?.title])
        {
            productImagesMap[product?.title] = imageCache[product?.title];
        }

        else{
            const imageRef = ref(storage,`${product.imagesFolder}/`);
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