import { ClientSession, Types } from 'mongoose';
import { StockRepository } from '../repositories/stock.repositories.js';

export class StockService {
  constructor(private readonly stockRepo: StockRepository) {}

  // ================= CREATE =================

  // Called when product/version is created
  async createInitialStock(
    versionId: Types.ObjectId,
    total: number,
    session?: ClientSession,
  ) {
    if (total < 0) {
      throw new Error('Initial stock cannot be negative');
    }

    return this.stockRepo.createInitialStock(versionId, total, session);
  }

  // ================= READ =================

  // Used by product listing / PDP
  async getAvailableStock(versionId: Types.ObjectId): Promise<number> {
    const stock = await this.stockRepo.getStock(versionId);
    return stock?.available ?? 0;
  }

  async getStock(versionId: Types.ObjectId) {
    return this.stockRepo.getStock(versionId);
  }

  // ================= ORDER FLOW =================

  // Reserve during checkout
  async reserveStock(
    versionId: Types.ObjectId,
    quantity: number,
    session?: ClientSession,
  ) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    return this.stockRepo.reserveStock(versionId, quantity, session);
  }

  // Payment failed / order cancelled
  async releaseStock(
    versionId: Types.ObjectId,
    quantity: number,
    session?: ClientSession,
  ) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    return this.stockRepo.releaseStock(versionId, quantity, session);
  }

  // Order success
  async confirmStock(
    versionId: Types.ObjectId,
    quantity: number,
    session?: ClientSession,
  ) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    return this.stockRepo.confirmStock(versionId, quantity, session);
  }

  // ADMIN

  // Increase physical stock
  async restock(versionId: Types.ObjectId, quantity: number) {
    if (quantity <= 0) {
      throw new Error('Restock quantity must be positive');
    }

    return this.stockRepo.restock(versionId, quantity);
  }

  // Decrease stock (damage/loss)
  async decreaseStock(versionId: Types.ObjectId, quantity: number) {
    if (quantity <= 0) {
      throw new Error('Decrease quantity must be positive');
    }

    return this.stockRepo.decreaseStock(versionId, quantity);
  }

  // Hard correction (audit fix)
  async correctStock(versionId: Types.ObjectId, newTotal: number) {
    if (newTotal < 0) {
      throw new Error('Total cannot be negative');
    }

    return this.stockRepo.correctTotal(versionId, newTotal);
  }
}
