import {Schema,model,models} from "mongoose";
import mongoose from "mongoose";

export const CartItems = new Schema({
    _id : {type : mongoose.Types.ObjectId , required:true},
    title : {type : String , required:true},
    price : {type : String , required:true},
    coverPhoto : {type : String , required:true},
    quantity : {type : Number , required : true},
    stripeID: {type: String, required: true},
})

const CartSchema = new Schema({
    _id: {type: mongoose.Types.ObjectId,required: true},
    name: {type: String,required: true},
    email: {type: String,required: true},
    avatar: {type: String},
    userCart: [CartItems],
})

export const Cart = (models.Cart || model("Cart",CartSchema));