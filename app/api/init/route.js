// app/api/init/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { randomUUID } from "crypto";

export async function GET(request) {
  try {
    await connectToDatabase();

    const cookieStore = request.cookies;
    let uid = cookieStore.get("uid")?.value;

    // No cookie → create user + set cookie
    if (!uid) {
      uid = randomUUID();

      const user = await User.create({
        uid,
        subscriptions: [],
      });

      const res = NextResponse.json(
        { uid: user.uid, subscriptions: user.subscriptions },
        { status: 200 }
      );

      const tenYearsInSeconds = 10 * 365 * 24 * 60 * 60;

      res.cookies.set("uid", uid, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: tenYearsInSeconds,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      return res;
    }

    // Cookie exists → find or create
    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        subscriptions: [],
      });
    }

    return NextResponse.json(
      { uid: user.uid, subscriptions: user.subscriptions },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in /api/init:", err);

    return NextResponse.json(
      {
        message: "Server error in /api/init",
        error: String(err),
      },
      { status: 500 }
    );
  }
}
