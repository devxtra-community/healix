import { Model, Types, UpdateQuery } from 'mongoose';
import { ICategory } from '../models/category.model.js';
export class CategoryRepository {
  private categoryModel: Model<ICategory>;
  constructor(categoryModel: Model<ICategory>) {
    this.categoryModel = categoryModel;
  }
  async create(
    categoryData: Omit<ICategory, '_id' | 'created_at' | 'updated_at'>,
  ): Promise<ICategory> {
    const newCategory = new this.categoryModel(categoryData);
    return newCategory.save();
  }
  async findById(id: string | Types.ObjectId): Promise<ICategory | null> {
    return this.categoryModel.findById(id).exec();
  }
  async findAll(
    filter: Partial<ICategory> & Record<string, unknown>,
  ): Promise<ICategory[]> {
    return this.categoryModel.find(filter).exec();
  }
  async update(
    id: string | Types.ObjectId,
    updateData: UpdateQuery<ICategory>,
  ): Promise<ICategory | null> {
    return this.categoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }
  async disabled(id: string | Types.ObjectId): Promise<ICategory | null> {
    return this.categoryModel
      .findByIdAndUpdate(
        id,
        { is_active: false, deleted_at: new Date() },
        { new: true },
      )
      .exec();
  }
  async restore(id: string | Types.ObjectId): Promise<ICategory | null> {
    return this.categoryModel
      .findByIdAndUpdate(
        id,
        {
          is_active: true,
          deleted_at: null,
        },
        { new: true },
      )
      .exec();
  }
}
