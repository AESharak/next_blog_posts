import { NextResponse } from "next/server";
import { createUser } from "@/lib/auth";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Define schema for validation
const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Registration request received:", {
      ...body,
      password: "[REDACTED]",
    });

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    try {
      const user = await createUser(name, email, password);
      console.log("User created successfully:", {
        id: user.id,
        name: user.name,
        email: user.email,
      });

      return NextResponse.json(
        { user: { id: user.id, name: user.name, email: user.email } },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating user:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return NextResponse.json(
            { error: "A user with this email already exists" },
            { status: 409 }
          );
        }
      }

      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
