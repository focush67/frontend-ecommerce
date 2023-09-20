import { Cart } from "@/lib/models/CartSchema";
import mongooseConnect from "@/lib/mongoose";
import mongoose from "mongoose";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handle(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { method } = request;
  mongooseConnect();
  console.log("Cart Online");

  // GET Request

  if (method === "GET") {
    if (request.query?.id) {
      return response.json(await Cart.findOne({ _id: request.query?.id }));
    }
    return response.json(await Cart.find());
  }

  // POST Request

  if (method === "POST") {
    try {
      const { _id, title, price, coverPhoto, quantity } = request.body;
      const productID = new mongoose.Types.ObjectId(_id);
      const isThereAlready = await Cart.findOne({_id : productID});

      if (isThereAlready) {
        await Cart.findByIdAndUpdate(
          { _id : productID},
          {
            $inc: { quantity: 1 },
          }
        );

        return response.json({
          message: "Cart Updated",
          status: 201,
        });

      } else {
        await Cart.create({
          _id: productID,
          title: title,
          price: price,
          coverPhoto: coverPhoto,
          quantity: quantity,
        });

        return response.json({
          message: "Product added to Cart",
          status: 200,
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  return response.json({
    message: "Couldn't perform method",
    status: 500,
  });
}
