// Middleware function to validate the API key for incoming requests
const validateApiKey = (req, res, next) => {
  // Retrieve the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Expected API key (hardcoded for simplicity in this example)
  const expectedToken = "ATCTT3xFfGN0zeMYhF7BoOeA5MMW7t1bJfXyaytRiiCo0wsNTsJ2Yo_69uGC8fe4r3XsQG4FHet9MhqvTJUKytHYBku0bNrlP6DLL0DKyDYmKia4YMEQt9T3mpnFnoUbLC_UxVejmaCMZELbvR4cXlXJ95qA9Z7DFfOAEYxNWx3BhVUFR1K1f1c=2D0E2E02";

  // Check if the Authorization header exists, starts with "Bearer ", and contains the correct token
  if (
      !authHeader ||                          // Header is missing
      !authHeader.startsWith('Bearer ') ||   // Header does not start with "Bearer "
      authHeader.split(' ')[1] !== expectedToken // Token does not match the expected value
  ) {
    // Respond with 401 Unauthorized if the token is invalid
    return res.status(401).json({ error: 'Invalid API key' });
  }

  // Proceed to the next middleware or route handler if the token is valid
  next();
};

// Export the middleware to be used in other parts of the application
module.exports = validateApiKey;
