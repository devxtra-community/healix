import { NextFunction, Request, Response } from "express";
import { CheckoutService } from "../services/checkout.service.js";
import { v4 as uuid } from "uuid";
export class CheckoutController {
    constructor(
        private checkoutService: CheckoutService
    ) { }
    checkOut = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.headers['x-user-id'] as string;
            const { addressId } = req.body;

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (!addressId) {
                return res.status(400).json({ message: "addressId is required" });
            }

            const result = await this.checkoutService.checkOut(userId, addressId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };
}