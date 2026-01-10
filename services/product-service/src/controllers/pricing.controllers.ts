import { PricingService } from '../services/pricing.service.js';
import { Request, Response, NextFunction } from 'express';
export class PricingController {
  constructor(private pricingservice: PricingService) {}
  setBasePrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, price } = req.body;
      const result = await this.pricingservice.setBasePrice(productId, price);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
  applyDiscount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const discount = await this.pricingservice.applyDiscount(req.body);
      res.status(201).json(discount);
    } catch (error) {
      next(error);
    }
  };
  getActivePrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const price = await this.pricingservice.getActivePrice(productId);
      res.status(200).json(price);
    } catch (error) {
      next(error);
    }
  };
}
