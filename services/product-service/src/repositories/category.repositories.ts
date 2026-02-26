import { Model, Types, UpdateQuery } from 'mongoose';
import { ICategory } from '../models/category.models.js';
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
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.categoryModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 })
        .exec(),

      this.categoryModel.countDocuments(filter),
    ]);

    console.log(filter);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
