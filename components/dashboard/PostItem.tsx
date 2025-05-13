"use client";

import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { PostOperations } from "@/components/dashboard/PostOperations";

interface PostItemProps {
  post: {
    id: string;
    title: string;
    published: boolean;
    createdAt: string;
    author: {
      name: string;
    };
  };
}

export function PostItem({ post }: PostItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/dashboard/posts/${post.id}`}
          className="font-semibold hover:underline"
        >
          {post.title}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatDate(post.createdAt)}
          </span>
          {!post.published && (
            <span className="flex items-center text-xs text-muted-foreground">
              <Icons.draft className="mr-1 h-3 w-3" />
              Draft
            </span>
          )}
        </div>
      </div>
      <PostOperations post={post} />
    </div>
  );
}
