import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "styled-components";

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
  font-size: larger;
  text-align: center;
`;

const TableRow = styled.tr`
  border: 3px solid #ccc;
  background-color: rgba;
`;

const TableCell = styled.td`
  border: 2px solid #ccc;
  padding: 1.5rem;
  box-shadow: #ccc;
`;

const CartItemsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CartItemImage = styled.img`
  max-width: 40px;
  max-height: 40px;
  margin: 3px 3px;
`;

export default function MyOrder() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `/api/orders?email=${session?.user?.email}`
        );

        console.log(response.data);

        setOrders(Object.values(response.data));

        console.log("Orders: ", orders);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchOrders();
  }, [session]);

  return (
    <>
      <Header profile={session?.user} />
      <OrdersTable>
        <thead>
          <tr>
            <TableHeader>Order ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Items</TableHeader>
            <TableHeader>Payment</TableHeader>
            <TableHeader>Paid</TableHeader>
          </tr>
        </thead>

        <tbody>
          {orders.map((order: any) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.name}</TableCell>
              <TableCell>{order.email}</TableCell>
              <TableCell>
                <CartItemsContainer>
                  {order.userCart?.map((item: any) => (
                    <CartItem>
                      <CartItemImage key={item._id} src={item.coverPhoto} />
                      <p>{item?.quantity}</p>
                    </CartItem>
                  ))}
                </CartItemsContainer>
              </TableCell>
              <TableCell>{order.payment}</TableCell>
              <TableCell>{order.paymentStatus}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </OrdersTable>
    </>
  );
}
