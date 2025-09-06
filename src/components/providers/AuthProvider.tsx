"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface AuthContextType {
  session: { user: { id: string; email: string; name: string } } | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<{ user: { id: string; email: string; name: string } } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setSession(data);
        }
      } catch (_error) {
        console.error("Failed to get session:", _error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        return { error: result.error.message };
      } else {
        setSession(result.data);
        return {};
      }
    } catch (_error) {
      return { error: "Network error" };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        return { error: result.error.message };
      } else {
        setSession(result.data);
        return {};
      }
    } catch (_error) {
      return { error: "Network error" };
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/campaigns",
      });
    } catch (error) {
      console.error("Google sign in failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AppAuthProvider");
  }
  return context;
}
