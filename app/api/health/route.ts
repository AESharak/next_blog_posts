import { NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/prisma";

export async function GET() {
  try {
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database unavailable",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: "ok",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
      },
      { status: 500 }
    );
  }
}
