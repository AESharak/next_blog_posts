import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getPostById } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PostPageProps {
  params: {
    postId: string;
  };
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostById(params.postId);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostById(params.postId);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/" className="flex items-center">
            ← Back to Home
          </Link>
        </Button>
      </div>

      <article className="prose dark:prose-invert lg:prose-lg mx-auto">
        <h1>{post.title}</h1>
        <div className="text-sm text-muted-foreground mb-8">
          <p>Published • {formatDate(post.createdAt)}</p>
        </div>

        <div className="mt-8">
          {post.content
            .split("\n")
            .map((paragraph, index) =>
              paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
            )}
        </div>
      </article>
    </div>
  );
}
