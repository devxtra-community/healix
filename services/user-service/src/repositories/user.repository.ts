import { Types } from 'mongoose';
import { type IUser, User } from '../models/user.model.js';
import { PaginatedResponse } from '../types/pagination.js';

type AdminUserFilter = {
  role: 'user';
  isActive?: boolean;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
};

type AnalyticsCustomer = {
  userId: string;
  totalOrders: number;
  totalSpent: number;
};

type UserBasic = {
  _id: Types.ObjectId;
  name: string;
};

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }); //isDeleted: false
  }

  async findById(userId: string): Promise<IUser | null> {
    return User.findOne({ _id: userId }); //isDeleted: false
  }

  async create(data: IUser): Promise<IUser> {
    return User.create(data);
  }

  async getAllUsersForAdmin({
    page,
    limit,
    search,
    status,
  }: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<IUser>> {
    const skip = (page - 1) * limit;

    const filter: AdminUserFilter = {
      role: 'user',
    };

    // 🔍 Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // 🎯 Status filter
    if (status === 'Active') filter.isActive = true;
    if (status === 'Blocked') filter.isActive = false;

    const [data, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async toggleUserStatus(userId: string): Promise<IUser> {
    const user = await User.findOne({
      _id: userId,
    });

    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = !user.isActive;
    await user.save();

    return user;
  }

  async updateUser(
    userId: string,
    payload: Partial<IUser>,
  ): Promise<IUser | null> {
    return User.findOneAndUpdate({ _id: userId }, payload, {
      new: true,
    });
  }

  async updatePassword(userId: Types.ObjectId | string, password: string) {
    return User.findByIdAndUpdate(userId, { password }, { new: true });
  }

  async updateLastLogin(userId: Types.ObjectId | string) {
    return User.findByIdAndUpdate(
      userId,
      { last_login: new Date() },
      { new: true },
    );
  }

  async getUserInsights() {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    // BASIC CUSTOMER STATS
    const totalCustomers = await User.countDocuments({ role: 'user' });

    const newCustomers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: oneWeekAgo },
    });

    const activeUsers = await User.countDocuments({
      role: 'user',
      isActive: true,
    });

    const retentionRate = totalCustomers
      ? Math.round((activeUsers / totalCustomers) * 100)
      : 0;

    let analyticsCustomers: AnalyticsCustomer[] = [];

    try {
      const analyticsRes = await fetch(
        'http://localhost:4003/api/v1/analytics/users/top?limit=5',
      );

      if (analyticsRes.ok) {
        const response: unknown = await analyticsRes.json();

        if (Array.isArray(response)) {
          analyticsCustomers = response as AnalyticsCustomer[];
        } else if (
          typeof response === 'object' &&
          response !== null &&
          'data' in response
        ) {
          analyticsCustomers = (response as { data: AnalyticsCustomer[] }).data;
        }
      }
    } catch (error) {
      console.error('Analytics service unavailable:', error);
    }

    const userIds = analyticsCustomers.map((c) => c.userId);

    let users: UserBasic[] = [];

    if (userIds.length > 0) {
      users = await User.find({ _id: { $in: userIds } })
        .select('_id name')
        .lean<UserBasic[]>();
    }

    const userMap = new Map<string, UserBasic>(
      users.map((u) => [String(u._id), u]),
    );

    const topCustomers = analyticsCustomers.map((stat) => {
      const user = userMap.get(String(stat.userId));

      return {
        _id: stat.userId,
        name: user?.name ?? 'Unknown',
        totalOrders: stat.totalOrders ?? 0,
        totalSpent: stat.totalSpent ?? 0,
      };
    });

    return {
      newCustomers,
      vipCustomers: topCustomers.filter((c) => c.totalSpent > 5000).length,
      totalCustomers,
      retentionRate,
      retentionGrowth: 2.4,
      topCustomers,
    };
  }
  // async deleteUser(userId: string): Promise<IUser | null> {
  //   return User.findOneAndUpdate(
  //     { _id: userId, isDeleted: false },
  //     { isDeleted: true },
  //     { new: true },
  //   );
  // }
}
