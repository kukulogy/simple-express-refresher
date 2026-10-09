import express, { Request, Response, Application } from 'express';

import { orderController } from "../controllers/order.controller";

const router = express.Router();

router.get('/', (req: Request, res: Response) => orderController.getOrders(req, res));
router.get('/:order_id', (req: Request, res: Response) => {
    orderController.getOrderById(req, res);
});

router.patch('/:order_id', (req: Request, res: Response) => { 
    orderController.updateOrderById(req, res);
});

router.delete('/:order_id', (req: Request, res: Response) => {
    orderController.deleteByOrderId(req, res);
})

router.post('/', (req: Request, res: Response) => {
    orderController.createOrder(req, res);
});

export default router;