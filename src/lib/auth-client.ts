import { createAuthClient } from "better-auth/react";

// Get the base URL from environment variables or use the deployed URL
const getBaseURL = () => {
  // For client-side, use NEXT_PUBLIC_APP_URL
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  }
  
  // For server-side, use BETTER_AUTH_URL or fallback
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
