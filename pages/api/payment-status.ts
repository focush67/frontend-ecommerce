import {Stripe} from "stripe";
import {NextApiRequest,NextApiResponse} from "next";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PRIVATE_KEY!,{
    apiVersion:"2023-08-16",
});

export default async function handleCheckPaymentStatus(request:NextApiRequest,response:NextApiResponse){
    if(request.method !== "GET"){
        return response.status(405).end();
    }

    try {
        const {userSessionId} = request.query;
        console.log("User Session ID received at backend: ",userSessionId);
        const session = await stripe.checkout.sessions.retrieve(userSessionId as string);
        return response.json({
            message: "Payment Status",
            status: 200,
            paymentStatus: session.payment_status,
        });
    } catch (error:any){
        console.log("Error: ",error);
        return response.json({
            error: error,
            status: error.status,
        })
    }
}