require("dotenv").config();

const REQUIRED_IN_PRODUCTION = ["DATABASE_URL", "JWT_SECRET", "CORS_ORIGIN"];

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

const env = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET || "dev-only-insecure-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  // Comma-separated list in .env, e.g. "http://localhost:5173,https://smartbizzsystem.vercel.app"
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

function validateEnv() {
  if (!isProduction) return; // dev/test get sensible fallbacks above

  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s) in production: ${missing.join(", ")}`
    );
  }
}

validateEnv();

module.exports = env;