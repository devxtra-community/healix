import { z } from "zod";
/**
 * 🔓 Public user (frontend-safe)
 */
export declare const UserPublicSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<{
        user: "user";
        admin: "admin";
    }>;
    avatar: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UserPublicDTO = z.infer<typeof UserPublicSchema>;
/**
 * 🔒 Internal user (gateway ↔ services)
 */
export declare const UserInternalSchema: z.ZodObject<{
    google_id: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    provider: z.ZodEnum<{
        google: "google";
        email: "email";
    }>;
    role: z.ZodEnum<{
        user: "user";
        admin: "admin";
    }>;
    avatar: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    email_verified: z.ZodBoolean;
    isActive: z.ZodBoolean;
    last_login: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type UserInternalDTO = z.infer<typeof UserInternalSchema>;
