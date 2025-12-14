import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

/**
 * GET USER PERFORMANCE
 * GET /api/dashboard/performance
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

    const userId = session.user.id;

    const totalAssigned = await Task.countDocuments({
      assignedVolunteer: userId,
    });

    const completed = await Task.countDocuments({
      assignedVolunteer: userId,
      status: "Completed",
    });

    const inProgress = await Task.countDocuments({
      assignedVolunteer: userId,
      status: { $in: ["Assigned", "In Progress"] },
    });

    const completionRate =
      totalAssigned === 0
        ? 0
        : Math.round((completed / totalAssigned) * 100);

    return NextResponse.json(
      {
        totalAssigned,
        completed,
        inProgress,
        completionRate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard performance error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
