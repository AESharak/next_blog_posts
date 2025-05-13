import bcrypt from "bcrypt";
import { prisma } from "./prisma";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await hashPassword(password);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
};
