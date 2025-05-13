import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log("Checking database connection...");

    // Get all users
    const users = await prisma.user.findMany();

    console.log(`Found ${users.length} users in the database.`);

    if (users.length > 0) {
      console.log("\nUser information:");
      users.forEach((user, index) => {
        console.log(`\nUser #${index + 1}:`);
        console.log(`  ID: ${user.id}`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Created: ${user.createdAt}`);
      });
    }

    // Check posts
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`\nFound ${posts.length} posts in the database.`);

    if (posts.length > 0) {
      console.log("\nPost information:");
      posts.forEach((post, index) => {
        console.log(`\nPost #${index + 1}:`);
        console.log(`  ID: ${post.id}`);
        console.log(`  Title: ${post.title}`);
        console.log(
          `  Author: ${post.author?.name || "Unknown"} (${
            post.author?.email || "No email"
          })`
        );
        console.log(`  Author ID: ${post.authorId}`);
        console.log(`  Created: ${post.createdAt}`);
        console.log(`  Published: ${post.published ? "Yes" : "No"}`);
      });
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers()
  .then(() => console.log("Done!"))
  .catch((error) => console.error("Script error:", error));
