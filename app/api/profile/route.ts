import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

/**
 * GET current user profile
 */
export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(session.user.id).select("-__v");

  return NextResponse.json(user);
}

/**
 * UPDATE profile
 */
export async function PUT(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const updatedUser = await User.findByIdAndUpdate(
    session.user.id,
    body,
    { new: true }
  );

  return NextResponse.json(updatedUser);
}
