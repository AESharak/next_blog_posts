#!/usr/bin/env node

/**
 * Simple script to check database connection status
 * Run with: node scripts/check-db.js
 */

// Using CommonJS for compatibility with direct node execution
const { PrismaClient } = require("@prisma/client");

async function checkDatabaseConnection() {
  console.log("Checking database connection...");

  const prisma = new PrismaClient({
    log: ["error", "warn"],
  });

  try {
    // Try to run a simple query
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Database connection successful!");

    // Check if users table exists and has data
    try {
      const userCount = await prisma.user.count();
      console.log(`Found ${userCount} users in the database`);
    } catch (userError) {
      console.error("❌ Error accessing users table:", userError.message);
    }

    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);

    // Check if this is a connection error
    if (
      error.message.includes("Can't reach database server") ||
      error.message.includes("connect ECONNREFUSED")
    ) {
      console.log("\nPossible solutions:");
      console.log("1. Make sure your database server is running");
      console.log("2. Check your database connection string in .env");
      console.log(
        "3. Verify the database server is running on the expected port"
      );
    }

    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check if this file is executed directly
if (require.main === module) {
  checkDatabaseConnection()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((err) => {
      console.error("Unexpected error:", err);
      process.exit(1);
    });
}

module.exports = { checkDatabaseConnection };
