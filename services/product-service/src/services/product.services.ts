import { startSession, Types } from 'mongoose';
import { IProductDetails } from '../models/product-deatils.models.js';
import { IProductVersion } from '../models/product-version.models.js';
import { IProduct } from '../models/product.models.js';
import { ProductRepository } from '../repositories/product.repositories.js';
import { StockRepository } from '../repositories/stock.repositories.js';
import { IProductStock } from '../models/product-stock.models.js';
import { deleteCache, getCache, setCache } from '../utils/cache.js';
import { env } from '../config/env.js';

const PRODUCTS_CACHE_KEY = 'products:user:list';

type ProductWithCurrentVersion = Omit<IProduct, 'current_version_id'> & {
  current_version_id: IProductVersion;
};

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
      await deleteCache(PRODUCTS_CACHE_KEY);
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
      await deleteCache(PRODUCTS_CACHE_KEY);
      return newVersion;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // ================= GET PRODUCT =================
  async getProduct(productId: string): Promise<
    | (ProductWithCurrentVersion & {
        details?: IProductDetails | null;
        stock?: IProductStock | null;
      })
    | null
  > {
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
    const cachedProducts = await getCache<unknown[]>(PRODUCTS_CACHE_KEY);

    if (cachedProducts) {
      return cachedProducts;
    }

    const products = await this.productRepository.getProductsForUser();
    await setCache(PRODUCTS_CACHE_KEY, products, env.productsCacheTtlSeconds);

    return products;
  }

  // ================= DELETE PRODUCT =================
  async deleteProduct(productId: string): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid product ID');
    }

    const product = await this.productRepository.deleteProduct(productId);
    await deleteCache(PRODUCTS_CACHE_KEY);

    return product;
  }

  async restoreProduct(productId: string): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid product ID');
    }

    const product = await this.productRepository.restoreProduct(productId);
    await deleteCache(PRODUCTS_CACHE_KEY);

    return product;
  }
}
