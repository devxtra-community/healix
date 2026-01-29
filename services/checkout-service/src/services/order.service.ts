import { OrderRespository } from "../repositories/order.repository.js";
type FulfillmentStatus =
    | "PLACED"
    | "PACKED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
export class OrderService {
    constructor(private orderRepo: OrderRespository) { }
    getuserOrder(userId: string) {
        return this.orderRepo.getUserOrders(userId)
    }
    getOrder(orderId: string) {
        return this.orderRepo.getOrder(orderId)
    }
    getAllorders() {
        return this.orderRepo.getAllOrders()
    }
    updateFullfillmentStatus(orderId: string, status: FulfillmentStatus) {
        return this.orderRepo.updateFulfillmentStatus(orderId, status);

    }
    
    async markPaid(orderId: string) {
        await this.orderRepo.updatePaymentStatus(orderId, "SUCCESS");
    }

    async markPaymentFailed(orderId: string) {
        await this.orderRepo.updatePaymentStatus(orderId, "FAILED");
    }
    async markFailed(orderId: string) {
        await this.orderRepo.updatePaymentStatus(orderId, "FAILED");
    }
}
