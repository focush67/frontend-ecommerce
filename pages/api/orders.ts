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
    if (request?.query?.email) {
      console.log("Order request for email: ", request.query.email);
      try {
        return response.json(await Order.find({ email: request.query.email }));
      } catch (error: any) {
        console.log(error.message);
        return response.json({
          message: `${error.message}`,
          status: error.status,
        });
      }
    }
    return response.json(await Order.find().populate("userCart"));
  }

  if (method === "POST") {
    try {
      const {
        sessionId,
        name,
        email,
        address,
        phone,
        payment,
        userCart,
        amount,
      } = request.body;
      const orderID = new mongoose.Types.ObjectId();

      await Order.create({
        _id: orderID,
        sessionId,
        name,
        email,
        address,
        phone,
        payment,
        userCart,
        amount,
      });

      return response.json({
        message: "Order placed",
        orderID: `${orderID}`,
        sessionId: `${sessionId}`,
        status: 200,
      });
    } catch (error: any) {
      console.log(error);
    }
  }

  if (method === "DELETE") {
    const { id } = request?.query;
    if (id) {
      try {
        const deletedOrder = await Order.findByIdAndDelete({ _id: id });
        if (deletedOrder) {
          return response.json({
            message: "Order deleted successfully",
            status: 200,
          });
        } else {
          return response.json({
            message: "Order not found",
            status: 404,
          });
        }
      } catch (error: any) {
        console.log(error);
        return response.json({
          message: "Error deleting Order",
          status: 501,
        });
      }
    }
  }

  return response.json({
    message: "Server error occured",
    status: 500,
  });
}
