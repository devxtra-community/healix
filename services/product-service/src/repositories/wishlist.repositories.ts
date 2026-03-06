import mongoose from 'mongoose';
import { Wishlist } from '../models/wishlist.model.js';

export class WishlistRepository {
  async findByUser(userId: string) {
    return Wishlist.findOne({ user: userId }).populate('products.product');
  }

  async create(userId: string, productId: string) {
    return Wishlist.create({
      user: new mongoose.Types.ObjectId(userId),
      products: [
        {
          product: new mongoose.Types.ObjectId(productId),
          isDeleted: false,
          deletedAt: null,
        },
      ],
    });
  }

  async addOrRestoreProduct(userId: string, productId: string) {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return this.create(userId, productId);
    }

    const existingItem = wishlist.products.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.isDeleted = false;
      existingItem.deletedAt = null;
    } else {
      wishlist.products.push({
        product: new mongoose.Types.ObjectId(productId),
        isDeleted: false,
        deletedAt: null,
      });
    }

    await wishlist.save();

    return wishlist.populate('products.product');
  }

  async softDeleteProduct(userId: string, productId: string) {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) return null;

    const item = wishlist.products.find(
      (p) => p.product.toString() === productId,
    );

    if (!item) return wishlist;

    item.isDeleted = true;
    item.deletedAt = new Date();

    await wishlist.save();

    return wishlist.populate('products.product');
  }

  async getActiveProducts(userId: string) {
    const wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: 'products.product',
      populate: {
        path: 'current_version_id',
      },
    });

    if (!wishlist) return null;

    const activeProducts = wishlist.products.filter(
      (item) => item.isDeleted === false,
    );

    return {
      ...wishlist.toObject(),
      products: activeProducts,
    };
  }

  async softDeleteAllProducts(userId: string) {
    const now = new Date();

    return Wishlist.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          'products.$[].isDeleted': true,
          'products.$[].deletedAt': now,
        },
      },
      { new: true },
    ).populate('products.product');
  }
}
