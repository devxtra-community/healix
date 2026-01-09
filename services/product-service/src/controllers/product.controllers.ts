import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.services.js";
import { ProductRepository } from "../repositories/product.repositories.js";
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);

export class ProdutController {
    async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { categoryId, versionData, detailsData } = req.body
            if (!categoryId || !versionData) {
                res.status(400).json({ message: 'categoryId and versionData are required' });
                return;
            }
            const newProduct = await productService.createProduct(categoryId, versionData, detailsData)
            res.status(201).json(newProduct)
        } catch (error) {
            next(error)
        }
    }
    async createNewVersion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = req.params;
            const { updateData, detailsData } = req.body;
            if (!productId) {
                res.status(400).json({ message: 'Product ID is required' });
                return;
            }

            if (!updateData) {
                res.status(400).json({ message: 'updateData is required' });
                return;
            }
            const newVersion = await productService.createNewVersion(productId, updateData, detailsData);
            res.status(201).json(newVersion);
        } catch (error) {
            next(error);
        }
    }
    async getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = req.params;
            const product = await productService.getProduct(productId);

            if (!product) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    async getAllProductsForAdmin(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;

            const result = await productService.getAllProductsForAdmin({
                page,
                limit,
            });

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
    async getProductsForUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const products = await productService.getProductsForUser();
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }
}