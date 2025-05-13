import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { getPostById } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

interface PostPageProps {
  params: {
    postId: string;
  };
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const post = await getPostById(resolvedParams.postId);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `Edit: ${post.title}`,
    description: post.content.substring(0, 160),
  };
}

export default async function DashboardPostPage({ params }: PostPageProps) {
  // Get current user
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fix for the params warning
  const resolvedParams = await Promise.resolve(params);

  // Get post details
  const post = await getPostById(resolvedParams.postId);

  // Show 404 if post doesn't exist
  if (!post) {
    notFound();
  }

  // Check if current user is the post author
  if (post.authorId !== user.id) {
    // If not the author, redirect to dashboard
    redirect("/dashboard");
  }

  // Status badge based on published state
  const statusBadge = post.published ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
      Published
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400">
      Draft
    </span>
  );

  return (
    <div className="container max-w-4xl py-10">
      <DashboardHeader
        heading={post.title}
        text={`Post details and management`}
      >
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/dashboard/posts/${post.id}/edit`}>Edit Post</Link>
          </Button>
        </div>
      </DashboardHeader>

      <div className="mt-8 grid gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Created: {formatDate(post.createdAt)}
            </p>
            {post.updatedAt !== post.createdAt && (
              <p className="text-sm text-muted-foreground">
                Updated: {formatDate(post.updatedAt)}
              </p>
            )}
          </div>
          {statusBadge}
        </div>

        <div className="prose dark:prose-invert max-w-none">
          {post.content
            .split("\n")
            .map((paragraph, index) =>
              paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
            )}
        </div>

        <div className="flex justify-between border-t pt-6">
          <Button asChild variant="outline">
            <Link href={`/posts/${post.id}`} target="_blank">
              View Public Post
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
