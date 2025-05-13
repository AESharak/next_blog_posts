#!/usr/bin/env node

/**
 * Script to create the missing user in the database
 * Run with: node scripts/create-user.js
 */

const { PrismaClient } = require("@prisma/client");

async function createMissingUser() {
  console.log("Creating missing user in database...");

  const prisma = new PrismaClient({
    log: ["error", "warn"],
  });

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "ahmed@gmail.com" },
    });

    if (existingUser) {
      console.log("✅ User ahmed@gmail.com already exists:", existingUser);
      return existingUser;
    }

    // Create the user with the same ID that appears in the session
    const newUser = await prisma.user.create({
      data: {
        id: "198a8a86-a8e4-4906-95dd-8d85c48fdcde",
        name: "Ahmed Essam",
        email: "ahmed@gmail.com",
        password: "password123", // You may want to use a proper hashed password
      },
    });

    console.log("✅ Created user successfully:", newUser);
    return newUser;
  } catch (error) {
    console.error("❌ Error creating user:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  createMissingUser()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error("Script failed:", err);
      process.exit(1);
    });
}

module.exports = { createMissingUser };
