const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTestData() {
  try {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      },
    });

    console.log("User created:", user);

    // Create a test post
    const post = await prisma.post.create({
      data: {
        title: "Test Post",
        content: "This is a test post content.",
        published: true,
        authorId: user.id,
      },
    });

    console.log("Post created:", post);
  } catch (error) {
    console.error("Error creating test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
