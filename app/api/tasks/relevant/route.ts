import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import { skillTaskSimilarity } from "@/lib/geminiSimilarity";

export async function GET() {
  try {
    console.log("🔵 Relevant Tasks API called");

    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log("❌ Unauthorized");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const userSkills = Array.isArray(user.skills)
      ? user.skills
      : [];

    console.log("🧠 User skills:", userSkills);

    const tasks = await Task.find({ status: "Open" });
    console.log("📋 Tasks found:", tasks.length);

    const result = [];

    for (const task of tasks) {
      try {
        const score = await skillTaskSimilarity(
          userSkills,
          task.title,
          task.description
        );

        result.push({
          task,
          similarityScore: score,
        });
      } catch (aiError) {
        console.error("⚠️ Gemini error on task:", task._id, aiError);

        result.push({
          task,
          similarityScore: 0, // fallback
        });
      }
    }

    result.sort((a, b) => b.similarityScore - a.similarityScore);

    console.log("✅ Returning results");
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);

    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
