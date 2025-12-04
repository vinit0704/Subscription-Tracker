// app/api/subscriptions/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

async function getUserFromRequest(request) {
  await connectToDatabase();

  const cookieStore = request.cookies;
  const uid = cookieStore.get("uid")?.value;

  if (!uid) return null;

  const user = await User.findOne({ uid });
  return user;
}

// GET /api/subscriptions -> read subs
export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { message: "User not initialized" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { subscriptions: user.subscriptions || [] },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in /api/subscriptions GET:", err);
    return NextResponse.json(
      {
        message: "Server error in /api/subscriptions GET",
        error: String(err),
      },
      { status: 500 }
    );
  }
}

// PUT /api/subscriptions -> update subs
export async function PUT(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { message: "User not initialized" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { subscriptions } = body;

    if (!Array.isArray(subscriptions)) {
      return NextResponse.json(
        { message: "Invalid subscriptions format" },
        { status: 400 }
      );
    }

    user.subscriptions = subscriptions;
    await user.save();

    return NextResponse.json(
      { subscriptions: user.subscriptions },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in /api/subscriptions PUT:", err);
    return NextResponse.json(
      {
        message: "Server error in /api/subscriptions PUT",
        error: String(err),
      },
      { status: 500 }
    );
  }
}
