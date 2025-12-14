"use client";


import { signIn } from "next-auth/react";


export default function SignupPage() {
return (
<div className="flex h-screen items-center justify-center">
<div className="p-6 border rounded-lg text-center">
<h1 className="text-2xl font-bold mb-4">Sign Up</h1>
<button
onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
className="px-4 py-2 bg-blue-600 text-white rounded"
>
Sign up with Google
</button>
</div>
</div>
);
}