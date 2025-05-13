import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  isConnected: boolean;
};

// Create the PrismaClient instance
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
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
    console.error("Failed to connect to database:", error);
    globalForPrisma.isConnected = false;
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
