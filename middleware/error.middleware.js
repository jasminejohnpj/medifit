/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error("Error Middleware:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(", ");
  }

  // Sequelize DB errors
  if (err.name === "SequelizeDatabaseError") {
    statusCode = 500;
    message = "Database error occurred";
  }

  // JWT / Authentication errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
