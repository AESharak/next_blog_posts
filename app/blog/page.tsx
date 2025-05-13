import { getPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/blog/Pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Explore our latest blog posts and articles",
};

interface BlogPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await Promise.resolve(searchParams);
  const currentPage = params.page ? parseInt(params.page) : 1;
  const { posts, totalPages } = await getPosts(currentPage, 9);

  return (
    <main className="container max-w-7xl py-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Explore our latest blog posts and articles
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No posts published yet.</p>
        )}

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        )}
      </div>
    </main>
  );
}
