import { NextResponse } from "next/server";
import { updatePost, deletePost, getPostById } from "@/lib/posts";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";

// Define schema for validation
const postUpdateSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title is required.",
    })
    .optional(),
  content: z
    .string()
    .min(1, {
      message: "Content is required.",
    })
    .optional(),
  published: z.boolean().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;
    const post = await getPostById(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error getting post:", error);
    return NextResponse.json(
      { error: "Error retrieving post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const postId = params.postId;

    // Check if post exists and belongs to user
    const existingPost = await getPostById(postId);

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to update this post" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = postUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, content, published } = validation.data;

    try {
      const updatedPost = await updatePost({
        id: postId,
        title,
        content,
        published,
      });

      return NextResponse.json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);

      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(
        { error: "Failed to update post" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Post update error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const postId = params.postId;

    // Check if post exists and belongs to user
    const existingPost = await getPostById(postId);

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this post" },
        { status: 403 }
      );
    }

    try {
      await deletePost(postId);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting post:", error);

      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Post deletion error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
