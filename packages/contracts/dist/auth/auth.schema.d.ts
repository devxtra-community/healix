import { z } from "zod";
/**
 * Email + password registration
 */
export declare const RegisterSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    provider: z.ZodLiteral<"email">;
}, z.core.$strip>;
export type RegisterDTO = z.infer<typeof RegisterSchema>;
/**
 * Google OAuth
 */
export declare const GoogleAuthSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    google_id: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    provider: z.ZodLiteral<"google">;
}, z.core.$strip>;
export type GoogleAuthDTO = z.infer<typeof GoogleAuthSchema>;
/**
 * Login
 */
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginDTO = z.infer<typeof LoginSchema>;
