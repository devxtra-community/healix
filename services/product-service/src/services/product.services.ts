import { startSession, Types } from 'mongoose';
import { IProductDetails } from '../models/product-deatils.models.js';
import { IProductVersion } from '../models/product-version.models.js';
import { IProduct } from '../models/product.models.js';
import { ProductRepository } from '../repositories/product.repositories.js';
import { StockRepository } from '../repositories/stock.repositories.js';

export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly stockRepository: StockRepository,
  ) {}

  // ================= CREATE PRODUCT =================
  async createProduct(
    categoryId: string,
    versionData: Partial<IProductVersion>,
    detailsData: Partial<IProductDetails>,
    initialStock: number,
  ): Promise<IProduct> {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new Error('Invalid category ID');
    }

    if (initialStock < 0) {
      throw new Error('Initial stock cannot be negative');
    }

    const session = await startSession();

    try {
      await session.startTransaction();

      // 1. Create product + version + details
      const { product, version } = await this.productRepository.createProduct(
        categoryId,
        versionData,
        detailsData,
        session,
      );

      // 2. Create initial stock
      await this.stockRepository.createInitialStock(
        version._id,
        initialStock,
        session,
      );

      await session.commitTransaction();
      return product;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // ================= CREATE NEW VERSION =================
  async createNewVersion(
    productId: string,
    versionData: Partial<IProductVersion>,
    detailsData: Partial<IProductDetails>,
    initialStock: number,
  ): Promise<IProductVersion> {
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid product ID');
    }

    if (initialStock < 0) {
      throw new Error('Initial stock cannot be negative');
    }

    const existingProduct = await this.productRepository.getProduct(productId);

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const session = await startSession();

    try {
      await session.startTransaction();

      // 1. Create new version + details
      const newVersion = await this.productRepository.createNewVersion(
        productId,
        versionData,
        detailsData,
        session,
      );

      // 2. Create stock for new version
      await this.stockRepository.createInitialStock(
        newVersion._id,
        initialStock,
        session,
      );

      await session.commitTransaction();
      return newVersion;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // ================= GET PRODUCT =================
  async getProduct(
    productId: string,
  ): Promise<(IProduct & { details?: IProductDetails | null }) | null> {
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid product ID');
    }

    return this.productRepository.getProduct(productId);
  }

  // ================= ADMIN LIST =================
  async getAllProductsForAdmin(payload: { page: number; limit: number }) {
    return this.productRepository.getAllProductsForAdmin(payload);
  }

  // ================= USER LIST =================
  async getProductsForUser(): Promise<unknown[]> {
    return this.productRepository.getProductsForUser();
  }

  // ================= DELETE PRODUCT =================
  async deleteProduct(productId: string): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid product ID');
    }

    return this.productRepository.deleteProduct(productId);
  }
}
