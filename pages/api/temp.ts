import mongooseConnect from "@/lib/mongoose";
import mongoose from "mongoose";
import { NextApiRequest,NextApiResponse } from "next";
import { Cart } from "@/lib/models/CartSchema";

export default async function handle(request:NextApiRequest,response:NextApiResponse){
    const {method} = request;
    mongooseConnect();
    
    if(method === "DELETE"){

        const {empty} = request.body;
        if(empty === true){
            await Cart.deleteMany({});
            return response.json({
                message : "Cart emptied",
                status : 201,
            });
        }

        else{
            await Cart.deleteMany({
                quantity:0
            });
    
            return response.json({
                message : "Product removed from Cart",
                status : 201,
            });
        }
        
    }

    return response.json({
        message : "Server error occured",
        status : 500,
    })
}