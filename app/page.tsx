import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default async function Home() {
  const { posts } = await getPosts(1, 3);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to our Blog Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mb-8">
          Share your thoughts, ideas and stories with the world. Create
          beautiful blog posts with our simple and elegant platform.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/signup">Create Account</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/blog">Explore Blog</Link>
          </Button>
        </div>
      </div>

      <div className="my-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Latest Posts</h2>
          <Button asChild variant="ghost">
            <Link href="/blog">View All Posts →</Link>
          </Button>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    By {post.author.name} • {formatDate(post.createdAt)}
                  </p>
                  <p className="line-clamp-3 mb-4">{post.content}</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/posts/${post.id}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-xl text-muted-foreground">
              No published posts yet
            </p>
          </div>
        )}
      </div>

      <div className="border-t pt-12">
        <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2">Create</h3>
            <p className="mb-4">
              Write and publish your own blog posts with our easy-to-use editor.
            </p>
            <Button asChild variant="link" className="px-0">
              <Link href="/dashboard/posts/new">Start Writing →</Link>
            </Button>
          </div>
          <div className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2">Manage</h3>
            <p className="mb-4">
              Use your dashboard to organize, edit and publish your content.
            </p>
            <Button asChild variant="link" className="px-0">
              <Link href="/dashboard">Go to Dashboard →</Link>
            </Button>
          </div>
          <div className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2">Explore</h3>
            <p className="mb-4">
              Discover posts from other writers and get inspired by their work.
            </p>
            <Button asChild variant="link" className="px-0">
              <Link href="/blog">Browse Posts →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
