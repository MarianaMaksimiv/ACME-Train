// Middleware for handling errors in the application
const errorHandler = (err, req, res) => {
  // Log the error message for debugging and monitoring purposes
  logger.error(`Error: ${err.message}`);

  // Respond with a 500 Internal Server Error status and a JSON error message
  res.status(500).json({
    error: 'An error occurred', // Generic error message
    message: err.message // Detailed error message from the error object
  });
};

// Export the middleware so it can be used in the application
module.exports = errorHandler;
