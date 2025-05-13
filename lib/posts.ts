"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function getPosts(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where: { published: true } }),
    ]);

    return {
      posts: posts.map((post) => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      })),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching posts:", error);
    }
    return { posts: [], totalPages: 0, currentPage: 1 };
  }
}

export async function getUserPosts(userId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: userId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where: { authorId: userId } }),
    ]);

    return {
      posts: posts.map((post) => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      })),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching user posts:", error);
    }
    return { posts: [], totalPages: 0, currentPage: 1 };
  }
}

export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    return {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  } catch (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching post:", error);
    }
    return null;
  }
}

export async function createPost({
  title,
  content,
  published,
  authorId,
}: {
  title: string;
  content: string;
  published: boolean;
  authorId: string;
}) {
  try {
    // Verify the user exists first
    const user = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!user) {
      throw new Error(`User with ID ${authorId} not found`);
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId,
      },
    });

    // Revalidate paths to update UI
    revalidatePath("/dashboard");
    revalidatePath("/posts");

    if (published) {
      revalidatePath("/");
    }

    return {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  } catch (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating post:", error);
    }
    throw error;
  }
}

export async function updatePost({
  id,
  title,
  content,
  published,
}: {
  id: string;
  title?: string;
  content?: string;
  published?: boolean;
}) {
  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        published,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/posts/${id}`);

    return {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  } catch (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error updating post:", error);
    }
    throw error;
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/dashboard");

    return true;
  } catch (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting post:", error);
    }
    throw error;
  }
}
