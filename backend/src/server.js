const env = require("./config/env");
const app = require("./app");
const prisma = require("./config/prisma");

const server = app.listen(env.port, () => {
  console.log(`SmartBizzSystem API listening on port ${env.port} [${env.nodeEnv}]`);
});

prisma
  .$connect()
  .then(() => console.log("Database connected."))
  .catch((error) => {
    console.error("Could not connect to the database on startup:", error.message);
  });

async function shutdown(signal) {
  console.log(`${signal} received — shutting down gracefully.`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log("Shutdown complete.");
    process.exit(0);
  });

  // Force-exit if something hangs longer than 10s
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});