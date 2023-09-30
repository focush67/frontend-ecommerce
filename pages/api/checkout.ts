import mongooseConnect from "@/lib/mongoose";
import {NextApiRequest,NextApiResponse} from "next";

export default async function handle(
    request: NextApiRequest,
    response: NextApiResponse,
){
    const {method} = request;
    mongooseConnect();

    if(method !== "POST")
    {
        return response.json({
            message: "Should be a POST request",
            status: 401,
        })
    }

    else{
        const {checkoutData , paymentMethod} = request.body;
        console.log("CHECKOUT: ",checkoutData);
        console.log("PAYMENT METHOD: ",paymentMethod);

        return response.json({
            message: "CHECOUT DATA RECEIVED",
            status: 200,
        })
    }
}