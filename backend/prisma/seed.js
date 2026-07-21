const bcrypt = require("bcryptjs");
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

  console.log("Seeding bootstrap admin account...");

  const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL || "admin@smartbizz.com";
  const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD || "ChangeMe123!";

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { name: "Admin" },
  });
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // never overwrite an existing admin's password on re-seed
    create: {
      roleId: adminRole.id,
      fullName: "Administrator",
      email: adminEmail,
      passwordHash,
      status: "Active",
    },
  });

  console.log(`  ✓ ${admin.email} (id: ${admin.id})`);
  if (!process.env.BOOTSTRAP_ADMIN_PASSWORD) {
    console.log(
      `    Using default password "${adminPassword}" — log in and change it immediately.`
    );
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