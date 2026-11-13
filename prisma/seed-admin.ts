import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) are required");
  }

  await prisma.user.upsert({
    where: { email },
    update: {
      password: await bcrypt.hash(password, 12),
      role: UserRole.superadmin,
      isActive: true
    },
    create: {
      email,
      password: await bcrypt.hash(password, 12),
      role: UserRole.superadmin
    }
  });

  console.log(`Superadmin ${email} is ready`);
}

main()
  .finally(() => prisma.$disconnect());
