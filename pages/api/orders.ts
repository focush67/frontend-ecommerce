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
    if(request?.query?.email)
    {
      console.log("Order request for email: ",request.query.email);
      try {
        return response.json(await Order.find({email: request.query.email}));
      } catch (error:any){
        console.log(error.message);
        return response.json({
          message: `${error.message}`,
          status: error.status,
        })
      }
    }
    return response.json(await Order.find().populate("userCart"));
  }

  if (method === "POST") {
    try {
      const { name, email, address, phone, payment, userCart } = request.body;
      const orderID = new mongoose.Types.ObjectId();

      await Order.create({
        _id: orderID,
        name,
        email,
        address,
        phone,
        payment,
        userCart,
        paymentStatus: "No",
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
