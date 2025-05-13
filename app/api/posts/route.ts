import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getPosts } from "@/lib/posts";
import { z } from "zod";
import { prisma, isDatabaseAvailable } from "@/lib/prisma";

const postCreateSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  content: z.string().min(1, {
    message: "Content is required.",
  }),
  published: z.boolean().default(false),
  authorId: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const posts = await getPosts(page, limit);

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    const validation = postCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, content, published, authorId } = validation.data;

    // Determine the authorId to use
    let userId = authorId;

    // If no authorId provided in the form, get the current user
    if (!userId) {
      const user = await getCurrentUser();

      if (!user) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
      }

      userId = user.id;
    }

    // Verify database is available
    if (!(await isDatabaseAvailable())) {
      return NextResponse.json(
        { error: "Database is currently unavailable" },
        { status: 503 }
      );
    }

    // Verify user exists
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Create the post
    try {
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          published,
          authorId: userId,
        },
      });

      // Format the response consistently
      return NextResponse.json(
        {
          success: true,
          post: {
            id: newPost.id,
            title: newPost.title,
            content: newPost.content,
            published: newPost.published,
            authorId: newPost.authorId,
            createdAt: newPost.createdAt.toISOString(),
            updatedAt: newPost.updatedAt.toISOString(),
          },
        },
        { status: 201 }
      );
    } catch (dbError) {
      return NextResponse.json(
        {
          error: "Failed to create post in database",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      {
        error: "Failed to create post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
