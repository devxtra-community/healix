import { NextFunction, Request, Response } from 'express';
import { CheckoutService } from '../services/checkout.service.js';

export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}
  checkOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { addressId, paymentMethod } = req.body as {
        addressId?: string;
        paymentMethod?: 'STRIPE' | 'COD';
      };

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!addressId) {
        return res.status(400).json({ message: 'addressId is required' });
      }

      if (paymentMethod && !['STRIPE', 'COD'].includes(paymentMethod)) {
        return res.status(400).json({ message: 'Invalid payment method' });
      }

      const result = await this.checkoutService.checkOut(
        userId,
        addressId,
        paymentMethod ?? 'STRIPE',
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}
