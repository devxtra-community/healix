import { ProductStockModel } from '../models/product-stock.models.js';
export class StockRepository {
  // CREATE INITIAL STOCK (idempotent-safe)
  async createInitialStock(productVersionId, total, session) {
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
  //UPDATE
  async updateStock(versionId, newVersionId, session) {
    return ProductStockModel.findOneAndUpdate(
      {
        product_version_id: versionId,
      },
      { $set: { product_version_id: newVersionId } },
      { new: true, session },
    );
  }
  // READ STOCK
  async getStock(productVersionId) {
    return ProductStockModel.findOne({
      product_version_id: productVersionId,
    }).lean();
  }
  // RESERVE STOCK (atomic)
  async reserveStock(productVersionId, quantity, session) {
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
  //add ttl for stock release -> todo
  //user closes browser
  //user goes idle
  //user never pays
  //network dies
  //Stripe webhook never arrives
  async releaseStock(productVersionId, quantity, session) {
    // First check whether the stock document even exists for this versionId
    const existing = await ProductStockModel.findOne({
      product_version_id: productVersionId,
    }).session(session ?? null);
    if (!existing) {
      throw new Error(
        `Stock record not found for versionId: ${productVersionId}`,
      );
    }
    if (existing.reserved < quantity) {
      throw new Error(
        `Cannot release ${quantity} units — only ${existing.reserved} are reserved for versionId: ${productVersionId}`,
      );
    }
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
    // Defensive fallback (race condition guard)
    if (!stock)
      throw new Error(
        'Stock release failed due to a concurrent update. Please retry.',
      );
    return stock;
  }
  // CONFIRM STOCK (order completed)
  async confirmStock(productVersionId, quantity, session) {
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
  async restock(productVersionId, quantity) {
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
  async decreaseStock(productVersionId, quantity) {
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
  async correctTotal(productVersionId, newTotal) {
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
