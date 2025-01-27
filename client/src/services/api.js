// Base URL for the API
const API_BASE_URL = "http://localhost:3000/api";

// API Key for authentication
const API_KEY = "ATCTT3xFfGN0zeMYhF7BoOeA5MMW7t1bJfXyaytRiiCo0wsNTsJ2Yo_69uGC8fe4r3XsQG4FHet9MhqvTJUKytHYBku0bNrlP6DLL0DKyDYmKia4YMEQt9T3mpnFnoUbLC_UxVejmaCMZELbvR4cXlXJ95qA9Z7DFfOAEYxNWx3BhVUFR1K1f1c=2D0E2E02";

// Default headers for API requests, including authorization
const headers = {
  'Authorization': `Bearer ${API_KEY}`
};

// API object containing methods for interacting with the backend
export const api = {
  /**
   * Calculate the distance for a given path.
   * @param {Array} path - Array of towns representing the path.
   * @returns {Object} Response data containing the distance or error message.
   */
  calculateDistance: async (path) => {
    try {
      // Convert the path array to a comma-separated string and encode it
      const pathString = encodeURIComponent(path.join(','));

      // Send a GET request to the API with the encoded path
      const response = await fetch(`${API_BASE_URL}/distance?path=${pathString}`, {
        method: 'GET',
        headers
      });

      // Check if the response is OK; otherwise, throw an error
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        throw new Error(errorData.error || 'Network response was not ok');
      }

      // Parse and return the JSON response
      return await response.json();
    } catch (error) {
      // Throw a descriptive error if the API call fails
      throw new Error(`Failed to calculate distance: ${error.message}`);
    }
  },

  /**
   * Find routes based on the type and parameters.
   * @param {String} type - The type of route to find (e.g., max-stops, exact-stops).
   * @param {Object} params - Query parameters for the route search.
   * @returns {Object} Response data containing the routes or error message.
   */
  findRoutes: async (type, params) => {
    try {
      // Convert the parameters object into a URL-encoded query string
      const queryParams = new URLSearchParams(params).toString();

      // Send a GET request to the API with the route type and query parameters
      const response = await fetch(`${API_BASE_URL}/routes/${type}?${queryParams}`, {
        method: 'GET',
        headers
      });

      // Check if the response is OK; otherwise, throw an error
      if (!response.ok) throw new Error('Network response was not ok');

      // Parse and return the JSON response
      return await response.json();
    } catch (error) {
      // Throw a descriptive error if the API call fails
      throw new Error(`Failed to find routes: ${error.message}`);
    }
  }
};
