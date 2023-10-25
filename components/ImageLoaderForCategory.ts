import {ref,listAll,getDownloadURL} from "firebase/storage";
import { categoryStorage } from "@/firebaseConfig";

export interface CategoryImagesMap{
    [key: string]: string[];
}

const categoryImageCache: CategoryImagesMap = {};

export async function fetchCategoryImages(categories:any[]){
    const categoryImagesMap: CategoryImagesMap = {};
    const promises = categories.map(async (category:any,index:number) => {
        if(categoryImageCache[category.name]){
            return {
                name: category.name,
                images: categoryImageCache[category.name]
            }
        }

        else{
            const imageRef = ref(categoryStorage,category.name);
            try {
                const response = await listAll(imageRef);
                const downloadPromises = response.items.map(async(item:any) => {
                    const url = await getDownloadURL(item);
                    return url;
                });

                const categoryImageUrls = await Promise.all(downloadPromises);
                categoryImageCache[category.name] = categoryImageUrls;

                return {
                    name: category.name,
                    images: categoryImageUrls,
                };

            } catch (error:any){
                console.log(error.message);
                return {name: category.name,images:[]};
            }
        }
    });


    const results = await Promise.all(promises);

    results.forEach((result) => {
        categoryImagesMap[result.name] = result.images;
    });

    localStorage.setItem("category_images",JSON.stringify(categoryImagesMap));

    return categoryImagesMap;
}