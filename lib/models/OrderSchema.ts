import {model,Schema,models} from "mongoose";
import mongoose from "mongoose";
import { CartItems } from "./CartSchema";

const orderSchema = new Schema({
    _id: {type:mongoose.Types.ObjectId,required:true},
    sessionId: {type: String,required:true},
    name : {type:String,required:true},
    email :{type:String,required:true},
    address :{type:String,required:true},
    phone :{type:String,required:true},
    payment :{type:String,required:true,default:"debit-card"},
    userCart: [CartItems],
});

export const Order = (models.Order || model("Order",orderSchema));