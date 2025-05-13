import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default async function Home() {
  const { posts } = await getPosts(1, 5);

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
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/signup">Create Account</Link>
          </Button>
        </div>
      </div>

      <div className="my-16">
        <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
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
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-bold mb-2">Create</h3>
            <p className="mb-4">
              Write and publish your own blog posts with our easy-to-use editor.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-bold mb-2">Connect</h3>
            <p className="mb-4">
              Join a community of writers and readers who share your interests.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-bold mb-2">Grow</h3>
            <p className="mb-4">
              Gain readers and get feedback to improve your writing skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
