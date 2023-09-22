import { Order } from "@/lib/models/OrderSchema";
import mongooseConnect from "@/lib/mongoose";
import mongoose from "mongoose";
import { NextApiRequest,NextApiResponse } from "next";

export default async function handle(request:NextApiRequest,response:NextApiResponse){
    const {method} = request;

    mongooseConnect();

    if(method === "GET"){
        return response.json(await Order.find());
    }

    if(method === "POST"){
        try {
            const {name,email,address,phone,payment} = request.body;
            const orderID = new mongoose.Types.ObjectId();

            const isThereAlready = await Order.findOne({
                email,
            });

            if(isThereAlready){
                return response.json({
                    message:"Order already placed",
                    status:301,
                });
            }

            else{
                await Order.create({
                    _id: orderID,
                    name,email,address,phone,payment
                });

                return response.json({
                    message:"Order placed",
                    status:200,
                })
            }
        } catch (error:any) {
            console.log(error);
        }
    }

    return response.json({
        message: "Server error occured",
        status: 500
    })
}