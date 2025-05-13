import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  isConnected: boolean;
};

// Create the PrismaClient instance
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    errorFormat: "pretty",
  });

// Connection state tracking
globalForPrisma.isConnected = false;

// Test connection on initialization
(async () => {
  try {
    // Try a simple query to test database connection
    await prisma.$queryRaw`SELECT 1`;
    globalForPrisma.isConnected = true;
  } catch (error) {
    globalForPrisma.isConnected = false;
    // Only log in development mode
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to connect to database:", error);
    }
  }
})();

// Helper to check if database is available
export const isDatabaseAvailable = async (): Promise<boolean> => {
  if (globalForPrisma.isConnected) return true;

  try {
    await prisma.$queryRaw`SELECT 1`;
    globalForPrisma.isConnected = true;
    return true;
  } catch {
    globalForPrisma.isConnected = false;
    return false;
  }
};

// Keep a single instance in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
