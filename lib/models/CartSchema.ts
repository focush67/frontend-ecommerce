import {Schema,model,models} from "mongoose";
import mongoose from "mongoose";

const cartSchema = new Schema({
    _id : {type : mongoose.Types.ObjectId , required:true},
    title : {type : String , required:true},
    price : {type : String , required:true},
    coverPhoto : {type : String , requred:true},
    quantity : {type : Number , required : true},
})

export const Cart = (models.Cart || model("Cart",cartSchema));