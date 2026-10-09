import express, { Request, Response, Application } from 'express';
import {
    StoredOrder,
    Order, 
    OrderPatch,
    orderSchema,
    orderPatchSchema
} from '../schema/OrderSchema';
import * as z from 'zod';

const router = express.Router();

let orders: Array<StoredOrder> = [];
const calculateTotal = (order: Order): number => {
  if (!order.quantity || !order.price) return 0;
  return order.price * order.quantity;
};

router.get('/', (req: Request, res: Response) => res.send({ data: orders }));
router.get('/:order_id', (req: Request, res: Response) => {
  const order = orders.find((x) => x.id === req.params.order_id);
  if(order === undefined) return res.status(404).send();
    res.send(order);
});

router.patch('/:order_id', (req: Request, res: Response) => { 
    const index = orders.findIndex((x) => x.id === req.params.id);
    const result = orderPatchSchema.safeParse(req.body);
    console.log(JSON.stringify(result), req.body);
    if (!result.success) {
        return res.status(400).send({ data: { error: z.treeifyError(result.error) } });
    }

    if (index === -1) {
        return res.status(404).send();
    }

    orders[index]['status'] = result.data;
    
    res.send({ data : orders[index]});
});
router.post('/', (req: Request, res: Response) => {
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

export default router;