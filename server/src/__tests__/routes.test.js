const {
  calculateDistance,
  findRoutesWithMaxStops,
  findRoutesWithExactStops,
  findShortestRoute,
  findRoutesWithinDistance
} = require('../services/routeService'); // Importing route service functions to be tested

// Test suite for route calculations
describe('Route Calculations', () => {

  // Sub-suite for testing distance calculations
  describe('Distance Calculations', () => {
    test('Calculate distance of path A-B-C', () => {
      // Expect the distance for path A → B → C to be 9
      expect(calculateDistance(['A', 'B', 'C'])).toBe(9);
    });

    test('Calculate distance of path A-D', () => {
      // Expect the distance for path A → D to be 5
      expect(calculateDistance(['A', 'D'])).toBe(5);
    });

    test('Handle nonexistent route', () => {
      // Expect "NO SUCH ROUTE" when the path includes an invalid node
      expect(calculateDistance(['A', 'E', 'K'])).toBe('NO SUCH ROUTE');
    });
  });

  // Sub-suite for testing route finding
  describe('Route Finding', () => {
    test('Find routes from C to C with max 3 stops', () => {
      // Expect to find 2 routes from C → C with at most 3 stops
      const routes = findRoutesWithMaxStops('C', 'C', 3);
      expect(routes).toHaveLength(2);
    });

    test('Find routes from A to C with exactly 4 stops', () => {
      // Expect at least one route from A → C with exactly 4 stops
      const routes = findRoutesWithExactStops('A', 'C', 4);
      expect(routes.length).toBeGreaterThan(0);
    });

    test('Find shortest route between A and C', () => {
      // Expect the shortest distance between A → C to be a number
      const distance = findShortestRoute('A', 'C');
      expect(typeof distance).toBe('number');
    });

    test('Find routes between C and C with distance less than 30', () => {
      // Expect routes from C → C with a total distance less than 30 to be an array
      const routes = findRoutesWithinDistance('C', 'C', 30);
      expect(Array.isArray(routes)).toBe(true);
    });
  });

  // Sub-suite for testing error handling in the functions
  describe('Error Handling', () => {
    test('Handle invalid input', () => {
      // Expect an error to be thrown for invalid input (null)
      expect(() => calculateDistance(null)).toThrow();
      expect(() => findRoutesWithMaxStops(null, 'C', 3)).toThrow();
    });

    test('Handle empty path', () => {
      // Expect an error to be thrown for an empty path
      expect(() => calculateDistance([])).toThrow();
    });
  });
});
