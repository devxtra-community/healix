import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { stripe } from '../config/stripe.js';
import { CartRepository } from '../repositories/cart.repository.js';
import { OrderRespository } from '../repositories/order.repository.js';
import { Order } from '../domain/order.type.js';
import { PaymentService } from './payment.service.js';
import { generateOrderNumber } from '../utils/order-number.js';

export class CheckoutService {
  constructor(
    private cartRepository: CartRepository,
    private orderRepository: OrderRespository,
    private paymentService: PaymentService,
  ) {}

  async checkOut(
    userId: string,
    addressId: string,
    paymentMethod: 'STRIPE' | 'COD' = 'STRIPE',
  ) {
    const existingOrder =
      await this.orderRepository.getPendingOrderByUser(userId);
    if (existingOrder) {
      return {
        canProceed: false,
        message: 'You already have a pending checkout. Complete payment first.',
        orderId: existingOrder.orderId,
      };
    }

    //  GET CART
    const cart = await this.cartRepository.getCart(userId);
    if (!cart || cart.items.length === 0) {
      return {
        canProceed: false,
        message: 'Cart is empty',
      };
    }

    // GET ADDRESS
    const addressRes = await axios.get(
      `${process.env.USER_SERVICE_URL}/address/${addressId}`,
      { headers: { 'x-user-id': userId } },
    );
    const addressSnapshot = addressRes.data?.data ?? addressRes.data;

    // CHECK AVAILABILITY

    const availableItems = [];
    const unavailableItems = [];

    for (const item of cart.items) {
      const stockRes = await axios.get(
        `${process.env.PRODUCT_SERVICE_URL}/product/stocks/${item.variantId}`,
      );

      if (!stockRes.data || stockRes.data.available < item.quantity) {
        unavailableItems.push(item);
      } else {
        availableItems.push(item);
      }
    }

    //  nothing available → stop
    if (availableItems.length === 0) {
      return {
        canProceed: false,
        unavailableItems,
        message: 'All items are out of stock',
      };
    }

    //  some unavailable → ASK USER
    if (unavailableItems.length > 0) {
      return {
        canProceed: false,
        unavailableItems,
        message: 'Some items are unavailable. Remove them to continue.',
      };
    }

    //  BUILD ORDER ITEMS
    const now = new Date().toISOString();
    const orderId = `ORD-${uuid()}`;
    const orderNumber = await generateOrderNumber();

    let subtotal = 0;
    const orderItems: Order['items'] = [];

    for (const item of availableItems) {
      const priceRes = await axios.get(
        `${process.env.PRODUCT_SERVICE_URL}/product/price/${item.productId}`,
      );

      const price = Number(priceRes.data.finalPrice);
      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for product ${item.productId}`);
      }
      const itemSubtotal = price * item.quantity;

      subtotal += itemSubtotal;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price,
        subtotal: itemSubtotal,
        attributes: item.attributes,
      });
    }

    console.log(availableItems);

    const order: Order = {
      orderId,
      orderNumber,
      userId,
      addressSnapshot,
      items: orderItems,
      subtotal,
      totalAmount: subtotal,
      currency: 'INR',
      paymentMethod,
      paymentStatus: 'PENDING',
      fulfillmentStatus: 'PLACED',
      createdAt: now,
      updatedAt: now,
    };
    // console.log(order);
    //  CREATE ORDER
    await this.orderRepository.createOrder(order);

    const paymentIntentMetadata = {
      orderId,
      userId,
      items: JSON.stringify(
        order.items.map((i) => ({
          versionId: i.variantId,
          quantity: i.quantity,
        })),
      ),
    };

    const paymentIntent =
      paymentMethod === 'STRIPE'
        ? await stripe.paymentIntents.create({
            amount: Math.round(order.totalAmount * 100),
            currency: 'inr',
            automatic_payment_methods: {
              enabled: true,
            },
            metadata: paymentIntentMetadata,
          })
        : null;

    const payment = await this.paymentService.createPendingPayment(
      order.orderId,
      userId,
      order.totalAmount,
      order.currency,
      paymentMethod,
      paymentIntent?.id,
    );

    await this.orderRepository.updatePaymentId(
      order.orderId,
      payment.paymentId,
    );

    //  RESERVE STOCK (ATOMIC)
    const reserved: { variantId: string; quantity: number }[] = [];

    try {
      //  PRE-CHECK STOCK
      for (const item of order.items) {
        const stockRes = await axios.get(
          `${process.env.PRODUCT_SERVICE_URL}/product/stocks/${item.variantId}`,
        );

        if (stockRes.data.available < item.quantity) {
          throw new Error('OUT_OF_STOCK');
        }
      }

      //  RESERVE STOCK
      for (const item of order.items) {
        await axios.post(
          `${process.env.PRODUCT_SERVICE_URL}/product/stocks/reserve`,
          {
            versionId: item.variantId,
            quantity: item.quantity,
          },
        );

        reserved.push({
          variantId: item.variantId,
          quantity: item.quantity,
        });
        const reservationExpiresAt = new Date(
          Date.now() + 10 * 60 * 1000, // 10 minutes
        ).toISOString();
        await this.orderRepository.setReservationExpiry(
          order.orderId,
          reservationExpiresAt,
        );
      }
    } catch {
      // ROLLBACK
      for (const r of reserved) {
        await axios.post(
          `${process.env.PRODUCT_SERVICE_URL}/product/stocks/release`,
          {
            versionId: r.variantId,
            quantity: r.quantity,
          },
        );
      }

      throw new Error('Stock reservation failed');
    }

    if (paymentMethod === 'COD') {
      for (const item of order.items) {
        await axios.post(
          `${process.env.PRODUCT_SERVICE_URL}/product/stocks/confirm`,
          {
            versionId: item.variantId,
            quantity: item.quantity,
          },
        );
      }

      await this.cartRepository.clearCart(userId);

      return {
        canProceed: true,
        orderId: order.orderId,
        paymentMethod: 'COD' as const,
      };
    }

    return {
      canProceed: true,
      orderId: order.orderId,
      paymentMethod: 'STRIPE' as const,
      paymentIntentClientSecret: paymentIntent?.client_secret ?? null,
    };
  }
}
