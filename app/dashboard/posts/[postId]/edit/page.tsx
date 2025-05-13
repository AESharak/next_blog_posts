import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { getPostById } from "@/lib/posts";
import { getCurrentUser } from "@/lib/session";
import { PostForm } from "@/components/dashboard/PostForm";

interface EditPostPageProps {
  params: {
    postId: string;
  };
}

export async function generateMetadata({
  params,
}: EditPostPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const post = await getPostById(resolvedParams.postId);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `Edit: ${post.title}`,
    description: "Edit your blog post",
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  try {
    // Get current user
    const user = await getCurrentUser();

    if (!user) {
      redirect("/auth/login");
    }

    // Fix for the params warning
    const resolvedParams = await Promise.resolve(params);

    // Get post details
    const post = await getPostById(resolvedParams.postId);

    // Check if post exists
    if (!post) {
      notFound();
    }

    // Check if current user is the post author
    if (post.authorId !== user.id) {
      // If not the author, redirect to dashboard
      redirect("/dashboard");
    }

    return (
      <div className="container max-w-4xl py-10">
        <DashboardHeader
          heading="Edit Post"
          text="Make changes to your blog post."
        />
        <div className="grid gap-10 py-10">
          <PostForm
            userId={user.id}
            post={{
              id: post.id,
              title: post.title,
              content: post.content,
              published: post.published,
            }}
          />
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    // Show error UI for other errors
    return (
      <div className="container max-w-4xl py-10">
        <DashboardHeader
          heading="Edit Post"
          text="An error occurred while loading the post."
        />
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mt-6">
          <p>
            <strong>Error:</strong>{" "}
            {error instanceof Error ? error.message : "Failed to load post"}
          </p>
        </div>
      </div>
    );
  }
}
