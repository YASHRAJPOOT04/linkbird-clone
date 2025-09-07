import { createAuthClient } from "better-auth/react";

// Get the base URL from environment variables or use the deployed URL
const getBaseURL = () => {
  // For client-side, use window.location.origin as the most reliable source
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // For server-side, use BETTER_AUTH_URL or fallback
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  fetchOptions: {
    onError: (ctx) => {
      console.error("Auth client error:", ctx.error);
    },
  },
});
