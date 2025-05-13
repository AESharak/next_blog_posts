import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Posts",
  description: "Browse all published blog posts",
};

export default async function PostsPage() {
  const { posts, totalPages, currentPage } = await getPosts(1, 10);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-6 bg-card">
              <h2 className="text-2xl font-bold mb-2">
                <Link href={`/posts/${post.id}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {formatDate(post.createdAt)}
              </p>
              <p className="line-clamp-3 mb-4">{post.content}</p>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/posts/${post.id}`}>Read More</Link>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-xl text-muted-foreground">
            No published posts yet
          </p>
          <Button asChild className="mt-4">
            <Link href="/auth/login">Sign in to create posts</Link>
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/posts?page=${i + 1}`}>{i + 1}</Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
