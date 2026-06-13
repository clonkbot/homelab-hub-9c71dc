import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { AuthForm } from "./components/AuthForm";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded bg-neutral-900 flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h1 className="text-base md:text-lg font-medium text-neutral-900 tracking-tight">Homelab Hub</h1>
          </div>
          <button
            onClick={() => signOut()}
            className="text-xs md:text-sm text-neutral-500 hover:text-neutral-900 transition-colors px-2 md:px-3 py-1.5 md:py-2 rounded hover:bg-neutral-100"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1">
        <Dashboard />
      </main>

      <footer className="border-t border-neutral-100 py-4 md:py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <p className="text-[10px] md:text-xs text-neutral-400">
            Requested by @web-user · Built by @clonkbot
          </p>
        </div>
      </footer>
    </div>
  );
}
