import { z } from "zod";

/**
 * Environment variable validation schema
 * Ensures all required environment variables are present and valid
 */
const envSchema = z.object({
    // Database
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),

    // NextAuth
    NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
    NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),

    // Email
    EMAIL_HOST: z.string().min(1, "EMAIL_HOST is required"),
    EMAIL_PORT: z.string().regex(/^\d+$/, "EMAIL_PORT must be a number"),
    EMAIL_USER: z.string().email("EMAIL_USER must be a valid email"),
    EMAIL_PASSWORD: z.string().min(1, "EMAIL_PASSWORD is required"),

    // Application
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    APP_URL: z.string().url("APP_URL must be a valid URL"),

    // Optional: Google OAuth
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    // Optional: Google Sheets
    GOOGLE_SHEETS_API_KEY: z.string().optional(),
    RESOURCES_SHEET_ID: z.string().optional(),
    LEARNING_MODULES_SHEET_ID: z.string().optional(),
    TOOLS_SHEET_ID: z.string().optional(),
});

/**
 * Validated environment variables
 * Use this instead of process.env for type safety
 */
export const env = envSchema.parse({
    MONGO_URI: process.env.MONGO_URI,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    NODE_ENV: process.env.NODE_ENV,
    APP_URL: process.env.APP_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_SHEETS_API_KEY: process.env.GOOGLE_SHEETS_API_KEY,
    RESOURCES_SHEET_ID: process.env.RESOURCES_SHEET_ID,
    LEARNING_MODULES_SHEET_ID: process.env.LEARNING_MODULES_SHEET_ID,
    TOOLS_SHEET_ID: process.env.TOOLS_SHEET_ID,
});

export type Env = z.infer<typeof envSchema>;
