import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function createTestPost() {
  try {
    console.log("Creating test post...");

    // Get first user from database
    const user = await prisma.user.findFirst();

    if (!user) {
      console.error(
        "No users found in the database. Please create a user first."
      );
      return;
    }

    console.log(`Using user: ${user.name} (${user.email}) with ID: ${user.id}`);

    // Create a test post
    const post = await prisma.post.create({
      data: {
        title: "Test Post " + new Date().toISOString(),
        content: "This is a test post created directly via script.",
        published: true,
        authorId: user.id,
      },
    });

    console.log("Post created successfully:");
    console.log(`  ID: ${post.id}`);
    console.log(`  Title: ${post.title}`);
    console.log(`  Author ID: ${post.authorId}`);
    console.log(`  Created: ${post.createdAt}`);
  } catch (error) {
    console.error("Error creating test post:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestPost()
  .then(() => console.log("Done!"))
  .catch((error) => console.error("Script error:", error));
