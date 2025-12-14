"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🔁 Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // ⏳ Prevent UI flash
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
        <div className="animate-pulse text-lg text-gray-700">
          Checking session...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      {/* Glass Card */}
      <div
        className="
          w-full max-w-md
          bg-white/20 backdrop-blur-xl
          border border-white/30
          rounded-2xl
          p-8
          shadow-2xl
          hover:scale-[1.02]
          transition-transform
          duration-300
        "
      >
        {/* Header */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-center text-white/80 mb-8">
          Sign in to continue helping others
        </p>

        {/* Google Button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="
            w-full
            flex items-center justify-center gap-3
            bg-white
            text-gray-700
            font-medium
            px-4 py-3
            rounded-xl
            shadow-lg
            hover:shadow-xl
            hover:-translate-y-0.5
            active:scale-95
            transition-all
            duration-200
          "
        >
          {/* Google Icon */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.35 1.22 8.69 3.21l6.46-6.46C35.01 2.38 29.93 0 24 0 14.6 0 6.51 5.38 2.56 13.22l7.53 5.85C12.04 13.09 17.57 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.61-.15-3.16-.43-4.65H24v9.02h12.93c-.56 2.94-2.23 5.44-4.75 7.13l7.29 5.65c4.26-3.93 6.51-9.72 6.51-16.15z"
            />
            <path
              fill="#FBBC05"
              d="M10.09 28.07a14.5 14.5 0 0 1 0-8.14l-7.53-5.85a23.98 23.98 0 0 0 0 19.84l7.53-5.85z"
            />
            <path
              fill="#34A853"
              d="M24 48c5.93 0 11.01-1.96 14.68-5.31l-7.29-5.65c-2.02 1.36-4.6 2.17-7.39 2.17-6.43 0-11.96-3.59-13.91-8.57l-7.53 5.85C6.51 42.62 14.6 48 24 48z"
            />
          </svg>

          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-white/70 mt-6">
          Secure login powered by Google
        </p>
      </div>
    </div>
  );
}
