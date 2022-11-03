import { format } from "./utils";

type Order = {
  price: number;
  quantity: number;
};

export type Market_View = {
  ask_orders: Order[]; //red
  bid_orders: Order[]; // green
};

const Column = ({
  orders,
  color,
}: {
  orders: Order[];
  color: "green" | "red";
}) => {
  return (
    <div style={{ color }}>
      {orders.map((x, idx) => (
        <div key={idx}>{format(x.price)}</div>
      ))}
    </div>
  );
};

export default ({
  marketView: { bid_orders, ask_orders },
}: {
  marketView: Market_View;
}) => {
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <Column orders={bid_orders} color="green"></Column>
      <Column orders={ask_orders} color="red"></Column>
    </div>
  );
};
