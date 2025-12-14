"use client";

import { useEffect, useState } from "react";

const categories = [
  "Groceries",
  "Home Improvement",
  "Pet Care",
  "Education",
  "Moving",
  "Technology",
] as const;

export default function AddTaskPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Groceries",
    priority: "Medium",
    urgency: false,
    deadline: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 Auto-detect location
  useEffect(() => {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
      },
      () => {
        setMessage("⚠️ Location permission denied");
      }
    );
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!form.latitude || !form.longitude) {
      setMessage("📍 Location is required to create a task");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          priority: form.priority,
          urgency: form.urgency,
          deadline: form.deadline,
          location: {
            latitude: Number(form.latitude),
            longitude: Number(form.longitude),
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to create task");

      setMessage("✅ Task created successfully!");
      setForm({
        title: "",
        description: "",
        category: "Groceries",
        priority: "Medium",
        urgency: false,
        deadline: "",
        latitude: form.latitude,   // keep detected location
        longitude: form.longitude,
      });
    } catch {
      setMessage("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Add New Task</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            required
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block mb-1 font-medium">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Urgency */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="urgency"
            checked={form.urgency}
            onChange={handleChange}
          />
          <label className="font-medium">Mark as Urgent</label>
        </div>

        {/* Deadline */}
        <div>
          <label className="block mb-1 font-medium">Deadline</label>
          <input
            type="date"
            name="deadline"
            required
            value={form.deadline}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Location (Auto-filled, Read-only) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">
              Latitude (auto)
            </label>
            <input
              type="number"
              value={form.latitude}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Longitude (auto)
            </label>
            <input
              type="number"
              value={form.longitude}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded hover:opacity-90"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>

        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
}
