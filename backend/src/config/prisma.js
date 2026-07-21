const { PrismaClient } = require("@prisma/client");
const env = require("./env");

const globalForPrisma = global;

const prisma =
  globalForPrisma.__prisma ||
  new PrismaClient({
    log: env.isProduction ? ["error", "warn"] : ["query", "error", "warn"],
  });

if (!env.isProduction) {
  globalForPrisma.__prisma = prisma;
}

module.exports = prisma;