// Graph data representing the network of towns and distances between them
const graph = {
  A: { B: 5, D: 5, E: 7 },
  B: { C: 4 },
  C: { D: 8, E: 2 },
  D: { C: 8, E: 6 },
  E: { B: 3 }
};

/**
 * Calculate the total distance of a given path.
 * @param {Array} path - Array of town names representing the path.
 * @returns {number|string} - Total distance or 'NO SUCH ROUTE' if the path is invalid.
 */
const calculateDistance = (path) => {
  if (!path || !Array.isArray(path) || path.length === 0) {
    throw new Error('Invalid path');
  }

  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    if (graph[start] && graph[start][end] !== undefined) {
      totalDistance += graph[start][end];
    } else {
      return 'NO SUCH ROUTE'; // Return this if any part of the path is invalid
    }
  }
  return totalDistance;
};

/**
 * Find all routes from start to end with at most a given number of stops.
 * @param {string} start - Starting town.
 * @param {string} end - Ending town.
 * @param {number} maxStops - Maximum number of stops.
 * @param {Array} currentPath - Current path being explored (for recursion).
 * @param {Array} routes - Collection of valid routes.
 * @returns {Array} - Array of all valid routes.
 */
const findRoutesWithMaxStops = (start, end, maxStops, currentPath = [], routes = []) => {
  if (!start || !end || maxStops === undefined) {
    throw new Error('Invalid parameters');
  }

  currentPath.push(start); // Add the current town to the path
  if (currentPath.length - 1 > maxStops) {
    currentPath.pop(); // Backtrack if max stops are exceeded
    return routes;
  }
  if (start === end && currentPath.length - 1 > 0) {
    routes.push([...currentPath]); // Save valid route
  }
  for (let neighbor in graph[start]) {
    findRoutesWithMaxStops(neighbor, end, maxStops, currentPath, routes);
  }
  currentPath.pop(); // Backtrack
  return routes;
};

/**
 * Find all routes from start to end with exactly a given number of stops.
 * @param {string} start - Starting town.
 * @param {string} end - Ending town.
 * @param {number} exactStops - Exact number of stops.
 * @param {Array} currentPath - Current path being explored (for recursion).
 * @param {Array} routes - Collection of valid routes.
 * @returns {Array} - Array of all valid routes.
 */
const findRoutesWithExactStops = (start, end, exactStops, currentPath = [], routes = []) => {
  if (!start || !end || exactStops === undefined) {
    throw new Error('Invalid parameters');
  }

  currentPath.push(start); // Add the current town to the path
  if (currentPath.length - 1 === exactStops) {
    if (start === end) {
      routes.push([...currentPath]); // Save valid route
    }
    currentPath.pop(); // Backtrack when exact stops are reached
    return routes;
  }
  if (currentPath.length - 1 < exactStops) {
    for (let neighbor in graph[start]) {
      findRoutesWithExactStops(neighbor, end, exactStops, currentPath, routes);
    }
  }
  currentPath.pop(); // Backtrack
  return routes;
};

/**
 * Find the shortest route between two towns.
 * @param {string} start - Starting town.
 * @param {string} end - Ending town.
 * @param {Set} visited - Set of visited towns to avoid cycles.
 * @param {number} currentDistance - Distance of the current path.
 * @param {Object} shortestDistance - Object to store the shortest distance found.
 * @returns {number} - Shortest distance between the two towns.
 */
const findShortestRoute = (start, end, visited = new Set(), currentDistance = 0, shortestDistance = { value: Infinity }) => {
  if (!start || !end) {
    throw new Error('Invalid parameters');
  }

  if (start === end && visited.size > 0) {
    shortestDistance.value = Math.min(shortestDistance.value, currentDistance); // Update shortest distance
    return shortestDistance.value;
  }

  visited.add(start); // Mark the current town as visited
  for (let neighbor in graph[start]) {
    if (!visited.has(neighbor) || neighbor === end) {
      findShortestRoute(neighbor, end, visited, currentDistance + graph[start][neighbor], shortestDistance);
    }
  }
  visited.delete(start); // Backtrack
  return shortestDistance.value;
};

/**
 * Find all routes from start to end within a maximum distance.
 * @param {string} start - Starting town.
 * @param {string} end - Ending town.
 * @param {number} maxDistance - Maximum allowable distance.
 * @param {Array} currentPath - Current path being explored (for recursion).
 * @param {number} currentDistance - Distance of the current path.
 * @param {Array} routes - Collection of valid routes.
 * @returns {Array} - Array of all valid routes.
 */
const findRoutesWithinDistance = (start, end, maxDistance, currentPath = [], currentDistance = 0, routes = []) => {
  if (!start || !end || maxDistance === undefined) {
    throw new Error('Invalid parameters');
  }

  currentPath.push(start); // Add the current town to the path
  if (start === end && currentDistance > 0 && currentDistance < maxDistance) {
    routes.push([...currentPath]); // Save valid route
  }
  for (let neighbor in graph[start]) {
    const distance = graph[start][neighbor];
    if (currentDistance + distance < maxDistance) {
      findRoutesWithinDistance(neighbor, end, maxDistance, currentPath, currentDistance + distance, routes);
    }
  }
  currentPath.pop(); // Backtrack
  return routes;
};

// Export the functions for use in other parts of the application
module.exports = {
  calculateDistance,
  findRoutesWithMaxStops,
  findRoutesWithExactStops,
  findShortestRoute,
  findRoutesWithinDistance
};
