import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { nextCookies } from "better-auth/next-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedAuth: any = null;
let cachedClient: MongoClient | null = null;

function getMongoClient(): MongoClient {
  if (cachedClient) return cachedClient;

  const uri = process.env.MONGODB_URI;
  if (
    !uri ||
    (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))
  ) {
    throw new Error(
      "MONGODB_URI is not configured. Set a valid MongoDB connection string.",
    );
  }

  cachedClient = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  return cachedClient;
}

export function getAuth() {
  if (cachedAuth) return cachedAuth;

  const client = getMongoClient();
  const db = client.db();

  cachedAuth = betterAuth({
    database: mongodbAdapter(db, { client }),
    secret:
      process.env.BETTER_AUTH_SECRET ||
      "development-only-secret-change-in-production-min32",
    baseURL:
      process.env.BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000",
    // Dev often lands on 3001/3002 when 3000 is busy
    trustedOrigins: [
      process.env.BETTER_AUTH_URL,
      process.env.NEXT_PUBLIC_SITE_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3002",
    ].filter((v): v is string => Boolean(v)),
    advanced: {
      database: {
        // Keep string UUIDs aligned with seed / fix-admin-auth scripts
        generateId: () => crypto.randomUUID(),
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 10,
      maxPasswordLength: 128,
      autoSignIn: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "editor",
          input: false,
        },
      },
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 10,
      customRules: {
        "/sign-in/email": {
          window: 60,
          max: 5,
        },
        "/forget-password": {
          window: 60,
          max: 3,
        },
      },
    },
    plugins: [nextCookies()],
  });

  return cachedAuth;
}

export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    image?: string | null;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
};
