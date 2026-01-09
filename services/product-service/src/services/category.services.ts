import { CategoryRepository } from '../repositories/category.repositories.js';
import { ICategory } from '../models/category.model.js';
import { Types, UpdateQuery } from 'mongoose';
import { BadRequestError } from '../errors/BadRequestError.js';
export class CategoryService {
  private categoryRepository: CategoryRepository;
  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
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
  async update(
    id: string | Types.ObjectId,
    updateData: UpdateQuery<ICategory>,
  ): Promise<ICategory | null> {
    return this.categoryRepository.update(id, updateData);
  }
  async disabled(id: string | Types.ObjectId): Promise<ICategory | null> {
    return this.categoryRepository.disabled(id);
  }
  async restore(id: string | Types.ObjectId): Promise<ICategory | null> {
    return this.categoryRepository.restore(id);
  }
}
