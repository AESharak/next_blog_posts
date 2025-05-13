"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Icons } from "@/components/ui/icons";
import { toast } from "sonner";
import axios from "axios";

interface PostFormProps {
  userId: string;
  post?: {
    id: string;
    title: string;
    content: string;
    published: boolean;
  };
}

export function PostForm({ userId, post }: PostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState(post?.title || "");
  const [content, setContent] = React.useState(post?.content || "");
  const [published, setPublished] = React.useState(post?.published || false);
  const [error, setError] = React.useState<string | null>(null);
  const [isDatabaseAvailable, setIsDatabaseAvailable] =
    React.useState<boolean>(true);

  // Check database connection on component mount
  React.useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const response = await fetch("/api/health");
        if (!response.ok) {
          setIsDatabaseAvailable(false);
          setError(
            "Database server is unavailable. Unable to create or edit posts at this time."
          );
        }
      } catch {
        setIsDatabaseAvailable(false);
        setError(
          "Cannot connect to the server. Database might be unavailable."
        );
      }
    };

    checkDatabaseStatus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isDatabaseAvailable) {
      toast.error(
        "Database is unavailable. Cannot create or edit posts at this time."
      );
      setError(
        "Database server is unavailable. Unable to create or edit posts at this time."
      );
      return;
    }

    // Validate form
    if (!title.trim()) {
      toast.error("Title is required");
      setError("Title is required");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required");
      setError("Content is required");
      return;
    }

    setIsLoading(true);

    const formData = {
      title: title.trim(),
      content: content.trim(),
      published,
      authorId: userId,
    };

    try {
      // Check database status before submitting
      const healthResponse = await fetch("/api/health");

      if (!healthResponse.ok) {
        setIsDatabaseAvailable(false);
        toast.error(
          "Database appears to be offline. Cannot create or edit posts."
        );
        setError("Database connection failed. Please try again later.");
        setIsLoading(false);
        return;
      }

      if (post) {
        // Update post
        await axios.patch(`/api/posts/${post.id}`, formData, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        toast.success("Post updated successfully");
      } else {
        // Create post with proper headers
        await axios.post("/api/posts", formData, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        toast.success("Post created successfully");
      }

      // Add a slight delay before navigation to ensure database operation completes
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503 || error.response?.status === 500) {
          setIsDatabaseAvailable(false);
          toast.error("Database is unavailable. Please try again later.");
          setError(
            "Database connection error. The server is unable to process your request."
          );
        } else if (error.response?.data?.error) {
          const errorMessage = error.response.data.error;
          toast.error(errorMessage);
          setError(errorMessage);
        } else if (error.message) {
          toast.error(`Error: ${error.message}`);
          setError(error.message);
        } else {
          toast.error("Failed to process your request. Please try again.");
          setError("Unknown error occurred");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
        setError("Unexpected error");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-6">
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {!isDatabaseAvailable && (
        <div className="bg-amber-100 border border-amber-400 text-amber-800 px-4 py-3 rounded-md mb-6">
          <h3 className="font-bold">Database Unavailable</h3>
          <p>
            The database server is currently unavailable. Post creation and
            editing are disabled.
          </p>
          <p className="text-sm mt-2">
            Please try again later or contact support if the issue persists.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Title
          </label>
          <Input
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isDatabaseAvailable || isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Content
          </label>
          <Textarea
            placeholder="Write your post content here..."
            className="min-h-[300px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!isDatabaseAvailable || isLoading}
          />
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <label className="text-base font-medium">Published</label>
            <p className="text-sm text-muted-foreground">
              {published
                ? "This post will be visible to everyone"
                : "This post is a draft and only visible to you"}
            </p>
          </div>
          <Switch
            checked={published}
            onCheckedChange={setPublished}
            disabled={!isDatabaseAvailable || isLoading}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading || !isDatabaseAvailable}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {post ? "Update" : "Create"} Post
          </Button>
        </div>
      </form>
    </div>
  );
}
