import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "./prisma";

export async function getSession() {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error getting session:", error);
    }
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    // Check database availability before attempting to query
    const dbAvailable = await isDatabaseAvailable();
    if (!dbAvailable) {
      throw new Error("Database connection failed");
    }

    try {
      const currentUser = await prisma.user.findUnique({
        where: {
          email: session.user.email as string,
        },
      });

      if (!currentUser) {
        return null;
      }

      return {
        ...currentUser,
        createdAt: currentUser.createdAt.toISOString(),
        updatedAt: currentUser.updatedAt.toISOString(),
      };
    } catch (dbError) {
      // Log errors only in development
      if (process.env.NODE_ENV === "development") {
        console.error("Database error when finding user:", dbError);
      }
      throw new Error(
        "Database error: " +
          (dbError instanceof Error ? dbError.message : String(dbError))
      );
    }
  } catch (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error getting current user:", error);
    }
    throw error; // Propagate the error so page components can handle it
  }
}
