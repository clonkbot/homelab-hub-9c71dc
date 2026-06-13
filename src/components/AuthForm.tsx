import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function AuthForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid email or password" : "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 md:mb-10">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-neutral-900 flex items-center justify-center mx-auto mb-4 md:mb-5">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-medium text-neutral-900 tracking-tight mb-1 md:mb-2">Homelab Hub</h1>
            <p className="text-sm md:text-base text-neutral-500">Manage your self-hosted services</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400 transition-shadow"
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                minLength={6}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400 transition-shadow"
              />
            </div>
            <input name="flow" type="hidden" value={flow} />

            {error && (
              <p className="text-xs md:text-sm text-red-600 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 md:py-3 bg-neutral-900 text-white text-sm md:text-base font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." : flow === "signIn" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-4 md:mt-6 text-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-xs md:text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              {flow === "signIn" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-neutral-100">
            <button
              onClick={() => signIn("anonymous")}
              className="w-full py-2.5 md:py-3 text-sm md:text-base text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors border border-neutral-200"
            >
              Continue as guest
            </button>
          </div>
        </div>
      </div>

      <footer className="py-4 md:py-6 border-t border-neutral-100">
        <div className="text-center">
          <p className="text-[10px] md:text-xs text-neutral-400">
            Requested by @web-user · Built by @clonkbot
          </p>
        </div>
      </footer>
    </div>
  );
}
