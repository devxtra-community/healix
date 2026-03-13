import { Types } from 'mongoose';
import { BadRequestError } from '../errors/BadRequestError.js';
export class CategoryService {
  categoryRepository;
  productRepository;
  constructor(categoryRepository, productRepository) {
    this.categoryRepository = categoryRepository;
    this.productRepository = productRepository;
  }
  async createCategory(categoryData) {
    if (!categoryData.name) {
      throw new BadRequestError('Category name is required');
    }
    return this.categoryRepository.create(categoryData);
  }
  async categoryById(id) {
    return this.categoryRepository.findById(id);
  }
  async getAllCategories(query, isAdmin = false) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const filter = {};
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
  async update(id, updateData) {
    return this.categoryRepository.update(id, updateData);
  }
  async disabled(id) {
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
  async restore(id) {
    return this.categoryRepository.restore(id);
  }
}
