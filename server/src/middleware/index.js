const winston = require('winston'); // Importing winston for logging

// Logger configuration
const logger = winston.createLogger({
  level: 'info', // Set default logging level to "info"
  format: winston.format.combine(
      winston.format.timestamp(), // Add a timestamp to log entries
      winston.format.json() // Format log entries as JSON
  ),
  transports: [
    // Log error-level messages to "error.log"
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Log all messages (info and above) to "combined.log"
    new winston.transports.File({ filename: 'combined.log' }),
    // Log messages to the console in a simple format
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Middleware to log HTTP requests
const requestLogger = (req, res, next) => {
  logger.info({
    method: req.method, // HTTP method (GET, POST, etc.)
    path: req.path, // Endpoint path (e.g., "/api/resource")
    body: req.body, // Request body (if applicable)
    timestamp: new Date().toISOString() // Log timestamp
  });
  next(); // Move to the next middleware or route handler
};

// Middleware to handle errors in the application
const errorHandler = (err, req, res) => {
  // Log the error details
  logger.error({
    error: err.message, // Error message
    stack: err.stack, // Stack trace (useful for debugging)
    path: req.path, // Endpoint where the error occurred
    timestamp: new Date().toISOString() // Log timestamp
  });

  // Respond to the client with a generic or detailed error message
  res.status(500).json({
    error: 'An error occurred', // Generic error description
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' // Show detailed message in development
  });
};

// Middleware to validate API key for secured endpoints
const apiKeyValidator = (req, res, next) => {
  const authHeader = req.headers.authorization; // Retrieve Authorization header
  const expectedToken = "ATCTT3xFfGN0zeMYhF7BoOeA5MMW7t1bJfXyaytRiiCo0wsNTsJ2Yo_69uGC8fe4r3XsQG4FHet9MhqvTJUKytHYBku0bNrlP6DLL0DKyDYmKia4YMEQt9T3mpnFnoUbLC_UxVejmaCMZELbvR4cXlXJ95qA9Z7DFfOAEYxNWx3BhVUFR1K1f1c=2D0E2E02";

  // Check if the Authorization header is valid
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== expectedToken) {
    // Log invalid API key attempts
    logger.warn({
      message: 'Invalid API key attempt',
      ip: req.ip, // Client IP address
      timestamp: new Date().toISOString() // Log timestamp
    });
    // Respond with a 401 Unauthorized error
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next(); // Move to the next middleware or route handler if the API key is valid
};

// Export the logger and middlewares for use in the application
module.exports = {
  logger, // Winston logger instance for custom logging
  requestLogger, // Logs details of incoming HTTP requests
  errorHandler, // Handles errors and sends responses to clients
  apiKeyValidator // Validates the API key for secured routes
};
