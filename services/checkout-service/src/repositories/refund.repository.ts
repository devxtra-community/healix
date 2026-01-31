import { Refund, RefundStatus } from "../domain/payment.types.js";

export interface RefundRepository {
    create(refund: Refund): Promise<void>;
    updateStatus(
        orderId: string,
        refundId: string,
        status: RefundStatus,
        stripeRefundId?: string,
    ): Promise<void>;
    getByOrder(orderId: string): Promise<Refund[]>;
}
