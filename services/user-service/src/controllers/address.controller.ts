import { NextFunction, Request, Response } from 'express';
import { AddressService } from '../services/address.service.js';

export class AddressController {
  private addressService;

  constructor(addressService: AddressService) {
    this.addressService = addressService;
  }

  // POST /profile
  createAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        return res
          .status(400)
          .json({ success: false, message: 'Request body is required' });
      }

      const address = await this.addressService.createAddress(req.body);
      res.status(201).json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  };

  getAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }

      const address = await this.addressService.getAddress(userId);
      res.status(200).json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  };

  getAddressById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }

      const { addressId } = req.body;
      const address = await this.addressService.getAddressById(
        userId,
        addressId,
      );
      res.status(200).json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  };

  updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        return res
          .status(400)
          .json({ success: false, message: 'Request body is required' });
      }

      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }

      const { addressId, data } = req.body;

      await this.addressService.updateAddress(addressId, data, userId);
      res
        .status(200)
        .json({ success: true, data: 'Address updated successfully!' });
    } catch (error) {
      next(error);
    }
  };

  deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.addressId) {
        return res
          .status(400)
          .json({ success: false, message: 'Address id is required' });
      }

      const { addressId } = req.body;

      await this.addressService.deleteAddress(addressId);
      res
        .status(200)
        .json({ success: true, data: 'Address deleted successfully!' });
    } catch (error) {
      next(error);
    }
  };
}
