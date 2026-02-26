import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.services.js';
import { ProductRepository } from '../repositories/product.repositories.js';
import { StockRepository } from '../repositories/stock.repositories.js';
import { ProductVersionModel } from '../models/product-version.models.js';
import { Types } from 'mongoose';
// ===== Dependency wiring =====
const productRepository = new ProductRepository();
const stockRepository = new StockRepository();
const productService = new ProductService(productRepository, stockRepository);

export class ProductController {
  //CREATE PRODUCT
  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { categoryId, versionData, detailsData, initialStock } = req.body;

      if (!categoryId || !versionData) {
        res.status(400).json({
          message: 'categoryId and versionData are required',
        });
        return;
      }

      if (initialStock === undefined) {
        res.status(400).json({
          message: 'initialStock is required',
        });
        return;
      }

      const newProduct = await productService.createProduct(
        categoryId,
        versionData,
        detailsData,
        Number(initialStock),
      );

      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }

  //CREATE NEW VERSION
  async createNewVersion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { productId } = req.params;
      const { updateData, detailsData, initialStock } = req.body;

      if (!productId) {
        res.status(400).json({
          message: 'Product ID is required',
        });
        return;
      }

      if (!updateData) {
        res.status(400).json({
          message: 'updateData is required',
        });
        return;
      }

      if (initialStock === undefined) {
        res.status(400).json({
          message: 'initialStock is required',
        });
        return;
      }

      const newVersion = await productService.createNewVersion(
        productId,
        updateData,
        detailsData,
        Number(initialStock),
      );

      res.status(201).json(newVersion);
    } catch (error) {
      next(error);
    }
  }

  //GET PRODUCT
  async getProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { productId } = req.params;

      const product = await productService.getProduct(productId);

      if (!product) {
        res.status(404).json({
          message: 'Product not found',
        });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  //ADMIN LIST
  async getAllProductsForAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
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

  //USER LIST
  async getProductsForUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const products = await productService.getProductsForUser();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  //DELETE PRODUCT
  async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { productId } = req.params;

      const product = await productService.deleteProduct(productId);

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
  async getProductVersion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { versionId } = req.params;

      if (!Types.ObjectId.isValid(versionId)) {
        res.status(400).json({ message: 'Invalid version ID' });
        return;
      }

      const version = await ProductVersionModel.findById(versionId).lean();

      if (!version) {
        res.status(404).json({ message: 'Product version not found' });
        return;
      }

      res.status(200).json(version);
    } catch (error) {
      next(error);
    }
  }

  async restoreProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { productId } = req.params;

      if (!Types.ObjectId.isValid(productId)) {
        res.status(400).json({ message: 'Invalid Product ID' });
        return;
      }

      const version = await productService.restoreProduct(productId);

      if (!version) {
        res.status(404).json({ message: 'Product version not found' });
        return;
      }

      res.status(200).json(version);
    } catch (error) {
      next(error);
    }
  }
}
