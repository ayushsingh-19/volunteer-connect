import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

/**
 * GET TASKS ASSIGNED TO ME
 * GET /api/tasks/assigned-to-me
 */
export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔍 Find tasks where logged-in user is the assigned volunteer
    const tasks = await Task.find({
      assignedVolunteer: session.user.id,
    })
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { tasks },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch assigned tasks error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
