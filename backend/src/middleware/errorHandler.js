// Response shape is always:
//   { success: false, message: "...", details: {...} | undefined }

const { Prisma } = require("@prisma/client");
const env = require("../config/env");

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let details = err.details || undefined;

  // Prisma: known request errors (unique constraint, FK violation, not found, ...)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const fields = err.meta?.target?.join?.(", ") || "field";
        statusCode = 409;
        message = `A record with that ${fields} already exists.`;
        break;
      }
      case "P2003":
        statusCode = 409;
        message = "This action violates a related record constraint.";
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found.";
        break;
      default:
        statusCode = 400;
        message = "Database request could not be processed.";
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data was sent to the database layer.";
  }

  // Zod validation errors, if a module throws one directly instead of
  // converting it to an ApiError first.
  if (err.name === "ZodError") {
    statusCode = 422;
    message = "Validation failed.";
    details = err.flatten?.() || err.issues;
  }

  // JWT errors from jsonwebtoken
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired.";
  }

  if (statusCode >= 500) {
    // Unexpected errors get logged with the full stack — operational
    // ApiErrors (4xx) are expected control flow and don't need the noise.
    console.error(err);
  }

  const body = { success: false, message };
  if (details) body.details = details;
  if (!env.isProduction && statusCode >= 500) body.stack = err.stack;

  res.status(statusCode).json(body);
}

module.exports = errorHandler;