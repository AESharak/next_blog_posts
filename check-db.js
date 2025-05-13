const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users:", users);

    const posts = await prisma.post.findMany();
    console.log("Posts:", posts);
  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
