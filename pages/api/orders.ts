import Cart from "@/components/Cart";
import { Order } from "@/lib/models/OrderSchema";
import mongooseConnect from "@/lib/mongoose";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { method } = request;

  mongooseConnect();

  if (method === "GET") {
    return response.json(await Order.find().populate("cartItems"));
  }

  if (method === "POST") {
    try {
      const { name, email, address, phone, payment, cartItems } = request.body;
      const orderID = new mongoose.Types.ObjectId();
      const isPresent = await Order.findOne({email});
      if(isPresent)
      {
        return response.json({
            message: "Use a different email",
            status: 302,            
        });
      }

      await Order.create({
        _id: orderID,
        name,
        email,
        address,
        phone,
        payment,
        cartItems,
      });

      return response.json({
        message: "Order placed",
        orderID: `${orderID}`,
        status: 200,
      });
    } catch (error: any) {
      console.log(error);
    }
  }

  return response.json({
    message: "Server error occured",
    status: 500,
  });
}
