# ACME Train Route Calculator

A web application for ACME Ltd's railroad business to calculate routes and distances between five key towns for widget delivery.

## Technical Stack

- **Node.js**: v20
- **Express.js**: v4
- **React**: v18
- **Rsuite**: Latest version
- **Jest**: v20 (for unit testing)

## Key Features

### 1. Distance Calculator
Calculate distances for specific paths:
- Path A-B-C
- Path A-D
- Path A-D-C
- Path A-E-B-C-D
- Path A-E-D
- Path A-E-K

### 2. Route Finder
Find routes with various constraints:
- Routes from C to C (max 3 stops)
- Routes from A to C (exactly 4 stops)
- Shortest route between A and C
- Shortest routes between B and B
- Shortest routes between B and K
- All routes from C to C (distance < 30)

### 3. Security & Technical Features
- API Key Authentication
- Comprehensive Logging System
- Request Handling Middleware
- Exception Handling for Route Anomalies

## Setup Instructions

### Prerequisites
- Ubuntu or Windows operating system
- Node.js v20
- npm (latest stable version)

### Installation Steps

1. Install dependencies:
Install client dependencies
cd client
npm install

2. Install server dependencies
cd server
npm install

3. Start the application:

Start server server
cd server
npm start
Start client application
cd client
npm start

## Project Structure
acme-train-calculator/
├── client/
│ ├── src/
│ │ ├── components/
│ │ │ ├── DistanceCalculator/
│ │ │ ├── RouteFinder/
│ │ │ └── TestCase/
│ │ ├── services/
│ │ └── App.js
│ └── package.json
└── server/
├── src/
│ ├── routes/
│ ├── controllers/
│ ├── middleware/
│ │ ├── auth.js
│ │ └── errorHandler.js
│ ├── services/
│ └── utils/
│ └── logger.js
└── package.json



## API Documentation

### Authentication
All API requests require the following header:


Authorization: Bearer ATCTT3xFfGN0zeMYhF7BoOeA5MMW7t1bJfXyaytRiiCo0wsNTsJ2Yo_69uGC8fe4r3XsQG4FHet9MhqvTJUKytHYBku0bNrlP6DLL0DKyDYmKia4YMEQt9T3mpnFnoUbLC_UxVejmaCMZELbvR4cXlXJ95qA9Z7DFfOAEYxNWx3BhVUFR1K1f1c=2D0E2E02


### Endpoints

#### Calculate Distance

GET /api/calculate-distance
Body: { "path": ["A", "B", "C"] }
Response: { "distance": 9 }


#### Find Routes
GET /api/find-routes
Body: {
"type": "max-stops|exact-stops|shortest|distance",
"start": "A",
"end": "C",
"constraint": 3
}
Response: { "routes": [...] }


## Testing

Run the test suite:
cd server
npm test


Key test scenarios:
- Distance calculations for all specified paths
- Route finding with various constraints
- Edge cases (nonexistent routes)
- API authentication
- Error handling

## Error Handling

The application handles various anomalies:
- Invalid routes
- Nonexistent stations
- Invalid constraints
- Authentication failures
- Network errors

## Logging

The application implements comprehensive logging:
- API request/response logging
- Error logging
- Authentication attempts
- Route calculation details

## User Interface Features

- Intuitive navigation between calculators
- Clear error messages
- Loading states for calculations
- Responsive design
- Input validation

## Performance Considerations

- Efficient route calculation algorithms
- Request caching
- Error boundary implementation
- Optimized API calls
