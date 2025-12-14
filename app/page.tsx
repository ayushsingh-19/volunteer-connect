"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4">
          Volunteer Help Platform
        </h1>

        <p className="text-gray-600 mb-8">
          Find help when you need it or volunteer to make a difference.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/tasks")}
            className="bg-indigo-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition"
          >
            🤝 Join as Volunteer
          </button>

          <button
            onClick={() => router.push("/tasks/add")}
            className="bg-purple-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-purple-700 transition"
          >
            🆘 Find Help
          </button>
        </div>
      </div>
    </div>
  );
}