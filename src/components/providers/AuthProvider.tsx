"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@/lib/auth";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
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

    // Listen for auth state changes
    const handleStorageChange = () => {
      getSession();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSession(data.user);
        return {};
      } else {
        return { error: data.message || "Sign in failed" };
      }
    } catch (_error) {
      return { error: "Network error" };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setSession(data.user);
        return {};
      } else {
        return { error: data.message || "Sign up failed" };
      }
    } catch (_error) {
      return { error: "Network error" };
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
      });
      setSession(null);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      window.location.href = "/api/auth/sign-in/google";
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
