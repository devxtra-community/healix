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
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        env.stripeWebHookSecretKey,
      );
    } catch (err) {
      console.error('❌ Webhook signature verification failed', err);
      return res.status(400).send('Webhook signature verification failed');
    }

    console.log('📩 Stripe event:', event.type);

    if (await this.webhookIdempotancy.isProcessed(event.id)) {
      console.log('⚠️ Duplicate webhook ignored:', event.id);
      return res.sendStatus(200);
    }

    try {
      // =========================
      // PAYMENT SUCCESS
      // =========================

      if (event.type === 'payment_intent.succeeded') {
        const intent = event.data.object as Stripe.PaymentIntent;

        console.log('💰 PaymentIntent:', intent.id);

        const payment = await this.paymentService.markSuccess(intent.id);

        // fallback using metadata if payment not found
        if (!payment) {
          console.log('⚠️ Payment record not found. Using metadata fallback.');

          const orderId = intent.metadata?.orderId;

          if (!orderId) {
            console.log('❌ orderId missing in metadata');
            return res.sendStatus(200);
          }

          await this.orderService.markPaid(orderId);
        } else {
          await this.orderService.markPaid(payment.orderId);
        }

        const items = JSON.parse(intent.metadata.items || '[]');

        for (const item of items) {
          await axios.post(
            `${env.productServiceUrl}/product/stocks/confirm`,
            item,
          );
        }

        if (payment) {
          await this.cartRepo.clearCart(payment.userId);
        }

        console.log('✅ Payment processed successfully');
      }

      // =========================
      // PAYMENT FAILED
      // =========================

      if (event.type === 'payment_intent.payment_failed') {
        const intent = event.data.object as Stripe.PaymentIntent;

        const payment = await this.paymentService.markFailed(intent.id);

        if (!payment) return res.sendStatus(200);

        await this.orderService.markFailed(payment.orderId);

        const items = JSON.parse(intent.metadata.items || '[]');

        for (const item of items) {
          await axios.post(
            `${env.productServiceUrl}/product/stocks/release`,
            item,
          );
        }

        console.log('❌ Payment failed handled');
      }

      // =========================
      // REFUND
      // =========================

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

        console.log('↩️ Refund processed');
      }

      await this.webhookIdempotancy.markProcessed(event.id);

      res.json({ received: true });
    } catch (error) {
      console.error('🔥 Webhook processing error:', error);

      res.sendStatus(500);
    }
  };
}
