import { ClientSession, Types } from 'mongoose';
import { ProductStockModel } from '../models/product-stock.models.js';

export class StockRepository {
  //Create stock for a product version (called on product/version creation)

  async createInitialStock(
    productVersionId: Types.ObjectId,
    total: number,
    session?: ClientSession,
  ) {
    return ProductStockModel.create(
      [
        {
          product_version_id: productVersionId,
          total,
          reserved: 0,
          available: total,
        },
      ],
      session ? { session } : {},
    );
  }

  //Get stock for a product version

  async getStock(productVersionId: Types.ObjectId) {
    return ProductStockModel.findOne({
      product_version_id: productVersionId,
    }).lean();
  }

  //Reserve stock (ATOMIC)
  //Prevents overselling

  async reserveStock(
    productVersionId: Types.ObjectId,
    quantity: number,
    session?: ClientSession,
  ) {
    return ProductStockModel.findOneAndUpdate(
      {
        product_version_id: productVersionId,
        available: { $gte: quantity },
      },
      {
        $inc: {
          available: -quantity,
          reserved: quantity,
        },
      },
      { new: true, session },
    );
  }

  //Release reserved stock (payment failed / order cancelled)

  async releaseStock(
    productVersionId: Types.ObjectId,
    quantity: number,
    session?: ClientSession,
  ) {
    return ProductStockModel.findOneAndUpdate(
      {
        product_version_id: productVersionId,
        reserved: { $gte: quantity },
      },
      {
        $inc: {
          available: quantity,
          reserved: -quantity,
        },
      },
      { new: true, session },
    );
  }

  //Confirm stock (order completed)

  async confirmStock(
    productVersionId: Types.ObjectId,
    quantity: number,
    session?: ClientSession,
  ) {
    return ProductStockModel.findOneAndUpdate(
      {
        product_version_id: productVersionId,
        reserved: { $gte: quantity },
      },
      {
        $inc: {
          reserved: -quantity,
          total: -quantity,
        },
      },
      { new: true, session },
    );
  }

  //Admin adjustment (restock / manual correction)

  async adjustStock(productVersionId: Types.ObjectId, delta: number) {
    return ProductStockModel.findOneAndUpdate(
      { product_version_id: productVersionId },
      {
        $inc: {
          total: delta,
          available: delta,
        },
      },
      { new: true },
    );
  }
}
