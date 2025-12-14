"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🔁 If already logged in → redirect to /
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // ⏳ Prevent UI flash
  if (status === "loading") {
    return <p className="p-6 text-center">Checking session...</p>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 border rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}