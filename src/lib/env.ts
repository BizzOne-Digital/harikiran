import { z } from "zod";

const serverSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  ADMIN_NAME: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  EMAIL_PROVIDER_API_KEY: z.string().optional(),
  GMAIL_USER: z.string().email().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

export function getServerEnv(options?: { soft?: boolean }): ServerEnv {
  if (cached) return cached;

  const parsed = serverSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_NAME: process.env.ADMIN_NAME,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_PROVIDER_API_KEY: process.env.EMAIL_PROVIDER_API_KEY,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  });

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");

    if (options?.soft || process.env.SKIP_ENV_VALIDATION === "1") {
      console.warn(`[env] Validation warnings: ${message}`);
      return {
        MONGODB_URI: process.env.MONGODB_URI || "",
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",
      } as ServerEnv;
    }

    throw new Error(`[env] Invalid environment: ${message}`);
  }

  cached = parsed.data;
  return cached;
}

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000"
  );
}

export function hasEmailConfigured() {
  // Gmail SMTP (preferred) or legacy Resend API key
  return Boolean(
    (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) ||
      (process.env.EMAIL_PROVIDER_API_KEY && process.env.EMAIL_FROM),
  );
}

export function hasCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}
