import {Stripe} from "stripe";
import { NextApiRequest,NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "" , {
    apiVersion: "2023-08-16",
});

export default async function handle(request:NextApiRequest , response:NextApiResponse){
    if(request.method === "POST"){
        try {
            const {amount,currency,description,token} = request.body;
            const charge = await stripe.paymentIntents.create({
                amount,
                currency,
                description,
                payment_method:token,
                confirm:true,
            });

            if(charge.status === "succeeded"){
                return response.json({
                    message: "Payment successful",
                    status: 200,
                })
            }

            else{
                response.json({
                    message: "Payment Failed",
                    status: 500,
                })
            }
        } catch (error:any) {
            console.log(error);
            return response.json({
                message: error.message,
                status : 500,
            })
        }
    }

    else{
        return response.status(405).end();
    }
}

