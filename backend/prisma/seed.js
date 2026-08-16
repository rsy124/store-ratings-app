const bcrypt = require("bcrypt");
require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashed = await bcrypt.hash("Admin@1234", 10);

  const admin = await prisma.user.create({
    data: {
      name: "System Administrator Account", // must be 20-60 chars
      email: "admin@example.com",
      password: hashed,
      address: "HQ",
      role: "ADMIN",
    },
  });

  console.log("Admin created:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });