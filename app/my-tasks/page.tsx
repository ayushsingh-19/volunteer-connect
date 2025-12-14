"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
  deadline: string;
  assignedVolunteer?: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

export default function MyTasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks/mine");
    const data = await res.json();
    setTasks(data.tasks || []);
    setLoading(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status, router]);

  const markCompleted = async (id: string) => {
    const ok = confirm("Mark this task as completed?");
    if (!ok) return;

    await fetch(`/api/tasks/${id}`, { method: "PATCH" });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    const ok = confirm(
      "Are you sure? This will permanently delete the task."
    );
    if (!ok) return;

    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  if (loading) {
    return <p className="p-6">Loading your tasks...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">
        📝 My Posted Tasks
      </h1>

      {tasks.length === 0 ? (
        <p className="text-gray-600">
          You haven’t posted any tasks yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div
              key={task._id}
              className="bg-white rounded-xl shadow p-5 space-y-3"
            >
              {/* Title */}
              <h2 className="text-lg font-semibold">
                {task.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-3">
                {task.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-2 py-1 bg-blue-100 rounded">
                  {task.category}
                </span>

                <span
                  className={`px-2 py-1 rounded ${
                    task.priority === "High"
                      ? "bg-red-100"
                      : task.priority === "Medium"
                      ? "bg-yellow-100"
                      : "bg-green-100"
                  }`}
                >
                  {task.priority}
                </span>

                <span className="px-2 py-1 bg-gray-100 rounded">
                  {task.status}
                </span>
              </div>

              {/* Assigned Volunteer */}
              {task.assignedVolunteer && (
                <div className="text-sm text-green-700">
                  <p>
                    <b>Assigned to:</b>{" "}
                    {task.assignedVolunteer.name}
                  </p>
                  <p>
                    <b>Email:</b>{" "}
                    {task.assignedVolunteer.email}
                  </p>
                </div>
              )}

              {/* Deadline */}
              <p className="text-xs text-gray-500">
                Deadline:{" "}
                {new Date(task.deadline).toLocaleDateString()}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 pt-2">
                {/* ✅ Show ONLY when Assigned */}
                {task.status === "Assigned" && (
                  <button
                    onClick={() => markCompleted(task._id)}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                  >
                    Mark Completed
                  </button>
                )}

                {/* ❌ Hide delete when Completed */}
                {task.status !== "Completed" && (
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
