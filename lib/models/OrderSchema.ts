import {model,Schema,models} from "mongoose";
import mongoose from "mongoose";

const orderSchema = new Schema({
    _id: {type:mongoose.Types.ObjectId,required:true},
    name : {type:String,required:true},
    email :{type:String,required:true},
    address :{type:String,required:true},
    phone :{type:String,required:true},
    payment :{type:String,required:true,default:"debit-card"},
});

export const Order = (models.Order || model("Order",orderSchema));