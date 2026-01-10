import { ClientSession, Types } from 'mongoose';
import { ProductStockModel } from '../models/product-stock.models.js';

export class StockRepository {

  // CREATE INITIAL STOCK (idempotent-safe)
  async createInitialStock(
    productVersionId: Types.ObjectId,
    total: number,
    session?: ClientSession,
  ) {
    return ProductStockModel.findOneAndUpdate(
      { product_version_id: productVersionId },
      {
        $setOnInsert: {
          product_version_id: productVersionId,
          total,
          reserved: 0,
          available: total,
        },
      },
      { upsert: true, new: true, session },
    );
  }

  // READ STOCK
  async getStock(productVersionId: Types.ObjectId) {
    return ProductStockModel.findOne({
      product_version_id: productVersionId,
    }).lean();
  }

  // RESERVE STOCK (atomic)
  async reserveStock(
    productVersionId: Types.ObjectId,
    quantity: number,
    session?: ClientSession,
  ) {
    const stock = await ProductStockModel.findOneAndUpdate(
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

    if (!stock) throw new Error('Insufficient stock');
    return stock;
  }

  // RELEASE RESERVED STOCK
  async releaseStock(
    productVersionId: Types.ObjectId,
    quantity: number,
    session?: ClientSession,
  ) {
    const stock = await ProductStockModel.findOneAndUpdate(
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

    if (!stock) throw new Error('Invalid stock release');
    return stock;
  }

  // CONFIRM STOCK (order completed)
  async confirmStock(
    productVersionId: Types.ObjectId,
    quantity: number,
    session?: ClientSession,
  ) {
    const stock = await ProductStockModel.findOneAndUpdate(
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

    if (!stock) throw new Error('Invalid stock confirmation');
    return stock;
  }

  // ADMIN OPERATIONS 

  // RESTOCK (increase physical stock)
  async restock(
    productVersionId: Types.ObjectId,
    quantity: number,
  ) {
    if (quantity <= 0) {
      throw new Error('Restock quantity must be positive');
    }

    return ProductStockModel.findOneAndUpdate(
      { product_version_id: productVersionId },
      {
        $inc: {
          total: quantity,
          available: quantity,
        },
      },
      { new: true },
    );
  }

  // ADMIN DECREASE (loss / damage)
  async decreaseStock(
    productVersionId: Types.ObjectId,
    quantity: number,
  ) {
    if (quantity <= 0) {
      throw new Error('Decrease quantity must be positive');
    }

    const stock = await ProductStockModel.findOneAndUpdate(
      {
        product_version_id: productVersionId,
        available: { $gte: quantity },
      },
      {
        $inc: {
          total: -quantity,
          available: -quantity,
        },
      },
      { new: true },
    );

    if (!stock) {
      throw new Error('Cannot decrease below reserved stock');
    }

    return stock;
  }

  // HARD CORRECTION (audit fix)
  async correctTotal(
    productVersionId: Types.ObjectId,
    newTotal: number,
  ) {
    const stock = await ProductStockModel.findOne({
      product_version_id: productVersionId,
    });

    if (!stock) throw new Error('Stock not found');

    if (newTotal < stock.reserved) {
      throw new Error('New total cannot be less than reserved stock');
    }

    stock.total = newTotal;
    stock.available = newTotal - stock.reserved;

    return stock.save();
  }
}
