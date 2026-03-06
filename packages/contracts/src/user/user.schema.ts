import { z } from "zod";

/**
 * Base shared fields
 */
const BaseUserSchema = {
  id: z.string(), // Mongo ObjectId as string
  name: z.string().min(2),
  email: z.string().email(),

  provider: z.enum(["google", "email"]),
  role: z.enum(["user", "admin"]),

  avatar: z.string().url().optional(),
  phone: z.string().optional(),

  email_verified: z.boolean(),
  isActive: z.boolean(),

  last_login: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
};

/**
 * 🔓 Public user (frontend-safe)
 */
export const UserPublicSchema = z.object({
  id: BaseUserSchema.id,
  name: BaseUserSchema.name,
  email: BaseUserSchema.email,
  role: BaseUserSchema.role,
  avatar: BaseUserSchema.avatar,
});

export type UserPublicDTO = z.infer<typeof UserPublicSchema>;

/**
 * 🔒 Internal user (gateway ↔ services)
 */
export const UserInternalSchema = z.object({
  ...BaseUserSchema,
  google_id: z.string().optional(),
});

export type UserInternalDTO = z.infer<typeof UserInternalSchema>;
