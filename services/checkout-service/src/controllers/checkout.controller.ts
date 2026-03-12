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

  createStripeSession = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { addressId } = req.body as {
        addressId?: string;
      };

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!addressId) {
        return res.status(400).json({ message: 'addressId is required' });
      }

      const result = await this.checkoutService.createStripeSession(
        userId,
        addressId,
      );

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  verifyStripeSession = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { sessionId } = req.params;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!sessionId) {
        return res.status(400).json({ message: 'sessionId is required' });
      }

      const result = await this.checkoutService.verifyStripeSession(
        userId,
        sessionId,
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
