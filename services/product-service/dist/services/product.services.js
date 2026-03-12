import { startSession, Types } from 'mongoose';
import { deleteCache, getCache, setCache } from '../utils/cache.js';
import { env } from '../config/env.js';
const PRODUCTS_CACHE_KEY = 'products:user:list';
export class ProductService {
    productRepository;
    stockRepository;
    constructor(productRepository, stockRepository) {
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }
    // ================= CREATE PRODUCT =================
    async createProduct(categoryId, versionData, detailsData, initialStock) {
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
            const { product, version } = await this.productRepository.createProduct(categoryId, versionData, detailsData, session);
            // 2. Create initial stock
            await this.stockRepository.createInitialStock(version._id, initialStock, session);
            await session.commitTransaction();
            await deleteCache(PRODUCTS_CACHE_KEY);
            return product;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    // ================= CREATE NEW VERSION =================
    async createNewVersion(productId, versionData, detailsData, initialStock) {
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
            const newVersion = await this.productRepository.createNewVersion(productId, versionData, detailsData, session);
            // 2. Create stock for new version
            await this.stockRepository.createInitialStock(newVersion._id, initialStock, session);
            await session.commitTransaction();
            await deleteCache(PRODUCTS_CACHE_KEY);
            return newVersion;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    // ================= GET PRODUCT =================
    async getProduct(productId) {
        if (!Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }
        return this.productRepository.getProduct(productId);
    }
    // ================= ADMIN LIST =================
    async getAllProductsForAdmin(payload) {
        return this.productRepository.getAllProductsForAdmin(payload);
    }
    // ================= USER LIST =================
    async getProductsForUser() {
        const cachedProducts = await getCache(PRODUCTS_CACHE_KEY);
        if (cachedProducts) {
            return cachedProducts;
        }
        const products = await this.productRepository.getProductsForUser();
        await setCache(PRODUCTS_CACHE_KEY, products, env.productsCacheTtlSeconds);
        return products;
    }
    // ================= DELETE PRODUCT =================
    async deleteProduct(productId) {
        if (!Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }
        const product = await this.productRepository.deleteProduct(productId);
        await deleteCache(PRODUCTS_CACHE_KEY);
        return product;
    }
    async restoreProduct(productId) {
        if (!Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }
        const product = await this.productRepository.restoreProduct(productId);
        await deleteCache(PRODUCTS_CACHE_KEY);
        return product;
    }
}
