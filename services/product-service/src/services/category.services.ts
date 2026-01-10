import { CategoryRepository } from '../repositories/category.repositories.js';
import { ICategory } from '../models/category.models.js';
import { Types, UpdateQuery } from 'mongoose';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ProductRepository } from '../repositories/product.repositories.js';
export class CategoryService {
  private categoryRepository: CategoryRepository;
  private productRepository: ProductRepository;
  constructor(
    categoryRepository: CategoryRepository,
    productRepository: ProductRepository,
  ) {
    this.categoryRepository = categoryRepository;
    this.productRepository = productRepository;
  }
  async createCategory(
    categoryData: Omit<ICategory, '_id' | 'created_at' | 'updated_at'>,
  ) {
    if (!categoryData.name) {
      throw new BadRequestError('Category name is required');
    }
    return this.categoryRepository.create(categoryData);
  }
  async categoryById(id: string | Types.ObjectId): Promise<ICategory | null> {
    return this.categoryRepository.findById(id);
  }
  async getAllCategories(
    filter: Partial<ICategory> & Record<string, unknown>,
  ): Promise<ICategory[]> {
    return this.categoryRepository.findAll(filter);
  }
  //user
  async getActiveCategories() {
    return this.categoryRepository.findAll({ isActive: true });
  }

  async update(
    id: string | Types.ObjectId,
    updateData: UpdateQuery<ICategory>,
  ): Promise<ICategory | null> {
    return this.categoryRepository.update(id, updateData);
  }
  async disabled(id: string | Types.ObjectId): Promise<ICategory | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid category id');
    }
    const hasProducts = await this.productRepository.existsByCategory(id);

    if (hasProducts) {
      throw new Error(
        'Cannot disable category. Products exist under this category.',
      );
    }
    return this.categoryRepository.disabled(id);
  }
  async restore(id: string | Types.ObjectId): Promise<ICategory | null> {
    return this.categoryRepository.restore(id);
  }
}
