"use client";

import { PostItem } from "@/components/dashboard/PostItem";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";

interface PostListProps {
  posts: {
    posts: {
      id: string;
      title: string;
      published: boolean;
      createdAt: string;
      author: {
        name: string;
      };
    }[];
    totalPages: number;
    currentPage: number;
  };
}

export function PostList({ posts }: PostListProps) {
  if (posts.posts.length === 0) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon>
          <Icons.post />
        </EmptyPlaceholder.Icon>
        <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any posts yet. Start creating content.
        </EmptyPlaceholder.Description>
        <EmptyPlaceholder.Action>
          <Link
            href="/dashboard/posts/new"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <Icons.plus className="mr-2 h-4 w-4" />
            Create a post
          </Link>
        </EmptyPlaceholder.Action>
      </EmptyPlaceholder>
    );
  }

  return (
    <div className="divide-y divide-border rounded-md border">
      {posts.posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
