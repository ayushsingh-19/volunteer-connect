import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

/**
 * CREATE TASK
 * POST /api/tasks
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    // 🔐 Get logged-in user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      title,
      description,
      category,
      priority,
      urgency,
      deadline,
      location,
    } = body;

    // Basic validation
    if (
      !title ||
      !description ||
      !category ||
      !deadline ||
      !location?.latitude ||
      !location?.longitude
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const task = await Task.create({
      title,
      description,
      category,
      priority,
      urgency,
      deadline,
      location,
      postedBy: session.user.id, // ✅ MongoDB User _id
    });

    return NextResponse.json(
      { message: "Task created successfully", task },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Task Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * GET TASKS
 * GET /api/tasks
 */
export async function GET() {
  try {
    await connectDB();

    const tasks = await Task.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Fetch Tasks Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}