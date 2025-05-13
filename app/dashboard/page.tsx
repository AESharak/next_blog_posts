import { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PostList } from "@/components/dashboard/PostList";
import { CreatePostButton } from "@/components/dashboard/CreatePostButton";
import { getUserPosts } from "@/lib/posts";
import { getCurrentUser } from "@/lib/session";
import { DatabaseErrorMessage } from "@/components/ui/DatabaseErrorMessage";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your blog posts",
};

export default async function DashboardPage() {
  try {
    const user = await getCurrentUser();

    // If no user is found, redirect to login page
    if (!user) {
      // This will throw a NEXT_REDIRECT error which we shouldn't catch
      redirect("/auth/login");
    }

    const posts = await getUserPosts(user.id);

    return (
      <div className="container max-w-7xl py-10">
        <DashboardHeader
          heading="Dashboard"
          text="Create and manage your blog posts."
        >
          <CreatePostButton />
        </DashboardHeader>
        <div className="grid gap-10 mt-8">
          <PostList posts={posts} />
        </div>
      </div>
    );
  } catch (error) {
    // Don't catch NEXT_REDIRECT errors
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Let Next.js handle the redirect
    }

    // Only log errors in development
    if (process.env.NODE_ENV === "development") {
      console.error("Dashboard loading error:", error);
    }

    // Show error UI for database errors
    return (
      <div className="container max-w-7xl py-10">
        <DashboardHeader
          heading="Dashboard"
          text="Database connection error. Please try again later."
        >
          <CreatePostButton />
        </DashboardHeader>
        <DatabaseErrorMessage
          title="Database Connection Error"
          message="The database server is currently unavailable. Please try again later."
          details={error instanceof Error ? error.message : "Unknown error"}
          showTroubleshooting={true}
        />
      </div>
    );
  }
}
