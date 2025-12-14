"use client";

import { useEffect, useState } from "react";

type TaskItem = {
  task: {
    _id: string;
    title: string;
    description: string;
  };
  similarityScore: number;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks/relevant");

        const data = await res.json();

        // 🔥 IMPORTANT CHECK
        if (!Array.isArray(data)) {
          setError(data.message || "Failed to load tasks");
          setTasks([]);
        } else {
          setTasks(data);
        }
      } catch (err) {
        setError("Something went wrong");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // ⏳ Loading
  if (loading) {
    return <p className="p-6">Loading recommended tasks...</p>;
  }

  // ❌ Error
  if (error) {
    return (
      <p className="p-6 text-red-600 font-medium">
        {error}
      </p>
    );
  }

  // 📭 No tasks
  if (tasks.length === 0) {
    return (
      <p className="p-6 text-gray-500">
        No relevant tasks found.
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Recommended Tasks For You
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((item) => (
          <div
            key={item.task._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg">
              {item.task.title}
            </h2>

            <p className="text-gray-600 mt-2 line-clamp-3">
              {item.task.description}
            </p>

            <div className="mt-4">
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Match: {item.similarityScore}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
