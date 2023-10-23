import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "styled-components";
import {loadStripe} from "@stripe/stripe-js";
import {NeutralButton} from "@/components/Buttons";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface Order{
  _id: string;
  name: string;
  email: string;
  userCart: any[];
  sessionId: string;
}

interface PaymentStats{
  [sessionId: string]:string;
}

const OrdersTable = styled.table`
  width: 100vw;
`;

const TableHeader = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
  font-size: large;
  text-align: center;
`;

const TableRow = styled.tr`
  border: 3px solid #ccc;
  background-color: rgba;
`;

const TableCell = styled.td`
  border: 2px solid #ccc;
  padding: 1rem;
  box-shadow: #ccc;
  font-size: 19px;
  font-weight: semibold;
  font-style: italic;
  text-align: center;
`;

const CartItemsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  justify-content: center;
`;

const CartItemImage = styled.img`
  max-width: 5em;
  max-height: 5em;
  margin: 2px 2px;
`;

export default function MyOrder() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentStats,setPaymentStats] = useState<PaymentStats>({});

  const fetchPaymentStatusForOrder = async(userSessionId:string) => {
    try {
      const response = await axios.get(`/api/payment-status?userSessionId=${userSessionId}`);
      return response.data.paymentStatus;
    } catch (error:any){
      console.log(error);
    }
  }

  useEffect(() => {
    const productPaymentStati:PaymentStats = {};
    const fetchPaymentStatiForCart = async() => {
      for(const order of orders){
        const status = await fetchPaymentStatusForOrder(order?.sessionId);
        productPaymentStati[order.sessionId] = status;
      }
      setPaymentStats(productPaymentStati);
    }
    fetchPaymentStatiForCart();
  } ,[orders])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `/api/orders?email=${session?.user?.email}`
        );

        setOrders(Object.values(response.data));

      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchOrders();
  }, [session]);

  const handleCompletePayment = async(order:Order) => {
    ///console.log("Event for re-payment received");
    const stripe = await stripePromise;

    try {
       
      const {error} = await stripe?.redirectToCheckout({
        sessionId: order.sessionId,
      })!

      if(error)
      {
        console.log("Error proceeding to checkout");
      }

    } catch (error:any){
      console.log("Error from orders: ",error);
    }
  }

  return (
    <>
      <Header profile={session?.user} />
      <OrdersTable>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Items</TableHeader>
            <TableHeader>Paid</TableHeader>
          </tr>
        </thead>

        <tbody>
          {orders.map((order: any,index:number) => (
            <TableRow key={index}>
              <TableCell>{index+1}</TableCell>
              <TableCell>{order.name}</TableCell>
              <TableCell>
                <CartItemsContainer>
                  {order.userCart?.map((item: any) => (
                    <CartItem key={item._id}>
                      <CartItemImage key={item._id} src={item.coverPhoto} />
                      <p>{item?.quantity}</p>
                    </CartItem>
                  ))}
                </CartItemsContainer>
              </TableCell>
              <TableCell>
                {
                  paymentStats[order?.sessionId] === "paid" ? "Yes" : (
                    <NeutralButton size="medium" onClick={() => handleCompletePayment(order)} >Complete Payment</NeutralButton>
                  )
                }
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </OrdersTable>
    </>
  );
}
