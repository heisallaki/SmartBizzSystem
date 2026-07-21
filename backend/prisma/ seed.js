const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const SYSTEM_ROLES = [
  {
    name: "Admin",
    description: "Full access to all modules",
    isSystemRole: true,
  },
  {
    name: "Manager",
    description: "Operational access, no system settings",
    isSystemRole: true,
  },
  {
    name: "Cashier",
    description: "Sales and customer-facing access only",
    isSystemRole: true,
  },
];

async function main() {
  console.log("Seeding system roles...");

  for (const role of SYSTEM_ROLES) {
    const result = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
    console.log(`  ✓ ${result.name} (id: ${result.id})`);
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });