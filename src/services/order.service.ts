import {
    StoredOrder,
    Order, 
    OrderPatch,
} from '../schemas/order.schemas';

const orders: Array<StoredOrder> = [];

const calculateTotal = (order: Order): number => {
  if (!order.quantity || !order.price) return 0;
  return order.price * order.quantity;
};

export class OrderService {

    createOrder(order: Order): StoredOrder[]  {
        const exists = orders.find((x) => x.id === order.id);
      
        if(exists) {
          throw new Error("Order already exists");
        }
      
        const total = calculateTotal(order);
        const item: StoredOrder = { ...order, total };
        orders.push(item);
        return orders;
    }

    getOrders(): StoredOrder[] {
        return orders;
    }

    getOrderById(id: string): StoredOrder {
        const order = orders.find((x) => x.id === id);
        console.log("test", order);
        if(order === undefined) throw new Error("Order not found");
        return order;
    }

    updateOrderStatus(orderId: string, order: Order): StoredOrder {
        const index = orders.findIndex((x) => x.id === orderId);

        if (index === -1) {
            throw new Error("Order not found");
        }
    
        orders[index].status = order.status;
        return orders[index];
    }

    deleteOrderById(id: string): StoredOrder[] { 
        const index = orders.findIndex((x) => x.id === id);

        if (index === -1) {
            throw new Error("Order not found");
        }
    
        orders.splice(index, 1);
        
        return orders;
    }

}

export const orderService = new OrderService();