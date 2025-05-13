import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({
        success: true,
        message: "Already logged out",
      });
    }

    // We can't explicitly destroy the session server-side with NextAuth's JWT strategy
    // The client-side signOut() function will handle clearing the token

    return NextResponse.json({
      success: true,
      message: "Logout request received",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process logout request" },
      { status: 500 }
    );
  }
}
