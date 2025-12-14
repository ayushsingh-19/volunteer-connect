import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import mongoose from "mongoose";
import Invite from "@/models/Invite"; // ✅ IMPORTANT: register Invite schema

/**
 * UPDATE TASK (MARK COMPLETED)
 * PATCH /api/tasks/[id]
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid task id" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    // 🔐 Only owner
    if (task.postedBy.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    // 🧠 SAFE BODY PARSE
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { action } = body;

    // 🆕 NEW FEATURE
    if (action === "unassign") {
      task.assignedVolunteer = null;
      task.status = "Open";
    } 
    // ✅ OLD BEHAVIOUR (DEFAULT)
    else {
      task.status = "Completed";
    }

    await task.save();

    return NextResponse.json(
      { message: "Task updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE TASK
 * DELETE /api/tasks/[id]
 */
/**
 * DELETE TASK (WITH CASCADE INVITE DELETE)
 * DELETE /api/tasks/[id]
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    // 🔐 Only owner can delete
    if (task.postedBy.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    // ✅ CASCADE DELETE
    await Invite.deleteMany({ task: id });
    await Task.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Task and related invites deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}


/**
 * GET SINGLE TASK
 * GET /api/tasks/[id]
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid task id" },
        { status: 400 }
      );
    }

    const task = await Task.findById(id).populate(
      "postedBy",
      "name email image"
    );

    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { task },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch task error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

