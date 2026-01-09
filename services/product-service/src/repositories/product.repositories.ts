import { startSession, Types } from 'mongoose';
import { ProductModel } from '../models/product.models.js';
import {
  IProductDetails,
  ProductDetailsModel,
} from '../models/product-deatils.models.js';
import {
  IProductVersion,
  ProductVersionModel,
} from '../models/product-version.models.js';

export class ProductRepository {
  async createProduct(
    category_id: string,
    versionData: Partial<IProductVersion>,
    detailsData: Partial<IProductDetails>,
  ) {
    const session = await startSession();
    try {
      session.startTransaction();
      const [product] = await ProductModel.create(
        [{ category_id: new Types.ObjectId(category_id) }],
        { session },
      );
      const [version] = await ProductVersionModel.create(
        [
          {
            ...versionData,
            product_id: product._id,
            version: 1,
          },
        ],
        { session },
      );
      await ProductDetailsModel.create(
        [
          {
            ...detailsData,
            product_version_id: version._id,
          },
        ],
        { session },
      );
      product.current_version_id = version._id;
      await product.save({ session });
      await session.commitTransaction();
      return product;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  async createNewVersion(
    productId: string,
    updateData: Partial<IProductVersion>,
    deatilsData: Partial<IProductDetails>,
  ) {
    const session = await startSession();
    try {
      session.startTransaction();
      const lastVersion = await ProductVersionModel.findOne({
        product_id: productId,
      })
        .sort({ version: -1 })
        .session(session);
      const nextVersionNumber = (lastVersion?.version || 0) + 1;
      const [newVersion] = await ProductVersionModel.create(
        [
          {
            ...updateData,
            product_id: new Types.ObjectId(productId),
            version: nextVersionNumber,
          },
        ],
        { session },
      );
      await ProductDetailsModel.create(
        [
          {
            ...deatilsData,
            product_version_id: newVersion._id,
          },
        ],
        { session },
      );
      await ProductModel.findByIdAndUpdate(
        productId,
        { current_version_id: newVersion._id },
        { session },
      );
      await session.commitTransaction();
      return newVersion;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
  async getProduct(productId: string) {
    const product = await ProductModel.findById(productId)
      .populate({
        path: 'current_version_id',
        model: 'productVersion',
      })
      .lean();
    if (!product) return null;
    const details = await ProductDetailsModel.findOne({
      product_version_id: product.current_version_id,
    }).lean();
    return {
      ...product,
      details,
    };
  }
  async getAllProductsForAdmin({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      ProductModel.find()
        .populate('current_version_id')
        .sort({ updated_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ProductModel.countDocuments(),
    ]);

    return {
      data,
      page,
      limit,
      total,
    };
  }
  async getProductsFroUser() {
    return await ProductModel.aggregate([
      { $match: { is_delete: false } },
      {
        $lookup: {
          from: 'productversions',
          localField: 'current_version_id',
          foreignField: '_id',
          as: 'current_version',
        },
      },
      { $unwind: 'current_version' },
      { $match: { 'current_version.status': 'active' } },
      {
        $lookup: {
          from: 'productdetails',
          localField: 'current_version._id',
          foreignField: 'product_version_id',
          as: 'details',
        },
      },
      { $unwind: { path: 'details', preserveNullAndEmptyArrays: true } },
    ]);
  }
  async deleteProduct(productId: string) {
    return await ProductModel.findByIdAndUpdate(
      productId,
      {
        is_delete: true,
        deleted_at: new Date(),
      },
      { new: true },
    );
  }
}
