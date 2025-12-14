"use client";


import { signIn } from "next-auth/react";


export default function LoginPage() {
return (
<div className="flex h-screen items-center justify-center">
<div className="p-6 border rounded-lg text-center">
<h1 className="text-2xl font-bold mb-4">Login</h1>
<button
onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
className="px-4 py-2 bg-red-500 text-white rounded"
>
Continue with Google
</button>
</div>
</div>
);
}