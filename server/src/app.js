const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { logger, requestLogger, errorHandler, apiKeyValidator } = require("./middleware");
const {
  calculateDistance,
  findRoutesWithMaxStops,
  findRoutesWithExactStops,
  findShortestRoute,
  findRoutesWithinDistance
} = require("./services/routeService");

// 1. CORS middleware
// Allows cross-origin requests to this API from any domain
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allow specified HTTP methods
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specified headers
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Respond quickly to preflight OPTIONS requests
  }
  next(); // Continue to the next middleware
});

// 2. Body parsing middleware
// Parses incoming JSON payloads and makes them available in `req.body`
app.use(bodyParser.json());

// 3. Request logging middleware
// Logs details of each incoming HTTP request using the `requestLogger` middleware
app.use(requestLogger);

// 4. API Key validation middleware
// Secures the API by validating the API key in the request headers
app.use(apiKeyValidator);

// Define API endpoints

// Endpoint to calculate the distance of a given path
app.get("/api/distance", (req, res) => {
  try {
    const pathArray = decodeURIComponent(req.query.path).split(','); // Parse and decode the path from the query parameter
    logger.info(`Received distance calculation request for path: ${pathArray}`);

    if (!pathArray || pathArray.length < 2) {
      return res.status(400).json({ error: 'Invalid path format' }); // Validate the input path
    }

    const result = calculateDistance(pathArray); // Calculate the distance
    res.json({ distance: result }); // Return the result
  } catch (error) {
    logger.error(`Error calculating distance: ${error.message}`);
    res.status(400).json({ error: error.message }); // Handle errors and send a response
  }
});

// Endpoint to find routes with a maximum number of stops
app.get("/api/routes/max-stops", (req, res) => {
  const { start, end, maxStops } = req.query; // Extract parameters from query
  logger.info(
      `Received route calculation request for max stops from ${start} to ${end} with max stops ${maxStops}`
  );
  const routes = findRoutesWithMaxStops(start, end, parseInt(maxStops)); // Find routes
  res.json({ routes }); // Return the routes
});

// Endpoint to find routes with an exact number of stops
app.get("/api/routes/exact-stops", (req, res) => {
  const { start, end, exactStops } = req.query; // Extract parameters from query
  logger.info(
      `Received route calculation request for exact stops from ${start} to ${end} with exact stops ${exactStops}`
  );
  const routes = findRoutesWithExactStops(start, end, parseInt(exactStops)); // Find routes
  res.json({ routes }); // Return the routes
});

// Endpoint to find the shortest route between two towns
app.get("/api/routes/shortest", (req, res) => {
  const { start, end } = req.query; // Extract parameters from query
  logger.info(`Received shortest route calculation request from ${start} to ${end}`);
  const shortestDistance = findShortestRoute(start, end); // Find shortest route
  res.json({ shortestDistance }); // Return the shortest distance
});

// Endpoint to find all routes within a maximum distance
app.get("/api/routes/within-distance", (req, res) => {
  const { start, end, withinDistance } = req.query; // Extract parameters from query
  logger.info(`Finding routes from ${start} to ${end} within distance ${withinDistance}`);

  try {
    const routes = findRoutesWithinDistance(start, end, parseInt(withinDistance)); // Find routes
    const formattedRoutes = routes.map(route => ({
      path: route.join(" → "), // Format the path for readability
      distance: calculateDistance(route) // Calculate the distance for each route
    }));
    res.json({ routes: formattedRoutes }); // Return the formatted routes
  } catch (error) {
    logger.error(`Error finding routes within distance: ${error.message}`);
    res.status(500).json({ error: "Error finding routes within distance" }); // Handle errors
  }
});

// 5. Error handling middleware
// Captures and handles errors across the application
app.use(errorHandler);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`); // Log server start
  console.log(`Server is running on http://localhost:${PORT}`); // Output server start to the console
});
