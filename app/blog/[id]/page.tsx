import { getPostById } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getPostById(params.id);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The post you're looking for doesn't exist",
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <main className="container max-w-4xl py-12">
      <Button
        asChild
        variant="ghost"
        className="mb-8 flex items-center"
        size="sm"
      >
        <Link href="/blog">
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          Back to all posts
        </Link>
      </Button>

      <article className="prose prose-stone dark:prose-invert mx-auto">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <div>
            By <span className="font-medium">{post.author.name}</span>
          </div>
          <div>•</div>
          <div>{formatDate(post.createdAt)}</div>
        </div>

        <div className="leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
    </main>
  );
}
