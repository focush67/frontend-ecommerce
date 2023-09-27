import { Cart, CartItems } from "@/lib/models/CartSchema";
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
    if(request.query?.email)
    {
      console.log("Request Email: ", request.query?.email);
      const email = request?.query?.email;
      try {
        const cart = await Cart.findOne({email});
        if(!cart)
        {
          return response.json({
            message: "Cart not found for the user",
            status: 404,
          });
        }

        return response.json(cart);
      } catch (error:any) {
        console.log(error);
        return response.json({
          message: "Internal Server Error occured",
          status: 500,
        })
      }
    }

    try {
      console.log("Fetching all carts");
      const carts = await Cart.find();
      return response.json(carts);
    } catch (error:any) {
      console.log(error);
      return response.json({
        message: "Internal Server occured",
        status: 500,
      })
    }
  }

  // POST Request

  if (method === "POST") {
    try {
      const {name,email,avatar,productDetails} = request.body;
      console.log("BACKEND ",request.body);
      const productID = new mongoose.Types.ObjectId();
      const isThereAlready = await Cart.findOne({email});
      console.log("CHECKING ",isThereAlready);
      if(isThereAlready)
      {
        const existingCartItem = isThereAlready.userCart.find((item:any)=>item._id.equals(productDetails._id));
        if(existingCartItem)
        {
          console.log("Item ",existingCartItem);
          existingCartItem.quantity += 1;
        }

        else
        {
          isThereAlready.userCart.push({
            _id: productDetails._id,
            title: productDetails.title,
            price: productDetails.price,
            coverPhoto: productDetails.coverPhoto,
            quantity: 1,
          });
        }

        await isThereAlready.save();
        console.log("AFTER SAVING ",isThereAlready);
        return response.json({
          message: "Cart updated",
          status: 201,
        });
      }


      else
      {
        await Cart.create({
          _id: productID,
          name,
          email,
          avatar,
          cartContents:[
            {
              _id: productDetails._id,
              title: productDetails.title,
              price: productDetails.price,
              coverPhoto: productDetails.coverPhoto,
              quantity: 1,
            }
          ]
        });

        return response.json({
          message: "Product added to Cart",
          status: 200,
        });
      }
    } catch (error:any) {
      console.log(error);
      return response.json({
        message: error.message,
        status: 505,
      })
    }
  }

  if (method === "DELETE") {
  
      const {email,_id,quantity} = request.body;
      const productID = new mongoose.Types.ObjectId(_id);

      try {
        await Cart.findOneAndUpdate({"userCart._id" : productID},
        {
          $inc: {"userCart.$.quantity": quantity}
        });

        return response.json({
          message: "Item decremented",
          status: 200,
        });
      } catch (error:any) {
        console.log(error);
        return response.json({
          message: error.message,
          status: error.status,
        })
      }
      
    }
    
    return response.json({
      message:"Server error occcured",
      status : 500,
    })
  }

