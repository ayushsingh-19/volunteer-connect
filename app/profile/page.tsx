"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  const [form, setForm] = useState({
    name: "",
    role: "User",
    skills: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 Fetch profile data
  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          setForm({
            name: data.name || "",
            role: data.role || "User",
            skills: data.skills?.join(", ") || "",
            latitude: data.location?.latitude || "",
            longitude: data.location?.longitude || "",
          });
        });
    }
  }, [session]);

  // 🔥 Auto-detect location (Geolocation API)
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
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
      (error) => {
        console.warn("Location permission denied", error);
      }
    );
  }, []);

  if (status === "loading") return <p className="p-6">Loading...</p>;

  if (!session) {
    return <p className="p-6">Please login to edit your profile.</p>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        role: form.role,
        skills: form.skills.split(",").map((s) => s.trim()),
        location: {
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        },
      }),
    });

    setLoading(false);

    if (res.ok) {
      setMessage("✅ Profile updated successfully");
    } else {
      setMessage("❌ Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block font-medium mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="User">User</option>
              <option value="Volunteer">Volunteer</option>
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="block font-medium mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Teaching, First Aid, Coding"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Location (Auto-filled & Read-only) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Latitude (auto)
              </label>
              <input
                type="number"
                value={form.latitude}
                readOnly
                className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Longitude (auto)
              </label>
              <input
                type="number"
                value={form.longitude}
                readOnly
                className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {message && <p className="text-center mt-3">{message}</p>}
        </form>
      </div>
    </div>
  );
}
