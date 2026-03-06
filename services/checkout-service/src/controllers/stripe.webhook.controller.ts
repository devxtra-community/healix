import { Request, Response } from 'express';
import Stripe from 'stripe';
import { stripe } from '../config/stripe.js';
import axios from 'axios';
import { env } from '../config/env.js';
import { PaymentService } from '../services/payment.service.js';
import { OrderService } from '../services/order.service.js';
import { CartRepository } from '../repositories/cart.repository.js';
import { webhookIdempotency } from '../utils/webhook-idempotency.js';
import { DynamoRefundRepository } from '../repositories/refund.repository.dynamo.js';
export class StripeWebHookController {
  constructor(
    private paymentService: PaymentService,
    private orderService: OrderService,
    private cartRepo: CartRepository,
    private webhookIdempotancy: webhookIdempotency,
    private refundRepo: DynamoRefundRepository,
  ) {}
  handle = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig!,
        env.stripeWebHookSecretKey,
      );
    } catch {
      return res.status(400).send('Webhook signature verification failed');
    }

    if (await this.webhookIdempotancy.isProcessed(event.id)) {
      return res.sendStatus(200);
    }
    // PAYMENT SUCCESS

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;

      const payment = await this.paymentService.markSuccess(intent.id);
      if (!payment) return res.sendStatus(200);

      await this.orderService.markPaid(payment.orderId);

      const items = JSON.parse(intent.metadata.items || '[]');
      for (const item of items) {
        await axios.post(
          `${process.env.PRODUCT_SERVICE_URL}/product/stocks/confirm`,
          item,
        );
      }

      await this.cartRepo.clearCart(payment.userId);
    }

    // PAYMENT FAILD

    if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object as Stripe.PaymentIntent;

      const payment = await this.paymentService.markFailed(intent.id);
      if (!payment) return res.sendStatus(200);

      await this.orderService.markFailed(payment.orderId);

      const items = JSON.parse(intent.metadata.items || '[]');
      for (const item of items) {
        await axios.post(
          `${process.env.PRODUCT_SERVICE_URL}/product/stocks/release`,
          item,
        );
      }
    }
    if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;

      if (!charge.refunds || charge.refunds.data.length === 0) {
        return res.sendStatus(200);
      }

      const refund = charge.refunds.data[0];

      if (
        !refund.metadata ||
        !refund.metadata.orderId ||
        !refund.metadata.refundId
      ) {
        return res.sendStatus(200);
      }

      await this.refundRepo.updateStatus(
        refund.metadata.orderId,
        refund.metadata.refundId,
        'SUCCESS',
        refund.id,
      );
    }

    await this.webhookIdempotancy.markProcessed(event.id);

    res.json({ received: true });
  };
}
