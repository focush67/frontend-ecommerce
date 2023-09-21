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
      const isThereAlready = await Cart.findOne({ _id: productID });

      if (isThereAlready) {
        await Cart.findByIdAndUpdate(
          { _id: productID },
          {
            $inc: { quantity: quantity },
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

  if (method === "DELETE") {
    if (request.body) {
      const { _id, quantity } = request.body;
      const productID = new mongoose.Types.ObjectId(_id);
      const response = await Cart.findById({ _id: productID });

      if (response) {
        if (quantity >= response.quantity) {
          // Product quantity is equal to or greater than the quantity to be decremented,
          // so delete the product from the database
          await Cart.findByIdAndDelete({ _id: productID });
          return response.json({
            message: "Product deleted completely",
            status: 200,
          });
        } else {
          // Decrease the product quantity
          await Cart.findByIdAndUpdate(
            { _id },
            {
              $inc: { quantity: -quantity },
            }
          );

          return response.json({
            message: "Item decremented",
            status: 200,
          });
        }
      } else {
        return response.json({
          message: "Product not found",
          status: 404,
        });
      }
    } else {
      try {
        const result = await Cart.deleteMany({ quantity: 0 });
        if (result.deletedCount > 0) {
          return response.json({
            message: "Products with quantity 0 deleted",
            status: 200,
          });
        } else {
          return response.json({
            message: "No products with quantity 0 found",
            status: 404,
          });
        }
      } catch (error: any) {
        console.log(error.message);
        return response.json({
          message: "Internal server error",
          status: 500,
        });
      }
    }
  }

  return response.json({
    message: "No request processed",
    status: 500,
  });
}
