import {
    StoredOrder,
    Order, 
    OrderPatch,
    orderSchema,
    orderPatchSchema
} from '../schemas/order.schemas';
import * as z from 'zod';

const orders: Array<StoredOrder> = [];

const calculateTotal = (order: Order): number => {
  if (!order.quantity || !order.price) return 0;
  return order.price * order.quantity;
};

export class OrderService {

    createOrder(order: Order): Array<StoredOrder>  {
        const exists = orders.find((x) => x.id === order.id);
      
        if(exists) {
          throw new Error("Order already exists");
        }
      
        const total = calculateTotal(order);
        const item: StoredOrder = { ...order, total };
        orders.push(item);
        return orders;
    }

    getOrders(): Order[] {
        return orders;
    }

    getOrderById(id: string): Order | undefined {
        const order = orders.find((x) => x.id === id);
        console.log("test", order);
        if(order === undefined) throw new Error("Order not found");
        return order;
    }

    updateOrderStatus(orderId: string, order: Order): Order | undefined {
        const index = orders.findIndex((x) => x.id === orderId);

        if (index === -1) {
            throw new Error("Order not found");
        }
    
        orders[index].status = order.status;
        return orders[index];
    }

    deleteOrderById(id: string): Array<StoredOrder> { 
        const index = orders.findIndex((x) => x.id === id);

        if (index === -1) {
            throw new Error("Order not found");
        }
    
        orders.splice(index, 1);
        
        return orders;
    }

}

export const orderService = new OrderService();