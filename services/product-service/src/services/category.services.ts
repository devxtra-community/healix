import { CategoryRepository } from '../repositories/category.repositories.js';
import { ICategory } from '../models/category.models.js';
import { Types, UpdateQuery } from 'mongoose';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ProductRepository } from '../repositories/product.repositories.js';

export interface GetCategoriesQuery {
  page?: string | number;
  limit?: string | number;
  search?: string;
  is_active?: string | boolean;
  category_type?: ICategory['category_type'];
}

type CategoryFilter = {
  is_active?: boolean;
  category_type?: ICategory['category_type'];
  $or?: Array<{
    name?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
};

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
  ): Promise<ICategory> {
    if (!categoryData.name) {
      throw new BadRequestError('Category name is required');
    }

    return this.categoryRepository.create(categoryData);
  }

  async categoryById(id: string | Types.ObjectId): Promise<ICategory | null> {
    return this.categoryRepository.findById(id);
  }

  async getAllCategories(query: GetCategoriesQuery, isAdmin = false) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);

    const filter: CategoryFilter = {};

    if (!isAdmin) {
      filter.is_active = true;
    }

    if (query.is_active !== undefined) {
      filter.is_active = query.is_active === true || query.is_active === 'true';
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.category_type) {
      filter.category_type = query.category_type;
    }

    return this.categoryRepository.findAll(filter, page, limit);
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
