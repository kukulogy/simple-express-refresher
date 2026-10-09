import express, { Request, Response, Application } from 'express';
import {
  orderSchema,
  Status,
  storedOrderSchema,
} from './interface/OrderSchema';
import * as z from 'zod';
const app = express();

app.use(express.json());

const PORT: number = 3000;
type StoredOrder = z.infer<typeof storedOrderSchema>;
type Order = z.infer<typeof orderSchema>;

let orders: Array<StoredOrder> = [];
const calculateTotal = (order: Order): number => {
  if (!order.quantity || !order.price) return 0;
  return order.price * order.quantity;
};

app.get('/', (req: Request, res: Response) => res.send('Hello World'));
app.get('/orders', (req: Request, res: Response) => res.send({ data: orders }));
app.get('/orders/:order_id', (req: Request, res: Response) => {
  const order = orders.find((x) => x.id === req.params.order_id);
  if(order === undefined) return res.status(404).send();
    res.send(order);
});
app.post('/orders', (req: Request, res: Response) => {
  const result = orderSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({ data: { error: z.treeifyError(result.error) } });
  }

  const exists = orders.find((x) => x.id === result.data.id);

  if(exists) {
    return res.status(409).send();
  }

  const order = result.data;
  const total = calculateTotal(order);
  const item: StoredOrder = { ...order, total };
  orders.push(item);
  res.status(201).send({ data: { orders } });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
