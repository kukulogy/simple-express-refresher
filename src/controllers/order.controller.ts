import { Request, Response } from "express";
import { orderSchema, orderPatchSchema } from "../schemas/order.schemas"
import { orderService } from "../services/order.service";

export class OrderController {
    createOrder(req: Request, res: Response): void {
        const result = orderSchema.safeParse(req.body);

        if (!result.success) {
             res.status(400).send({
                message: "Invalid order data",
                errors: result.error.issues,
            });
            return;
        }

        try {
            const data = orderService.createOrder(result.data);
            res.send(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(409).json({
                    message: error.message
                });
                return;
            }
        
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }

    getOrders(req: Request, res: Response): void {
        const orders = orderService.getOrders();

        res.send({
            data: orders,
        });
    }

    getOrderById(req: Request, res: Response): void {
        try {
            const orderId = req.params.order_id;

            if (typeof orderId !== "string") {
                res.status(400).json({
                    message: "Invalid order ID"
                });
                return;
            }

            const order = orderService.getOrderById(orderId);
            console.log("getOrderById", order);
            res.send({
                message: order
            });
        } catch( error: unknown) {
            if (error instanceof Error) {
                res.status(404).json({
                    message: error.message
                });
                return; 
            }
        
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }

    updateOrderById(req: Request, res: Response) {
        const result = orderPatchSchema.safeParse(req.body);
        const orderId = req.params.order_id;

        if (typeof orderId !== "string") {
            res.status(400).json({
                message: "Invalid order ID"
            });
            return;
        }
    
        if (!result.success) {
            return res.status(400).send({ message: result.error }); 
        }

        try{ 
            const order = orderService.updateOrderStatus(orderId, req.body);
            res.send({ data: order });
        } catch(error: unknown) {
            if (error instanceof Error) {
                return res.status(404).json({
                    message: error.message
                });
                
            }
        
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }

    deleteByOrderId(req: Request, res: Response) {
        try{ 
            const orderId = req.params.order_id;

            if (typeof orderId !== "string") {
                res.status(400).json({
                    message: "Invalid order ID"
                });
                return;
            }
            orderService.deleteOrderById(orderId);
            res.status(204).send();
        } catch(error: unknown) {
            if (error instanceof Error) {
                return res.status(404).json({
                    message: error.message
                });
                
            }
        
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
  
}
export const orderController = new OrderController();