import { ClientSession, Types } from 'mongoose';
import { IProduct, ProductModel } from '../models/product.models.js';
import {
  IProductDetails,
  ProductDetailsModel,
} from '../models/product-deatils.models.js';
import {
  IProductVersion,
  ProductVersionModel,
} from '../models/product-version.models.js';

export class ProductRepository {
  //CREATE PRODUCT
  async createProduct(
    categoryId: string,
    versionData: Partial<IProductVersion>,
    detailsData: Partial<IProductDetails>,
    session: ClientSession,
  ): Promise<{
    product: IProduct;
    version: IProductVersion;
  }> {
    // 1. Create Product (WITHOUT current_version_id initially)
    const [product] = await ProductModel.create(
      [{ category_id: new Types.ObjectId(categoryId) }],
      { session },
    );

    // 2. Create Product Version v1
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

    // 3. Create Product Details
    await ProductDetailsModel.create(
      [
        {
          ...detailsData,
          product_version_id: version._id,
        },
      ],
      { session },
    );

    // 4. Update Product with current version
    product.current_version_id = version._id;
    await product.save({ session });

    return { product, version };
  }

  //CREATE NEW VERSION
  async createNewVersion(
    productId: string,
    versionData: Partial<IProductVersion>,
    detailsData: Partial<IProductDetails>,
    session?: ClientSession,
  ): Promise<IProductVersion> {
    const mongoSession: ClientSession | null = session ?? null;
    const lastVersion = await ProductVersionModel.findOne({
      product_id: productId,
    })
      .sort({ version: -1 })
      .session(mongoSession);

    const nextVersionNumber = (lastVersion?.version ?? 0) + 1;

    const [newVersion] = await ProductVersionModel.create(
      [
        {
          ...versionData,
          product_id: new Types.ObjectId(productId),
          version: nextVersionNumber,
        },
      ],
      { session },
    );

    await ProductDetailsModel.create(
      [
        {
          ...detailsData,
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

    return newVersion;
  }

  //GET SINGLE PRODUCT
  async getProduct(productId: string) {
    const product = await ProductModel.findById(productId)
      .populate({
        path: 'current_version_id',
        model: 'ProductVersion',
      })
      .lean();

    if (!product) return null;

    const details = await ProductDetailsModel.findOne({
      product_version_id: product.current_version_id,
    }).lean();

    return {
      ...product,
      current_version_id:
        product.current_version_id as unknown as IProductVersion,
      details,
    };
  }

  //ADMIN LIST
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

  //USER LIST
  async getProductsForUser() {
    return ProductModel.aggregate([
      { $match: { is_delete: false } },
      {
        $lookup: {
          from: 'productversions',
          localField: 'current_version_id',
          foreignField: '_id',
          as: 'current_version',
        },
      },
      { $unwind: '$current_version' },
      { $match: { 'current_version.status': 'active' } },
      {
        $lookup: {
          from: 'productdetails',
          localField: 'current_version._id',
          foreignField: 'product_version_id',
          as: 'details',
        },
      },
      { $unwind: { path: '$details', preserveNullAndEmptyArrays: true } },
    ]);
  }

  //DELETE
  async deleteProduct(productId: string) {
    return ProductModel.findByIdAndUpdate(
      productId,
      {
        is_delete: true,
        deleted_at: new Date(),
      },
      { new: true },
    );
  }
  async existsByCategory(
    categoryId: string | Types.ObjectId,
  ): Promise<boolean> {
    const count = await ProductModel.countDocuments({
      category_id: categoryId,
      is_delete: false,
    });

    return count > 0;
  }
}
