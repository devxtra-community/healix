export class StockService {
  stockRepo;
  constructor(stockRepo) {
    this.stockRepo = stockRepo;
  }
  // ================= CREATE =================
  // Called when product/version is created
  async createInitialStock(versionId, total, session) {
    if (total < 0) {
      throw new Error('Initial stock cannot be negative');
    }
    return this.stockRepo.createInitialStock(versionId, total, session);
  }
  // ================= READ =================
  // Used by product listing / PDP
  async getAvailableStock(versionId) {
    const stock = await this.stockRepo.getStock(versionId);
    return stock?.available ?? 0;
  }
  async getStock(versionId) {
    return this.stockRepo.getStock(versionId);
  }
  // ================= ORDER FLOW =================
  // Reserve during checkout
  async reserveStock(versionId, quantity, session) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    return this.stockRepo.reserveStock(versionId, quantity, session);
  }
  // Payment failed / order cancelled
  async releaseStock(versionId, quantity, session) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    return this.stockRepo.releaseStock(versionId, quantity, session);
  }
  // Order success
  async confirmStock(versionId, quantity, session) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    return this.stockRepo.confirmStock(versionId, quantity, session);
  }
  // ADMIN
  // Increase physical stock
  async restock(versionId, quantity) {
    if (quantity <= 0) {
      throw new Error('Restock quantity must be positive');
    }
    return this.stockRepo.restock(versionId, quantity);
  }
  // Decrease stock (damage/loss)
  async decreaseStock(versionId, quantity) {
    if (quantity <= 0) {
      throw new Error('Decrease quantity must be positive');
    }
    return this.stockRepo.decreaseStock(versionId, quantity);
  }
  // Hard correction (audit fix)
  async correctStock(versionId, newTotal) {
    if (newTotal < 0) {
      throw new Error('Total cannot be negative');
    }
    return this.stockRepo.correctTotal(versionId, newTotal);
  }
}
