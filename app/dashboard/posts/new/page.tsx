import { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PostForm } from "@/components/dashboard/PostForm";
import { getCurrentUser } from "@/lib/session";
import { DatabaseErrorMessage } from "@/components/ui/DatabaseErrorMessage";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Post",
  description: "Create a new blog post",
};

export default async function CreatePostPage() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/auth/login");
    }

    return (
      <div className="container max-w-4xl py-10">
        <DashboardHeader
          heading="Create Post"
          text="Create a new blog post for your readers."
        />
        <div className="grid gap-10 py-10">
          <PostForm userId={user.id} />
        </div>
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Error in create post page:", error);

    return (
      <div className="container max-w-4xl py-10">
        <DashboardHeader
          heading="Create Post"
          text="Database connection error. Please try again later."
        />
        <DatabaseErrorMessage
          title="Database Connection Error"
          message="The database server is currently unavailable. You cannot create posts at this time."
          details={error instanceof Error ? error.message : "Unknown error"}
          showTroubleshooting={true}
        />
      </div>
    );
  }
}
