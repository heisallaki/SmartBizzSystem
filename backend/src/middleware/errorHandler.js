const { Prisma } = require("@prisma/client");
const env = require("../config/env");

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let details = err.details || undefined;

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

  if (err.name === "ZodError") {
    statusCode = 422;
    message = "Validation failed.";
    details = err.flatten?.() || err.issues;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired.";
  }

   if (statusCode >= 500 || err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(err);
  }

  const body = { success: false, message };
  if (details) body.details = details;
  if (!env.isProduction && statusCode >= 500) body.stack = err.stack;

  res.status(statusCode).json(body);
}

module.exports = errorHandler;