import stripePackage from "stripe";
import { NextApiRequest,NextApiResponse } from "next";

const stripe = stripePackage(process.env.NEXT_PUBLIC_STRIPE_PRIVATE_KEY || "");

export default async function handleStripePayment(req:NextApiRequest,res:NextApiResponse){
    if(req.method !== "POST")
    {
        return res.status(405).end();
    }

    try {
       const {formData,userCart} = req.body;
      
       const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: userCart.map((product: any) => {
          const unitAmountCents = (parseFloat(product.price)*100);
          console.log(`Product: ${product.title}, Unit Amount (rupees): ${unitAmountCents}`);
          
          if (unitAmountCents < 1) {
            console.error(`Invalid Unit Amount for Product: ${product.title}, Value: ${unitAmountCents}`);
          }
          

          return {
            price_data: {
              currency: "inr",
              product_data: {
                name: product.title,
              },
              unit_amount: unitAmountCents, // Convert to cents
            },
            quantity: product.quantity,
          };
        }),
        mode: "payment",
        customer_email: formData.email,
        success_url: "http://localhost:3001/cart?success=1",
        cancel_url: "http://localhost:3001/cart?canceled=1",
      });
      


      
      
      console.log("Session from backend: ",session);
       return res.status(200).json({session});

    } catch (error:any){
        console.log("Error from backend: ",error);
        return res.status(500).json({error});
    }
}
