export class CategoryRepository {
  categoryModel;
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }
  async create(categoryData) {
    const newCategory = new this.categoryModel(categoryData);
    return newCategory.save();
  }
  async findById(id) {
    return this.categoryModel.findById(id).exec();
  }
  async findAll(filter, page, limit) {
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
  async update(id, updateData) {
    return this.categoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }
  async disabled(id) {
    return this.categoryModel
      .findByIdAndUpdate(
        id,
        { is_active: false, deleted_at: new Date() },
        { new: true },
      )
      .exec();
  }
  async restore(id) {
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
