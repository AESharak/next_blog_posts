import { Metadata } from "next";
import { Header } from "@/components/dashboard/Header";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your blog posts",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // Use getServerSession directly for a lighter check
    const session = await getServerSession(authOptions);

    if (!session) {
      // No session, redirect to login
      redirect("/auth/login");
    }

    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    );
  } catch (error) {
    // Don't catch NEXT_REDIRECT errors (from redirect() function)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Error in dashboard layout:", error);

    // For other errors, redirect to login
    redirect("/auth/login");
  }
}
