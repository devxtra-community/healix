import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service.js';

export class OrderController {
  constructor(private orderService: OrderService) {}
  getMyOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['x-user-id'] as string;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const orders = await this.orderService.getuserOrder(userId);
      if (!orders) return res.status(404).json({ message: 'Order not found' });

      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  };
  getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { orderId } = req.params;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const order = await this.orderService.getOrder(orderId);
      if (!order || order.userId !== userId) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  };
  getAllOrders = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.orderService.getAllorders();
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  };
  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        'PLACED',
        'PACKED',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      await this.orderService.updateFullfillmentStatus(orderId, status);

      return res.status(200).json({
        message: 'Order status updated',
        orderId,
        status,
      });
    } catch (error) {
      next(error);
    }
  };
}
