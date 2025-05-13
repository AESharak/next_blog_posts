"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deletePost } from "@/lib/posts";

interface PostOperationsProps {
  post: {
    id: string;
  };
}

export function PostOperations({ post }: PostOperationsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const confirmed = confirm("Are you sure you want to delete this post?");

    if (confirmed) {
      try {
        await deletePost(post.id);
        toast.success("Post deleted successfully");
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Icons.ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/posts/${post.id}`}>
            <Icons.eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/posts/${post.id}/edit`}>
            <Icons.edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={isLoading}
          className="text-destructive focus:text-destructive"
        >
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Icons.trash className="mr-2 h-4 w-4" />
              Delete
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
