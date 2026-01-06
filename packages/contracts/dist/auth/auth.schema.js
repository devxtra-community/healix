import { z } from "zod";
/**
 * Email + password registration
 */
export const RegisterSchema = z
    .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    provider: z.literal("email"),
});
/**
 * Google OAuth
 */
export const GoogleAuthSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    google_id: z.string(),
    avatar: z.string().url().optional(),
    provider: z.literal("google"),
});
/**
 * Login
 */
export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
