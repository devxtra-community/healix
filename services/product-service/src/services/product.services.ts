import { IProductDetails } from "../models/product-deatils.models.js";
import { IProductVersion } from "../models/product-version.models.js";
import { IProduct } from "../models/product.models.js";
import { ProductRepository } from "../repositories/product.repositories.js";
import { Types } from "mongoose";

export class ProductService {
    private productRepository: ProductRepository
    constructor(productRepository: ProductRepository) {
        this.productRepository = new ProductRepository
    }
    async createProduct(
        categoryId: string,
        versionData: Partial<IProductVersion>,
        detailsData: Partial<IProductDetails>
    ): Promise<IProduct> {
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            throw new Error('Invalid category ID');
        }
        return this.productRepository.createProduct(categoryId, versionData, detailsData);
    }
    async createNewVersion(
        productId: string,
        updateData: Partial<IProductVersion>,
        detailsData: Partial<IProductDetails>
    ): Promise<IProductVersion> {
        if (!productId || !Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }
        const existingProduct = await this.productRepository.getProduct(productId);
        if (!existingProduct) {
            throw new Error('Product not found');
        }
        return this.productRepository.createNewVersion(productId, updateData, detailsData);
    }
    async getProduct(
        productId: string
    ): Promise<(IProduct & { details?: IProductDetails | null }) | null> {
        if (!productId || !Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }

        return this.productRepository.getProduct(productId);
    }

    async getAllProductsForAdmin({
        page,
        limit,
    }:{
        page: number;
        limit: number;
    }) 
    {
        return this.productRepository.getAllProductsForAdmin({ page, limit });
    }

    async getProductsForUser(): Promise<unknown[]> {
        return this.productRepository.getProductsFroUser();
    }
    async deleteProduct(productId: string): Promise<IProduct | null> {
        if (!productId || !Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }
        return this.productRepository.deleteProduct(productId);
    }
}
