import { NextApiRequest, NextApiResponse } from "next";
import connect from "@/lib/mongoose";
import { Category } from "@/lib/models/CategorySchema";

export default async function handle(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { method } = request;
  connect();

  if (method === "GET") {
    const {parent} = request.query;
    if(!parent){
      try {
        const parentCategories = await Category.find({ parent: null });
        return response.json({
          message: "Returning Parent Categories",
          status: 201,
          categories: parentCategories,
        });
      } catch (error: any) {
        return response.json({
          message: "Error from backend",
          status: 500,
        });
      }
    }
    
    else{
      const childProducts = await Category.find({parent});
      return response.json({
        message: "Returning child products",
        status: 201,
        products: childProducts,
      })
    }
  }

  return response.json({
    message: "Invalid method",
    status: 505,
  });
}
