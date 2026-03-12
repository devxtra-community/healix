import { Types } from 'mongoose';
import { ProductModel } from '../models/product.models.js';
import { ProductDetailsModel, } from '../models/product-deatils.models.js';
import { ProductVersionModel, } from '../models/product-version.models.js';
import { ProductStockModel, } from '../models/product-stock.models.js';
export class ProductRepository {
    //CREATE PRODUCT
    async createProduct(categoryId, versionData, detailsData, session) {
        // 1. Create Product (WITHOUT current_version_id initially)
        const [product] = await ProductModel.create([{ category_id: new Types.ObjectId(categoryId) }], { session });
        // 2. Create Product Version v1
        const [version] = await ProductVersionModel.create([
            {
                ...versionData,
                product_id: product._id,
                version: 1,
            },
        ], { session });
        // 3. Create Product Details
        await ProductDetailsModel.create([
            {
                ...detailsData,
                product_version_id: version._id,
            },
        ], { session });
        // 4. Update Product with current version
        product.current_version_id = version._id;
        await product.save({ session });
        return { product, version };
    }
    //CREATE NEW VERSION
    async createNewVersion(productId, versionData, detailsData, session) {
        const mongoSession = session ?? null;
        const lastVersion = await ProductVersionModel.findOne({
            product_id: productId,
        })
            .sort({ version: -1 })
            .session(mongoSession);
        const nextVersionNumber = (lastVersion?.version ?? 0) + 1;
        const [newVersion] = await ProductVersionModel.create([
            {
                ...versionData,
                product_id: new Types.ObjectId(productId),
                version: nextVersionNumber,
            },
        ], { session });
        await ProductDetailsModel.create([
            {
                ...detailsData,
                product_version_id: newVersion._id,
            },
        ], { session });
        await ProductModel.findByIdAndUpdate(productId, { current_version_id: newVersion._id }, { session });
        return newVersion;
    }
    //GET SINGLE PRODUCT
    async getProduct(productId) {
        const product = await ProductModel.findById(productId)
            .populate('current_version_id')
            .lean();
        if (!product)
            return null;
        const details = await ProductDetailsModel.findOne({
            product_version_id: product.current_version_id,
        }).lean();
        const stock = await ProductStockModel.findOne({
            product_version_id: product.current_version_id,
        }).lean();
        return {
            ...product,
            current_version_id: product.current_version_id,
            details,
            stock,
        };
    }
    //ADMIN LIST
    async getAllProductsForAdmin({ page, limit, }) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            ProductModel.aggregate([
                { $sort: { updated_at: -1 } }, // sort first
                { $skip: skip }, // then skip for page
                { $limit: limit }, // then limit
                // Category join
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category_id',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
                // Current version join
                {
                    $lookup: {
                        from: 'productversions',
                        localField: 'current_version_id',
                        foreignField: '_id',
                        as: 'current_version',
                    },
                },
                {
                    $unwind: {
                        path: '$current_version',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // Stock join
                {
                    $lookup: {
                        from: 'productstocks',
                        localField: 'current_version._id',
                        foreignField: 'product_version_id',
                        as: 'stock',
                    },
                },
                { $unwind: { path: '$stock', preserveNullAndEmptyArrays: true } },
            ]).exec(),
            ProductModel.countDocuments(), // total count for pagination
        ]);
        return {
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }
    //USER LIST
    async getProductsForUser() {
        return ProductModel.aggregate([
            { $match: { is_delete: false } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
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
            {
                $lookup: {
                    from: 'productstocks',
                    localField: 'current_version._id',
                    foreignField: 'product_version_id',
                    as: 'stock',
                },
            },
            { $unwind: { path: '$stock', preserveNullAndEmptyArrays: true } },
        ]);
    }
    //DELETE
    async deleteProduct(productId) {
        return ProductModel.findByIdAndUpdate(productId, {
            is_delete: true,
            deleted_at: new Date(),
        }, { new: true });
    }
    async existsByCategory(categoryId) {
        const count = await ProductModel.countDocuments({
            category_id: categoryId,
            is_delete: false,
        });
        return count > 0;
    }
    async restoreProduct(productId) {
        return ProductModel.findByIdAndUpdate(productId, {
            is_delete: false,
            deleted_at: null,
        }, { new: true });
    }
}
