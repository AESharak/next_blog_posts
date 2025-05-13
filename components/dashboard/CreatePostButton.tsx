"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";

export function CreatePostButton() {
  return (
    <Button asChild>
      <Link href="/dashboard/posts/new">
        <Icons.plus className="mr-2 h-4 w-4" />
        New Post
      </Link>
    </Button>
  );
}
