import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { users } from "@/db/schema";

// Get the deployment URL for trusted origins
const getDeploymentUrl = () => {
  // For Vercel deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // For custom domain or explicit setting
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  
  // Fallback for local development
  return "http://localhost:3000";
};

const deploymentUrl = getDeploymentUrl();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookie: {
      domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  trustedOrigins: [
    deploymentUrl,
    "https://linkbird-clone-kmqf.vercel.app",
  ],
});

export type Session = typeof auth.$Infer.Session;
