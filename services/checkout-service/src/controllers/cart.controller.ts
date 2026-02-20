import { CartItem } from '../domain/cart.types.js';
import { CartService } from '../services/cart.service.js';
import { Request, Response, NextFunction } from 'express';
export class CartController {
  constructor(private cartService: CartService) {}
  getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      console.log(userId);

      if (!userId) {
        return res.status(401).json({ message: 'HELLO Unauthorized' });
      }
      const cart = await this.cartService.getCart(userId);
      console.log(cart);

      if (!cart) {
        return res.status(200).json({
          userId,
          items: [],
          itemCount: 0,
          cartTotal: 0,
          expiresAt: '',
        });
      }

      return res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  };
  addItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const items: CartItem = req.body;
      await this.cartService.addItem(userId, items);
      return res.status(200).json({
        message: 'Item added to cart',
      });
    } catch (error) {
      next(error);
    }
  };
  removeItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { productId, variantId } = req.params;
      await this.cartService.removeItem(userId, productId, variantId);
      return res.status(200).json({
        message: 'Item removed from cart',
      });
    } catch (error) {
      next(error);
    }
  };
  clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['x-user-id'] as string;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      await this.cartService.clearCart(userId);

      return res.status(200).json({
        message: 'Cart cleared',
      });
    } catch (error) {
      next(error);
    }
  };
}
