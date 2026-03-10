import mongoose, { Schema, Document } from 'mongoose';

export interface MonthlyStat {
  month: string;
  orders: number;
  spent: number;
}

export interface IUserStats extends Document {
  userId: mongoose.Types.ObjectId;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: Date;
  monthlyStats: MonthlyStat[];
}

const MonthlyStatSchema = new Schema<MonthlyStat>(
  {
    month: {
      type: String,
      required: true,
    },
    orders: {
      type: Number,
      default: 0,
    },
    spent: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const UserStatsSchema = new Schema<IUserStats>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    totalSpent: {
      type: Number,
      default: 0,
    },

    lastOrderAt: {
      type: Date,
    },

    monthlyStats: [MonthlyStatSchema],
  },
  {
    timestamps: true,
  },
);

export const UserStats = mongoose.model<IUserStats>(
  'UserStats',
  UserStatsSchema,
);
