import { Product } from "../../lib/models/ProductSchema";
import mongooseConnect from "../../lib/mongoose";

export default async function handle(request: any, response: any) {
  const { method } = request;
  mongooseConnect();
  console.log("DB Connected");

// GET REQUEST
  if (method === "GET") {
    console.log("INSIDE GET");
    if (request.query?.id) {
      return response.json(await Product.findOne({ _id: request.query?.id }));
    }
    return response.json(await Product.find());
  }

}
