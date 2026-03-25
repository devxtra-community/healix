export const globalErrorHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  // Duplicate key
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    message = `${field} already exists`;
  }
  // Validation errors
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }
  res.status(statusCode).json({
    success: false,
    message,
  });
};
